import React from 'react';
import { Vote, Shield, Activity, Coins, TrendingUp, Users, CheckCircle } from 'lucide-react';
import { useAccount } from 'wagmi';
import { useSupabaseCitizen, useSupabaseProposals, useSupabaseActivities } from '../hooks/useSupabase';
import { useSupabaseRealTime } from '../hooks/useSupabaseRealTime';
import StatCard from '../components/StatCard';
import CivicIdSetup from '../components/CivicIdSetup';
import ProposalCard from '../components/ProposalCard';

const Dashboard: React.FC = () => {
  const { isConnected, address } = useAccount();
  const { citizen, hasCivicId, loading: citizenLoading } = useSupabaseCitizen();
  const { proposals, loading: proposalsLoading } = useSupabaseProposals();
  const { activities, totalPoints } = useSupabaseActivities();
  const { metrics } = useSupabaseRealTime();

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 bg-civic-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-civic-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to CivicKernel</h2>
          <p className="text-gray-600 mb-6">Connect your wallet to access the governance platform</p>
        </div>
      </div>
    );
  }

  if (citizenLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-civic-500"></div>
      </div>
    );
  }

  if (!hasCivicId) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Welcome to CivicKernel</h1>
          <p className="text-gray-600 mt-2">Create your Civic ID to participate in governance</p>
        </div>
        <CivicIdSetup />
      </div>
    );
  }

  const activeProposals = proposals.filter(p => p.status === 0);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {citizen?.name || `${address?.slice(0, 6)}...${address?.slice(-4)}`}
        </h1>
        <p className="text-gray-600 mt-2">
          Your civic engagement dashboard for {citizen?.residency || 'Network State'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Civic Score"
          value={citizen?.civic_score || 0}
          icon={TrendingUp}
          color="green"
        />
        <StatCard
          title="Active Proposals"
          value={metrics.activeProposals}
          icon={Vote}
          color="blue"
        />
        <StatCard
          title="Reputation Points"
          value={totalPoints}
          icon={Shield}
          color="purple"
        />
        <StatCard
          title="Network Citizens"
          value={metrics.totalCitizens}
          icon={Users}
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Active Proposals</h2>
              <p className="text-gray-600 mt-1">Participate in governance decisions</p>
            </div>
            <div className="p-6 space-y-4">
              {proposalsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-civic-500 mx-auto"></div>
                </div>
              ) : activeProposals.length > 0 ? (
                activeProposals.map((proposal) => (
                  <ProposalCard key={proposal.id} proposal={proposal} />
                ))
              ) : (
                <div className="text-center py-8">
                  <Vote className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No active proposals</h3>
                  <p className="text-gray-600">Check back later or create a new proposal.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
            </div>
            <div className="p-6 space-y-4">
              {activities.length > 0 ? (
                activities.slice(0, 3).map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-governance-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Activity className="w-4 h-4 text-governance-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.activity_type}</p>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-governance-600 font-medium">
                          +{activity.points} points
                        </span>
                        {activity.verified && (
                          <CheckCircle className="w-3 h-3 text-governance-500" />
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500">No activities yet</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-br from-civic-500 to-governance-500 rounded-xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">Network State Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="opacity-90">Your Role</span>
                <span className="font-semibold">{citizen?.role || 'Citizen'}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-90">Residency</span>
                <span className="font-semibold">{citizen?.residency || 'Network State'}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-90">Total Proposals</span>
                <span className="font-semibold">{proposals.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-90">Network Health</span>
                <span className="font-semibold">{metrics.networkHealth}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;