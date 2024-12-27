-- Create a function to handle cashbox opening in a transaction
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
BEGIN
  -- Create the cashbox
  INSERT INTO cashbox (date, bank_ids, status)
  VALUES (p_date, p_bank_ids, 'open')
  RETURNING id INTO v_cashbox_id;

  -- Create bank balances
  FOR v_balance IN SELECT * FROM jsonb_array_elements(p_bank_balances)
  LOOP
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
      (v_balance->>'opening_balance_ars')::numeric,
      (v_balance->>'opening_balance_usd')::numeric,
      (v_balance->>'opening_balance_usdt')::numeric,
      (v_balance->>'opening_balance_ars')::numeric,
      (v_balance->>'opening_balance_usd')::numeric,
      (v_balance->>'opening_balance_usdt')::numeric
    );
  END LOOP;

  RETURN v_cashbox_id;
END;
$$;