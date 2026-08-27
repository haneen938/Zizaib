CREATE POLICY "Anyone can upload a checkout receipt"
ON storage.objects FOR INSERT TO anon, authenticated
WITH CHECK (bucket_id = 'receipts');