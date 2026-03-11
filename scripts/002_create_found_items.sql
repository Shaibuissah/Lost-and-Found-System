-- Create found_items table
CREATE TABLE IF NOT EXISTS public.found_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  location_found TEXT NOT NULL,
  date_found DATE NOT NULL,
  image_url TEXT,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'claimed', 'returned')),
  contact_phone TEXT,
  contact_email TEXT,
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
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own items
CREATE POLICY "Users can update their own items" 
  ON public.found_items FOR UPDATE 
  USING (auth.uid() = user_id);

-- Users can delete their own items
CREATE POLICY "Users can delete their own items" 
  ON public.found_items FOR DELETE 
  USING (auth.uid() = user_id);

-- Create index for faster searches
CREATE INDEX IF NOT EXISTS idx_found_items_category ON public.found_items(category);
CREATE INDEX IF NOT EXISTS idx_found_items_status ON public.found_items(status);
CREATE INDEX IF NOT EXISTS idx_found_items_date_found ON public.found_items(date_found);
CREATE INDEX IF NOT EXISTS idx_found_items_user_id ON public.found_items(user_id);

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
