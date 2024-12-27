/*
  # Add Financial Data Table

  1. New Tables
    - `financial_data`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `amount` (numeric)
      - `type` (text - 'income' or 'expense')
      - `description` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `financial_data` table
    - Add policies for users to manage their own data
    - Add policies for admins to view all data
*/

CREATE TABLE IF NOT EXISTS financial_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount numeric NOT NULL,
  type text CHECK (type IN ('income', 'expense')) NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE financial_data ENABLE ROW LEVEL SECURITY;

-- Users can read their own financial data
CREATE POLICY "Users can read own financial data"
  ON financial_data
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can insert their own financial data
CREATE POLICY "Users can insert own financial data"
  ON financial_data
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Admins can read all financial data
CREATE POLICY "Admins can read all financial data"
  ON financial_data
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );