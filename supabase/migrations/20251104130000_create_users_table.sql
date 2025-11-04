CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);

-- First, remove the old foreign key constraint on inventory_items
ALTER TABLE public.inventory_items DROP CONSTRAINT IF EXISTS inventory_items_user_id_fkey;

-- Now, add the new foreign key constraint to the new users table
ALTER TABLE public.inventory_items
  ADD CONSTRAINT inventory_items_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
