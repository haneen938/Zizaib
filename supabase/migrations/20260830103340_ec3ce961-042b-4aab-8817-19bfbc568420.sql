-- 1) Stop exposing reviewer emails through the public reviews read path.
REVOKE SELECT ON public.product_reviews FROM anon, authenticated;
GRANT SELECT (id, product_id, name, rating, comment, created_at, image_url, image_urls)
  ON public.product_reviews TO anon, authenticated;
GRANT INSERT ON public.product_reviews TO anon, authenticated;

-- 2) Lock down storage objects for the private buckets: service_role only.
--    Explicit deny-by-policy instead of deny-by-omission.
DROP POLICY IF EXISTS "receipts service role only" ON storage.objects;
CREATE POLICY "receipts service role only"
  ON storage.objects FOR ALL TO service_role
  USING (bucket_id = 'receipts')
  WITH CHECK (bucket_id = 'receipts');

DROP POLICY IF EXISTS "review images service role only" ON storage.objects;
CREATE POLICY "review images service role only"
  ON storage.objects FOR ALL TO service_role
  USING (bucket_id = 'review-images')
  WITH CHECK (bucket_id = 'review-images');

-- 3) Tracking numbers are generated server-side only.
REVOKE EXECUTE ON FUNCTION public.generate_tracking_number() FROM PUBLIC, anon, authenticated;