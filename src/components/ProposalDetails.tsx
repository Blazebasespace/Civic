import React, { useState, useEffect } from 'react';
import { X, Clock, Users, MessageSquare, TrendingUp, Share2, Flag, Eye, ExternalLink } from 'lucide-react';
import { useGovernance } from '../hooks/useContracts';
import { useHasVoted } from '../hooks/useContractData';
import { useSupabaseProposals } from '../hooks/useSupabase';
import { useAccount } from 'wagmi';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

interface ProposalDetailsProps {
  proposal: {
    id: string;
    title: string;
    description: string;
    proposer_address: string;
    start_time: string;
    end_time: string;
    votes_for: number;
    votes_against: number;
    status: number;
    voting_type: number;
    category: string;
    total_participants: number;
    blockchain_proposal_id: number | null;
  };
  isOpen: boolean;
  onClose: () => void;
}

const ProposalDetails: React.FC<ProposalDetailsProps> = ({ proposal, isOpen, onClose }) => {
  const [comment, setComment] = useState('');
  const [voteWeight, setVoteWeight] = useState(1);
  const [isVoting, setIsVoting] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  
  const { address } = useAccount();
  const { vote, isPending, isSuccess, hash } = useGovernance();
  const { voteOnProposal: updateSupabaseVote } = useSupabaseProposals();
  const hasVoted = useHasVoted(proposal.blockchain_proposal_id);

  // Monitor transaction status
  useEffect(() => {
    if (hash) {
      setTxHash(hash);
    }
  }, [hash]);

  useEffect(() => {
    if (isSuccess && txHash) {
      toast.success('Vote recorded on blockchain!');
      // Update Supabase after successful blockchain transaction
      updateSupabaseVote(proposal.id, true, voteWeight, address!);
      setIsVoting(false);
      setTxHash(null);
    }
  }, [isSuccess, txHash, proposal.id, voteWeight, address, updateSupabaseVote]);

  const handleVote = (support: boolean) => {
    if (!address) {
      toast.error('Please connect your wallet');
      return;
    }

    if (proposal.blockchain_proposal_id === null) {
      toast.error('Proposal not yet available on blockchain');
      return;
    }

    if (hasVoted) {
      toast.error('You have already voted on this proposal');
      return;
    }

    setIsVoting(true);
    
    try {
      vote(BigInt(proposal.blockchain_proposal_id), support, BigInt(voteWeight));
      toast.loading('Submitting vote to blockchain...', {
        duration: 10000,
        id: 'blockchain-vote-details'
      });
    } catch (error) {
      console.error('Error voting:', error);
      toast.error('Failed to submit vote');
      setIsVoting(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Proposal link copied to clipboard!');
  };

  if (!isOpen) return null;

  const isActive = proposal.status === 0;
  const endDate = new Date(proposal.end_time);
  const totalVotes = proposal.votes_for + proposal.votes_against;
  const forPercentage = totalVotes > 0 ? (proposal.votes_for / totalVotes) * 100 : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Proposal Details</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleShare}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium flex items-center space-x-1">
                <span>🔗</span>
                <span>Blockchain Secured</span>
              </span>
              {proposal.blockchain_proposal_id !== null && (
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  Blockchain ID: {proposal.blockchain_proposal_id}
                </span>
              )}
              <a 
                href={`https://sepolia.basescan.org/address/${proposal.proposer_address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
              >
                <span className="text-sm">View on Explorer</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{proposal.title}</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-6">
              <span>By {proposal.proposer_address.slice(0, 6)}...{proposal.proposer_address.slice(-4)}</span>
              <span>•</span>
              <span>{formatDistanceToNow(new Date(proposal.start_time), { addSuffix: true })}</span>
              <span>•</span>
              <span className="capitalize">{proposal.category}</span>
            </div>
            <p className="text-gray-700 text-lg leading-relaxed">{proposal.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-governance-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-5 h-5 text-governance-600" />
                <span className="font-medium text-governance-900">Support</span>
              </div>
              <div className="text-2xl font-bold text-governance-600">{proposal.votes_for}</div>
              <div className="text-sm text-governance-700">{forPercentage.toFixed(1)}% of votes</div>
            </div>

            <div className="bg-red-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <X className="w-5 h-5 text-red-600" />
                <span className="font-medium text-red-900">Against</span>
              </div>
              <div className="text-2xl font-bold text-red-600">{proposal.votes_against}</div>
              <div className="text-sm text-red-700">{(100 - forPercentage).toFixed(1)}% of votes</div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-900">Participation</span>
              </div>
              <div className="text-2xl font-bold text-gray-600">{proposal.total_participants}</div>
              <div className="text-sm text-gray-700">Total voters</div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-gray-900">Voting Progress</span>
              <span className="text-sm text-gray-600">
                {isActive ? `Ends ${formatDistanceToNow(endDate, { addSuffix: true })}` : 'Voting ended'}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
              <div className="relative h-4 rounded-full overflow-hidden">
                <div 
                  className="absolute left-0 top-0 h-full bg-governance-500 transition-all duration-500"
                  style={{ width: `${forPercentage}%` }}
                ></div>
                <div 
                  className="absolute right-0 top-0 h-full bg-red-500 transition-all duration-500"
                  style={{ width: `${100 - forPercentage}%` }}
                ></div>
              </div>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>{proposal.votes_for} For</span>
              <span>{proposal.votes_against} Against</span>
            </div>
          </div>

          {/* Transaction Status */}
          {txHash && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="font-medium text-blue-800">Blockchain Transaction Pending</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-blue-600 font-mono">{txHash.slice(0, 10)}...{txHash.slice(-8)}</span>
                <a 
                  href={`https://sepolia.basescan.org/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}

          {isActive && address && !hasVoted && proposal.blockchain_proposal_id !== null && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Cast Your Blockchain Vote</h3>
              
              {proposal.voting_type === 1 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vote Weight (Quadratic Voting)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={voteWeight}
                    onChange={(e) => setVoteWeight(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600 mt-1">
                    <span>1</span>
                    <span>Weight: {voteWeight} (Cost: {voteWeight * voteWeight} tokens)</span>
                    <span>10</span>
                  </div>
                </div>
              )}

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-purple-700">
                  🔗 Your vote will be permanently recorded on the blockchain. This requires a small transaction fee.
                </p>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => handleVote(true)}
                  disabled={isPending || isVoting}
                  className="flex-1 px-6 py-3 bg-governance-500 text-white rounded-lg hover:bg-governance-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center space-x-2"
                >
                  {isPending || isVoting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Voting on Blockchain...</span>
                    </>
                  ) : (
                    <>
                      <span>🔗</span>
                      <span>Vote For</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleVote(false)}
                  disabled={isPending || isVoting}
                  className="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center space-x-2"
                >
                  {isPending || isVoting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Voting on Blockchain...</span>
                    </>
                  ) : (
                    <>
                      <span>🔗</span>
                      <span>Vote Against</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {proposal.blockchain_proposal_id === null && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                <span className="font-medium text-yellow-800">Proposal Pending Blockchain Confirmation</span>
              </div>
              <p className="text-sm text-yellow-700 mt-1">
                This proposal is being processed on the blockchain. Voting will be available once confirmed.
              </p>
            </div>
          )}

          {hasVoted && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="font-medium text-green-800">Vote Successfully Recorded on Blockchain</span>
              </div>
              <p className="text-sm text-green-700 mt-1">
                Your vote is permanently stored and cannot be changed. Thank you for participating!
              </p>
            </div>
          )}

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Discussion</h3>
            <div className="space-y-4 mb-6">
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p>No comments yet. Be the first to share your thoughts!</p>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts on this proposal..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-civic-500 focus:border-transparent"
                rows={3}
              />
              <div className="flex justify-between items-center mt-3">
                <span className="text-sm text-gray-500">{comment.length}/500 characters</span>
                <button
                  disabled={!comment.trim()}
                  className="px-4 py-2 bg-civic-500 text-white rounded-lg hover:bg-civic-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Post Comment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalDetails;