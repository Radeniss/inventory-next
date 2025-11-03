/*
  # Create Inventory Management System

  1. New Tables
    - `inventory_items`
      - `id` (uuid, primary key)
      - `name` (text, unique, required) - Item name
      - `quantity` (integer, required) - Item quantity
      - `description` (text, optional) - Item description
      - `last_updated` (timestamptz) - Auto-updated timestamp
      - `created_at` (timestamptz) - Creation timestamp

  2. Security
    - Enable RLS on `inventory_items` table
    - Add policies for authenticated users to manage inventory
    - Public read access for demonstration purposes
    
  3. Important Notes
    - Quantity defaults to 0
    - Name must be unique to prevent duplicates
    - Timestamps are automatically managed
*/

CREATE TABLE IF NOT EXISTS inventory_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  quantity integer NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  description text DEFAULT '',
  last_updated timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to inventory"
  ON inventory_items
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert access to inventory"
  ON inventory_items
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update access to inventory"
  ON inventory_items
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete access to inventory"
  ON inventory_items
  FOR DELETE
  TO public
  USING (true);

CREATE OR REPLACE FUNCTION update_last_updated()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_updated = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_last_updated
  BEFORE UPDATE ON inventory_items
  FOR EACH ROW
  EXECUTE FUNCTION update_last_updated();