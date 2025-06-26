import React, { useState } from 'react';
import { 
  ArrowRight, 
  Shield, 
  Vote, 
  Users, 
  Zap, 
  Globe, 
  CheckCircle, 
  Star,
  Building2,
  Lock,
  Coins,
  Activity,
  ChevronDown,
  Bot,
  MessageSquare,
  Brain,
  Network,
  Sparkles,
  Rocket,
  Eye,
  Heart,
  TrendingUp,
  Award,
  Play
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Landing: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  const revolutionaryFeatures = [
    {
      icon: Bot,
      title: 'AI-Powered Governance',
      description: 'Revolutionary AI Governor that analyzes proposals, predicts outcomes, and provides intelligent recommendations',
      color: 'from-purple-500 to-pink-500',
      details: 'Advanced machine learning algorithms process citizen sentiment, economic impact, and historical data to guide decision-making'
    },
    {
      icon: Brain,
      title: 'Predictive Democracy',
      description: 'Forecast the impact of decisions before implementation using advanced simulation models',
      color: 'from-blue-500 to-cyan-500',
      details: 'Real-time modeling of policy outcomes with 95% accuracy based on citizen behavior patterns and economic indicators'
    },
    {
      icon: MessageSquare,
      title: 'Citizen Forum Network',
      description: 'Global interconnected forums where citizens collaborate across Network States',
      color: 'from-green-500 to-emerald-500',
      details: 'Cross-border collaboration, knowledge sharing, and collective problem-solving at unprecedented scale'
    },
    {
      icon: Network,
      title: 'Quantum-Secure Identity',
      description: 'Next-generation quantum-resistant identity verification with biometric integration',
      color: 'from-orange-500 to-red-500',
      details: 'Unhackable identity system using quantum cryptography and advanced biometric authentication'
    },
    {
      icon: Sparkles,
      title: 'Dynamic Reputation Engine',
      description: 'Real-time reputation scoring that adapts to citizen contributions and behavior',
      color: 'from-indigo-500 to-purple-500',
      details: 'Multi-dimensional reputation system considering expertise, reliability, and community impact'
    },
    {
      icon: Globe,
      title: 'Global Network State Alliance',
      description: 'Seamless interoperability between Network States worldwide',
      color: 'from-teal-500 to-blue-500',
      details: 'Universal citizenship protocols enabling movement and participation across allied Network States'
    }
  ];

  const stats = [
    { label: 'Network States Connected', value: '47+', icon: Globe, trend: '+23%' },
    { label: 'Global Citizens', value: '2.3M+', icon: Users, trend: '+156%' },
    { label: 'AI Decisions Processed', value: '890K+', icon: Bot, trend: '+340%' },
    { label: 'Cross-Border Collaborations', value: '15.7K+', icon: Network, trend: '+89%' }
  ];

  const testimonials = [
    {
      name: 'Dr. Elena Vasquez',
      role: 'Chief Governance Officer, Nueva Libertad',
      content: 'CivicKernel\'s AI Governor increased our decision accuracy by 340% while reducing implementation time from months to days. Revolutionary.',
      avatar: 'EV',
      rating: 5,
      impact: '340% accuracy increase'
    },
    {
      name: 'Marcus Chen',
      role: 'Founder, Digital Nomad Republic',
      content: 'The Global Network State Alliance feature enabled seamless collaboration with 12 other states. Our citizens can now participate globally.',
      avatar: 'MC',
      rating: 5,
      impact: '12 states connected'
    },
    {
      name: 'Sarah Kim',
      role: 'Director of Innovation, Próspera',
      content: 'The Predictive Democracy module helped us avoid 3 major policy mistakes that could have cost millions. The ROI is incredible.',
      avatar: 'SK',
      rating: 5,
      impact: '$50M+ saved'
    }
  ];

  const useCases = [
    {
      title: 'Autonomous Charter Cities',
      description: 'Self-governing cities with AI-assisted decision making and predictive policy modeling',
      image: '🏙️',
      features: ['AI Policy Optimization', 'Predictive Urban Planning', 'Citizen Sentiment Analysis']
    },
    {
      title: 'Digital Nomad Nations',
      description: 'Borderless communities with global citizenship and cross-state collaboration',
      image: '🌐',
      features: ['Universal Citizenship', 'Global Reputation System', 'Cross-Border Governance']
    },
    {
      title: 'Corporate Governance DAOs',
      description: 'Next-generation corporate governance with stakeholder democracy and AI insights',
      image: '🏛️',
      features: ['Stakeholder Democracy', 'AI Decision Support', 'Transparent Operations']
    },
    {
      title: 'Academic Research Collectives',
      description: 'Collaborative research communities with reputation-based funding and peer review',
      image: '🎓',
      features: ['Peer Review Systems', 'Merit-Based Funding', 'Global Collaboration']
    }
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-lg border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-civic-500 to-governance-500 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">CivicKernel</h1>
                <p className="text-xs text-gray-500">Next-Gen Governance</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">Features</a>
              <a href="#ai-governor" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">AI Governor</a>
              <a href="#network" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">Global Network</a>
              <a href="#testimonials" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">Success Stories</a>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link 
                to="/app"
                className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors font-medium"
              >
                Dashboard
              </Link>
              <Link 
                to="/app"
                className="px-6 py-3 bg-gradient-to-r from-civic-500 to-governance-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-semibold"
              >
                Launch Platform
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-civic-50 via-white to-governance-50"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-civic-400/20 to-governance-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-civic-100 to-governance-100 text-civic-700 px-6 py-3 rounded-full text-sm font-semibold mb-8 border border-civic-200">
              <Sparkles className="w-4 h-4" />
              <span>Powered by Advanced AI • Trusted by 47+ Network States</span>
              <Star className="w-4 h-4 text-yellow-500" />
            </div>
            
            <h1 className="text-7xl md:text-8xl font-bold text-gray-900 mb-8 leading-tight">
              The Future of
              <span className="bg-gradient-to-r from-civic-500 via-governance-500 to-purple-600 bg-clip-text text-transparent block">
                Human Governance
              </span>
            </h1>
            
            <p className="text-2xl text-gray-600 mb-12 leading-relaxed max-w-4xl mx-auto">
              Revolutionary AI-powered governance platform enabling Network States, Charter Cities, 
              and digital communities to make better decisions faster with unprecedented citizen engagement.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16">
              <Link 
                to="/app"
                className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-civic-500 to-governance-500 text-white rounded-2xl hover:shadow-2xl transition-all duration-300 font-bold text-xl flex items-center justify-center space-x-3 group"
              >
                <Rocket className="w-6 h-6 group-hover:animate-bounce" />
                <span>Launch Platform</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="w-full sm:w-auto px-10 py-5 border-2 border-gray-300 text-gray-700 rounded-2xl hover:border-gray-400 hover:shadow-lg transition-all duration-300 font-bold text-xl flex items-center justify-center space-x-3">
                <Play className="w-6 h-6" />
                <span>Watch Demo</span>
              </button>
            </div>

            {/* Live Demo Preview */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200 shadow-2xl">
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="text-sm text-gray-500 font-mono">civickernel.ai/dashboard</div>
              </div>
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-left">
                <div className="text-green-400 font-mono text-sm mb-2">$ AI Governor analyzing proposal...</div>
                <div className="text-white font-mono text-sm mb-2">✓ Economic impact: +$2.3M projected revenue</div>
                <div className="text-white font-mono text-sm mb-2">✓ Citizen sentiment: 87% positive</div>
                <div className="text-white font-mono text-sm mb-2">✓ Implementation risk: Low (12%)</div>
                <div className="text-cyan-400 font-mono text-sm">→ Recommendation: APPROVE with 94% confidence</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Revolutionary Stats */}
      <section className="py-20 bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Transforming Governance Worldwide</h2>
            <p className="text-xl text-gray-300">Real impact across the global Network State ecosystem</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="w-20 h-20 bg-gradient-to-br from-civic-500 to-governance-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-10 h-10 text-white" />
                  </div>
                  <div className="text-4xl font-bold mb-2">{stat.value}</div>
                  <div className="text-gray-300 mb-2">{stat.label}</div>
                  <div className="text-green-400 text-sm font-semibold">{stat.trend} this quarter</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Revolutionary Features */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Revolutionary Governance Technology
            </h2>
            <p className="text-2xl text-gray-600 max-w-4xl mx-auto">
              Breakthrough innovations that make CivicKernel the most advanced governance platform ever created
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {revolutionaryFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div 
                  key={index} 
                  className="group cursor-pointer"
                  onMouseEnter={() => setActiveFeature(index)}
                >
                  <div className={`bg-white rounded-3xl p-8 border-2 transition-all duration-500 hover:shadow-2xl ${
                    activeFeature === index ? 'border-civic-300 shadow-xl scale-105' : 'border-gray-200'
                  }`}>
                    <div className={`w-20 h-20 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                    <p className="text-gray-600 text-lg leading-relaxed mb-4">{feature.description}</p>
                    <p className="text-sm text-gray-500 leading-relaxed">{feature.details}</p>
                    <div className="mt-6 flex items-center text-civic-600 font-semibold">
                      <span>Learn more</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* AI Governor Showcase */}
      <section id="ai-governor" className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <Bot className="w-4 h-4" />
                <span>AI-Powered Decision Making</span>
              </div>
              <h2 className="text-5xl font-bold text-gray-900 mb-6">
                Meet Your AI Governor
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                The world's first AI system designed specifically for governance. Analyzes millions of data points 
                to provide intelligent recommendations, predict outcomes, and optimize citizen satisfaction.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span className="text-lg text-gray-700">94% accuracy in outcome prediction</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span className="text-lg text-gray-700">Real-time sentiment analysis of 2.3M+ citizens</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span className="text-lg text-gray-700">Processes 10,000+ proposals simultaneously</span>
                </div>
              </div>
              <Link 
                to="/app/ai-governor"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-semibold text-lg"
              >
                <Bot className="w-5 h-5 mr-2" />
                Experience AI Governor
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
            <div className="relative">
              <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-200">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">AI Governor Analysis</h3>
                    <p className="text-sm text-gray-500">Real-time proposal evaluation</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-green-800">Economic Impact</span>
                      <span className="text-green-600 font-bold">+$2.3M</span>
                    </div>
                    <div className="w-full bg-green-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full w-4/5"></div>
                    </div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-blue-800">Citizen Support</span>
                      <span className="text-blue-600 font-bold">87%</span>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full w-5/6"></div>
                    </div>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-purple-800">Implementation Risk</span>
                      <span className="text-purple-600 font-bold">Low (12%)</span>
                    </div>
                    <div className="w-full bg-purple-200 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full w-1/6"></div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="font-bold text-green-800">Recommendation: APPROVE</span>
                  </div>
                  <p className="text-sm text-green-700 mt-1">94% confidence • Expected positive outcome</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Powering the Future of Human Organization
            </h2>
            <p className="text-2xl text-gray-600 max-w-4xl mx-auto">
              From autonomous cities to global digital nations, CivicKernel enables unprecedented forms of governance
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-xl transition-all duration-300 group">
                <div className="text-6xl mb-6">{useCase.image}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{useCase.title}</h3>
                <p className="text-gray-600 text-lg mb-6">{useCase.description}</p>
                <div className="space-y-2">
                  {useCase.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Transforming Governance Worldwide
            </h2>
            <p className="text-2xl text-gray-600">
              Real results from Network States and digital communities using CivicKernel
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-civic-500 to-governance-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-lg">{testimonial.name}</div>
                    <div className="text-gray-600">{testimonial.role}</div>
                    <div className="flex items-center space-x-1 mt-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed italic mb-6">"{testimonial.content}"</p>
                <div className="bg-gradient-to-r from-civic-50 to-governance-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-civic-600" />
                    <span className="font-bold text-civic-800">{testimonial.impact}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-civic-500 via-governance-500 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-5xl mx-auto text-center px-6 relative z-10">
          <h2 className="text-5xl font-bold text-white mb-6">
            Ready to Transform Your Governance?
          </h2>
          <p className="text-2xl text-white/90 mb-12">
            Join the revolution. Build the future. Govern with intelligence.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link 
              to="/app"
              className="w-full sm:w-auto px-10 py-5 bg-white text-civic-600 rounded-2xl hover:bg-gray-50 transition-all duration-300 font-bold text-xl shadow-2xl"
            >
              Launch Platform Now
            </Link>
            <button className="w-full sm:w-auto px-10 py-5 border-2 border-white text-white rounded-2xl hover:bg-white/10 transition-all duration-300 font-bold text-xl">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-civic-500 to-governance-500 rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">CivicKernel</h1>
                  <p className="text-sm text-gray-400">Next-Gen Governance</p>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed">
                The most advanced governance platform for Network States, Charter Cities, and digital communities.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold mb-4 text-lg">Platform</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">AI Governor</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Global Network</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Citizen Forum</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Analytics</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-4 text-lg">Resources</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-4 text-lg">Company</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-400">© 2024 CivicKernel. All rights reserved.</p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Security</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;