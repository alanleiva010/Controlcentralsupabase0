/*
  # Add cashbox_banks and update transactions schema

  1. New Tables
    - `cashbox_banks`
      - Links cashbox entries with specific bank balances
      - Tracks opening and closing balances per bank

  2. Changes
    - Update transactions table to include cashbox_id
    - Add bank balance columns to banks table

  3. Security
    - Enable RLS on new tables
    - Add policies for authenticated users
*/

-- Add bank balance columns to banks table
ALTER TABLE banks 
ADD COLUMN IF NOT EXISTS balance_ars numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS balance_usd numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS balance_usdt numeric DEFAULT 0;

-- Create cashbox_banks table
CREATE TABLE IF NOT EXISTS cashbox_banks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cashbox_id uuid REFERENCES cashbox(id) ON DELETE CASCADE,
  bank_id uuid REFERENCES banks(id) ON DELETE CASCADE,
  opening_balance numeric DEFAULT 0,
  closing_balance numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(cashbox_id, bank_id)
);

-- Add cashbox_id to transactions
ALTER TABLE transactions
ADD COLUMN IF NOT EXISTS cashbox_id uuid REFERENCES cashbox(id);

-- Enable RLS
ALTER TABLE cashbox_banks ENABLE ROW LEVEL SECURITY;

-- Policies for cashbox_banks
CREATE POLICY "Enable read access for cashbox_banks"
  ON cashbox_banks FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert for cashbox_banks"
  ON cashbox_banks FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable update for cashbox_banks"
  ON cashbox_banks FOR UPDATE
  TO authenticated
  USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_cashbox_banks_cashbox_id ON cashbox_banks(cashbox_id);
CREATE INDEX IF NOT EXISTS idx_cashbox_banks_bank_id ON cashbox_banks(bank_id);
CREATE INDEX IF NOT EXISTS idx_transactions_cashbox_id ON transactions(cashbox_id);