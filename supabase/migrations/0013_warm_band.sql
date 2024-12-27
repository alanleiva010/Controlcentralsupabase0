/*
  # Transaction Management Enhancement

  1. Changes
    - Add operation types enum for transactions
    - Add exchange rate column for crypto/USD operations
    - Add triggers to update bank and cashbox balances
    - Add constraints for transaction validation

  2. Security
    - Maintain existing RLS policies
    - Add validation checks for transactions
*/

-- Create operation type enum
CREATE TYPE operation_type AS ENUM (
  'ars_in', 'ars_out',
  'usdt_buy', 'usdt_sell', 'usdt_in', 'usdt_out',
  'usd_buy', 'usd_sell', 'usd_in', 'usd_out'
);

-- Update transactions table
ALTER TABLE transactions
  ADD COLUMN IF NOT EXISTS exchange_rate numeric,
  ADD COLUMN IF NOT EXISTS crypto_amount numeric,
  ALTER COLUMN operation_type TYPE operation_type USING operation_type::operation_type;

-- Function to update bank balance
CREATE OR REPLACE FUNCTION update_bank_balance()
RETURNS TRIGGER AS $$
BEGIN
  -- ARS operations
  IF NEW.operation_type = 'ars_in' THEN
    UPDATE banks SET balance_ars = balance_ars + NEW.net_amount WHERE id = NEW.bank_id;
  ELSIF NEW.operation_type = 'ars_out' THEN
    UPDATE banks SET balance_ars = balance_ars - NEW.net_amount WHERE id = NEW.bank_id;
  
  -- USDT operations
  ELSIF NEW.operation_type = 'usdt_buy' THEN
    UPDATE banks SET 
      balance_ars = balance_ars - NEW.net_amount,
      balance_usdt = balance_usdt + NEW.crypto_amount 
    WHERE id = NEW.bank_id;
  ELSIF NEW.operation_type = 'usdt_sell' THEN
    UPDATE banks SET 
      balance_ars = balance_ars + NEW.net_amount,
      balance_usdt = balance_usdt - NEW.crypto_amount 
    WHERE id = NEW.bank_id;
  ELSIF NEW.operation_type = 'usdt_in' THEN
    UPDATE banks SET balance_usdt = balance_usdt + NEW.amount WHERE id = NEW.bank_id;
  ELSIF NEW.operation_type = 'usdt_out' THEN
    UPDATE banks SET balance_usdt = balance_usdt - NEW.amount WHERE id = NEW.bank_id;
  
  -- USD operations
  ELSIF NEW.operation_type = 'usd_buy' THEN
    UPDATE banks SET 
      balance_ars = balance_ars - NEW.net_amount,
      balance_usd = balance_usd + NEW.crypto_amount 
    WHERE id = NEW.bank_id;
  ELSIF NEW.operation_type = 'usd_sell' THEN
    UPDATE banks SET 
      balance_ars = balance_ars + NEW.net_amount,
      balance_usd = balance_usd - NEW.crypto_amount 
    WHERE id = NEW.bank_id;
  ELSIF NEW.operation_type = 'usd_in' THEN
    UPDATE banks SET balance_usd = balance_usd + NEW.amount WHERE id = NEW.bank_id;
  ELSIF NEW.operation_type = 'usd_out' THEN
    UPDATE banks SET balance_usd = balance_usd - NEW.amount WHERE id = NEW.bank_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for bank balance updates
DROP TRIGGER IF EXISTS update_bank_balance_trigger ON transactions;
CREATE TRIGGER update_bank_balance_trigger
  AFTER INSERT ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_bank_balance();

-- Add validation check for exchange rate
ALTER TABLE transactions
  ADD CONSTRAINT check_exchange_rate
  CHECK (
    (operation_type IN ('usdt_buy', 'usdt_sell', 'usd_buy', 'usd_sell') AND exchange_rate IS NOT NULL)
    OR
    (operation_type NOT IN ('usdt_buy', 'usdt_sell', 'usd_buy', 'usd_sell') AND exchange_rate IS NULL)
  );

-- Add validation check for crypto amount
ALTER TABLE transactions
  ADD CONSTRAINT check_crypto_amount
  CHECK (
    (operation_type IN ('usdt_buy', 'usdt_sell', 'usd_buy', 'usd_sell') AND crypto_amount IS NOT NULL)
    OR
    (operation_type NOT IN ('usdt_buy', 'usdt_sell', 'usd_buy', 'usd_sell') AND crypto_amount IS NULL)
  );