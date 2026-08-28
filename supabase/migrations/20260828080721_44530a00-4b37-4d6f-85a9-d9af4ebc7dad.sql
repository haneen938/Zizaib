CREATE TABLE public.product_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id TEXT NOT NULL,
  name TEXT NOT NULL DEFAULT 'Anonymous' CHECK (char_length(name) <= 80),
  email TEXT NOT NULL CHECK (char_length(email) <= 255),
  rating SMALLINT NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  comment TEXT NOT NULL CHECK (char_length(comment) BETWEEN 1 AND 2000),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  image_url text,
  image_urls text[] NOT NULL DEFAULT '{}'::text[]
);

CREATE INDEX product_reviews_product_id_idx ON public.product_reviews (product_id, created_at DESC);

GRANT SELECT (id, product_id, name, rating, comment, created_at, image_urls) ON public.product_reviews TO anon, authenticated;
GRANT INSERT ON public.product_reviews TO anon, authenticated;
GRANT ALL ON public.product_reviews TO service_role;

ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read reviews"
  ON public.product_reviews FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Public can submit a valid review"
  ON public.product_reviews FOR INSERT TO anon, authenticated
  WITH CHECK (
    char_length(btrim(product_id)) BETWEEN 1 AND 100
    AND email ~* '^[^@\s]+@[^@\s]+\.[a-z]{2,}$'
    AND rating BETWEEN 1 AND 5
    AND char_length(btrim(comment)) BETWEEN 1 AND 2000
    AND char_length(btrim(name)) BETWEEN 1 AND 80
  );

CREATE OR REPLACE FUNCTION public.generate_tracking_number()
RETURNS text
LANGUAGE sql
VOLATILE
SET search_path = public
AS $$
  SELECT 'ZB' || to_char(now(), 'YYMMDD') || upper(substr(md5(gen_random_uuid()::text), 1, 6));
$$;

CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tracking_number text NOT NULL UNIQUE DEFAULT public.generate_tracking_number(),
  status text NOT NULL DEFAULT 'processing',
  customer_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  postal text,
  notes text,
  payment_method text NOT NULL,
  total numeric(12,2) NOT NULL DEFAULT 0,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  cash_sender_name text,
  cash_reference_id text,
  cash_transfer_date date,
  cash_bank_name text,
  cash_receipt_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.orders TO anon, authenticated;
GRANT ALL ON public.orders TO service_role;

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can place a valid order"
ON public.orders FOR INSERT TO anon, authenticated
WITH CHECK (
  char_length(btrim(customer_name)) BETWEEN 2 AND 80
  AND email ~* '^[^@\s]+@[^@\s]+\.[a-z]{2,}$'
  AND char_length(btrim(phone)) BETWEEN 7 AND 20
  AND char_length(btrim(address)) BETWEEN 5 AND 200
  AND char_length(btrim(city)) BETWEEN 2 AND 60
  AND payment_method IN ('card','bank','cash')
  AND total >= 0 AND total <= 10000000
  AND jsonb_typeof(items) = 'array'
  AND status = 'processing'
);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER orders_set_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.track_order(_tracking_number text)
RETURNS TABLE (
  tracking_number text,
  status text,
  city text,
  item_count integer,
  placed_at timestamptz,
  updated_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT o.tracking_number,
         o.status,
         o.city,
         COALESCE(jsonb_array_length(o.items), 0)::int,
         o.created_at,
         o.updated_at
  FROM public.orders o
  WHERE upper(btrim(o.tracking_number)) = upper(btrim(_tracking_number))
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.track_order(text) FROM public;
GRANT EXECUTE ON FUNCTION public.track_order(text) TO anon, authenticated, service_role;