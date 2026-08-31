-- 1. Hide reviewer emails from the public
REVOKE SELECT ON public.product_reviews FROM anon, authenticated;
GRANT SELECT (id, product_id, name, rating, comment, created_at, image_url, image_urls) ON public.product_reviews TO anon, authenticated;
GRANT ALL ON public.product_reviews TO service_role;

-- 2. Storage policies: private buckets are service-role only
DROP POLICY IF EXISTS "receipts service role only" ON storage.objects;
CREATE POLICY "receipts service role only" ON storage.objects
  FOR ALL TO service_role
  USING (bucket_id = 'receipts') WITH CHECK (bucket_id = 'receipts');

DROP POLICY IF EXISTS "review images service role only" ON storage.objects;
CREATE POLICY "review images service role only" ON storage.objects
  FOR ALL TO service_role
  USING (bucket_id = 'review-images') WITH CHECK (bucket_id = 'review-images');

-- 3. No public execution of the tracking-number generator
REVOKE EXECUTE ON FUNCTION public.generate_tracking_number() FROM anon, authenticated, public;

-- 4. Order columns for manual transfer verification
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS address2 text,
  ADD COLUMN IF NOT EXISTS payment_provider text,
  ADD COLUMN IF NOT EXISTS transaction_id text,
  ADD COLUMN IF NOT EXISTS admin_notes text;

CREATE UNIQUE INDEX IF NOT EXISTS orders_transaction_id_key
  ON public.orders (lower(btrim(transaction_id))) WHERE transaction_id IS NOT NULL;

-- 5. Allow the new statuses on insert
DROP POLICY IF EXISTS "Anyone can place a valid order" ON public.orders;
CREATE POLICY "Anyone can place a valid order" ON public.orders
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    char_length(btrim(customer_name)) BETWEEN 2 AND 80
    AND email ~* '^[^@\s]+@[^@\s]+\.[a-z]{2,}$'
    AND char_length(btrim(phone)) BETWEEN 7 AND 20
    AND char_length(btrim(address)) BETWEEN 5 AND 200
    AND char_length(btrim(city)) BETWEEN 2 AND 60
    AND payment_method = ANY (ARRAY['card','bank','cash'])
    AND total >= 0 AND total <= 10000000
    AND jsonb_typeof(items) = 'array'
    AND status = ANY (ARRAY['processing','pending_verification'])
  );

-- 6. Roles
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin','moderator','user');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read their own roles" ON public.user_roles;
CREATE POLICY "Users can read their own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

-- 7. Admin access to orders
GRANT SELECT, UPDATE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;

DROP POLICY IF EXISTS "Admins can read orders" ON public.orders;
CREATE POLICY "Admins can read orders" ON public.orders
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;
CREATE POLICY "Admins can update orders" ON public.orders
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));