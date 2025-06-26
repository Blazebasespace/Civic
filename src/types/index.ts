export interface User {
  id: string;
  name: string;
  zkAddress: string;
  civicScore: number;
  reputation: number;
  roles: string[];
  isVerified: boolean;
  residency: string;
  joinDate: string;
}

export interface Proposal {
  id: string;
  title: string;
  description: string;
  type: 'quadratic' | 'conviction' | 'futarchy' | 'simple';
  status: 'active' | 'passed' | 'rejected' | 'draft';
  votesFor: number;
  votesAgainst: number;
  totalParticipants: number;
  deadline: string;
  createdBy: string;
  category: string;
}

export interface CivicActivity {
  id: string;
  type: string;
  description: string;
  points: number;
  timestamp: string;
  verified: boolean;
}

export interface TokenBalance {
  symbol: string;
  amount: number;
  value: number;
}

export interface Module {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  icon: string;
}