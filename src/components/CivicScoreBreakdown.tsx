import React from 'react';
import { TrendingUp, Award, Vote, Users, Clock, CheckCircle } from 'lucide-react';

interface ScoreCategory {
  name: string;
  points: number;
  maxPoints: number;
  icon: React.ComponentType<any>;
  color: string;
  description: string;
}

interface CivicScoreBreakdownProps {
  totalScore: number;
  categories: ScoreCategory[];
}

const CivicScoreBreakdown: React.FC<CivicScoreBreakdownProps> = ({ totalScore, categories }) => {
  const maxTotalScore = categories.reduce((sum, cat) => sum + cat.maxPoints, 0);
  const scorePercentage = (totalScore / maxTotalScore) * 100;

  const getScoreLevel = (score: number) => {
    if (score >= 800) return { level: 'Champion', color: 'text-governance-600', bg: 'bg-governance-100' };
    if (score >= 600) return { level: 'Active', color: 'text-civic-600', bg: 'bg-civic-100' };
    if (score >= 400) return { level: 'Engaged', color: 'text-orange-600', bg: 'bg-orange-100' };
    if (score >= 200) return { level: 'Participant', color: 'text-purple-600', bg: 'bg-purple-100' };
    return { level: 'Beginner', color: 'text-gray-600', bg: 'bg-gray-100' };
  };

  const scoreLevel = getScoreLevel(totalScore);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Civic Score Breakdown</h3>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${scoreLevel.bg} ${scoreLevel.color}`}>
          {scoreLevel.level}
        </div>
      </div>

      <div className="text-center mb-6">
        <div className="text-4xl font-bold text-gray-900 mb-2">{totalScore}</div>
        <div className="text-gray-600 mb-4">Total Civic Score</div>
        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
          <div 
            className="bg-gradient-to-r from-civic-500 to-governance-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(scorePercentage, 100)}%` }}
          ></div>
        </div>
        <div className="text-sm text-gray-600">
          {scorePercentage.toFixed(1)}% of maximum possible score
        </div>
      </div>

      <div className="space-y-4">
        {categories.map((category, index) => {
          const categoryPercentage = (category.points / category.maxPoints) * 100;
          const IconComponent = category.icon;
          
          return (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${category.color}`}>
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{category.name}</h4>
                    <p className="text-sm text-gray-600">{category.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">
                    {category.points}/{category.maxPoints}
                  </div>
                  <div className="text-sm text-gray-600">
                    {categoryPercentage.toFixed(0)}%
                  </div>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${category.color.replace('bg-', 'bg-').replace('-100', '-500')}`}
                  style={{ width: `${categoryPercentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-civic-50 to-governance-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">How to Improve Your Score</h4>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• Vote on more proposals to increase governance participation</li>
          <li>• Attend community events and meetings</li>
          <li>• Contribute to public goods and infrastructure projects</li>
          <li>• Help onboard new citizens to the Network State</li>
          <li>• Maintain consistent engagement over time</li>
        </ul>
      </div>
    </div>
  );
};

// Default categories for civic score
export const defaultScoreCategories: ScoreCategory[] = [
  {
    name: 'Governance Participation',
    points: 250,
    maxPoints: 300,
    icon: Vote,
    color: 'bg-governance-100',
    description: 'Voting on proposals and governance activities'
  },
  {
    name: 'Community Engagement',
    points: 180,
    maxPoints: 250,
    icon: Users,
    color: 'bg-civic-100',
    description: 'Attending events and community interactions'
  },
  {
    name: 'Public Contributions',
    points: 220,
    maxPoints: 300,
    icon: Award,
    color: 'bg-purple-100',
    description: 'Contributing to public goods and infrastructure'
  },
  {
    name: 'Consistency',
    points: 150,
    maxPoints: 200,
    icon: Clock,
    color: 'bg-orange-100',
    description: 'Regular and sustained participation over time'
  },
  {
    name: 'Verification Status',
    points: 50,
    maxPoints: 50,
    icon: CheckCircle,
    color: 'bg-green-100',
    description: 'Identity verification and compliance'
  }
];

export default CivicScoreBreakdown;