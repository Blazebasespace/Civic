import React from 'react';
import { Activity, Award, Clock, CheckCircle, TrendingUp, Calendar } from 'lucide-react';
import { useAccount } from 'wagmi';
import { useSupabaseCitizen, useSupabaseActivities } from '../hooks/useSupabase';
import EventCalendar from '../components/EventCalendar';
import toast from 'react-hot-toast';

const Participation: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { citizen } = useSupabaseCitizen();
  const { activities, totalPoints, recordActivity } = useSupabaseActivities();

  const handleRecordActivity = async (activityType: string, description: string, points: number) => {
    if (!address) {
      toast.error('Please connect your wallet');
      return;
    }

    try {
      await recordActivity({
        activityType,
        description,
        points,
        userAddress: address
      });
    } catch (error) {
      console.error('Error recording activity:', error);
    }
  };

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect Wallet</h2>
          <p className="text-gray-600">Connect your wallet to track your civic participation</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Civic Participation</h1>
        <p className="text-gray-600 mt-2">
          Track your contributions and engagement with the Network State community
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-governance-100 rounded-lg">
              <Award className="w-6 h-6 text-governance-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Points</p>
              <p className="text-2xl font-bold text-gray-900">{totalPoints}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-civic-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-civic-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Civic Score</p>
              <p className="text-2xl font-bold text-gray-900">{citizen?.civic_score || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Activity className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Reputation</p>
              <p className="text-2xl font-bold text-gray-900">{citizen?.reputation || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Activities</p>
              <p className="text-2xl font-bold text-gray-900">{activities.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Recent Activities</h2>
              <p className="text-gray-600 mt-1">Your contributions to the community</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {activities.length > 0 ? (
                  activities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="w-10 h-10 bg-governance-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Activity className="w-5 h-5 text-governance-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-gray-900">{activity.activity_type}</h3>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-governance-600">
                              +{activity.points} pts
                            </span>
                            {activity.verified && (
                              <CheckCircle className="w-4 h-4 text-governance-500" />
                            )}
                          </div>
                        </div>
                        <p className="text-gray-600 mt-1">{activity.description}</p>
                        <p className="text-sm text-gray-500 mt-2">
                          {new Date(activity.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No activities yet</h3>
                    <p className="text-gray-600">Start participating to earn points and build reputation.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <EventCalendar />
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-governance-500 to-civic-500 rounded-xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-4">Participation Level</h3>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">
                {totalPoints > 500 ? 'Champion' : totalPoints > 200 ? 'Active' : 'Beginner'}
              </div>
              <p className="opacity-90 mb-4">
                {totalPoints > 500 ? 'Top contributor' : totalPoints > 200 ? 'Regular participant' : 'Getting started'}
              </p>
              <div className="w-full bg-white/20 rounded-full h-2 mb-2">
                <div 
                  className="bg-white h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((totalPoints / 1000) * 100, 100)}%` }}
                ></div>
              </div>
              <p className="text-sm opacity-75">
                {Math.max(0, 1000 - totalPoints)} points to next level
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Earning Opportunities</h3>
            </div>
            <div className="p-6 space-y-3">
              <div className="p-3 border border-governance-200 rounded-lg bg-governance-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-governance-900">Vote on Proposals</h4>
                    <p className="text-sm text-governance-700 mt-1">Earn up to 50 points per vote</p>
                  </div>
                  <button
                    onClick={() => handleRecordActivity('Governance Voting', 'Voted on proposal', 50)}
                    className="px-3 py-1 bg-governance-500 text-white rounded text-sm hover:bg-governance-600"
                  >
                    Record
                  </button>
                </div>
              </div>
              
              <div className="p-3 border border-civic-200 rounded-lg bg-civic-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-civic-900">Host Community Event</h4>
                    <p className="text-sm text-civic-700 mt-1">Earn 200 points for organizing</p>
                  </div>
                  <button
                    onClick={() => handleRecordActivity('Community Event', 'Hosted community meetup', 200)}
                    className="px-3 py-1 bg-civic-500 text-white rounded text-sm hover:bg-civic-600"
                  >
                    Record
                  </button>
                </div>
              </div>
              
              <div className="p-3 border border-orange-200 rounded-lg bg-orange-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-orange-900">Public Contribution</h4>
                    <p className="text-sm text-orange-700 mt-1">Earn 100 points for contributions</p>
                  </div>
                  <button
                    onClick={() => handleRecordActivity('Public Contribution', 'Contributed to open source project', 100)}
                    className="px-3 py-1 bg-orange-500 text-white rounded text-sm hover:bg-orange-600"
                  >
                    Record
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Participation;