import React, { useState } from 'react';
import { Vote, Clock, CheckCircle, XCircle, Filter, Users, ExternalLink } from 'lucide-react';
import { useSupabaseProposals } from '../hooks/useSupabase';
import { useAccount } from 'wagmi';
import ProposalCard from '../components/ProposalCard';
import CreateProposal from '../components/CreateProposal';
import DelegationManager from '../components/DelegationManager';

const Governance: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'active' | 'passed' | 'rejected'>('all');
  const [votingType, setVotingType] = useState<'all' | '0' | '1' | '2' | '3'>('all');
  const [showDelegation, setShowDelegation] = useState(false);
  const { isConnected } = useAccount();
  const { proposals, loading } = useSupabaseProposals();

  const filteredProposals = proposals.filter(proposal => {
    const statusMatch = filter === 'all' || 
      (filter === 'active' && proposal.status === 0) ||
      (filter === 'passed' && proposal.status === 1) ||
      (filter === 'rejected' && proposal.status === 2);
    
    const typeMatch = votingType === 'all' || proposal.voting_type === Number(votingType);
    return statusMatch && typeMatch;
  });

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Vote className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect Wallet</h2>
          <p className="text-gray-600">Connect your wallet to view and participate in governance</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Blockchain Governance</h1>
            <p className="text-gray-600 mt-2">
              Participate in Network State decision-making through blockchain-secured voting mechanisms
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <a 
              href="https://sepolia.basescan.org"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View on Explorer
            </a>
            <button
              onClick={() => setShowDelegation(true)}
              className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Users className="w-4 h-4 mr-2" />
              Delegate Votes
            </button>
            <CreateProposal />
          </div>
        </div>

        {/* Blockchain Info Banner */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🔗</span>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-purple-900">Blockchain-Secured Governance</h3>
              <p className="text-purple-700 mt-1">
                All proposals and votes are permanently recorded on the Base Sepolia blockchain for complete transparency and immutability.
                Your participation requires small transaction fees paid in ETH.
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-purple-600 font-medium">Network</div>
              <div className="text-purple-800 font-bold">Base Sepolia</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Filters:</span>
            </div>
            
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-civic-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="passed">Passed</option>
              <option value="rejected">Rejected</option>
            </select>

            <select
              value={votingType}
              onChange={(e) => setVotingType(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-civic-500 focus:border-transparent"
            >
              <option value="all">All Voting Types</option>
              <option value="0">Simple Majority</option>
              <option value="1">Quadratic Voting</option>
              <option value="2">Conviction Voting</option>
              <option value="3">Futarchy</option>
            </select>

            <div className="ml-auto flex items-center space-x-2 text-sm text-gray-600">
              <span>🔗</span>
              <span>Blockchain Secured</span>
            </div>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-civic-500 mx-auto"></div>
                <p className="text-gray-600 mt-2">Loading blockchain proposals...</p>
              </div>
            ) : filteredProposals.length > 0 ? (
              filteredProposals.map((proposal) => (
                <ProposalCard key={proposal.id} proposal={proposal} />
              ))
            ) : (
              <div className="text-center py-12">
                <Vote className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No proposals found</h3>
                <p className="text-gray-600">Try adjusting your filters or create a new proposal.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <DelegationManager 
        isOpen={showDelegation} 
        onClose={() => setShowDelegation(false)} 
      />
    </>
  );
};

export default Governance;