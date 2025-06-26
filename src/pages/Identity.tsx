import React from 'react';
import { Shield, CheckCircle, Eye, Key, Users, MapPin } from 'lucide-react';
import { useAccount } from 'wagmi';
import { useUserCivicData } from '../hooks/useContractData';
import CivicIdSetup from '../components/CivicIdSetup';
import CivicScoreBreakdown, { defaultScoreCategories } from '../components/CivicScoreBreakdown';

const Identity: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { hasCivicId, civicData, tokenId } = useUserCivicData();

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect Wallet</h2>
          <p className="text-gray-600">Connect your wallet to view your civic identity</p>
        </div>
      </div>
    );
  }

  if (!hasCivicId) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Civic Identity</h1>
          <p className="text-gray-600 mt-2">Create your Civic ID to establish your identity</p>
        </div>
        <CivicIdSetup />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Civic Identity</h1>
        <p className="text-gray-600 mt-2">
          Your zero-knowledge identity and verification status in the Network State
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Identity Overview</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-civic-500 to-governance-500 rounded-full flex items-center justify-center">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                  </h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <CheckCircle className="w-5 h-5 text-governance-500" />
                    <span className="text-governance-600 font-medium">Verified Citizen</span>
                  </div>
                  <p className="text-gray-600 mt-1">Token ID: {tokenId?.toString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-civic-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Key className="w-5 h-5 text-civic-600" />
                    <span className="font-medium text-civic-900">Wallet Address</span>
                  </div>
                  <p className="text-civic-700 font-mono text-sm break-all">{address}</p>
                </div>
                
                <div className="bg-governance-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <MapPin className="w-5 h-5 text-governance-600" />
                    <span className="font-medium text-governance-900">Residency</span>
                  </div>
                  <p className="text-governance-700 font-medium">{civicData?.residency}</p>
                </div>
              </div>
            </div>
          </div>

          <CivicScoreBreakdown 
            totalScore={civicData?.civicScore || 0}
            categories={defaultScoreCategories}
          />

          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Privacy Settings</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center space-x-3">
                  <Eye className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">Anonymous Voting</p>
                    <p className="text-sm text-gray-600">Use zero-knowledge proofs for voting privacy</p>
                  </div>
                </div>
                <div className="relative">
                  <input type="checkbox" defaultChecked className="sr-only" />
                  <div className="w-11 h-6 bg-governance-500 rounded-full shadow-inner"></div>
                  <div className="absolute w-4 h-4 bg-white rounded-full shadow top-1 right-1"></div>
                </div>
              </div>
              
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">Public Profile Visibility</p>
                    <p className="text-sm text-gray-600">Show your contributions to other citizens</p>
                  </div>
                </div>
                <div className="relative">
                  <input type="checkbox" defaultChecked className="sr-only" />
                  <div className="w-11 h-6 bg-governance-500 rounded-full shadow-inner"></div>
                  <div className="absolute w-4 h-4 bg-white rounded-full shadow top-1 right-1"></div>
                </div>
              </div>
              
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">Data Encryption</p>
                    <p className="text-sm text-gray-600">Encrypt all personal data with your private key</p>
                  </div>
                </div>
                <div className="relative">
                  <input type="checkbox" defaultChecked className="sr-only" />
                  <div className="w-11 h-6 bg-governance-500 rounded-full shadow-inner"></div>
                  <div className="absolute w-4 h-4 bg-white rounded-full shadow top-1 right-1"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-civic-500 to-governance-500 rounded-xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-4">Identity Score</h3>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{civicData?.civicScore || 0}</div>
              <p className="opacity-90 mb-4">Civic Reputation</p>
              <div className="w-full bg-white/20 rounded-full h-2 mb-2">
                <div 
                  className="bg-white h-2 rounded-full transition-all duration-500"
                  style={{ width: `${((civicData?.civicScore || 0) / 1000) * 100}%` }}
                ></div>
              </div>
              <p className="text-sm opacity-75">Reputation Score: {civicData?.reputation || 0}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Verification Status</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-governance-500" />
                <span className="text-gray-900">Identity Verified</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-governance-500" />
                <span className="text-gray-900">Residency Confirmed</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-governance-500" />
                <span className="text-gray-900">Blockchain Verified</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-governance-500" />
                <span className="text-gray-900">Smart Contract Linked</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
            </div>
            <div className="p-6 space-y-3">
              <button className="w-full px-4 py-2 bg-civic-500 text-white rounded-lg hover:bg-civic-600 transition-colors font-medium">
                Update Profile
              </button>
              <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                Export Identity
              </button>
              <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                Privacy Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Identity;