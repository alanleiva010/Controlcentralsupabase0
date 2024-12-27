/*
  # Create transactions and cashbox tables

  1. New Tables
    - `transactions`
      - `id` (uuid, primary key)
      - `client_id` (uuid, references clients)
      - `bank_id` (uuid, references banks)
      - `operation_type` (text, required)
      - `amount` (numeric, required)
      - `deductions` (jsonb)
      - `net_amount` (numeric, required)
      - `currency` (text, required)
      - `description` (text)
      - `documentation` (text)
      - `created_at` (timestamp)

    - `cashbox`
      - `id` (uuid, primary key)
      - `date` (date, required)
      - `opening_balance_ars` (numeric)
      - `opening_balance_usd` (numeric)
      - `opening_balance_usdt` (numeric)
      - `closing_balance_ars` (numeric)
      - `closing_balance_usd` (numeric)
      - `closing_balance_usdt` (numeric)
      - `status` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients(id),
  bank_id uuid REFERENCES banks(id),
  operation_type text NOT NULL,
  amount numeric NOT NULL,
  deductions jsonb,
  net_amount numeric NOT NULL,
  currency text NOT NULL CHECK (currency IN ('ARS', 'USD', 'USDT')),
  description text,
  documentation text,
  created_at timestamptz DEFAULT now()
);

-- Create cashbox table
CREATE TABLE IF NOT EXISTS cashbox (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL UNIQUE,
  opening_balance_ars numeric DEFAULT 0,
  opening_balance_usd numeric DEFAULT 0,
  opening_balance_usdt numeric DEFAULT 0,
  closing_balance_ars numeric DEFAULT 0,
  closing_balance_usd numeric DEFAULT 0,
  closing_balance_usdt numeric DEFAULT 0,
  status text DEFAULT 'open' CHECK (status IN ('open', 'closed')),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cashbox ENABLE ROW LEVEL SECURITY;

-- Policies for transactions
CREATE POLICY "Enable read access for transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert for transactions"
  ON transactions FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable update for transactions"
  ON transactions FOR UPDATE
  TO authenticated
  USING (true);

-- Policies for cashbox
CREATE POLICY "Enable read access for cashbox"
  ON cashbox FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert for cashbox"
  ON cashbox FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable update for cashbox"
  ON cashbox FOR UPDATE
  TO authenticated
  USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_transactions_client_id ON transactions(client_id);
CREATE INDEX IF NOT EXISTS idx_transactions_bank_id ON transactions(bank_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cashbox_date ON cashbox(date DESC);