-- Drop existing public policies
DROP POLICY IF EXISTS "Allow public read access to inventory" ON public.inventory_items;
DROP POLICY IF EXISTS "Allow public insert access to inventory" ON public.inventory_items;
DROP POLICY IF EXISTS "Allow public update access to inventory" ON public.inventory_items;
DROP POLICY IF EXISTS "Allow public delete access to inventory" ON public.inventory_items;

-- Enable RLS on the table if not already enabled
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Allow authenticated users to see their own inventory" ON public.inventory_items
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Allow authenticated users to insert their own inventory" ON public.inventory_items
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow authenticated users to update their own inventory" ON public.inventory_items
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow authenticated users to delete their own inventory" ON public.inventory_items
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
