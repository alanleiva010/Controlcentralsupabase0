-- Drop existing trigger that was causing conflicts
DROP TRIGGER IF EXISTS create_bank_balances_trigger ON cashbox;
DROP FUNCTION IF EXISTS create_bank_balances();

-- Modify the open_cashbox function to handle bank balances properly
CREATE OR REPLACE FUNCTION open_cashbox(
  p_date date,
  p_bank_ids uuid[],
  p_bank_balances jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_cashbox_id uuid;
  v_balance jsonb;
  v_existing_cashbox uuid;
BEGIN
  -- Check if there's already an open cashbox for this date
  SELECT id INTO v_existing_cashbox
  FROM cashbox
  WHERE date = p_date AND status = 'open';

  IF v_existing_cashbox IS NOT NULL THEN
    RAISE EXCEPTION 'There is already an open cashbox for this date';
  END IF;

  -- Create the cashbox
  INSERT INTO cashbox (date, bank_ids, status)
  VALUES (p_date, p_bank_ids, 'open')
  RETURNING id INTO v_cashbox_id;

  -- Create bank balances
  FOR v_balance IN SELECT * FROM jsonb_array_elements(p_bank_balances)
  LOOP
    -- Insert bank balance, handling potential conflicts
    INSERT INTO cashbox_bank_balances (
      cashbox_id,
      bank_id,
      opening_balance_ars,
      opening_balance_usd,
      opening_balance_usdt,
      closing_balance_ars,
      closing_balance_usd,
      closing_balance_usdt
    ) VALUES (
      v_cashbox_id,
      (v_balance->>'bank_id')::uuid,
      COALESCE((v_balance->>'opening_balance_ars')::numeric, 0),
      COALESCE((v_balance->>'opening_balance_usd')::numeric, 0),
      COALESCE((v_balance->>'opening_balance_usdt')::numeric, 0),
      COALESCE((v_balance->>'opening_balance_ars')::numeric, 0),
      COALESCE((v_balance->>'opening_balance_usd')::numeric, 0),
      COALESCE((v_balance->>'opening_balance_usdt')::numeric, 0)
    )
    ON CONFLICT (cashbox_id, bank_id) DO UPDATE SET
      opening_balance_ars = EXCLUDED.opening_balance_ars,
      opening_balance_usd = EXCLUDED.opening_balance_usd,
      opening_balance_usdt = EXCLUDED.opening_balance_usdt,
      closing_balance_ars = EXCLUDED.closing_balance_ars,
      closing_balance_usd = EXCLUDED.closing_balance_usd,
      closing_balance_usdt = EXCLUDED.closing_balance_usdt;
  END LOOP;

  RETURN v_cashbox_id;
END;
$$;