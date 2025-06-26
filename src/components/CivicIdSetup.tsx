import React, { useState } from 'react';
import { Shield, CheckCircle } from 'lucide-react';
import { useSupabaseCitizen } from '../hooks/useSupabase';
import { useAccount } from 'wagmi';
import toast from 'react-hot-toast';

const CivicIdSetup: React.FC = () => {
  const [role, setRole] = useState('Verified Resident');
  const [residency, setResidency] = useState('Infinita City');
  const [name, setName] = useState('');
  const { address } = useAccount();
  const { createCitizen, loading } = useSupabaseCitizen();

  const handleCreateCivicId = async () => {
    if (!address) {
      toast.error('Please connect your wallet first');
      return;
    }

    const result = await createCitizen({
      name: name.trim() || undefined,
      role,
      residency,
    });

    if (result) {
      // Trigger page refresh to update the UI
      window.location.reload();
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-civic-500 to-governance-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Create Your Civic Identity</h2>
          <p className="text-gray-600 mt-2">
            Establish your verified identity in the Network State
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Display Name (Optional)
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-civic-500 focus:border-transparent"
              placeholder="Enter your display name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Primary Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-civic-500 focus:border-transparent"
            >
              <option value="Verified Resident">Verified Resident</option>
              <option value="Council Member">Council Member</option>
              <option value="Public Goods Contributor">Public Goods Contributor</option>
              <option value="Community Builder">Community Builder</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Residency
            </label>
            <select
              value={residency}
              onChange={(e) => setResidency(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-civic-500 focus:border-transparent"
            >
              <option value="Infinita City">Infinita City</option>
              <option value="Próspera">Próspera</option>
              <option value="Zuzalu">Zuzalu</option>
              <option value="Nueva Libertad">Nueva Libertad</option>
              <option value="Digital Nomad Republic">Digital Nomad Republic</option>
              <option value="Aurora Station">Aurora Station</option>
            </select>
          </div>

          <div className="bg-civic-50 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-civic-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-civic-900">Privacy Protection</h4>
                <p className="text-sm text-civic-700 mt-1">
                  Your Civic ID uses zero-knowledge proofs to verify your identity while maintaining privacy. 
                  Only you control what information is shared.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleCreateCivicId}
            disabled={loading}
            className="w-full px-6 py-3 bg-civic-500 text-white rounded-lg hover:bg-civic-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {loading ? 'Creating Civic ID...' : 'Create Civic ID'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CivicIdSetup;