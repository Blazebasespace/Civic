import { User, Proposal, CivicActivity, TokenBalance, Module } from '../types';

export const mockUser: User = {
  id: '1',
  name: 'Alex Rivera',
  zkAddress: 'zk1x2y3z4a5b6c7d8e9f0',
  civicScore: 847,
  reputation: 92,
  roles: ['Verified Resident', 'Council Member', 'Public Goods Contributor'],
  isVerified: true,
  residency: 'Infinita City',
  joinDate: '2024-01-15'
};

export const mockProposals: Proposal[] = [
  {
    id: '1',
    title: 'Community Solar Grid Initiative',
    description: 'Proposal to implement a decentralized solar energy grid for Infinita City with citizen-owned solar panels and energy trading system.',
    type: 'quadratic',
    status: 'active',
    votesFor: 1247,
    votesAgainst: 203,
    totalParticipants: 1450,
    deadline: '2024-12-25',
    createdBy: 'Energy Council',
    category: 'Infrastructure'
  },
  {
    id: '2',
    title: 'Universal Basic Assets Program',
    description: 'Monthly distribution of 500 I₵C to all verified residents with civic score above 50.',
    type: 'conviction',
    status: 'active',
    votesFor: 2156,
    votesAgainst: 892,
    totalParticipants: 3048,
    deadline: '2024-12-30',
    createdBy: 'Economic Council',
    category: 'Economy'
  },
  {
    id: '3',
    title: 'Digital Identity Privacy Enhancement',
    description: 'Upgrade to zero-knowledge proof system for enhanced citizen privacy in governance participation.',
    type: 'futarchy',
    status: 'passed',
    votesFor: 1834,
    votesAgainst: 401,
    totalParticipants: 2235,
    deadline: '2024-12-15',
    createdBy: 'Tech Council',
    category: 'Governance'
  }
];

export const mockActivities: CivicActivity[] = [
  {
    id: '1',
    type: 'Proposal Voting',
    description: 'Voted on Community Solar Grid Initiative',
    points: 25,
    timestamp: '2024-12-20T10:30:00Z',
    verified: true
  },
  {
    id: '2',
    type: 'Community Event',
    description: 'Attended Weekly Governance Assembly',
    points: 15,
    timestamp: '2024-12-19T18:00:00Z',
    verified: true
  },
  {
    id: '3',
    type: 'Public Contribution',
    description: 'Contributed to Open Source Infrastructure',
    points: 50,
    timestamp: '2024-12-18T14:20:00Z',
    verified: true
  }
];

export const mockTokens: TokenBalance[] = [
  { symbol: 'I₵C', amount: 2847, value: 2847 },
  { symbol: 'GOV', amount: 156, value: 468 },
  { symbol: 'REP', amount: 92, value: 0 }
];

export const mockModules: Module[] = [
  {
    id: '1',
    name: 'Civic ID Engine',
    description: 'ZK-based identity and residency verification',
    isActive: true,
    icon: 'shield-check'
  },
  {
    id: '2',
    name: 'Governance OS',
    description: 'Modular voting and proposal management',
    isActive: true,
    icon: 'vote'
  },
  {
    id: '3',
    name: 'Participation Tracker',
    description: 'Civic engagement and reputation system',
    isActive: true,
    icon: 'activity'
  },
  {
    id: '4',
    name: 'Economy Integrator',
    description: 'Token incentives and local commerce',
    isActive: true,
    icon: 'coins'
  }
];