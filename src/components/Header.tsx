import React, { useState } from 'react';
import { Search, Settings, User } from 'lucide-react';
import { useAccount } from 'wagmi';
import { useSupabaseCitizen } from '../hooks/useSupabase';
import { useSupabaseRealTime } from '../hooks/useSupabaseRealTime';
import WalletConnect from './WalletConnect';
import RealTimeNotifications from './RealTimeNotifications';

const Header: React.FC = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { address, isConnected } = useAccount();
  const { citizen, hasCivicId } = useSupabaseCitizen();
  const { metrics } = useSupabaseRealTime();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Implement search functionality
      console.log('Searching for:', searchTerm);
    }
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="search"
                placeholder="Search governance, proposals, citizens..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-96 border border-gray-300 rounded-lg focus:ring-2 focus:ring-civic-500 focus:border-transparent transition-all duration-200"
              />
            </form>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Real-time metrics - simplified */}
            {isConnected && (
              <div className="hidden lg:flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-gray-600">{metrics.activeUsers} online</span>
                </div>
                <div className="text-gray-400">|</div>
                <div className="text-gray-600">
                  Network Health: <span className="font-semibold text-green-600">{metrics.networkHealth}%</span>
                </div>
              </div>
            )}

            {isConnected && (
              <>
                <RealTimeNotifications />
                
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Settings className="w-5 h-5" />
                </button>
              </>
            )}
            
            {isConnected && hasCivicId && citizen && (
              <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {citizen.name || `${address?.slice(0, 6)}...${address?.slice(-4)}`}
                  </p>
                  <p className="text-xs text-gray-500">
                    Civic Score: <span className="font-semibold text-governance-600">{citizen.civic_score}</span>
                  </p>
                </div>
                <div className="w-8 h-8 bg-gradient-to-br from-civic-500 to-governance-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              </div>
            )}
            
            <WalletConnect />
          </div>
        </div>
      </header>

      {/* Profile dropdown */}
      {isProfileOpen && (
        <div className="absolute right-6 top-16 w-64 bg-white rounded-xl border border-gray-200 shadow-xl z-50">
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Quick Settings</h3>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">
                Profile Settings
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">
                Privacy Controls
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">
                Notification Preferences
              </button>
              <hr className="my-2" />
              <button className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg">
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;