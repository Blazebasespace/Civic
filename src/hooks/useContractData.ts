import { useReadContract, useAccount } from 'wagmi';
import { CONTRACT_ADDRESSES } from '../contracts/addresses';
import { 
  CIVIC_ID_ABI, 
  GOVERNANCE_ABI, 
  CIVIC_TOKEN_ABI, 
  PARTICIPATION_TRACKER_ABI 
} from '../contracts/abis';

export function useUserCivicData() {
  const { address } = useAccount();

  const { data: balance } = useReadContract({
    address: CONTRACT_ADDRESSES.CIVIC_ID,
    abi: CIVIC_ID_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const { data: tokenId } = useReadContract({
    address: CONTRACT_ADDRESSES.CIVIC_ID,
    abi: CIVIC_ID_ABI,
    functionName: 'tokenOfOwnerByIndex',
    args: address && balance && balance > 0n ? [address, 0n] : undefined,
    query: { enabled: !!address && !!balance && balance > 0n },
  });

  const { data: civicData } = useReadContract({
    address: CONTRACT_ADDRESSES.CIVIC_ID,
    abi: CIVIC_ID_ABI,
    functionName: 'getCivicData',
    args: tokenId ? [tokenId] : undefined,
    query: { enabled: !!tokenId },
  });

  const { data: tokenBalance } = useReadContract({
    address: CONTRACT_ADDRESSES.CIVIC_TOKEN,
    abi: CIVIC_TOKEN_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const { data: totalPoints } = useReadContract({
    address: CONTRACT_ADDRESSES.PARTICIPATION_TRACKER,
    abi: PARTICIPATION_TRACKER_ABI,
    functionName: 'getTotalPoints',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const { data: activities } = useReadContract({
    address: CONTRACT_ADDRESSES.PARTICIPATION_TRACKER,
    abi: PARTICIPATION_TRACKER_ABI,
    functionName: 'getUserActivities',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  return {
    hasCivicId: balance && balance > 0n,
    tokenId,
    civicData: civicData ? {
      role: civicData[0],
      residency: civicData[1],
      civicScore: Number(civicData[2]),
      reputation: Number(civicData[3]),
    } : null,
    tokenBalance: tokenBalance ? Number(tokenBalance) / 1e18 : 0,
    totalPoints: totalPoints ? Number(totalPoints) : 0,
    activities: activities || [],
  };
}

export function useProposals() {
  const { data: proposalCount } = useReadContract({
    address: CONTRACT_ADDRESSES.GOVERNANCE,
    abi: GOVERNANCE_ABI,
    functionName: 'getProposalCount',
  });

  const count = proposalCount ? Number(proposalCount) : 0;
  
  // Fetch all proposals
  const proposalQueries = Array.from({ length: count }, (_, i) => 
    useReadContract({
      address: CONTRACT_ADDRESSES.GOVERNANCE,
      abi: GOVERNANCE_ABI,
      functionName: 'getProposal',
      args: [BigInt(i)],
      query: { enabled: count > 0 },
    })
  );

  const proposals = proposalQueries.map((query, index) => {
    if (!query.data) return null;
    
    const [title, description, proposer, startTime, endTime, forVotes, againstVotes, status, votingType, category] = query.data;
    
    return {
      id: index.toString(),
      title,
      description,
      proposer,
      startTime: Number(startTime),
      endTime: Number(endTime),
      forVotes: Number(forVotes),
      againstVotes: Number(againstVotes),
      status: Number(status),
      votingType: Number(votingType),
      category,
      totalParticipants: Number(forVotes) + Number(againstVotes),
    };
  }).filter(Boolean);

  return {
    proposals,
    isLoading: proposalQueries.some(q => q.isLoading),
    count,
  };
}

export function useHasVoted(proposalId: string | number | undefined) {
  const { address } = useAccount();

  // Convert proposalId to string and check if it's valid
  const validProposalId = proposalId !== undefined && proposalId !== null ? String(proposalId) : undefined;
  const isNumericId = validProposalId && !isNaN(Number(validProposalId));

  const { data: hasVoted } = useReadContract({
    address: CONTRACT_ADDRESSES.GOVERNANCE,
    abi: GOVERNANCE_ABI,
    functionName: 'hasVoted',
    args: address && isNumericId ? [BigInt(validProposalId), address] : undefined,
    query: { enabled: !!address && !!isNumericId },
  });

  return hasVoted || false;
}