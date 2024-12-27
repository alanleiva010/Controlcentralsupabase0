/*
  # Fix Cashbox Balance Updates

  1. Changes
    - Fix the update_cashbox_bank_balances function to correctly handle crypto buy/sell operations
    - Use net_amount for ARS operations and amount for crypto operations
    - Ensure proper balance updates for all operation types

  2. Details
    - For crypto buy: Subtract gross ARS amount, add net crypto amount
    - For crypto sell: Add net ARS amount, subtract gross crypto amount
    - For direct operations (in/out): Use gross amounts
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
        closing_balance_ars = closing_balance_ars - NEW.amount, -- Subtract gross ARS amount
        closing_balance_usdt = closing_balance_usdt + NEW.crypto_amount -- Add net USDT amount
      WHERE cashbox_id = NEW.cashbox_id AND bank_id = NEW.bank_id;
    WHEN 'usdt_sell'::operation_type THEN
      UPDATE cashbox_bank_balances 
      SET 
        closing_balance_ars = closing_balance_ars + NEW.net_amount, -- Add net ARS amount
        closing_balance_usdt = closing_balance_usdt - NEW.amount -- Subtract gross USDT amount
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
        closing_balance_ars = closing_balance_ars - NEW.amount, -- Subtract gross ARS amount
        closing_balance_usd = closing_balance_usd + NEW.crypto_amount -- Add net USD amount
      WHERE cashbox_id = NEW.cashbox_id AND bank_id = NEW.bank_id;
    WHEN 'usd_sell'::operation_type THEN
      UPDATE cashbox_bank_balances 
      SET 
        closing_balance_ars = closing_balance_ars + NEW.net_amount, -- Add net ARS amount
        closing_balance_usd = closing_balance_usd - NEW.amount -- Subtract gross USD amount
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

-- Recreate trigger
DROP TRIGGER IF EXISTS update_cashbox_bank_balances_trigger ON transactions;
CREATE TRIGGER update_cashbox_bank_balances_trigger
  AFTER INSERT ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_cashbox_bank_balances();