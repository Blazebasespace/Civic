import React from 'react';
import { Coins, TrendingUp, ArrowUpRight, ArrowDownLeft, ShoppingCart, Gift } from 'lucide-react';
import { useAccount } from 'wagmi';
import { useUserCivicData } from '../hooks/useContractData';
import { useCivicToken } from '../hooks/useContracts';
import toast from 'react-hot-toast';

const Economy: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { tokenBalance } = useUserCivicData();
  const { mint, transfer, isPending } = useCivicToken();

  const handleClaimUBI = () => {
    if (!address) {
      toast.error('Please connect your wallet');
      return;
    }

    const ubiAmount = BigInt(500 * 1e18); // 500 tokens with 18 decimals
    mint(address, ubiAmount);
    toast.loading('Claiming UBI tokens...');
  };

  const handleSendTokens = () => {
    // This would open a modal for sending tokens
    toast.info('Send tokens feature coming soon!');
  };

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Coins className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect Wallet</h2>
          <p className="text-gray-600">Connect your wallet to access the local economy</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Local Economy</h1>
        <p className="text-gray-600 mt-2">
          Manage your civic credits and participate in the Network State economy
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-civic-500 to-governance-500 rounded-full flex items-center justify-center">
                <Coins className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">I₵C</h3>
                <p className="text-sm text-gray-600">Infinita City Credits</p>
              </div>
            </div>
            <TrendingUp className="w-5 h-5 text-governance-500" />
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-gray-900">{tokenBalance.toFixed(2)}</p>
            <p className="text-sm text-gray-600">≈ ${(tokenBalance * 1).toFixed(2)} USD</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Coins className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">GOV</h3>
                <p className="text-sm text-gray-600">Governance Tokens</p>
              </div>
            </div>
            <TrendingUp className="w-5 h-5 text-purple-500" />
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-gray-900">0</p>
            <p className="text-sm text-gray-600">Voting power</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                <Coins className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">REP</h3>
                <p className="text-sm text-gray-600">Reputation Points</p>
              </div>
            </div>
            <TrendingUp className="w-5 h-5 text-orange-500" />
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-gray-900">0</p>
            <p className="text-sm text-gray-600">Non-transferable</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Recent Transactions</h2>
              <p className="text-gray-600 mt-1">Your economic activity in the Network State</p>
            </div>
            <div className="p-6">
              <div className="text-center py-8">
                <Coins className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions yet</h3>
                <p className="text-gray-600">Start participating to earn and spend civic credits.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-4">UBI Program</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="opacity-90">Monthly Allocation</span>
                <span className="font-semibold">500 I₵C</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-90">Next Distribution</span>
                <span className="font-semibold">Available</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-90">Eligibility</span>
                <span className="font-semibold">✓ Qualified</span>
              </div>
            </div>
            <button
              onClick={handleClaimUBI}
              disabled={isPending}
              className="w-full mt-4 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isPending ? 'Claiming...' : 'Claim UBI'}
            </button>
          </div>

          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
            </div>
            <div className="p-6 space-y-3">
              <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-civic-500 text-white rounded-lg hover:bg-civic-600 transition-colors font-medium">
                <ShoppingCart className="w-4 h-4" />
                <span>Local Market</span>
              </button>
              <button
                onClick={handleSendTokens}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                <Gift className="w-4 h-4" />
                <span>Send Credits</span>
              </button>
              <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                <Coins className="w-4 h-4" />
                <span>Exchange Tokens</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Earning Opportunities</h3>
            </div>
            <div className="p-6 space-y-3">
              <div className="p-3 border border-governance-200 rounded-lg bg-governance-50">
                <h4 className="font-medium text-governance-900">Vote on Proposals</h4>
                <p className="text-sm text-governance-700 mt-1">Earn up to 50 I₵C per vote</p>
              </div>
              <div className="p-3 border border-civic-200 rounded-lg bg-civic-50">
                <h4 className="font-medium text-civic-900">Host Community Event</h4>
                <p className="text-sm text-civic-700 mt-1">Earn 200 I₵C for organizing</p>
              </div>
              <div className="p-3 border border-orange-200 rounded-lg bg-orange-50">
                <h4 className="font-medium text-orange-900">Refer New Citizens</h4>
                <p className="text-sm text-orange-700 mt-1">Earn 100 I₵C per referral</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Economy;