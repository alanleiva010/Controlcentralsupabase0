/*
  # Add Cashbox Transaction Updates
  
  1. Changes
    - Add function to update cashbox balances on transaction
    - Add trigger to automatically update cashbox balances
    
  2. Security
    - Function runs with security definer to ensure proper access
*/

-- Function to update cashbox balances
CREATE OR REPLACE FUNCTION update_cashbox_balances()
RETURNS TRIGGER AS $$
BEGIN
  -- Update cashbox balances based on operation type
  CASE NEW.operation_type
    -- ARS operations
    WHEN 'ars_in'::operation_type THEN
      UPDATE cashbox 
      SET closing_balance_ars = closing_balance_ars + NEW.net_amount 
      WHERE id = NEW.cashbox_id;
    WHEN 'ars_out'::operation_type THEN
      UPDATE cashbox 
      SET closing_balance_ars = closing_balance_ars - NEW.net_amount 
      WHERE id = NEW.cashbox_id;
    
    -- USDT operations
    WHEN 'usdt_buy'::operation_type THEN
      UPDATE cashbox 
      SET 
        closing_balance_ars = closing_balance_ars - NEW.net_amount,
        closing_balance_usdt = closing_balance_usdt + NEW.crypto_amount 
      WHERE id = NEW.cashbox_id;
    WHEN 'usdt_sell'::operation_type THEN
      UPDATE cashbox 
      SET 
        closing_balance_ars = closing_balance_ars + NEW.net_amount,
        closing_balance_usdt = closing_balance_usdt - NEW.crypto_amount 
      WHERE id = NEW.cashbox_id;
    WHEN 'usdt_in'::operation_type THEN
      UPDATE cashbox 
      SET closing_balance_usdt = closing_balance_usdt + NEW.amount 
      WHERE id = NEW.cashbox_id;
    WHEN 'usdt_out'::operation_type THEN
      UPDATE cashbox 
      SET closing_balance_usdt = closing_balance_usdt - NEW.amount 
      WHERE id = NEW.cashbox_id;
    
    -- USD operations
    WHEN 'usd_buy'::operation_type THEN
      UPDATE cashbox 
      SET 
        closing_balance_ars = closing_balance_ars - NEW.net_amount,
        closing_balance_usd = closing_balance_usd + NEW.crypto_amount 
      WHERE id = NEW.cashbox_id;
    WHEN 'usd_sell'::operation_type THEN
      UPDATE cashbox 
      SET 
        closing_balance_ars = closing_balance_ars + NEW.net_amount,
        closing_balance_usd = closing_balance_usd - NEW.crypto_amount 
      WHERE id = NEW.cashbox_id;
    WHEN 'usd_in'::operation_type THEN
      UPDATE cashbox 
      SET closing_balance_usd = closing_balance_usd + NEW.amount 
      WHERE id = NEW.cashbox_id;
    WHEN 'usd_out'::operation_type THEN
      UPDATE cashbox 
      SET closing_balance_usd = closing_balance_usd - NEW.amount 
      WHERE id = NEW.cashbox_id;
  END CASE;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for cashbox balance updates
DROP TRIGGER IF EXISTS update_cashbox_balances_trigger ON transactions;
CREATE TRIGGER update_cashbox_balances_trigger
  AFTER INSERT ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_cashbox_balances();