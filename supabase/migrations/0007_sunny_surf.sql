/*
  # Add Operation Types Management

  1. New Tables
    - `operation_types`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `description` (text)
      - `created_by` (uuid, references profiles)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS operation_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  created_by uuid REFERENCES profiles(id) DEFAULT auth.uid(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE operation_types ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Enable read access for operation types"
  ON operation_types FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert for authenticated users"
  ON operation_types FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Enable update for own operation types"
  ON operation_types FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid());

CREATE POLICY "Enable delete for own operation types"
  ON operation_types FOR DELETE
  TO authenticated
  USING (created_by = auth.uid());

-- Indexes
CREATE INDEX IF NOT EXISTS idx_operation_types_created_by ON operation_types(created_by);
CREATE INDEX IF NOT EXISTS idx_operation_types_created_at ON operation_types(created_at DESC);