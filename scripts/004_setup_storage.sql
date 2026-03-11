-- Create storage bucket for item images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'item-images', 
  'item-images', 
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images" 
  ON storage.objects FOR INSERT 
  WITH CHECK (
    bucket_id = 'item-images' 
    AND auth.role() = 'authenticated'
  );

-- Allow authenticated users to update their own images
CREATE POLICY "Users can update their own images" 
  ON storage.objects FOR UPDATE 
  USING (
    bucket_id = 'item-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow authenticated users to delete their own images
CREATE POLICY "Users can delete their own images" 
  ON storage.objects FOR DELETE 
  USING (
    bucket_id = 'item-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow public read access to all images
CREATE POLICY "Public read access for item images" 
  ON storage.objects FOR SELECT 
  USING (bucket_id = 'item-images');
