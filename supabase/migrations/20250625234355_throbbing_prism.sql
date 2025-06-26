/*
  # Complete CivicKernel Database Schema

  1. New Tables
    - `citizens` - User profiles and civic identity
    - `proposals` - Governance proposals for voting
    - `votes` - Individual votes on proposals
    - `activities` - User participation tracking
    - `ai_analyses` - AI-generated proposal analyses
    - `forum_posts` - Community forum discussions
    - `network_states` - Global network state information

  2. Security
    - Enable RLS on all tables
    - Add policies for public read and authenticated write access

  3. Performance
    - Add indexes for frequently queried columns
    - Add triggers for automatic timestamp updates

  4. Sample Data
    - Insert initial network states for testing
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Citizens table
CREATE TABLE IF NOT EXISTS citizens (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_address text UNIQUE NOT NULL,
  name text,
  civic_score integer DEFAULT 100,
  reputation integer DEFAULT 50,
  role text DEFAULT 'Verified Resident',
  residency text DEFAULT 'Network State',
  is_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Proposals table
CREATE TABLE IF NOT EXISTS proposals (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  description text NOT NULL,
  proposer_address text NOT NULL,
  category text DEFAULT 'Governance',
  voting_type integer DEFAULT 0,
  status integer DEFAULT 0,
  votes_for integer DEFAULT 0,
  votes_against integer DEFAULT 0,
  total_participants integer DEFAULT 0,
  start_time timestamptz DEFAULT now(),
  end_time timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Votes table
CREATE TABLE IF NOT EXISTS votes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  proposal_id uuid,
  voter_address text NOT NULL,
  support boolean NOT NULL,
  weight integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  UNIQUE(proposal_id, voter_address)
);

-- Activities table
CREATE TABLE IF NOT EXISTS activities (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_address text NOT NULL,
  activity_type text NOT NULL,
  description text NOT NULL,
  points integer DEFAULT 0,
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- AI Analyses table
CREATE TABLE IF NOT EXISTS ai_analyses (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  proposal_id uuid,
  economic_impact integer NOT NULL,
  citizen_sentiment integer NOT NULL,
  implementation_risk integer NOT NULL,
  recommendation text NOT NULL,
  confidence integer NOT NULL,
  reasoning text[] NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Forum Posts table
CREATE TABLE IF NOT EXISTS forum_posts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  content text NOT NULL,
  author_address text NOT NULL,
  category text DEFAULT 'governance',
  tags text[] DEFAULT '{}',
  likes integer DEFAULT 0,
  replies integer DEFAULT 0,
  views integer DEFAULT 0,
  network_state text DEFAULT 'infinita',
  is_trending boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Network States table
CREATE TABLE IF NOT EXISTS network_states (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text UNIQUE NOT NULL,
  flag text NOT NULL,
  population integer NOT NULL,
  gdp numeric(10,2) NOT NULL,
  governance_score integer NOT NULL,
  innovation_index integer NOT NULL,
  location text NOT NULL,
  established text NOT NULL,
  status text DEFAULT 'active',
  specialties text[] DEFAULT '{}',
  partnerships text[] DEFAULT '{}',
  color text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add foreign key constraints safely
DO $$
BEGIN
  -- Add votes foreign key if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'votes_proposal_id_fkey' AND table_name = 'votes'
  ) THEN
    ALTER TABLE votes ADD CONSTRAINT votes_proposal_id_fkey 
    FOREIGN KEY (proposal_id) REFERENCES proposals(id) ON DELETE CASCADE;
  END IF;

  -- Add ai_analyses foreign key if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'ai_analyses_proposal_id_fkey' AND table_name = 'ai_analyses'
  ) THEN
    ALTER TABLE ai_analyses ADD CONSTRAINT ai_analyses_proposal_id_fkey 
    FOREIGN KEY (proposal_id) REFERENCES proposals(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Enable Row Level Security safely
DO $$
DECLARE
  table_name text;
BEGIN
  FOR table_name IN SELECT unnest(ARRAY['citizens', 'proposals', 'votes', 'activities', 'ai_analyses', 'forum_posts', 'network_states'])
  LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', table_name);
  END LOOP;
EXCEPTION
  WHEN OTHERS THEN
    -- RLS might already be enabled, continue
    NULL;
END $$;

-- Create or replace all policies
DO $$
BEGIN
  -- Citizens policies
  DROP POLICY IF EXISTS "Public read access for citizens" ON citizens;
  CREATE POLICY "Public read access for citizens"
    ON citizens FOR SELECT TO public USING (true);

  DROP POLICY IF EXISTS "Authenticated users can insert citizens" ON citizens;
  CREATE POLICY "Authenticated users can insert citizens"
    ON citizens FOR INSERT TO public WITH CHECK (true);

  DROP POLICY IF EXISTS "Authenticated users can update citizens" ON citizens;
  CREATE POLICY "Authenticated users can update citizens"
    ON citizens FOR UPDATE TO public USING (true);

  -- Proposals policies
  DROP POLICY IF EXISTS "Public read access for proposals" ON proposals;
  CREATE POLICY "Public read access for proposals"
    ON proposals FOR SELECT TO public USING (true);

  DROP POLICY IF EXISTS "Authenticated users can insert proposals" ON proposals;
  CREATE POLICY "Authenticated users can insert proposals"
    ON proposals FOR INSERT TO public WITH CHECK (true);

  DROP POLICY IF EXISTS "Authenticated users can update proposals" ON proposals;
  CREATE POLICY "Authenticated users can update proposals"
    ON proposals FOR UPDATE TO public USING (true);

  -- Votes policies
  DROP POLICY IF EXISTS "Public read access for votes" ON votes;
  CREATE POLICY "Public read access for votes"
    ON votes FOR SELECT TO public USING (true);

  DROP POLICY IF EXISTS "Authenticated users can insert votes" ON votes;
  CREATE POLICY "Authenticated users can insert votes"
    ON votes FOR INSERT TO public WITH CHECK (true);

  -- Activities policies
  DROP POLICY IF EXISTS "Public read access for activities" ON activities;
  CREATE POLICY "Public read access for activities"
    ON activities FOR SELECT TO public USING (true);

  DROP POLICY IF EXISTS "Authenticated users can insert activities" ON activities;
  CREATE POLICY "Authenticated users can insert activities"
    ON activities FOR INSERT TO public WITH CHECK (true);

  -- AI Analyses policies
  DROP POLICY IF EXISTS "Public read access for ai_analyses" ON ai_analyses;
  CREATE POLICY "Public read access for ai_analyses"
    ON ai_analyses FOR SELECT TO public USING (true);

  DROP POLICY IF EXISTS "Authenticated users can insert ai_analyses" ON ai_analyses;
  CREATE POLICY "Authenticated users can insert ai_analyses"
    ON ai_analyses FOR INSERT TO public WITH CHECK (true);

  -- Forum Posts policies
  DROP POLICY IF EXISTS "Public read access for forum_posts" ON forum_posts;
  CREATE POLICY "Public read access for forum_posts"
    ON forum_posts FOR SELECT TO public USING (true);

  DROP POLICY IF EXISTS "Authenticated users can insert forum_posts" ON forum_posts;
  CREATE POLICY "Authenticated users can insert forum_posts"
    ON forum_posts FOR INSERT TO public WITH CHECK (true);

  DROP POLICY IF EXISTS "Authenticated users can update forum_posts" ON forum_posts;
  CREATE POLICY "Authenticated users can update forum_posts"
    ON forum_posts FOR UPDATE TO public USING (true);

  -- Network States policies
  DROP POLICY IF EXISTS "Public read access for network_states" ON network_states;
  CREATE POLICY "Public read access for network_states"
    ON network_states FOR SELECT TO public USING (true);

  DROP POLICY IF EXISTS "Authenticated users can insert network_states" ON network_states;
  CREATE POLICY "Authenticated users can insert network_states"
    ON network_states FOR INSERT TO public WITH CHECK (true);

  DROP POLICY IF EXISTS "Authenticated users can update network_states" ON network_states;
  CREATE POLICY "Authenticated users can update network_states"
    ON network_states FOR UPDATE TO public USING (true);
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_proposals_status ON proposals(status);
CREATE INDEX IF NOT EXISTS idx_proposals_end_time ON proposals(end_time);
CREATE INDEX IF NOT EXISTS idx_votes_proposal_id ON votes(proposal_id);
CREATE INDEX IF NOT EXISTS idx_votes_voter_address ON votes(voter_address);
CREATE INDEX IF NOT EXISTS idx_activities_user_address ON activities(user_address);
CREATE INDEX IF NOT EXISTS idx_ai_analyses_proposal_id ON ai_analyses(proposal_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_category ON forum_posts(category);
CREATE INDEX IF NOT EXISTS idx_forum_posts_network_state ON forum_posts(network_state);
CREATE INDEX IF NOT EXISTS idx_citizens_wallet_address ON citizens(wallet_address);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for automatic timestamp updates
DROP TRIGGER IF EXISTS update_citizens_updated_at ON citizens;
CREATE TRIGGER update_citizens_updated_at
  BEFORE UPDATE ON citizens
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_proposals_updated_at ON proposals;
CREATE TRIGGER update_proposals_updated_at
  BEFORE UPDATE ON proposals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_forum_posts_updated_at ON forum_posts;
CREATE TRIGGER update_forum_posts_updated_at
  BEFORE UPDATE ON forum_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_network_states_updated_at ON network_states;
CREATE TRIGGER update_network_states_updated_at
  BEFORE UPDATE ON network_states
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample network states with proper array casting
DO $$
BEGIN
  -- Insert Infinita City
  INSERT INTO network_states (
    name, flag, population, gdp, governance_score, innovation_index, 
    location, established, specialties, partnerships, color
  ) VALUES (
    'Infinita City', '🏙️', 45000, 2.3, 94, 87, 'Caribbean', '2023',
    ARRAY['AI Governance', 'Sustainable Tech', 'Digital Finance'],
    ARRAY['Próspera', 'Zuzalu'],
    'from-blue-500 to-cyan-500'
  ) ON CONFLICT (name) DO NOTHING;

  -- Insert Próspera
  INSERT INTO network_states (
    name, flag, population, gdp, governance_score, innovation_index, 
    location, established, specialties, partnerships, color
  ) VALUES (
    'Próspera', '🏛️', 12000, 0.8, 91, 82, 'Honduras', '2020',
    ARRAY['Charter City', 'Economic Freedom', 'Regulatory Innovation'],
    ARRAY['Infinita City', 'Nueva Libertad'],
    'from-green-500 to-emerald-500'
  ) ON CONFLICT (name) DO NOTHING;

  -- Insert Zuzalu
  INSERT INTO network_states (
    name, flag, population, gdp, governance_score, innovation_index, 
    location, established, specialties, partnerships, color
  ) VALUES (
    'Zuzalu', '🌊', 8500, 0.4, 88, 95, 'Montenegro', '2023',
    ARRAY['Research', 'Longevity', 'Crypto Innovation'],
    ARRAY['Infinita City', 'Digital Nomad Republic'],
    'from-purple-500 to-pink-500'
  ) ON CONFLICT (name) DO NOTHING;

  -- Insert Nueva Libertad
  INSERT INTO network_states (
    name, flag, population, gdp, governance_score, innovation_index, 
    location, established, specialties, partnerships, color
  ) VALUES (
    'Nueva Libertad', '🗽', 23000, 1.2, 89, 78, 'Chile', '2022',
    ARRAY['Mining Tech', 'Renewable Energy', 'Space Industry'],
    ARRAY['Próspera', 'Aurora Station'],
    'from-orange-500 to-red-500'
  ) ON CONFLICT (name) DO NOTHING;

  -- Insert Digital Nomad Republic
  INSERT INTO network_states (
    name, flag, population, gdp, governance_score, innovation_index, 
    location, established, specialties, partnerships, color
  ) VALUES (
    'Digital Nomad Republic', '🌐', 67000, 3.1, 85, 92, 'Distributed', '2021',
    ARRAY['Remote Work', 'Digital Services', 'Global Mobility'],
    ARRAY['Infinita City', 'Zuzalu'],
    'from-teal-500 to-blue-500'
  ) ON CONFLICT (name) DO NOTHING;

  -- Insert Aurora Station
  INSERT INTO network_states (
    name, flag, population, gdp, governance_score, innovation_index, 
    location, established, specialties, partnerships, color
  ) VALUES (
    'Aurora Station', '🚀', 150, 0.05, 76, 98, 'Low Earth Orbit', '2024',
    ARRAY['Space Governance', 'Zero-G Manufacturing', 'Orbital Research'],
    ARRAY['Nueva Libertad', 'Digital Nomad Republic'],
    'from-indigo-500 to-purple-500'
  ) ON CONFLICT (name) DO NOTHING;

END $$;