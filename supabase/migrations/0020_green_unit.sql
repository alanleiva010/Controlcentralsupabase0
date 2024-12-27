-- Remove unique constraint on date column
ALTER TABLE cashbox
DROP CONSTRAINT IF EXISTS cashbox_date_key;

-- Add index for date without unique constraint
DROP INDEX IF EXISTS idx_cashbox_date;
CREATE INDEX idx_cashbox_date ON cashbox(date DESC);

-- Update or create policies
DROP POLICY IF EXISTS "Allow read access for authenticated users" ON cashbox;
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON cashbox;
DROP POLICY IF EXISTS "Allow update for authenticated users" ON cashbox;

CREATE POLICY "Allow read access for authenticated users"
  ON cashbox FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow insert for authenticated users"
  ON cashbox FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow update for authenticated users"
  ON cashbox FOR UPDATE
  TO authenticated
  USING (status = 'open');

-- Add status check constraint if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'cashbox_status_check'
  ) THEN
    ALTER TABLE cashbox
    ADD CONSTRAINT cashbox_status_check
    CHECK (status IN ('open', 'closed'));
  END IF;
END $$;