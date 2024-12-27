/*
  # Fix Transaction Policies and Indexes
  
  1. Changes
    - Remove existing transaction policies
    - Add simplified RLS policies for authenticated users
    - Add performance indexes
    
  2. Security
    - Enable read access for authenticated users
    - Enable insert access for authenticated users
    - Grant necessary table permissions
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for transactions" ON transactions;
DROP POLICY IF EXISTS "Enable insert for valid transactions" ON transactions;

-- Create simpler, more permissive policies
CREATE POLICY "Allow read access for all authenticated users"
  ON transactions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow insert for all authenticated users"
  ON transactions FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Grant necessary permissions
GRANT ALL ON transactions TO authenticated;

-- Add necessary indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_transactions_client_id ON transactions(client_id);
CREATE INDEX IF NOT EXISTS idx_transactions_bank_id ON transactions(bank_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at DESC);