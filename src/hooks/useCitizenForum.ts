import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    reputation: number;
    location: string;
    verified: boolean;
  };
  category: string;
  tags: string[];
  likes: number;
  replies: number;
  views: number;
  timestamp: Date;
  isLiked: boolean;
  networkState: string;
  trending: boolean;
}

interface NetworkState {
  id: string;
  name: string;
  flag: string;
  members: number;
  activeNow: number;
  color: string;
}

export function useCitizenForum() {
  const { address } = useAccount();
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [networkStates, setNetworkStates] = useState<NetworkState[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialize network states with real-time data
  useEffect(() => {
    const states: NetworkState[] = [
      { 
        id: 'infinita', 
        name: 'Infinita City', 
        flag: '🏙️', 
        members: 45000 + Math.floor(Math.random() * 1000), 
        activeNow: 2340 + Math.floor(Math.random() * 100), 
        color: 'from-blue-500 to-cyan-500' 
      },
      { 
        id: 'prospera', 
        name: 'Próspera', 
        flag: '🏛️', 
        members: 12000 + Math.floor(Math.random() * 500), 
        activeNow: 890 + Math.floor(Math.random() * 50), 
        color: 'from-green-500 to-emerald-500' 
      },
      { 
        id: 'zuzalu', 
        name: 'Zuzalu', 
        flag: '🌊', 
        members: 8500 + Math.floor(Math.random() * 300), 
        activeNow: 567 + Math.floor(Math.random() * 30), 
        color: 'from-purple-500 to-pink-500' 
      },
      { 
        id: 'nueva', 
        name: 'Nueva Libertad', 
        flag: '🗽', 
        members: 23000 + Math.floor(Math.random() * 800), 
        activeNow: 1200 + Math.floor(Math.random() * 80), 
        color: 'from-orange-500 to-red-500' 
      },
      { 
        id: 'digital', 
        name: 'Digital Nomad Republic', 
        flag: '🌐', 
        members: 67000 + Math.floor(Math.random() * 2000), 
        activeNow: 3400 + Math.floor(Math.random() * 200), 
        color: 'from-teal-500 to-blue-500' 
      }
    ];
    
    setNetworkStates(states);
  }, []);

  // Load initial posts
  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const initialPosts: ForumPost[] = [
        {
          id: '1',
          title: 'Proposal: Universal Basic Assets across Network State Alliance',
          content: 'I propose we establish a cross-border UBA system that allows citizens to receive basic assets regardless of which Network State they\'re currently residing in. This would enable true digital nomadism while maintaining social safety nets.',
          author: {
            name: address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Elena Rodriguez',
            avatar: address ? address.slice(2, 4).toUpperCase() : 'ER',
            reputation: 847 + Math.floor(Math.random() * 100),
            location: 'Próspera',
            verified: true
          },
          category: 'economy',
          tags: ['UBA', 'cross-border', 'social-safety'],
          likes: 234 + Math.floor(Math.random() * 50),
          replies: 67 + Math.floor(Math.random() * 20),
          views: 1240 + Math.floor(Math.random() * 200),
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          isLiked: false,
          networkState: 'prospera',
          trending: true
        },
        {
          id: '2',
          title: 'AI-Assisted Governance: Early Results from Infinita City',
          content: 'After 6 months of using CivicKernel\'s AI Governor, we\'ve seen a 340% increase in decision accuracy and 67% faster policy implementation. Here are the detailed metrics and lessons learned.',
          author: {
            name: 'Marcus Chen',
            avatar: 'MC',
            reputation: 923 + Math.floor(Math.random() * 100),
            location: 'Infinita City',
            verified: true
          },
          category: 'governance',
          tags: ['AI', 'governance', 'metrics'],
          likes: 189 + Math.floor(Math.random() * 30),
          replies: 43 + Math.floor(Math.random() * 15),
          views: 890 + Math.floor(Math.random() * 150),
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
          isLiked: Math.random() > 0.5,
          networkState: 'infinita',
          trending: true
        }
      ];
      
      setPosts(initialPosts);
      setLoading(false);
    };

    loadPosts();
  }, [address]);

  const createPost = async (postData: {
    title: string;
    content: string;
    category: string;
    tags: string[];
  }) => {
    if (!address) return;

    const newPost: ForumPost = {
      id: `post-${Date.now()}`,
      title: postData.title,
      content: postData.content,
      author: {
        name: `${address.slice(0, 6)}...${address.slice(-4)}`,
        avatar: address.slice(2, 4).toUpperCase(),
        reputation: Math.floor(Math.random() * 500) + 100,
        location: 'Network State',
        verified: true
      },
      category: postData.category,
      tags: postData.tags,
      likes: 0,
      replies: 0,
      views: 1,
      timestamp: new Date(),
      isLiked: false,
      networkState: 'infinita', // Default to user's current state
      trending: false
    };

    setPosts(prev => [newPost, ...prev]);
    return newPost;
  };

  const likePost = (postId: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
          isLiked: !post.isLiked
        };
      }
      return post;
    }));
  };

  const incrementViews = (postId: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return { ...post, views: post.views + 1 };
      }
      return post;
    }));
  };

  // Update active users periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setNetworkStates(prev => prev.map(state => ({
        ...state,
        activeNow: state.activeNow + Math.floor(Math.random() * 20) - 10 // Random fluctuation
      })));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return {
    posts,
    networkStates,
    loading,
    createPost,
    likePost,
    incrementViews
  };
}