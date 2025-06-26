import React, { useState } from 'react';
import { Users, ArrowRight, Search, CheckCircle, X } from 'lucide-react';
import { useAccount } from 'wagmi';
import toast from 'react-hot-toast';

interface Delegate {
  address: string;
  name: string;
  civicScore: number;
  expertise: string[];
  delegatedVotes: number;
  votingHistory: number;
}

const mockDelegates: Delegate[] = [
  {
    address: '0x1234567890123456789012345678901234567890',
    name: 'Alex Rivera',
    civicScore: 847,
    expertise: ['Infrastructure', 'Environment'],
    delegatedVotes: 1250,
    votingHistory: 95
  },
  {
    address: '0x2345678901234567890123456789012345678901',
    name: 'Sarah Chen',
    civicScore: 923,
    expertise: ['Economy', 'Governance'],
    delegatedVotes: 2100,
    votingHistory: 98
  },
  {
    address: '0x3456789012345678901234567890123456789012',
    name: 'Marcus Johnson',
    civicScore: 756,
    expertise: ['Social', 'Education'],
    delegatedVotes: 890,
    votingHistory: 87
  }
];

interface DelegationManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

const DelegationManager: React.FC<DelegationManagerProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDelegate, setSelectedDelegate] = useState<string | null>(null);
  const [delegationCategories, setDelegationCategories] = useState<string[]>([]);
  const { address } = useAccount();

  const filteredDelegates = mockDelegates.filter(delegate =>
    delegate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    delegate.expertise.some(exp => exp.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDelegate = () => {
    if (!selectedDelegate) {
      toast.error('Please select a delegate');
      return;
    }

    if (delegationCategories.length === 0) {
      toast.error('Please select at least one category');
      return;
    }

    toast.success('Delegation successful!');
    onClose();
  };

  const toggleCategory = (category: string) => {
    setDelegationCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Delegate Your Votes</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-gray-600 mt-2">
            Delegate your voting power to trusted community members in specific categories
          </p>
        </div>

        <div className="p-6 space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search delegates by name or expertise..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-civic-500 focus:border-transparent"
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Categories to Delegate</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {['Governance', 'Infrastructure', 'Economy', 'Social', 'Environment', 'Education'].map(category => (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    delegationCategories.includes(category)
                      ? 'bg-civic-500 text-white border-civic-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Delegates</h3>
            <div className="space-y-4">
              {filteredDelegates.map(delegate => (
                <div
                  key={delegate.address}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedDelegate === delegate.address
                      ? 'border-civic-500 bg-civic-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedDelegate(delegate.address)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-civic-500 to-governance-500 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{delegate.name}</h4>
                        <p className="text-sm text-gray-600">
                          {delegate.address.slice(0, 6)}...{delegate.address.slice(-4)}
                        </p>
                      </div>
                    </div>
                    {selectedDelegate === delegate.address && (
                      <CheckCircle className="w-6 h-6 text-civic-500" />
                    )}
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Civic Score</p>
                      <p className="font-semibold text-governance-600">{delegate.civicScore}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Delegated Votes</p>
                      <p className="font-semibold text-gray-900">{delegate.delegatedVotes.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Voting Participation</p>
                      <p className="font-semibold text-gray-900">{delegate.votingHistory}%</p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <p className="text-sm text-gray-600 mb-2">Expertise</p>
                    <div className="flex flex-wrap gap-2">
                      {delegate.expertise.map(exp => (
                        <span
                          key={exp}
                          className="px-2 py-1 bg-governance-100 text-governance-700 rounded text-sm"
                        >
                          {exp}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleDelegate}
              disabled={!selectedDelegate || delegationCategories.length === 0}
              className="flex-1 px-6 py-3 bg-civic-500 text-white rounded-lg hover:bg-civic-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center space-x-2"
            >
              <span>Delegate Votes</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DelegationManager;