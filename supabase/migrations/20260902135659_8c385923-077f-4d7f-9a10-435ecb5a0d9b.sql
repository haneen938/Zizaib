CREATE TABLE public.category_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scope text NOT NULL CHECK (scope IN ('collection','group','subcategory')),
  ref_key text NOT NULL,
  image_url text NOT NULL,
  alt text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (scope, ref_key)
);

GRANT SELECT ON public.category_images TO anon;
GRANT SELECT ON public.category_images TO authenticated;
GRANT ALL ON public.category_images TO service_role;

ALTER TABLE public.category_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read category images"
  ON public.category_images FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins manage category images"
  ON public.category_images FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER category_images_set_updated_at
  BEFORE UPDATE ON public.category_images
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();