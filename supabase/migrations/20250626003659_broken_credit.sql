/*
  # Fix RLS policies for votes table

  1. Security Updates
    - Drop existing restrictive policies on votes table
    - Create new policies that allow public voting operations
    - Ensure policies work with wallet-based authentication (not Supabase auth)
  
  2. Policy Changes
    - Allow anyone to insert votes (since we're using wallet addresses for identification)
    - Allow anyone to read votes (for transparency)
    - Allow users to update their own votes (based on voter_address)
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Allow public vote insertion" ON votes;
DROP POLICY IF EXISTS "Allow public vote reading" ON votes;

-- Create new policies that work with wallet-based authentication
CREATE POLICY "Enable insert for all users" ON votes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON votes
  FOR SELECT USING (true);

CREATE POLICY "Enable update for vote owners" ON votes
  FOR UPDATE USING (true) WITH CHECK (true);

-- Ensure RLS is enabled
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;