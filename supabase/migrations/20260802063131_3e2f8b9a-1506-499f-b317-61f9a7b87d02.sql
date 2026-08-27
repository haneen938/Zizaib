CREATE TABLE public.product_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id TEXT NOT NULL,
  name TEXT NOT NULL DEFAULT 'Anonymous' CHECK (char_length(name) <= 80),
  email TEXT NOT NULL CHECK (char_length(email) <= 255),
  rating SMALLINT NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  comment TEXT NOT NULL CHECK (char_length(comment) BETWEEN 1 AND 2000),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX product_reviews_product_id_idx ON public.product_reviews (product_id, created_at DESC);

GRANT SELECT (id, product_id, name, rating, comment, created_at) ON public.product_reviews TO anon, authenticated;
GRANT INSERT ON public.product_reviews TO anon, authenticated;
GRANT ALL ON public.product_reviews TO service_role;

ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read reviews"
  ON public.product_reviews FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Anyone can submit a review"
  ON public.product_reviews FOR INSERT TO anon, authenticated WITH CHECK (true);