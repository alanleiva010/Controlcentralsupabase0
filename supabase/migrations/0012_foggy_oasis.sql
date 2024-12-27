/*
  # Add cashbox and transaction management

  1. Changes
    - Add status column to cashbox table
    - Add transaction_type column to transactions table
    - Update RLS policies for cashbox and transactions
    - Add performance indexes

  2. Security
    - Policies for cashbox management
    - Policies for transaction management
*/

-- Add status to cashbox if not exists
ALTER TABLE cashbox 
ADD COLUMN IF NOT EXISTS status text DEFAULT 'open' CHECK (status IN ('open', 'closed'));

-- Add transaction_type to transactions if not exists
ALTER TABLE transactions 
ADD COLUMN IF NOT EXISTS transaction_type text CHECK (transaction_type IN ('income', 'expense', 'transfer'));

-- Update or create cashbox policies
DROP POLICY IF EXISTS "Enable read access for cashbox" ON cashbox;
DROP POLICY IF EXISTS "Enable insert for cashbox" ON cashbox;
DROP POLICY IF EXISTS "Enable update for cashbox" ON cashbox;

CREATE POLICY "Allow users to read cashbox entries"
  ON cashbox FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow users to create cashbox entries"
  ON cashbox FOR INSERT
  TO authenticated
  WITH CHECK (
    NOT EXISTS (
      SELECT 1 FROM cashbox c 
      WHERE c.date = CURRENT_DATE 
      AND c.status = 'open'
    )
  );

CREATE POLICY "Allow users to update cashbox entries"
  ON cashbox FOR UPDATE
  TO authenticated
  USING (status = 'open');

-- Update or create transaction policies
DROP POLICY IF EXISTS "Enable read access for transactions" ON transactions;
DROP POLICY IF EXISTS "Enable insert for transactions" ON transactions;
DROP POLICY IF EXISTS "Enable update for transactions" ON transactions;

CREATE POLICY "Allow users to read transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow users to create transactions"
  ON transactions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM cashbox c 
      WHERE c.id = cashbox_id 
      AND c.status = 'open'
    )
  );

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cashbox_status ON cashbox(status);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_cashbox_date ON cashbox(date);