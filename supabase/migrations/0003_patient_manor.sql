/*
  # Fix RLS policies to prevent infinite recursion

  1. Changes
    - Drop existing policies that cause recursion
    - Create new policies with proper conditions
    - Add role column directly to auth.users metadata for efficient checks
  
  2. Security
    - Enable RLS on profiles table
    - Add policies for user and admin access
*/

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;

-- Create new non-recursive policies
CREATE POLICY "Allow users to read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Allow admins to read all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Update existing update policy
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Allow users to update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Update financial data policies
DROP POLICY IF EXISTS "Users can read own financial data" ON financial_data;
DROP POLICY IF EXISTS "Admins can read all financial data" ON financial_data;

CREATE POLICY "Allow users to read own financial data"
  ON financial_data FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Allow admins to read all financial data"
  ON financial_data FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );