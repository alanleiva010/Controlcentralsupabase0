/*
  # Add Bank Balance Updates
  
  1. Changes
    - Add function to update bank balances on transaction
    - Add trigger to automatically update bank balances
    
  2. Security
    - Function runs with security definer to ensure proper access
*/

-- Function to update bank balances
CREATE OR REPLACE FUNCTION update_bank_balances()
RETURNS TRIGGER AS $$
BEGIN
  -- Update bank balances based on operation type
  CASE NEW.operation_type
    -- ARS operations
    WHEN 'ars_in'::operation_type THEN
      UPDATE banks 
      SET balance_ars = balance_ars + NEW.net_amount 
      WHERE id = NEW.bank_id;
    WHEN 'ars_out'::operation_type THEN
      UPDATE banks 
      SET balance_ars = balance_ars - NEW.net_amount 
      WHERE id = NEW.bank_id;
    
    -- USDT operations
    WHEN 'usdt_buy'::operation_type THEN
      UPDATE banks 
      SET 
        balance_ars = balance_ars - NEW.net_amount,
        balance_usdt = balance_usdt + NEW.crypto_amount 
      WHERE id = NEW.bank_id;
    WHEN 'usdt_sell'::operation_type THEN
      UPDATE banks 
      SET 
        balance_ars = balance_ars + NEW.net_amount,
        balance_usdt = balance_usdt - NEW.crypto_amount 
      WHERE id = NEW.bank_id;
    WHEN 'usdt_in'::operation_type THEN
      UPDATE banks 
      SET balance_usdt = balance_usdt + NEW.amount 
      WHERE id = NEW.bank_id;
    WHEN 'usdt_out'::operation_type THEN
      UPDATE banks 
      SET balance_usdt = balance_usdt - NEW.amount 
      WHERE id = NEW.bank_id;
    
    -- USD operations
    WHEN 'usd_buy'::operation_type THEN
      UPDATE banks 
      SET 
        balance_ars = balance_ars - NEW.net_amount,
        balance_usd = balance_usd + NEW.crypto_amount 
      WHERE id = NEW.bank_id;
    WHEN 'usd_sell'::operation_type THEN
      UPDATE banks 
      SET 
        balance_ars = balance_ars + NEW.net_amount,
        balance_usd = balance_usd - NEW.crypto_amount 
      WHERE id = NEW.bank_id;
    WHEN 'usd_in'::operation_type THEN
      UPDATE banks 
      SET balance_usd = balance_usd + NEW.amount 
      WHERE id = NEW.bank_id;
    WHEN 'usd_out'::operation_type THEN
      UPDATE banks 
      SET balance_usd = balance_usd - NEW.amount 
      WHERE id = NEW.bank_id;
  END CASE;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for bank balance updates
DROP TRIGGER IF EXISTS update_bank_balances_trigger ON transactions;
CREATE TRIGGER update_bank_balances_trigger
  AFTER INSERT ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_bank_balances();

-- Add validation function to check bank balances before transaction
CREATE OR REPLACE FUNCTION validate_bank_balance()
RETURNS TRIGGER AS $$
BEGIN
  -- Validate bank has sufficient balance
  CASE NEW.operation_type
    WHEN 'ars_out'::operation_type THEN
      IF (SELECT balance_ars FROM banks WHERE id = NEW.bank_id) < NEW.amount THEN
        RAISE EXCEPTION 'Insufficient ARS balance in bank';
      END IF;
    WHEN 'usdt_sell'::operation_type THEN
      IF (SELECT balance_usdt FROM banks WHERE id = NEW.bank_id) < NEW.crypto_amount THEN
        RAISE EXCEPTION 'Insufficient USDT balance in bank';
      END IF;
    WHEN 'usdt_out'::operation_type THEN
      IF (SELECT balance_usdt FROM banks WHERE id = NEW.bank_id) < NEW.amount THEN
        RAISE EXCEPTION 'Insufficient USDT balance in bank';
      END IF;
    WHEN 'usd_sell'::operation_type THEN
      IF (SELECT balance_usd FROM banks WHERE id = NEW.bank_id) < NEW.crypto_amount THEN
        RAISE EXCEPTION 'Insufficient USD balance in bank';
      END IF;
    WHEN 'usd_out'::operation_type THEN
      IF (SELECT balance_usd FROM banks WHERE id = NEW.bank_id) < NEW.amount THEN
        RAISE EXCEPTION 'Insufficient USD balance in bank';
      END IF;
    ELSE
      -- Other operations don't need balance validation
      NULL;
  END CASE;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for bank balance validation
DROP TRIGGER IF EXISTS validate_bank_balance_trigger ON transactions;
CREATE TRIGGER validate_bank_balance_trigger
  BEFORE INSERT ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION validate_bank_balance();