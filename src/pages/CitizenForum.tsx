import React, { useState } from 'react';
import { 
  MessageSquare, 
  Users, 
  Globe, 
  TrendingUp, 
  Heart, 
  MessageCircle, 
  Share2, 
  Flag,
  Search,
  Filter,
  Plus,
  Award,
  Clock,
  Eye,
  ThumbsUp,
  Star,
  MapPin,
  Zap
} from 'lucide-react';
import { useSupabaseForumPosts } from '../hooks/useSupabase';
import { useAccount } from 'wagmi';
import toast from 'react-hot-toast';

const CitizenForum: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedNetwork, setSelectedNetwork] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: 'governance',
    tags: ''
  });

  const { address } = useAccount();
  const { posts, loading, createPost, likePost, incrementViews } = useSupabaseForumPosts();

  const categories = [
    { id: 'all', name: 'All Topics', icon: MessageSquare },
    { id: 'governance', name: 'Governance', icon: Users },
    { id: 'economy', name: 'Economy', icon: TrendingUp },
    { id: 'innovation', name: 'Innovation', icon: Zap },
    { id: 'community', name: 'Community', icon: Heart },
    { id: 'collaboration', name: 'Cross-Border', icon: Globe }
  ];

  const networkStates = [
    { id: 'infinita', name: 'Infinita City', flag: '🏙️', members: 45000, activeNow: 2340, color: 'from-blue-500 to-cyan-500' },
    { id: 'prospera', name: 'Próspera', flag: '🏛️', members: 12000, activeNow: 890, color: 'from-green-500 to-emerald-500' },
    { id: 'zuzalu', name: 'Zuzalu', flag: '🌊', members: 8500, activeNow: 567, color: 'from-purple-500 to-pink-500' },
    { id: 'nueva', name: 'Nueva Libertad', flag: '🗽', members: 23000, activeNow: 1200, color: 'from-orange-500 to-red-500' },
    { id: 'digital', name: 'Digital Nomad Republic', flag: '🌐', members: 67000, activeNow: 3400, color: 'from-teal-500 to-blue-500' }
  ];

  const filteredPosts = posts.filter(post => {
    const categoryMatch = selectedCategory === 'all' || post.category === selectedCategory;
    const networkMatch = selectedNetwork === 'all' || post.network_state === selectedNetwork;
    const searchMatch = searchTerm === '' || 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return categoryMatch && networkMatch && searchMatch;
  });

  const getNetworkInfo = (networkId: string) => {
    return networkStates.find(ns => ns.id === networkId);
  };

  const handleCreatePost = async () => {
    if (!address) {
      toast.error('Please connect your wallet');
      return;
    }

    if (!newPost.title.trim() || !newPost.content.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    const tags = newPost.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    
    try {
      await createPost({
        title: newPost.title,
        content: newPost.content,
        category: newPost.category,
        tags,
        authorAddress: address
      });
      
      setShowCreatePost(false);
      setNewPost({ title: '', content: '', category: 'governance', tags: '' });
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleLike = (postId: string) => {
    if (!address) {
      toast.error('Please connect your wallet');
      return;
    }
    likePost(postId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-civic-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Global Citizen Forum</h1>
          <p className="text-gray-600 mt-2 text-lg">
            Connect, collaborate, and share ideas across the Network State Alliance
          </p>
        </div>
        <button
          onClick={() => setShowCreatePost(true)}
          className="flex items-center px-6 py-3 bg-gradient-to-r from-civic-500 to-governance-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-semibold"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Post
        </button>
      </div>

      {/* Network States Overview */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Connected Network States</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {networkStates.map(network => (
            <div key={network.id} className="text-center group cursor-pointer">
              <div className={`w-16 h-16 bg-gradient-to-br ${network.color} rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform text-2xl`}>
                {network.flag}
              </div>
              <h3 className="font-semibold text-gray-900 text-sm">{network.name}</h3>
              <p className="text-xs text-gray-600">{network.members.toLocaleString()} citizens</p>
              <div className="flex items-center justify-center space-x-1 mt-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-600">{network.activeNow} online</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search discussions, topics, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-civic-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-civic-500 focus:border-transparent"
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>

          <select
            value={selectedNetwork}
            onChange={(e) => setSelectedNetwork(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-civic-500 focus:border-transparent"
          >
            <option value="all">All Network States</option>
            {networkStates.map(network => (
              <option key={network.id} value={network.id}>{network.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Forum Posts */}
      <div className="space-y-4">
        {filteredPosts.map(post => {
          const network = getNetworkInfo(post.network_state);
          return (
            <div key={post.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
              {/* Post Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-civic-500 to-governance-500 rounded-full flex items-center justify-center text-white font-bold">
                    {post.author_address.slice(2, 4).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900">
                        {post.author_address.slice(0, 6)}...{post.author_address.slice(-4)}
                      </h3>
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <Star className="w-3 h-3 text-white" />
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{new Date(post.created_at).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {post.is_trending && (
                    <div className="flex items-center space-x-1 px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                      <TrendingUp className="w-3 h-3" />
                      <span>Trending</span>
                    </div>
                  )}
                  {network && (
                    <div className={`flex items-center space-x-1 px-2 py-1 bg-gradient-to-r ${network.color} text-white rounded-full text-xs font-medium`}>
                      <span>{network.flag}</span>
                      <span>{network.name}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Post Content */}
              <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-900 mb-3">{post.title}</h2>
                <p className="text-gray-700 leading-relaxed">{post.content}</p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Post Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-6">
                  <button 
                    onClick={() => handleLike(post.id)}
                    className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
                  >
                    <Heart className="w-5 h-5" />
                    <span className="font-medium">{post.likes}</span>
                  </button>
                  
                  <button 
                    onClick={() => incrementViews(post.id)}
                    className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span className="font-medium">{post.replies}</span>
                  </button>
                  
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Eye className="w-5 h-5" />
                    <span className="font-medium">{post.views}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <Flag className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Post Modal */}
      {showCreatePost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Create New Post</h2>
                <button
                  onClick={() => setShowCreatePost(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  placeholder="What would you like to discuss?"
                  value={newPost.title}
                  onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-civic-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select 
                  value={newPost.category}
                  onChange={(e) => setNewPost(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-civic-500 focus:border-transparent"
                >
                  {categories.filter(c => c.id !== 'all').map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                <textarea
                  rows={6}
                  placeholder="Share your thoughts, ideas, or questions..."
                  value={newPost.content}
                  onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-civic-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                <input
                  type="text"
                  placeholder="Add tags separated by commas"
                  value={newPost.tags}
                  onChange={(e) => setNewPost(prev => ({ ...prev, tags: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-civic-500 focus:border-transparent"
                />
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setShowCreatePost(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreatePost}
                  className="flex-1 px-4 py-2 bg-civic-500 text-white rounded-lg hover:bg-civic-600 transition-colors font-medium"
                >
                  Publish Post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CitizenForum;