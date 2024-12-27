/*
  # Create deductions table and policies

  1. New Tables
    - `deductions`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `percentage` (numeric, required)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS
    - Add policies for authenticated users to manage deductions
*/

CREATE TABLE IF NOT EXISTS deductions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  percentage numeric NOT NULL CHECK (percentage >= 0 AND percentage <= 100),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE deductions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Enable read access for deductions"
  ON deductions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert for authenticated users"
  ON deductions FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users"
  ON deductions FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Enable delete for authenticated users"
  ON deductions FOR DELETE
  TO authenticated
  USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_deductions_created_at ON deductions(created_at DESC);