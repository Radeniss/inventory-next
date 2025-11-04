ALTER TABLE public.inventory_items
  ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
