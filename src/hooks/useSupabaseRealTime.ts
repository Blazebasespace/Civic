import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface RealTimeMetrics {
  activeUsers: number;
  totalCitizens: number;
  activeProposals: number;
  totalVotes: number;
  forumPosts: number;
  networkHealth: number;
}

export function useSupabaseRealTime() {
  const [metrics, setMetrics] = useState<RealTimeMetrics>({
    activeUsers: 0,
    totalCitizens: 0,
    activeProposals: 0,
    totalVotes: 0,
    forumPosts: 0,
    networkHealth: 95,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        // Fetch total citizens
        const { count: citizenCount } = await supabase
          .from('citizens')
          .select('*', { count: 'exact', head: true });

        // Fetch active proposals
        const { count: proposalCount } = await supabase
          .from('proposals')
          .select('*', { count: 'exact', head: true })
          .eq('status', 0);

        // Fetch total votes
        const { count: voteCount } = await supabase
          .from('votes')
          .select('*', { count: 'exact', head: true });

        // Fetch forum posts
        const { count: postCount } = await supabase
          .from('forum_posts')
          .select('*', { count: 'exact', head: true });

        setMetrics({
          activeUsers: Math.floor(Math.random() * 500) + 1500, // Simulated active users
          totalCitizens: citizenCount || 0,
          activeProposals: proposalCount || 0,
          totalVotes: voteCount || 0,
          forumPosts: postCount || 0,
          networkHealth: 95 + Math.floor(Math.random() * 5),
        });
      } catch (error) {
        console.error('Error fetching metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();

    // Update metrics every 30 seconds
    const interval = setInterval(fetchMetrics, 30000);

    // Subscribe to real-time changes
    const citizenSubscription = supabase
      .channel('citizen_changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'citizens' },
        () => fetchMetrics()
      )
      .subscribe();

    const proposalSubscription = supabase
      .channel('proposal_changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'proposals' },
        () => fetchMetrics()
      )
      .subscribe();

    const voteSubscription = supabase
      .channel('vote_changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'votes' },
        () => fetchMetrics()
      )
      .subscribe();

    return () => {
      clearInterval(interval);
      citizenSubscription.unsubscribe();
      proposalSubscription.unsubscribe();
      voteSubscription.unsubscribe();
    };
  }, []);

  return {
    metrics,
    loading,
  };
}

export function useSupabaseNotifications() {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    // Subscribe to all table changes for notifications
    const subscription = supabase
      .channel('all_changes')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'proposals' },
        (payload) => {
          const notification = {
            id: `proposal-${payload.new.id}`,
            type: 'info',
            title: 'New Proposal Created',
            message: `"${payload.new.title}" has been submitted for voting`,
            timestamp: new Date(),
            read: false,
          };
          setNotifications(prev => [notification, ...prev.slice(0, 9)]);
        }
      )
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'votes' },
        (payload) => {
          const notification = {
            id: `vote-${payload.new.id}`,
            type: 'success',
            title: 'New Vote Cast',
            message: `A citizen has voted on a proposal`,
            timestamp: new Date(),
            read: false,
          };
          setNotifications(prev => [notification, ...prev.slice(0, 9)]);
        }
      )
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'forum_posts' },
        (payload) => {
          const notification = {
            id: `post-${payload.new.id}`,
            type: 'info',
            title: 'New Forum Post',
            message: `"${payload.new.title}" posted in Citizen Forum`,
            timestamp: new Date(),
            read: false,
          };
          setNotifications(prev => [notification, ...prev.slice(0, 9)]);
        }
      )
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'citizens' },
        (payload) => {
          const notification = {
            id: `citizen-${payload.new.id}`,
            type: 'success',
            title: 'New Citizen Joined',
            message: `Welcome new citizen from ${payload.new.residency}`,
            timestamp: new Date(),
            read: false,
          };
          setNotifications(prev => [notification, ...prev.slice(0, 9)]);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  return {
    notifications,
    markAsRead,
    markAllAsRead,
    unreadCount: notifications.filter(n => !n.read).length,
  };
}