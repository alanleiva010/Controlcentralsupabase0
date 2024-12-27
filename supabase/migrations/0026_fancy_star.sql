/*
  # Fix Transaction Validation

  1. Changes
    - Remove existing check constraints for crypto_amount and exchange_rate
    - Add new, more flexible constraints that properly handle all operation types
    - Update validation function to ensure proper values are set

  2. Validation Rules
    - Crypto operations (buy/sell) must have exchange_rate and crypto_amount
    - Non-crypto operations must NOT have exchange_rate or crypto_amount
    - All amounts must be positive
*/

-- Drop existing check constraints
ALTER TABLE transactions 
DROP CONSTRAINT IF EXISTS check_crypto_amount,
DROP CONSTRAINT IF EXISTS check_exchange_rate;

-- Add new check constraints
ALTER TABLE transactions
ADD CONSTRAINT check_positive_amounts
  CHECK (
    amount > 0 AND
    (crypto_amount IS NULL OR crypto_amount > 0) AND
    (exchange_rate IS NULL OR exchange_rate > 0)
  );

-- Function to validate transaction data
CREATE OR REPLACE FUNCTION validate_transaction()
RETURNS TRIGGER AS $$
BEGIN
  -- Validate crypto operations
  IF NEW.operation_type IN ('usdt_buy', 'usdt_sell', 'usd_buy', 'usd_sell') THEN
    IF NEW.exchange_rate IS NULL OR NEW.crypto_amount IS NULL THEN
      RAISE EXCEPTION 'Exchange rate and crypto amount are required for crypto operations';
    END IF;
  ELSE
    -- Non-crypto operations should not have exchange rate or crypto amount
    IF NEW.exchange_rate IS NOT NULL OR NEW.crypto_amount IS NOT NULL THEN
      RAISE EXCEPTION 'Exchange rate and crypto amount should not be set for non-crypto operations';
    END IF;
  END IF;

  -- Set net_amount if not provided
  IF NEW.net_amount IS NULL THEN
    NEW.net_amount := NEW.amount;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for transaction validation
DROP TRIGGER IF EXISTS validate_transaction_trigger ON transactions;
CREATE TRIGGER validate_transaction_trigger
  BEFORE INSERT ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION validate_transaction();