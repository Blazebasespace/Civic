import React, { useState } from 'react';
import { 
  Bot, 
  Brain, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Users, 
  DollarSign,
  BarChart3,
  Zap,
  Eye,
  MessageSquare,
  Lightbulb,
  Target,
  Activity,
  Award
} from 'lucide-react';
import { useAIGovernor } from '../hooks/useAIGovernor';
import { useProposals } from '../hooks/useContractData';

const AIGovernor: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'analysis' | 'predictions' | 'insights'>('dashboard');
  const { insights, analyses, metrics, isAnalyzing, analyzeProposal } = useAIGovernor();
  const { proposals } = useProposals();

  const runAnalysis = async () => {
    // Analyze all active proposals
    const activeProposals = proposals.filter(p => p.status === 0);
    
    for (const proposal of activeProposals) {
      await analyzeProposal(proposal.id, {
        title: proposal.title,
        description: proposal.description,
        category: proposal.category
      });
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'recommendation': return <Lightbulb className="w-5 h-5" />;
      case 'prediction': return <TrendingUp className="w-5 h-5" />;
      case 'alert': return <AlertCircle className="w-5 h-5" />;
      case 'analysis': return <BarChart3 className="w-5 h-5" />;
      default: return <Brain className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">AI Governor</h1>
          <p className="text-gray-600 mt-2 text-lg">
            Advanced artificial intelligence for governance optimization and decision support
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-medium">AI Online</span>
          </div>
          <button
            onClick={runAnalysis}
            disabled={isAnalyzing}
            className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-semibold disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Analyzing...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 mr-2" />
                Run Analysis
              </>
            )}
          </button>
        </div>
      </div>

      {/* AI Status Dashboard */}
      <div className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10"></div>
        <div className="relative z-10">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Bot className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">AI Governor Status</h2>
              <p className="text-white/80 text-lg">Real-time governance intelligence system</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="text-3xl font-bold mb-2">{(metrics.citizensAnalyzed / 1000000).toFixed(1)}M+</div>
              <div className="text-white/80">Citizens Analyzed</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="text-3xl font-bold mb-2">{metrics.predictionAccuracy.toFixed(1)}%</div>
              <div className="text-white/80">Prediction Accuracy</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="text-3xl font-bold mb-2">{metrics.proposalsProcessed}</div>
              <div className="text-white/80">Proposals Processed</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="text-3xl font-bold mb-2">{metrics.dailyDecisions}</div>
              <div className="text-white/80">Decisions Today</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 rounded-xl p-1">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
          { id: 'analysis', label: 'Proposal Analysis', icon: Brain },
          { id: 'predictions', label: 'Predictions', icon: TrendingUp },
          { id: 'insights', label: 'AI Insights', icon: Lightbulb }
        ].map(tab => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <IconComponent className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content based on active tab */}
      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Real-time Governance Metrics</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700">Citizen Satisfaction</span>
                      <span className="font-bold text-green-600">87%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-green-500 h-3 rounded-full w-5/6 transition-all duration-500"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700">Policy Effectiveness</span>
                      <span className="font-bold text-blue-600">92%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-blue-500 h-3 rounded-full w-11/12 transition-all duration-500"></div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700">Participation Rate</span>
                      <span className="font-bold text-purple-600">78%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-purple-500 h-3 rounded-full w-4/5 transition-all duration-500"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700">Economic Health</span>
                      <span className="font-bold text-orange-600">85%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-orange-500 h-3 rounded-full w-5/6 transition-all duration-500"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent AI Recommendations</h3>
              <div className="space-y-4">
                {insights.slice(0, 3).map(insight => (
                  <div key={insight.id} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      {getTypeIcon(insight.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(insight.impact)}`}>
                          {insight.impact} impact
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">{insight.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span>Confidence: {insight.confidence}%</span>
                        <span>{insight.category}</span>
                        <span>{insight.timestamp.toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Performance</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Processing Speed</span>
                  <span className="font-bold text-green-600">2.3ms avg</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Accuracy Rate</span>
                  <span className="font-bold text-green-600">{metrics.predictionAccuracy.toFixed(1)}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Data Points</span>
                  <span className="font-bold text-blue-600">{(metrics.citizensAnalyzed / 1000000).toFixed(1)}M</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Active Models</span>
                  <span className="font-bold text-purple-600">12</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-blue-500 rounded-xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-4">Today's Impact</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="opacity-90">Decisions Optimized</span>
                  <span className="font-bold">{metrics.dailyDecisions}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="opacity-90">Cost Savings</span>
                  <span className="font-bold">$47K</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="opacity-90">Citizen Satisfaction</span>
                  <span className="font-bold">+5.2%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'analysis' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Proposal Analysis Results</h3>
            <div className="space-y-6">
              {analyses.length > 0 ? (
                analyses.map(analysis => (
                  <div key={analysis.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-900">{analysis.title}</h4>
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          analysis.recommendation === 'approve' 
                            ? 'bg-green-100 text-green-700' 
                            : analysis.recommendation === 'reject'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {analysis.recommendation.toUpperCase()}
                        </span>
                        <span className="text-sm text-gray-500">{analysis.confidence}% confidence</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6 mb-6">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-700">Economic Impact</span>
                          <span className="font-bold text-green-600">{analysis.economicImpact}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${analysis.economicImpact}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-700">Citizen Support</span>
                          <span className="font-bold text-blue-600">{analysis.citizenSentiment}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${analysis.citizenSentiment}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-700">Implementation Risk</span>
                          <span className="font-bold text-red-600">{analysis.implementationRisk}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-red-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${analysis.implementationRisk}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-semibold text-gray-900 mb-3">AI Reasoning:</h5>
                      <ul className="space-y-2">
                        {analysis.reasoning.map((reason, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Analysis Available</h3>
                  <p className="text-gray-600">Run AI analysis to see proposal recommendations</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">AI-Generated Insights</h3>
            <div className="space-y-4">
              {insights.map(insight => (
                <div key={insight.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      insight.type === 'recommendation' ? 'bg-blue-100 text-blue-600' :
                      insight.type === 'prediction' ? 'bg-green-100 text-green-600' :
                      insight.type === 'alert' ? 'bg-red-100 text-red-600' :
                      'bg-purple-100 text-purple-600'
                    }`}>
                      {getTypeIcon(insight.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-lg font-semibold text-gray-900">{insight.title}</h4>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(insight.impact)}`}>
                            {insight.impact} impact
                          </span>
                          <span className="text-sm text-gray-500">{insight.confidence}% confidence</span>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-3">{insight.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{insight.timestamp.toLocaleString()}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Target className="w-4 h-4" />
                          <span>{insight.category}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIGovernor;