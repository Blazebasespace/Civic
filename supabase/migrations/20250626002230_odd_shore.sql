/*
  # Add blockchain_proposal_id column to proposals table

  1. Changes
    - Add `blockchain_proposal_id` column to `proposals` table
    - Column type: bigint (INT8)
    - Column is nullable to support proposals that may not have blockchain integration
    - Add index for performance when querying by blockchain_proposal_id

  2. Security
    - No changes to RLS policies needed
    - Column inherits existing table permissions
*/

-- Add blockchain_proposal_id column to proposals table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'proposals' AND column_name = 'blockchain_proposal_id'
  ) THEN
    ALTER TABLE proposals ADD COLUMN blockchain_proposal_id bigint;
  END IF;
END $$;

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_proposals_blockchain_proposal_id 
ON proposals (blockchain_proposal_id) 
WHERE blockchain_proposal_id IS NOT NULL;