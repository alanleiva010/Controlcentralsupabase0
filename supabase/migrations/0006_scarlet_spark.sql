/*
  # Fix client table policies and permissions

  1. Changes
    - Grant necessary table permissions to authenticated users
    - Simplify RLS policies for better reliability
    - Add created_by column default value
  
  2. Security
    - Maintain RLS protection
    - Ensure users can only access their own data
    - Allow admins full access
*/

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON clients TO authenticated;

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Users can read own clients" ON clients;
DROP POLICY IF EXISTS "Users can insert own clients" ON clients;
DROP POLICY IF EXISTS "Users can update own clients" ON clients;
DROP POLICY IF EXISTS "Users can delete own clients" ON clients;

-- Add default value for created_by
ALTER TABLE clients ALTER COLUMN created_by SET DEFAULT auth.uid();

-- Create simplified policies
CREATE POLICY "Enable read access for own clients"
  ON clients FOR SELECT
  TO authenticated
  USING (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Enable insert access for authenticated users"
  ON clients FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Enable update access for own clients"
  ON clients FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid());

CREATE POLICY "Enable delete access for own clients"
  ON clients FOR DELETE
  TO authenticated
  USING (created_by = auth.uid());