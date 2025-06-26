import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, Vote, Eye, MessageSquare, ExternalLink } from 'lucide-react';
import { useSupabaseProposals } from '../hooks/useSupabase';
import { useGovernance } from '../hooks/useContracts';
import { useHasVoted } from '../hooks/useContractData';
import { useAccount } from 'wagmi';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import ProposalDetails from './ProposalDetails';

interface ProposalCardProps {
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
}

const ProposalCard: React.FC<ProposalCardProps> = ({ proposal }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [userVoteStatus, setUserVoteStatus] = useState<{ hasVoted: boolean; support: boolean | null }>({ hasVoted: false, support: null });
  const { address } = useAccount();
  const { vote, isPending, isSuccess, hash } = useGovernance();
  const { voteOnProposal: updateSupabaseVote, hasVoted: checkHasVoted } = useSupabaseProposals();
  const hasVoted = useHasVoted(proposal.blockchain_proposal_id);

  // Check vote status when component mounts or address changes
  useEffect(() => {
    const checkVoteStatus = async () => {
      if (address) {
        const voteStatus = await checkHasVoted(proposal.id, address);
        setUserVoteStatus(voteStatus);
      } else {
        setUserVoteStatus({ hasVoted: false, support: null });
      }
    };

    checkVoteStatus();
  }, [address, proposal.id, checkHasVoted]);

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
      updateSupabaseVote(proposal.id, true, 1, address!);
      setIsVoting(false);
      setTxHash(null);
      // Refresh vote status
      const refreshVoteStatus = async () => {
        const voteStatus = await checkHasVoted(proposal.id, address!);
        setUserVoteStatus(voteStatus);
      };
      refreshVoteStatus();
    }
  }, [isSuccess, txHash, proposal.id, address, updateSupabaseVote, checkHasVoted]);

  const getStatusIcon = (status: number) => {
    switch (status) {
      case 0: // Active
        return <Clock className="w-4 h-4 text-orange-500" />;
      case 1: // Passed
        return <CheckCircle className="w-4 h-4 text-governance-500" />;
      case 2: // Rejected
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Vote className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: number) => {
    switch (status) {
      case 0:
        return 'bg-orange-100 text-orange-700';
      case 1:
        return 'bg-governance-100 text-governance-700';
      case 2:
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: number) => {
    switch (status) {
      case 0:
        return 'Active';
      case 1:
        return 'Passed';
      case 2:
        return 'Rejected';
      default:
        return 'Unknown';
    }
  };

  const getVotingTypeText = (votingType: number) => {
    switch (votingType) {
      case 0:
        return 'Simple';
      case 1:
        return 'Quadratic';
      case 2:
        return 'Conviction';
      case 3:
        return 'Futarchy';
      default:
        return 'Unknown';
    }
  };

  const handleVote = async (support: boolean) => {
    if (!address) {
      toast.error('Please connect your wallet');
      return;
    }

    if (userVoteStatus.hasVoted && proposal.blockchain_proposal_id !== null) {
      toast.error('You have already voted on this blockchain proposal');
      return;
    }

    setIsVoting(true);
    
    try {
      // For Supabase-only proposals (no blockchain_proposal_id), vote directly in Supabase
      if (proposal.blockchain_proposal_id === null) {
        await updateSupabaseVote(proposal.id, support, 1, address);
        toast.success('Vote recorded successfully!');
        // Refresh vote status
        const voteStatus = await checkHasVoted(proposal.id, address);
        setUserVoteStatus(voteStatus);
        setIsVoting(false);
        return;
      }

      // For blockchain proposals, execute blockchain transaction first
      const weight = proposal.voting_type === 1 ? BigInt(1) : BigInt(1); // For quadratic voting, this could be dynamic
      vote(BigInt(proposal.blockchain_proposal_id), support, weight);
      
      toast.loading('Submitting vote to blockchain...', {
        duration: 10000,
        id: 'blockchain-vote'
      });
      
    } catch (error) {
      console.error('Error voting:', error);
      toast.error('Failed to submit vote');
      setIsVoting(false);
    }
  };

  const isActive = proposal.status === 0;
  const endDate = new Date(proposal.end_time);
  const isExpired = Date.now() > endDate.getTime();
  const totalVotes = proposal.votes_for + proposal.votes_against;
  const forPercentage = totalVotes > 0 ? (proposal.votes_for / totalVotes) * 100 : 0;

  // Determine if user has voted (blockchain or database)
  const userHasVoted = proposal.blockchain_proposal_id !== null ? hasVoted : userVoteStatus.hasVoted;

  // Show voting buttons only if proposal is active, not expired, user is connected, and hasn't voted
  const showVotingButtons = isActive && !isExpired && address && !userHasVoted;

  return (
    <>
      <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all duration-200">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              {getStatusIcon(proposal.status)}
              <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(proposal.status)}`}>
                {getStatusText(proposal.status)}
              </span>
              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                {getVotingTypeText(proposal.voting_type)} Voting
              </span>
              <span className="px-2 py-1 bg-civic-100 text-civic-700 rounded text-xs font-medium">
                {proposal.category}
              </span>
              {proposal.blockchain_proposal_id !== null ? (
                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium flex items-center space-x-1">
                  <span>🔗</span>
                  <span>Blockchain</span>
                </span>
              ) : (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                  Database
                </span>
              )}
              {proposal.blockchain_proposal_id !== null && (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                  ID: {proposal.blockchain_proposal_id}
                </span>
              )}
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{proposal.title}</h3>
            <p className="text-gray-600 mb-4 line-clamp-2">{proposal.description}</p>
            
            <div className="flex items-center space-x-6 text-sm text-gray-500 mb-4">
              <span>Proposer: {proposal.proposer_address.slice(0, 6)}...{proposal.proposer_address.slice(-4)}</span>
              <span>{proposal.total_participants} participants</span>
              <span>
                {isExpired ? 'Ended' : 'Ends'} {formatDistanceToNow(endDate, { addSuffix: true })}
              </span>
            </div>

            {/* Transaction Hash Display */}
            {txHash && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-blue-800">Transaction Pending</span>
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs text-blue-600 font-mono">{txHash.slice(0, 10)}...{txHash.slice(-8)}</span>
                  <a 
                    href={`https://sepolia.basescan.org/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-governance-600 font-medium">For: {proposal.votes_for}</span>
                <span className="text-red-600 font-medium">Against: {proposal.votes_against}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="relative h-3 rounded-full overflow-hidden">
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
            </div>

            <div className="flex items-center space-x-4 mt-4">
              <button
                onClick={() => setShowDetails(true)}
                className="flex items-center space-x-1 text-sm text-civic-600 hover:text-civic-700 transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span>View Details</span>
              </button>
              <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700 transition-colors">
                <MessageSquare className="w-4 h-4" />
                <span>0 Comments</span>
              </button>
              {userHasVoted && (
                <div className="flex items-center space-x-1 text-sm text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span>Voted {userVoteStatus.support !== null ? (userVoteStatus.support ? 'For' : 'Against') : ''}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Voting Buttons - Show only if user hasn't voted */}
          {showVotingButtons && (
            <div className="ml-6 flex flex-col space-y-2">
              <button
                onClick={() => handleVote(true)}
                disabled={isPending || isVoting}
                className="px-6 py-2 bg-governance-500 text-white rounded-lg hover:bg-governance-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center space-x-2"
              >
                {isPending || isVoting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Voting...</span>
                  </>
                ) : (
                  <>
                    {proposal.blockchain_proposal_id !== null ? <span>🔗</span> : <span>📊</span>}
                    <span>Vote For</span>
                  </>
                )}
              </button>
              <button
                onClick={() => handleVote(false)}
                disabled={isPending || isVoting}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center space-x-2"
              >
                {isPending || isVoting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Voting...</span>
                  </>
                ) : (
                  <>
                    {proposal.blockchain_proposal_id !== null ? <span>🔗</span> : <span>📊</span>}
                    <span>Vote Against</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Show "Already Voted" message when user has voted */}
          {!showVotingButtons && address && isActive && !isExpired && userHasVoted && (
            <div className="ml-6 flex flex-col space-y-2">
              <div className="px-6 py-3 bg-green-100 text-green-700 rounded-lg font-medium flex items-center space-x-2 border border-green-200">
                <CheckCircle className="w-5 h-5" />
                <div className="text-center">
                  <div className="font-semibold">You Have Already Voted</div>
                  {userVoteStatus.support !== null && (
                    <div className="text-sm">
                      Your vote: {userVoteStatus.support ? 'For' : 'Against'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Show message for other cases (expired, not connected, etc.) */}
          {!showVotingButtons && (!address || !isActive || isExpired) && !userHasVoted && (
            <div className="ml-6 flex flex-col space-y-2">
              <div className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium">
                <span>
                  {!address ? 'Connect Wallet to Vote' : 
                   !isActive ? 'Voting Closed' : 
                   isExpired ? 'Voting Ended' : 'Voting Unavailable'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <ProposalDetails
        proposal={proposal}
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
      />
    </>
  );
};

export default ProposalCard;