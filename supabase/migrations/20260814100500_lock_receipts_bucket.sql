-- Receipts are uploaded server-side with the service role after validation,
-- so no browser client needs write access to the bucket.
DROP POLICY IF EXISTS "Anyone can upload a checkout receipt" ON storage.objects;

-- Defense in depth: make sure neither bucket is publicly listable/readable.
UPDATE storage.buckets SET public = false WHERE id IN ('receipts', 'review-images');
