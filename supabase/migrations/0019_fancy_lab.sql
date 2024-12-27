/*
  # Add Bank-Specific Balances for Cashbox
  
  1. New Tables
    - cashbox_bank_balances: Tracks balances per bank in a cashbox
  
  2. Changes
    - Add bank-specific balance tracking
    - Add necessary indexes and constraints
    
  3. Security
    - Enable RLS for new table
    - Add appropriate policies
*/

-- Create table for bank-specific balances
CREATE TABLE IF NOT EXISTS cashbox_bank_balances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cashbox_id uuid REFERENCES cashbox(id) ON DELETE CASCADE,
  bank_id uuid REFERENCES banks(id) ON DELETE CASCADE,
  opening_balance_ars numeric DEFAULT 0,
  opening_balance_usd numeric DEFAULT 0,
  opening_balance_usdt numeric DEFAULT 0,
  closing_balance_ars numeric DEFAULT 0,
  closing_balance_usd numeric DEFAULT 0,
  closing_balance_usdt numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(cashbox_id, bank_id)
);

-- Enable RLS
ALTER TABLE cashbox_bank_balances ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow read access for authenticated users"
  ON cashbox_bank_balances FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow insert for authenticated users"
  ON cashbox_bank_balances FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow update for authenticated users"
  ON cashbox_bank_balances FOR UPDATE
  TO authenticated
  USING (true);

-- Grant permissions
GRANT ALL ON cashbox_bank_balances TO authenticated;

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_cashbox_bank_balances_cashbox_id 
  ON cashbox_bank_balances(cashbox_id);
CREATE INDEX IF NOT EXISTS idx_cashbox_bank_balances_bank_id 
  ON cashbox_bank_balances(bank_id);

-- Function to create bank balances on cashbox creation
CREATE OR REPLACE FUNCTION create_bank_balances()
RETURNS TRIGGER AS $$
BEGIN
  -- Create balance entries for each bank
  INSERT INTO cashbox_bank_balances (cashbox_id, bank_id)
  SELECT NEW.id, unnest(NEW.bank_ids);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create bank balances
CREATE TRIGGER create_bank_balances_trigger
  AFTER INSERT ON cashbox
  FOR EACH ROW
  EXECUTE FUNCTION create_bank_balances();