/*
  # Fix financial data permissions

  1. Changes
    - Grant proper permissions to authenticated users
    - Update RLS policies for financial_data table
    - Add missing indexes for performance
  
  2. Security
    - Maintain RLS protection
    - Ensure proper access control
*/

-- Grant necessary permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON financial_data TO authenticated;

-- Recreate financial data policies with simplified conditions
DROP POLICY IF EXISTS "Allow users to read own financial data" ON financial_data;
DROP POLICY IF EXISTS "Allow admins to read all financial data" ON financial_data;

CREATE POLICY "allow_users_read_own_data"
  ON financial_data FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_financial_data_user_id ON financial_data(user_id);
CREATE INDEX IF NOT EXISTS idx_financial_data_created_at ON financial_data(created_at DESC);