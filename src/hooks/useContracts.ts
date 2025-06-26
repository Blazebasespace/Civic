import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACT_ADDRESSES } from '../contracts/addresses';
import { 
  CIVIC_ID_ABI, 
  GOVERNANCE_ABI, 
  CIVIC_TOKEN_ABI, 
  PARTICIPATION_TRACKER_ABI 
} from '../contracts/abis';

export function useCivicId() {
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const mintCivicId = (to: string, role: string, residency: string) => {
    writeContract({
      address: CONTRACT_ADDRESSES.CIVIC_ID,
      abi: CIVIC_ID_ABI,
      functionName: 'mintCivicID',
      args: [to, role, residency],
    });
  };

  const addCivicPoints = (tokenId: bigint, points: bigint) => {
    writeContract({
      address: CONTRACT_ADDRESSES.CIVIC_ID,
      abi: CIVIC_ID_ABI,
      functionName: 'addCivicPoints',
      args: [tokenId, points],
    });
  };

  return {
    mintCivicId,
    addCivicPoints,
    isPending,
    isConfirming,
    isSuccess,
    hash,
  };
}

export function useGovernance() {
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const { data: proposalCount, refetch: refetchProposalCount } = useReadContract({
    address: CONTRACT_ADDRESSES.GOVERNANCE,
    abi: GOVERNANCE_ABI,
    functionName: 'getProposalCount',
  });

  const createProposal = (
    title: string,
    description: string,
    votingType: number,
    duration: bigint,
    category: string
  ) => {
    writeContract({
      address: CONTRACT_ADDRESSES.GOVERNANCE,
      abi: GOVERNANCE_ABI,
      functionName: 'createProposal',
      args: [title, description, votingType, duration, category],
    });
  };

  const vote = (proposalId: bigint, support: boolean, weight: bigint) => {
    writeContract({
      address: CONTRACT_ADDRESSES.GOVERNANCE,
      abi: GOVERNANCE_ABI,
      functionName: 'vote',
      args: [proposalId, support, weight],
    });
  };

  return {
    createProposal,
    vote,
    isPending,
    isConfirming,
    isSuccess,
    hash,
    proposalCount,
    refetchProposalCount,
  };
}

export function useCivicToken() {
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const transfer = (to: string, amount: bigint) => {
    writeContract({
      address: CONTRACT_ADDRESSES.CIVIC_TOKEN,
      abi: CIVIC_TOKEN_ABI,
      functionName: 'transfer',
      args: [to, amount],
    });
  };

  const mint = (to: string, amount: bigint) => {
    writeContract({
      address: CONTRACT_ADDRESSES.CIVIC_TOKEN,
      abi: CIVIC_TOKEN_ABI,
      functionName: 'mint',
      args: [to, amount],
    });
  };

  return {
    transfer,
    mint,
    isPending,
    isConfirming,
    isSuccess,
    hash,
  };
}

export function useParticipationTracker() {
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const recordActivity = (
    user: string,
    activityType: string,
    description: string,
    points: bigint
  ) => {
    writeContract({
      address: CONTRACT_ADDRESSES.PARTICIPATION_TRACKER,
      abi: PARTICIPATION_TRACKER_ABI,
      functionName: 'recordActivity',
      args: [user, activityType, description, points],
    });
  };

  return {
    recordActivity,
    isPending,
    isConfirming,
    isSuccess,
    hash,
  };
}