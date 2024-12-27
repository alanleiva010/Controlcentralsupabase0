/*
  # Fix Bank Balance Updates

  1. Changes
    - Add validation for bank balances before transactions
    - Fix balance updates for crypto operations
    - Add proper error messages

  2. Details
    - Validates sufficient bank balance before transaction
    - Updates bank balances correctly for all operation types
    - Handles both gross and net amounts properly
*/

-- Function to validate bank balance before transaction
CREATE OR REPLACE FUNCTION validate_bank_balance()
RETURNS TRIGGER AS $$
BEGIN
  -- Validate bank has sufficient balance
  CASE NEW.operation_type
    WHEN 'ars_out'::operation_type THEN
      IF (SELECT closing_balance_ars FROM cashbox_bank_balances 
          WHERE cashbox_id = NEW.cashbox_id AND bank_id = NEW.bank_id) < NEW.amount THEN
        RAISE EXCEPTION 'Insufficient ARS balance in bank';
      END IF;
    WHEN 'usdt_sell'::operation_type THEN
      IF (SELECT closing_balance_usdt FROM cashbox_bank_balances 
          WHERE cashbox_id = NEW.cashbox_id AND bank_id = NEW.bank_id) < NEW.amount THEN
        RAISE EXCEPTION 'Insufficient USDT balance in bank';
      END IF;
    WHEN 'usdt_out'::operation_type THEN
      IF (SELECT closing_balance_usdt FROM cashbox_bank_balances 
          WHERE cashbox_id = NEW.cashbox_id AND bank_id = NEW.bank_id) < NEW.amount THEN
        RAISE EXCEPTION 'Insufficient USDT balance in bank';
      END IF;
    WHEN 'usd_sell'::operation_type THEN
      IF (SELECT closing_balance_usd FROM cashbox_bank_balances 
          WHERE cashbox_id = NEW.cashbox_id AND bank_id = NEW.bank_id) < NEW.amount THEN
        RAISE EXCEPTION 'Insufficient USD balance in bank';
      END IF;
    WHEN 'usd_out'::operation_type THEN
      IF (SELECT closing_balance_usd FROM cashbox_bank_balances 
          WHERE cashbox_id = NEW.cashbox_id AND bank_id = NEW.bank_id) < NEW.amount THEN
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

-- Function to update bank balances
CREATE OR REPLACE FUNCTION update_cashbox_bank_balances()
RETURNS TRIGGER AS $$
BEGIN
  -- Update cashbox bank balances based on operation type
  CASE NEW.operation_type
    -- ARS operations
    WHEN 'ars_in'::operation_type THEN
      UPDATE cashbox_bank_balances 
      SET closing_balance_ars = closing_balance_ars + NEW.net_amount 
      WHERE cashbox_id = NEW.cashbox_id AND bank_id = NEW.bank_id;
    WHEN 'ars_out'::operation_type THEN
      UPDATE cashbox_bank_balances 
      SET closing_balance_ars = closing_balance_ars - NEW.net_amount 
      WHERE cashbox_id = NEW.cashbox_id AND bank_id = NEW.bank_id;
    
    -- USDT operations
    WHEN 'usdt_buy'::operation_type THEN
      UPDATE cashbox_bank_balances 
      SET 
        closing_balance_ars = closing_balance_ars - NEW.net_amount,
        closing_balance_usdt = closing_balance_usdt + NEW.crypto_amount 
      WHERE cashbox_id = NEW.cashbox_id AND bank_id = NEW.bank_id;
    WHEN 'usdt_sell'::operation_type THEN
      UPDATE cashbox_bank_balances 
      SET 
        closing_balance_ars = closing_balance_ars + NEW.net_amount,
        closing_balance_usdt = closing_balance_usdt - NEW.amount
      WHERE cashbox_id = NEW.cashbox_id AND bank_id = NEW.bank_id;
    WHEN 'usdt_in'::operation_type THEN
      UPDATE cashbox_bank_balances 
      SET closing_balance_usdt = closing_balance_usdt + NEW.amount 
      WHERE cashbox_id = NEW.cashbox_id AND bank_id = NEW.bank_id;
    WHEN 'usdt_out'::operation_type THEN
      UPDATE cashbox_bank_balances 
      SET closing_balance_usdt = closing_balance_usdt - NEW.amount 
      WHERE cashbox_id = NEW.cashbox_id AND bank_id = NEW.bank_id;
    
    -- USD operations
    WHEN 'usd_buy'::operation_type THEN
      UPDATE cashbox_bank_balances 
      SET 
        closing_balance_ars = closing_balance_ars - NEW.net_amount,
        closing_balance_usd = closing_balance_usd + NEW.crypto_amount 
      WHERE cashbox_id = NEW.cashbox_id AND bank_id = NEW.bank_id;
    WHEN 'usd_sell'::operation_type THEN
      UPDATE cashbox_bank_balances 
      SET 
        closing_balance_ars = closing_balance_ars + NEW.net_amount,
        closing_balance_usd = closing_balance_usd - NEW.amount
      WHERE cashbox_id = NEW.cashbox_id AND bank_id = NEW.bank_id;
    WHEN 'usd_in'::operation_type THEN
      UPDATE cashbox_bank_balances 
      SET closing_balance_usd = closing_balance_usd + NEW.amount 
      WHERE cashbox_id = NEW.cashbox_id AND bank_id = NEW.bank_id;
    WHEN 'usd_out'::operation_type THEN
      UPDATE cashbox_bank_balances 
      SET closing_balance_usd = closing_balance_usd - NEW.amount 
      WHERE cashbox_id = NEW.cashbox_id AND bank_id = NEW.bank_id;
  END CASE;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger for bank balance updates
DROP TRIGGER IF EXISTS update_cashbox_bank_balances_trigger ON transactions;
CREATE TRIGGER update_cashbox_bank_balances_trigger
  AFTER INSERT ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_cashbox_bank_balances();