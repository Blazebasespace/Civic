import React, { useState } from 'react';
import { 
  Globe, 
  Users, 
  TrendingUp, 
  MapPin, 
  Zap, 
  Shield, 
  Network, 
  ArrowRight,
  CheckCircle,
  Clock,
  Award,
  Building2,
  Coins,
  Activity,
  Star,
  Eye,
  Heart,
  MessageSquare
} from 'lucide-react';
import { useGlobalNetwork } from '../hooks/useGlobalNetwork';
import toast from 'react-hot-toast';

const GlobalNetwork: React.FC = () => {
  const [selectedState, setSelectedState] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const { networkStates, globalMetrics, recentActivities, loading, establishPartnership } = useGlobalNetwork();

  const handleEstablishPartnership = async (stateId1: string, stateId2: string) => {
    try {
      await establishPartnership(stateId1, stateId2);
      toast.success('Partnership established successfully!');
    } catch (error) {
      toast.error('Failed to establish partnership');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-civic-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Global Network State Alliance</h1>
          <p className="text-gray-600 mt-2 text-lg">
            Interconnected governance across sovereign digital communities worldwide
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-medium">{networkStates.filter(s => s.status === 'active').length} States Online</span>
          </div>
          <button className="flex items-center px-6 py-3 bg-gradient-to-r from-civic-500 to-governance-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-semibold">
            <Globe className="w-5 h-5 mr-2" />
            Join Alliance
          </button>
        </div>
      </div>

      {/* Global Overview */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-civic-500/10 to-governance-500/10"></div>
        <div className="relative z-10">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Globe className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Global Alliance Status</h2>
              <p className="text-white/80 text-lg">Real-time network state ecosystem metrics</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="text-3xl font-bold mb-2">{globalMetrics.totalCitizens}</div>
              <div className="text-white/80">Total Citizens</div>
              <div className="text-green-400 text-sm mt-1">+23.4% growth</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="text-3xl font-bold mb-2">{globalMetrics.totalGDP}</div>
              <div className="text-white/80">Combined GDP</div>
              <div className="text-green-400 text-sm mt-1">+18.7% growth</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="text-3xl font-bold mb-2">{globalMetrics.activePartnerships}</div>
              <div className="text-white/80">Active Partnerships</div>
              <div className="text-green-400 text-sm mt-1">+12.3% growth</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="text-3xl font-bold mb-2">{globalMetrics.innovationScore}</div>
              <div className="text-white/80">Innovation Score</div>
              <div className="text-green-400 text-sm mt-1">+5.2% growth</div>
            </div>
          </div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setViewMode('grid')}
          className={`px-4 py-2 rounded-md font-medium transition-all ${
            viewMode === 'grid' ? 'bg-white text-civic-600 shadow-sm' : 'text-gray-600'
          }`}
        >
          Grid View
        </button>
        <button
          onClick={() => setViewMode('map')}
          className={`px-4 py-2 rounded-md font-medium transition-all ${
            viewMode === 'map' ? 'bg-white text-civic-600 shadow-sm' : 'text-gray-600'
          }`}
        >
          Map View
        </button>
      </div>

      {/* Network States Grid */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {networkStates.map(state => (
            <div
              key={state.id}
              className="bg-white rounded-xl border border-gray-200 hover:shadow-xl transition-all duration-300 cursor-pointer group"
              onClick={() => setSelectedState(state)}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 bg-gradient-to-br ${state.color} rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                      {state.flag}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{state.name}</h3>
                      <p className="text-sm text-gray-600">{state.location}</p>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    state.status === 'active' ? 'bg-green-100 text-green-700' :
                    state.status === 'developing' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {state.status}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Population</div>
                    <div className="font-bold text-gray-900">{state.population.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">GDP</div>
                    <div className="font-bold text-gray-900">${state.gdp.toFixed(1)}B</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Governance</div>
                    <div className="font-bold text-governance-600">{state.governanceScore}/100</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Innovation</div>
                    <div className="font-bold text-purple-600">{state.innovationIndex}/100</div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">Specialties</div>
                  <div className="flex flex-wrap gap-1">
                    {state.specialties.slice(0, 2).map(specialty => (
                      <span key={specialty} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {specialty}
                      </span>
                    ))}
                    {state.specialties.length > 2 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        +{state.specialties.length - 2} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-xs text-gray-500">Est. {state.established}</span>
                  <div className="flex items-center text-civic-600 text-sm font-medium">
                    <span>View Details</span>
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Map View Placeholder */}
      {viewMode === 'map' && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Interactive World Map</h3>
          <p className="text-gray-600 mb-6">
            3D visualization of Network State locations and connections
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {networkStates.map(state => (
              <div key={state.id} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                <span className="text-lg">{state.flag}</span>
                <div className="text-left">
                  <div className="font-medium text-gray-900 text-sm">{state.name}</div>
                  <div className="text-xs text-gray-600">{state.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Alliance Activity */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Recent Alliance Activity</h2>
          <p className="text-gray-600 mt-1">Cross-border collaborations and governance updates</p>
        </div>
        <div className="p-6 space-y-4">
          {recentActivities.map(activity => (
            <div key={activity.id} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                activity.type === 'partnership' ? 'bg-blue-100 text-blue-600' :
                activity.type === 'governance' ? 'bg-green-100 text-green-600' :
                'bg-purple-100 text-purple-600'
              }`}>
                {activity.type === 'partnership' ? <Network className="w-5 h-5" /> :
                 activity.type === 'governance' ? <Shield className="w-5 h-5" /> :
                 <Zap className="w-5 h-5" />}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{activity.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{activity.description}</p>
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{activity.timestamp}</span>
                  </span>
                  <span>Participants: {Array.isArray(activity.participants) ? activity.participants.join(', ') : activity.participants}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* State Detail Modal */}
      {selectedState && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-16 h-16 bg-gradient-to-br ${selectedState.color} rounded-2xl flex items-center justify-center text-3xl`}>
                    {selectedState.flag}
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">{selectedState.name}</h2>
                    <p className="text-gray-600 text-lg">{selectedState.location} • Est. {selectedState.established}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedState(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-1">{selectedState.population.toLocaleString()}</div>
                  <div className="text-gray-600">Citizens</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-1">${selectedState.gdp.toFixed(1)}B</div>
                  <div className="text-gray-600">GDP</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-governance-600 mb-1">{selectedState.governanceScore}</div>
                  <div className="text-gray-600">Governance Score</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-1">{selectedState.innovationIndex}</div>
                  <div className="text-gray-600">Innovation Index</div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Core Specialties</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedState.specialties.map((specialty: string) => (
                    <span key={specialty} className="px-3 py-2 bg-civic-100 text-civic-700 rounded-lg font-medium">
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Active Partnerships</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedState.partnerships.map((partner: string) => {
                    const partnerState = networkStates.find(ns => ns.name === partner);
                    return (
                      <div key={partner} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                        {partnerState && (
                          <div className={`w-8 h-8 bg-gradient-to-br ${partnerState.color} rounded-lg flex items-center justify-center text-sm`}>
                            {partnerState.flag}
                          </div>
                        )}
                        <span className="font-medium text-gray-900">{partner}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex space-x-4">
                <button 
                  onClick={() => handleEstablishPartnership('infinita', selectedState.id)}
                  className="flex-1 px-6 py-3 bg-civic-500 text-white rounded-lg hover:bg-civic-600 transition-colors font-semibold"
                >
                  Establish Partnership
                </button>
                <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold">
                  View Constitution
                </button>
                <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold">
                  Trade Relations
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalNetwork;