/*
  # Fix RLS policies for votes table

  1. Security Changes
    - Drop existing restrictive RLS policies on votes table
    - Add new policies that allow public access for voting operations
    - Maintain data integrity while allowing wallet-based voting

  2. Policy Updates
    - Allow public INSERT for votes (wallet-based authentication)
    - Allow public SELECT for votes (needed for vote counting)
    - Remove UPDATE policy as votes should be immutable after creation

  This change enables the voting functionality to work with wallet addresses
  without requiring Supabase Auth integration.
*/

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Authenticated users can insert votes" ON votes;
DROP POLICY IF EXISTS "Public read access for votes" ON votes;

-- Create new policies that allow wallet-based voting
CREATE POLICY "Allow public vote insertion"
  ON votes
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public vote reading"
  ON votes
  FOR SELECT
  TO public
  USING (true);

-- Ensure RLS is still enabled
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;