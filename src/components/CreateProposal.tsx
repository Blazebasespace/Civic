import React, { useState, useEffect } from 'react';
import { Plus, X, ExternalLink } from 'lucide-react';
import { useSupabaseProposals } from '../hooks/useSupabase';
import { useGovernance } from '../hooks/useContracts';
import { useAccount } from 'wagmi';
import toast from 'react-hot-toast';

const CreateProposal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [votingType, setVotingType] = useState(0);
  const [duration, setDuration] = useState(7);
  const [category, setCategory] = useState('Governance');
  const [txHash, setTxHash] = useState<string | null>(null);

  const { address } = useAccount();
  const { createProposal: createSupabaseProposal } = useSupabaseProposals();
  const { createProposal: createBlockchainProposal, isPending, isSuccess, hash, proposalCount, refetchProposalCount } = useGovernance();

  // Monitor transaction status
  useEffect(() => {
    if (hash) {
      setTxHash(hash);
    }
  }, [hash]);

  useEffect(() => {
    if (isSuccess && txHash) {
      toast.success('Proposal created on blockchain!');
      
      // Refetch proposal count to get the latest count
      refetchProposalCount().then(() => {
        // The new proposal ID will be the current count (since it's 0-indexed, the new proposal is at index count-1)
        const blockchainProposalId = proposalCount ? Number(proposalCount) - 1 : 0;
        
        // Create proposal in Supabase after successful blockchain transaction
        createSupabaseProposal({
          title,
          description,
          category,
          votingType,
          duration,
          proposerAddress: address!,
          blockchainProposalId,
        });
      });
      
      // Reset form
      setIsOpen(false);
      setTitle('');
      setDescription('');
      setVotingType(0);
      setDuration(7);
      setCategory('Governance');
      setTxHash(null);
    }
  }, [isSuccess, txHash, title, description, category, votingType, duration, address, createSupabaseProposal, proposalCount, refetchProposalCount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!address) {
      toast.error('Please connect your wallet');
      return;
    }

    if (!title.trim() || !description.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      // Execute blockchain transaction first
      const durationInSeconds = BigInt(duration * 24 * 60 * 60); // Convert days to seconds
      createBlockchainProposal(title, description, votingType, durationInSeconds, category);
      
      toast.loading('Creating proposal on blockchain...', {
        duration: 15000,
        id: 'blockchain-proposal'
      });
      
    } catch (error) {
      console.error('Error creating proposal:', error);
      toast.error('Failed to create proposal');
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center px-4 py-2 bg-civic-500 text-white rounded-lg hover:bg-civic-600 transition-colors"
      >
        <Plus className="w-4 h-4 mr-2" />
        Create Proposal
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Create New Proposal</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Blockchain Notice */}
        <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-lg">🔗</span>
            <span className="font-semibold text-purple-800">Blockchain-Secured Proposal</span>
          </div>
          <p className="text-sm text-purple-700">
            Your proposal will be permanently recorded on the blockchain for transparency and immutability.
            This requires a transaction fee paid in ETH.
          </p>
        </div>

        {/* Transaction Status */}
        {txHash && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="font-medium text-blue-800">Transaction Pending</span>
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-civic-500 focus:border-transparent"
              placeholder="Enter proposal title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-civic-500 focus:border-transparent"
              placeholder="Describe your proposal in detail"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Voting Type
              </label>
              <select
                value={votingType}
                onChange={(e) => setVotingType(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-civic-500 focus:border-transparent"
              >
                <option value={0}>Simple Majority</option>
                <option value={1}>Quadratic Voting</option>
                <option value={2}>Conviction Voting</option>
                <option value={3}>Futarchy</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (days)
              </label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                min={1}
                max={30}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-civic-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-civic-500 focus:border-transparent"
              >
                <option value="Governance">Governance</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Economy">Economy</option>
                <option value="Social">Social</option>
                <option value="Environment">Environment</option>
              </select>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 px-4 py-2 bg-civic-500 text-white rounded-lg hover:bg-civic-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center space-x-2"
            >
              {isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Creating on Blockchain...</span>
                </>
              ) : (
                <>
                  <span>🔗</span>
                  <span>Create Proposal</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProposal;