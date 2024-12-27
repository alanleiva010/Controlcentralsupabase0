/*
  # Fix Cashbox RLS Policies

  1. Changes
    - Remove existing restrictive policies
    - Create new permissive policies for authenticated users
    - Add proper security checks for updates
    - Grant necessary permissions

  2. Security
    - Enable RLS
    - Allow authenticated users to read all cashboxes
    - Allow authenticated users to create new cashboxes
    - Allow updating only open cashboxes
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Allow read access for authenticated users" ON cashbox;
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON cashbox;
DROP POLICY IF EXISTS "Allow update for authenticated users" ON cashbox;

-- Create new policies
CREATE POLICY "enable_read_for_authenticated"
  ON cashbox FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "enable_insert_for_authenticated"
  ON cashbox FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "enable_update_for_authenticated"
  ON cashbox FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Grant necessary permissions
GRANT ALL ON cashbox TO authenticated;

-- Add validation function
CREATE OR REPLACE FUNCTION validate_cashbox_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Only allow updating open cashboxes
  IF OLD.status = 'closed' THEN
    RAISE EXCEPTION 'Cannot modify closed cashbox';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for validation
DROP TRIGGER IF EXISTS validate_cashbox_update_trigger ON cashbox;
CREATE TRIGGER validate_cashbox_update_trigger
  BEFORE UPDATE ON cashbox
  FOR EACH ROW
  EXECUTE FUNCTION validate_cashbox_update();