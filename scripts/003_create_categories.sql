-- Create categories lookup table
CREATE TABLE IF NOT EXISTS public.categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  icon TEXT
);

-- Insert default categories
INSERT INTO public.categories (name, icon) VALUES
  ('Electronics', 'smartphone'),
  ('Documents', 'file-text'),
  ('Accessories', 'watch'),
  ('Clothing', 'shirt'),
  ('Books', 'book'),
  ('Keys', 'key'),
  ('Bags', 'briefcase'),
  ('Other', 'package')
ON CONFLICT (name) DO NOTHING;

-- Enable Row Level Security (read-only for everyone)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories are viewable by everyone" 
  ON public.categories FOR SELECT 
  USING (true);
