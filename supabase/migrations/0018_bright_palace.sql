/*
  # Fix Cashbox Policies and Add Bank Selection
  
  1. Changes
    - Add bank_ids column to cashbox table
    - Fix RLS policies for cashbox table
    - Add necessary indexes
    
  2. Security
    - Enable proper RLS policies for cashbox operations
*/

-- Add bank_ids column if not exists
ALTER TABLE cashbox
ADD COLUMN IF NOT EXISTS bank_ids uuid[] DEFAULT '{}';

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for cashbox" ON cashbox;
DROP POLICY IF EXISTS "Enable insert for cashbox" ON cashbox;
DROP POLICY IF EXISTS "Enable update for cashbox" ON cashbox;
DROP POLICY IF EXISTS "Allow users to read cashbox entries" ON cashbox;
DROP POLICY IF EXISTS "Allow users to create cashbox entries" ON cashbox;
DROP POLICY IF EXISTS "Allow users to update cashbox entries" ON cashbox;

-- Create new policies
CREATE POLICY "Allow read access for authenticated users"
  ON cashbox FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow insert for authenticated users"
  ON cashbox FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow update for authenticated users"
  ON cashbox FOR UPDATE
  TO authenticated
  USING (true);

-- Grant necessary permissions
GRANT ALL ON cashbox TO authenticated;

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_cashbox_date ON cashbox(date);
CREATE INDEX IF NOT EXISTS idx_cashbox_status ON cashbox(status);
CREATE INDEX IF NOT EXISTS idx_cashbox_bank_ids ON cashbox USING gin(bank_ids);