import React, { useState } from 'react';
import { BarChart3, TrendingUp, Users, Vote, Activity, Calendar, Download, Filter } from 'lucide-react';
import StatCard from '../components/StatCard';

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('participation');

  const participationData = [
    { month: 'Jan', value: 65 },
    { month: 'Feb', value: 72 },
    { month: 'Mar', value: 68 },
    { month: 'Apr', value: 78 },
    { month: 'May', value: 85 },
    { month: 'Jun', value: 82 },
  ];

  const votingData = [
    { proposal: 'Solar Grid', for: 1247, against: 203 },
    { proposal: 'UBI Program', for: 2156, against: 892 },
    { proposal: 'Privacy Enhancement', for: 1834, against: 401 },
    { proposal: 'Education Fund', for: 987, against: 234 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Insights into governance participation and community engagement
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-civic-500 focus:border-transparent"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button className="flex items-center px-4 py-2 bg-civic-500 text-white rounded-lg hover:bg-civic-600 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Citizens"
          value="12,847"
          icon={Users}
          trend={{ value: 8.2, isPositive: true }}
          color="blue"
        />
        <StatCard
          title="Active Voters"
          value="8,923"
          icon={Vote}
          trend={{ value: 12.5, isPositive: true }}
          color="green"
        />
        <StatCard
          title="Participation Rate"
          value="69.4%"
          icon={Activity}
          trend={{ value: 3.1, isPositive: true }}
          color="purple"
        />
        <StatCard
          title="Avg. Civic Score"
          value="642"
          icon={TrendingUp}
          trend={{ value: 5.7, isPositive: true }}
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Participation Trends</h2>
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-civic-500 focus:border-transparent"
              >
                <option value="participation">Participation Rate</option>
                <option value="voting">Voting Activity</option>
                <option value="events">Event Attendance</option>
              </select>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {participationData.map((data, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">{data.month}</span>
                  <div className="flex items-center space-x-3 flex-1 ml-4">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-civic-500 to-governance-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${data.value}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-12 text-right">
                      {data.value}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Voting Results</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {votingData.map((data, index) => {
                const total = data.for + data.against;
                const forPercentage = (data.for / total) * 100;
                
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">{data.proposal}</span>
                      <span className="text-sm text-gray-600">{total.toLocaleString()} votes</span>
                    </div>
                    <div className="flex h-3 rounded-full overflow-hidden">
                      <div 
                        className="bg-governance-500 transition-all duration-500"
                        style={{ width: `${forPercentage}%` }}
                      ></div>
                      <div 
                        className="bg-red-500 transition-all duration-500"
                        style={{ width: `${100 - forPercentage}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>{data.for.toLocaleString()} For ({forPercentage.toFixed(1)}%)</span>
                      <span>{data.against.toLocaleString()} Against ({(100 - forPercentage).toFixed(1)}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Top Contributors</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[
                { name: 'Alex Rivera', score: 847, contributions: 23 },
                { name: 'Sarah Chen', score: 923, contributions: 31 },
                { name: 'Marcus Johnson', score: 756, contributions: 18 },
                { name: 'Elena Rodriguez', score: 689, contributions: 15 },
                { name: 'David Kim', score: 634, contributions: 12 }
              ].map((contributor, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-civic-500 to-governance-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {contributor.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{contributor.name}</p>
                      <p className="text-sm text-gray-600">{contributor.contributions} contributions</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-governance-600">{contributor.score}</p>
                    <p className="text-xs text-gray-500">Civic Score</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Proposal Categories</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[
                { category: 'Infrastructure', count: 12, percentage: 35 },
                { category: 'Economy', count: 8, percentage: 24 },
                { category: 'Governance', count: 7, percentage: 21 },
                { category: 'Social', count: 4, percentage: 12 },
                { category: 'Environment', count: 3, percentage: 8 }
              ].map((cat, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">{cat.category}</span>
                    <span className="text-sm text-gray-600">{cat.count} proposals</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-civic-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${cat.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Engagement Metrics</h2>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Daily Active Users</span>
                  <span className="text-sm font-bold text-gray-900">2,847</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-governance-500 h-2 rounded-full w-3/4"></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Event Attendance</span>
                  <span className="text-sm font-bold text-gray-900">1,234</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-civic-500 h-2 rounded-full w-2/3"></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Proposal Engagement</span>
                  <span className="text-sm font-bold text-gray-900">89.2%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full w-5/6"></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Community Growth</span>
                  <span className="text-sm font-bold text-gray-900">+12.5%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;