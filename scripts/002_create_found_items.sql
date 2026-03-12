-- Create found_items table
CREATE TABLE IF NOT EXISTS public.found_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category_id INTEGER REFERENCES public.categories(id),
  location_found TEXT NOT NULL,
  date_found DATE NOT NULL,
  image_url TEXT,
  finder_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  claimer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'claimed', 'returned')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.found_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Anyone can view found items
CREATE POLICY "Anyone can view found items" 
  ON public.found_items FOR SELECT 
  USING (true);

-- Users can insert their own items
CREATE POLICY "Users can insert their own items" 
  ON public.found_items FOR INSERT 
  WITH CHECK (auth.uid() = finder_id);

-- Users can update their own items or claim items
CREATE POLICY "Users can update their own items or claim items" 
  ON public.found_items FOR UPDATE 
  USING (auth.uid() = finder_id OR auth.uid() = claimer_id OR claimer_id IS NULL);

-- Users can delete their own items
CREATE POLICY "Users can delete their own items" 
  ON public.found_items FOR DELETE 
  USING (auth.uid() = finder_id);

-- Create index for faster searches
CREATE INDEX IF NOT EXISTS idx_found_items_category_id ON public.found_items(category_id);
CREATE INDEX IF NOT EXISTS idx_found_items_status ON public.found_items(status);
CREATE INDEX IF NOT EXISTS idx_found_items_date_found ON public.found_items(date_found);
CREATE INDEX IF NOT EXISTS idx_found_items_finder_id ON public.found_items(finder_id);
CREATE INDEX IF NOT EXISTS idx_found_items_claimer_id ON public.found_items(claimer_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-updating updated_at
DROP TRIGGER IF EXISTS update_found_items_updated_at ON public.found_items;
CREATE TRIGGER update_found_items_updated_at
  BEFORE UPDATE ON public.found_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
