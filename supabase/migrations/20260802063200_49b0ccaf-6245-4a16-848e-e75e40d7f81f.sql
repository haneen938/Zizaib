DROP POLICY "Anyone can submit a review" ON public.product_reviews;

CREATE POLICY "Public can submit a valid review"
  ON public.product_reviews FOR INSERT TO anon, authenticated
  WITH CHECK (
    char_length(btrim(product_id)) BETWEEN 1 AND 100
    AND email ~* '^[^@\s]+@[^@\s]+\.[a-z]{2,}$'
    AND rating BETWEEN 1 AND 5
    AND char_length(btrim(comment)) BETWEEN 1 AND 2000
    AND char_length(btrim(name)) BETWEEN 1 AND 80
  );