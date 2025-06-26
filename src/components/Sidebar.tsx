import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Vote, 
  Shield, 
  Activity, 
  Coins, 
  Settings, 
  HelpCircle,
  Building2,
  BarChart3,
  ExternalLink,
  Bot,
  MessageSquare,
  Globe,
  Zap,
  Users
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/app', icon: Home },
  { name: 'Governance', href: '/app/governance', icon: Vote },
  { name: 'AI Governor', href: '/app/ai-governor', icon: Bot },
  { name: 'Identity', href: '/app/identity', icon: Shield },
  { name: 'Participation', href: '/app/participation', icon: Activity },
  { name: 'Citizen Forum', href: '/app/citizen-forum', icon: MessageSquare },
  { name: 'Economy', href: '/app/economy', icon: Coins },
  { name: 'Global Network', href: '/app/global-network', icon: Globe },
  { name: 'Analytics', href: '/app/analytics', icon: BarChart3 },
];

const Sidebar: React.FC = () => {
  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-civic-500 to-governance-500 rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">CivicKernel</h1>
            <p className="text-xs text-gray-500">Governance Stack</p>
          </div>
        </div>
      </div>
      
      <nav className="px-3 space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-civic-50 text-civic-700 border-r-2 border-civic-500'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.name}
          </NavLink>
        ))}
      </nav>
      
      <div className="absolute bottom-6 left-3 right-3 space-y-1">
        <NavLink
          to="/"
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <ExternalLink className="w-5 h-5 mr-3" />
          Landing Page
        </NavLink>
        <NavLink
          to="/settings"
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <Settings className="w-5 h-5 mr-3" />
          Settings
        </NavLink>
        <NavLink
          to="/help"
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <HelpCircle className="w-5 h-5 mr-3" />
          Help
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;