/*
  # Create banks table and policies

  1. New Tables
    - `banks`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `country` (text)
      - `swift_code` (text, unique)
      - `created_by` (uuid, references profiles)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS
    - Add policies for authenticated users to manage banks
*/

CREATE TABLE IF NOT EXISTS banks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  country text,
  swift_code text UNIQUE,
  created_by uuid REFERENCES profiles(id) DEFAULT auth.uid(),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE banks ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Enable read access for banks"
  ON banks FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert for authenticated users"
  ON banks FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Enable update for own banks"
  ON banks FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid());

CREATE POLICY "Enable delete for own banks"
  ON banks FOR DELETE
  TO authenticated
  USING (created_by = auth.uid());

-- Indexes
CREATE INDEX IF NOT EXISTS idx_banks_created_by ON banks(created_by);
CREATE INDEX IF NOT EXISTS idx_banks_swift_code ON banks(swift_code);
CREATE INDEX IF NOT EXISTS idx_banks_created_at ON banks(created_at DESC);