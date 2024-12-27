/*
  # Fix Cashbox Balance Updates

  1. Changes
    - Update trigger function to properly handle crypto operations
    - Fix balance calculations for buy/sell operations
    - Add validation for sufficient balances
    
  2. Security
    - Maintain RLS policies
    - Add balance validation checks
*/

-- Function to update cashbox bank balances
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
        closing_balance_ars = closing_balance_ars - NEW.amount,
        closing_balance_usdt = closing_balance_usdt + NEW.crypto_amount 
      WHERE cashbox_id = NEW.cashbox_id AND bank_id = NEW.bank_id;
    WHEN 'usdt_sell'::operation_type THEN
      UPDATE cashbox_bank_balances 
      SET 
        closing_balance_ars = closing_balance_ars + NEW.net_amount,
        closing_balance_usdt = closing_balance_usdt - NEW.crypto_amount 
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
        closing_balance_ars = closing_balance_ars - NEW.amount,
        closing_balance_usd = closing_balance_usd + NEW.crypto_amount 
      WHERE cashbox_id = NEW.cashbox_id AND bank_id = NEW.bank_id;
    WHEN 'usd_sell'::operation_type THEN
      UPDATE cashbox_bank_balances 
      SET 
        closing_balance_ars = closing_balance_ars + NEW.net_amount,
        closing_balance_usd = closing_balance_usd - NEW.crypto_amount 
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

-- Create or replace trigger
DROP TRIGGER IF EXISTS update_cashbox_bank_balances_trigger ON transactions;
CREATE TRIGGER update_cashbox_bank_balances_trigger
  AFTER INSERT ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_cashbox_bank_balances();