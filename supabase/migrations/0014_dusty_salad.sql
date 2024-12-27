/*
  # Update Transaction Policies and Constraints

  1. Changes
    - Add proper constraints for transaction operations
    - Update RLS policies for better security
    - Add validation triggers for transaction operations
    - Add bank balance update triggers

  2. Security
    - Enable RLS on all affected tables
    - Add policies for transaction validation
    - Add policies for bank balance updates
*/

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Allow users to read transactions" ON transactions;
DROP POLICY IF EXISTS "Allow users to create transactions" ON transactions;

-- Policies for transactions
CREATE POLICY "Enable read access for transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert for valid transactions"
  ON transactions FOR INSERT
  TO authenticated
  WITH CHECK (
    -- Check if there's an open cashbox
    EXISTS (
      SELECT 1 FROM cashbox c 
      WHERE c.id = cashbox_id 
      AND c.status = 'open'
    ) AND
    -- Check if the bank exists
    EXISTS (
      SELECT 1 FROM banks b
      WHERE b.id = bank_id
    ) AND
    -- Check if the client exists
    EXISTS (
      SELECT 1 FROM clients cl
      WHERE cl.id = client_id
    )
  );

-- Function to validate transaction before insert
CREATE OR REPLACE FUNCTION validate_transaction()
RETURNS TRIGGER AS $$
BEGIN
  -- Validate exchange rate for crypto operations
  IF NEW.operation_type IN ('usdt_buy', 'usdt_sell', 'usd_buy', 'usd_sell') THEN
    IF NEW.exchange_rate IS NULL OR NEW.exchange_rate <= 0 THEN
      RAISE EXCEPTION 'Exchange rate is required for crypto operations';
    END IF;
  END IF;

  -- Validate bank balances
  CASE NEW.operation_type
    WHEN 'ars_out' THEN
      IF NOT EXISTS (
        SELECT 1 FROM banks 
        WHERE id = NEW.bank_id 
        AND balance_ars >= NEW.amount
      ) THEN
        RAISE EXCEPTION 'Insufficient ARS balance';
      END IF;
    WHEN 'usdt_sell' THEN
      IF NOT EXISTS (
        SELECT 1 FROM banks 
        WHERE id = NEW.bank_id 
        AND balance_usdt >= NEW.crypto_amount
      ) THEN
        RAISE EXCEPTION 'Insufficient USDT balance';
      END IF;
    WHEN 'usd_sell' THEN
      IF NOT EXISTS (
        SELECT 1 FROM banks 
        WHERE id = NEW.bank_id 
        AND balance_usd >= NEW.crypto_amount
      ) THEN
        RAISE EXCEPTION 'Insufficient USD balance';
      END IF;
    ELSE
      -- Other operations don't need balance validation
      NULL;
  END CASE;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for transaction validation
DROP TRIGGER IF EXISTS validate_transaction_trigger ON transactions;
CREATE TRIGGER validate_transaction_trigger
  BEFORE INSERT ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION validate_transaction();

-- Update bank balance function to handle all cases
CREATE OR REPLACE FUNCTION update_bank_balance()
RETURNS TRIGGER AS $$
BEGIN
  CASE NEW.operation_type
    -- ARS operations
    WHEN 'ars_in' THEN
      UPDATE banks SET balance_ars = balance_ars + NEW.net_amount 
      WHERE id = NEW.bank_id;
    WHEN 'ars_out' THEN
      UPDATE banks SET balance_ars = balance_ars - NEW.net_amount 
      WHERE id = NEW.bank_id;
    
    -- USDT operations
    WHEN 'usdt_buy' THEN
      UPDATE banks SET 
        balance_ars = balance_ars - NEW.net_amount,
        balance_usdt = balance_usdt + NEW.crypto_amount 
      WHERE id = NEW.bank_id;
    WHEN 'usdt_sell' THEN
      UPDATE banks SET 
        balance_ars = balance_ars + NEW.net_amount,
        balance_usdt = balance_usdt - NEW.crypto_amount 
      WHERE id = NEW.bank_id;
    WHEN 'usdt_in' THEN
      UPDATE banks SET balance_usdt = balance_usdt + NEW.amount 
      WHERE id = NEW.bank_id;
    WHEN 'usdt_out' THEN
      UPDATE banks SET balance_usdt = balance_usdt - NEW.amount 
      WHERE id = NEW.bank_id;
    
    -- USD operations
    WHEN 'usd_buy' THEN
      UPDATE banks SET 
        balance_ars = balance_ars - NEW.net_amount,
        balance_usd = balance_usd + NEW.crypto_amount 
      WHERE id = NEW.bank_id;
    WHEN 'usd_sell' THEN
      UPDATE banks SET 
        balance_ars = balance_ars + NEW.net_amount,
        balance_usd = balance_usd - NEW.crypto_amount 
      WHERE id = NEW.bank_id;
    WHEN 'usd_in' THEN
      UPDATE banks SET balance_usd = balance_usd + NEW.amount 
      WHERE id = NEW.bank_id;
    WHEN 'usd_out' THEN
      UPDATE banks SET balance_usd = balance_usd - NEW.amount 
      WHERE id = NEW.bank_id;
  END CASE;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for bank balance updates
DROP TRIGGER IF EXISTS update_bank_balance_trigger ON transactions;
CREATE TRIGGER update_bank_balance_trigger
  AFTER INSERT ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_bank_balance();