import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Database Types
export interface Database {
  public: {
    Tables: {
      citizens: {
        Row: {
          id: string;
          wallet_address: string;
          name: string | null;
          civic_score: number;
          reputation: number;
          role: string;
          residency: string;
          is_verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          wallet_address: string;
          name?: string | null;
          civic_score?: number;
          reputation?: number;
          role?: string;
          residency?: string;
          is_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          wallet_address?: string;
          name?: string | null;
          civic_score?: number;
          reputation?: number;
          role?: string;
          residency?: string;
          is_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      proposals: {
        Row: {
          id: string;
          title: string;
          description: string;
          proposer_address: string;
          category: string;
          voting_type: number;
          status: number;
          votes_for: number;
          votes_against: number;
          total_participants: number;
          start_time: string;
          end_time: string;
          created_at: string;
          updated_at: string;
          blockchain_proposal_id: number | null;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          proposer_address: string;
          category?: string;
          voting_type?: number;
          status?: number;
          votes_for?: number;
          votes_against?: number;
          total_participants?: number;
          start_time?: string;
          end_time: string;
          created_at?: string;
          updated_at?: string;
          blockchain_proposal_id?: number | null;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          proposer_address?: string;
          category?: string;
          voting_type?: number;
          status?: number;
          votes_for?: number;
          votes_against?: number;
          total_participants?: number;
          start_time?: string;
          end_time?: string;
          created_at?: string;
          updated_at?: string;
          blockchain_proposal_id?: number | null;
        };
      };
      votes: {
        Row: {
          id: string;
          proposal_id: string;
          voter_address: string;
          support: boolean;
          weight: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          proposal_id: string;
          voter_address: string;
          support: boolean;
          weight?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          proposal_id?: string;
          voter_address?: string;
          support?: boolean;
          weight?: number;
          created_at?: string;
        };
      };
      forum_posts: {
        Row: {
          id: string;
          title: string;
          content: string;
          author_address: string;
          category: string;
          tags: string[];
          likes: number;
          replies: number;
          views: number;
          network_state: string;
          is_trending: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          content: string;
          author_address: string;
          category?: string;
          tags?: string[];
          likes?: number;
          replies?: number;
          views?: number;
          network_state?: string;
          is_trending?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          content?: string;
          author_address?: string;
          category?: string;
          tags?: string[];
          likes?: number;
          replies?: number;
          views?: number;
          network_state?: string;
          is_trending?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      activities: {
        Row: {
          id: string;
          user_address: string;
          activity_type: string;
          description: string;
          points: number;
          verified: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_address: string;
          activity_type: string;
          description: string;
          points?: number;
          verified?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_address?: string;
          activity_type?: string;
          description?: string;
          points?: number;
          verified?: boolean;
          created_at?: string;
        };
      };
      ai_analyses: {
        Row: {
          id: string;
          proposal_id: string;
          economic_impact: number;
          citizen_sentiment: number;
          implementation_risk: number;
          recommendation: string;
          confidence: number;
          reasoning: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          proposal_id: string;
          economic_impact: number;
          citizen_sentiment: number;
          implementation_risk: number;
          recommendation: string;
          confidence: number;
          reasoning: string[];
          created_at?: string;
        };
        Update: {
          id?: string;
          proposal_id?: string;
          economic_impact?: number;
          citizen_sentiment?: number;
          implementation_risk?: number;
          recommendation?: string;
          confidence?: number;
          reasoning?: string[];
          created_at?: string;
        };
      };
      network_states: {
        Row: {
          id: string;
          name: string;
          flag: string;
          population: number;
          gdp: number;
          governance_score: number;
          innovation_index: number;
          location: string;
          established: string;
          status: string;
          specialties: string[];
          partnerships: string[];
          color: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          flag: string;
          population: number;
          gdp: number;
          governance_score: number;
          innovation_index: number;
          location: string;
          established: string;
          status?: string;
          specialties?: string[];
          partnerships?: string[];
          color: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          flag?: string;
          population?: number;
          gdp?: number;
          governance_score?: number;
          innovation_index?: number;
          location?: string;
          established?: string;
          status?: string;
          specialties?: string[];
          partnerships?: string[];
          color?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}