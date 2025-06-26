import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { supabase, Database } from '../lib/supabase';
import toast from 'react-hot-toast';

type Tables = Database['public']['Tables'];

export function useSupabaseCitizen() {
  const { address } = useAccount();
  const [citizen, setCitizen] = useState<Tables['citizens']['Row'] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!address) {
      setCitizen(null);
      setLoading(false);
      return;
    }

    const fetchCitizen = async () => {
      try {
        const { data, error } = await supabase
          .from('citizens')
          .select('*')
          .eq('wallet_address', address.toLowerCase())
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching citizen:', error);
          return;
        }

        setCitizen(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCitizen();
  }, [address]);

  const createCitizen = async (citizenData: {
    name?: string;
    role: string;
    residency: string;
  }) => {
    if (!address) return null;

    try {
      const { data, error } = await supabase
        .from('citizens')
        .insert({
          wallet_address: address.toLowerCase(),
          name: citizenData.name,
          role: citizenData.role,
          residency: citizenData.residency,
          civic_score: 100,
          reputation: 50,
          is_verified: true,
        })
        .select()
        .single();

      if (error) throw error;

      setCitizen(data);
      toast.success('Civic ID created successfully!');
      return data;
    } catch (error) {
      console.error('Error creating citizen:', error);
      toast.error('Failed to create Civic ID');
      return null;
    }
  };

  const updateCivicScore = async (points: number) => {
    if (!citizen) return;

    try {
      const { data, error } = await supabase
        .from('citizens')
        .update({
          civic_score: citizen.civic_score + points,
          updated_at: new Date().toISOString(),
        })
        .eq('id', citizen.id)
        .select()
        .single();

      if (error) throw error;
      setCitizen(data);
    } catch (error) {
      console.error('Error updating civic score:', error);
    }
  };

  return {
    citizen,
    loading,
    createCitizen,
    updateCivicScore,
    hasCivicId: !!citizen,
  };
}

export function useSupabaseProposals() {
  const [proposals, setProposals] = useState<Tables['proposals']['Row'][]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const { data, error } = await supabase
          .from('proposals')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setProposals(data || []);
      } catch (error) {
        console.error('Error fetching proposals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();

    // Subscribe to real-time changes
    const subscription = supabase
      .channel('proposals')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'proposals' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setProposals(prev => [payload.new as Tables['proposals']['Row'], ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setProposals(prev => prev.map(p => 
              p.id === payload.new.id ? payload.new as Tables['proposals']['Row'] : p
            ));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const createProposal = async (proposalData: {
    title: string;
    description: string;
    category: string;
    votingType: number;
    duration: number;
    proposerAddress: string;
    blockchainProposalId?: number;
  }) => {
    try {
      const endTime = new Date();
      endTime.setDate(endTime.getDate() + proposalData.duration);

      const { data, error } = await supabase
        .from('proposals')
        .insert({
          title: proposalData.title,
          description: proposalData.description,
          proposer_address: proposalData.proposerAddress,
          category: proposalData.category,
          voting_type: proposalData.votingType,
          status: 0, // Active
          end_time: endTime.toISOString(),
          blockchain_proposal_id: proposalData.blockchainProposalId || null,
        })
        .select()
        .single();

      if (error) throw error;
      toast.success('Proposal created successfully!');
      return data;
    } catch (error) {
      console.error('Error creating proposal:', error);
      toast.error('Failed to create proposal');
      return null;
    }
  };

  const voteOnProposal = async (proposalId: string, support: boolean, weight: number = 1, voterAddress: string) => {
    try {
      // First check if user has already voted
      const { data: existingVote, error: checkError } = await supabase
        .from('votes')
        .select('*')
        .eq('proposal_id', proposalId)
        .eq('voter_address', voterAddress.toLowerCase())
        .maybeSingle();

      if (checkError) throw checkError;

      let voteData;
      
      if (existingVote) {
        // Update existing vote
        const { data, error: updateError } = await supabase
          .from('votes')
          .update({
            support,
            weight,
          })
          .eq('proposal_id', proposalId)
          .eq('voter_address', voterAddress.toLowerCase())
          .select()
          .single();

        if (updateError) throw updateError;
        voteData = data;
      } else {
        // Insert new vote
        const { data, error: insertError } = await supabase
          .from('votes')
          .insert({
            proposal_id: proposalId,
            voter_address: voterAddress.toLowerCase(),
            support,
            weight,
          })
          .select()
          .single();

        if (insertError) throw insertError;
        voteData = data;
      }

      // Recalculate vote counts from all votes for this proposal
      const { data: allVotes, error: votesError } = await supabase
        .from('votes')
        .select('support, weight')
        .eq('proposal_id', proposalId);

      if (votesError) throw votesError;

      const votesFor = allVotes?.filter(v => v.support).reduce((sum, v) => sum + v.weight, 0) || 0;
      const votesAgainst = allVotes?.filter(v => !v.support).reduce((sum, v) => sum + v.weight, 0) || 0;
      const totalParticipants = allVotes?.length || 0;

      // Update proposal vote counts
      const { error: updateError } = await supabase
        .from('proposals')
        .update({
          votes_for: votesFor,
          votes_against: votesAgainst,
          total_participants: totalParticipants,
          updated_at: new Date().toISOString(),
        })
        .eq('id', proposalId);

      if (updateError) throw updateError;
      
      toast.success(existingVote ? 'Vote updated successfully!' : 'Vote recorded successfully!');
      return voteData;
    } catch (error) {
      console.error('Error voting:', error);
      toast.error('Failed to record vote');
      throw error;
    }
  };

  const removeVote = async (proposalId: string, voterAddress: string) => {
    try {
      // Delete the vote
      const { error: deleteError } = await supabase
        .from('votes')
        .delete()
        .eq('proposal_id', proposalId)
        .eq('voter_address', voterAddress.toLowerCase());

      if (deleteError) throw deleteError;

      // Recalculate vote counts from remaining votes
      const { data: allVotes, error: votesError } = await supabase
        .from('votes')
        .select('support, weight')
        .eq('proposal_id', proposalId);

      if (votesError) throw votesError;

      const votesFor = allVotes?.filter(v => v.support).reduce((sum, v) => sum + v.weight, 0) || 0;
      const votesAgainst = allVotes?.filter(v => !v.support).reduce((sum, v) => sum + v.weight, 0) || 0;
      const totalParticipants = allVotes?.length || 0;

      // Update proposal vote counts
      const { error: updateError } = await supabase
        .from('proposals')
        .update({
          votes_for: votesFor,
          votes_against: votesAgainst,
          total_participants: totalParticipants,
          updated_at: new Date().toISOString(),
        })
        .eq('id', proposalId);

      if (updateError) throw updateError;
      
      toast.success('Vote removed successfully!');
      return true;
    } catch (error) {
      console.error('Error removing vote:', error);
      toast.error('Failed to remove vote');
      throw error;
    }
  };

  const hasVoted = async (proposalId: string, voterAddress: string) => {
    try {
      const { data, error } = await supabase
        .from('votes')
        .select('support')
        .eq('proposal_id', proposalId)
        .eq('voter_address', voterAddress.toLowerCase())
        .maybeSingle();

      if (error) throw error;
      return data ? { hasVoted: true, support: data.support } : { hasVoted: false, support: null };
    } catch (error) {
      console.error('Error checking vote status:', error);
      return { hasVoted: false, support: null };
    }
  };

  return {
    proposals,
    loading,
    createProposal,
    voteOnProposal,
    removeVote,
    hasVoted,
  };
}

export function useSupabaseForumPosts() {
  const [posts, setPosts] = useState<Tables['forum_posts']['Row'][]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('forum_posts')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setPosts(data || []);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();

    // Subscribe to real-time changes
    const subscription = supabase
      .channel('forum_posts')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'forum_posts' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setPosts(prev => [payload.new as Tables['forum_posts']['Row'], ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setPosts(prev => prev.map(p => 
              p.id === payload.new.id ? payload.new as Tables['forum_posts']['Row'] : p
            ));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const createPost = async (postData: {
    title: string;
    content: string;
    category: string;
    tags: string[];
    authorAddress: string;
  }) => {
    try {
      const { data, error } = await supabase
        .from('forum_posts')
        .insert({
          title: postData.title,
          content: postData.content,
          author_address: postData.authorAddress.toLowerCase(),
          category: postData.category,
          tags: postData.tags,
          network_state: 'infinita',
        })
        .select()
        .single();

      if (error) throw error;
      toast.success('Post created successfully!');
      return data;
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post');
      return null;
    }
  };

  const likePost = async (postId: string) => {
    try {
      const post = posts.find(p => p.id === postId);
      if (!post) return;

      const { error } = await supabase
        .from('forum_posts')
        .update({
          likes: post.likes + 1,
          updated_at: new Date().toISOString(),
        })
        .eq('id', postId);

      if (error) throw error;
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const incrementViews = async (postId: string) => {
    try {
      const post = posts.find(p => p.id === postId);
      if (!post) return;

      const { error } = await supabase
        .from('forum_posts')
        .update({
          views: post.views + 1,
          updated_at: new Date().toISOString(),
        })
        .eq('id', postId);

      if (error) throw error;
    } catch (error) {
      console.error('Error incrementing views:', error);
    }
  };

  return {
    posts,
    loading,
    createPost,
    likePost,
    incrementViews,
  };
}

export function useSupabaseActivities() {
  const { address } = useAccount();
  const [activities, setActivities] = useState<Tables['activities']['Row'][]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!address) {
      setActivities([]);
      setLoading(false);
      return;
    }

    const fetchActivities = async () => {
      try {
        const { data, error } = await supabase
          .from('activities')
          .select('*')
          .eq('user_address', address.toLowerCase())
          .order('created_at', { ascending: false });

        if (error) throw error;
        setActivities(data || []);
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [address]);

  const recordActivity = async (activityData: {
    activityType: string;
    description: string;
    points: number;
    userAddress: string;
  }) => {
    try {
      const { data, error } = await supabase
        .from('activities')
        .insert({
          user_address: activityData.userAddress.toLowerCase(),
          activity_type: activityData.activityType,
          description: activityData.description,
          points: activityData.points,
          verified: true,
        })
        .select()
        .single();

      if (error) throw error;
      
      setActivities(prev => [data, ...prev]);
      toast.success('Activity recorded successfully!');
      return data;
    } catch (error) {
      console.error('Error recording activity:', error);
      toast.error('Failed to record activity');
      return null;
    }
  };

  const getTotalPoints = () => {
    return activities.reduce((sum, activity) => sum + activity.points, 0);
  };

  return {
    activities,
    loading,
    recordActivity,
    totalPoints: getTotalPoints(),
  };
}

export function useSupabaseNetworkStates() {
  const [networkStates, setNetworkStates] = useState<Tables['network_states']['Row'][]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNetworkStates = async () => {
      try {
        const { data, error } = await supabase
          .from('network_states')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setNetworkStates(data || []);
      } catch (error) {
        console.error('Error fetching network states:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNetworkStates();

    // Subscribe to real-time changes
    const subscription = supabase
      .channel('network_states')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'network_states' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setNetworkStates(prev => [payload.new as Tables['network_states']['Row'], ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setNetworkStates(prev => prev.map(ns => 
              ns.id === payload.new.id ? payload.new as Tables['network_states']['Row'] : ns
            ));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const establishPartnership = async (stateId1: string, stateId2: string) => {
    try {
      const state1 = networkStates.find(s => s.id === stateId1);
      const state2 = networkStates.find(s => s.id === stateId2);
      
      if (!state1 || !state2) return;

      // Update both states to include each other in partnerships
      const { error: error1 } = await supabase
        .from('network_states')
        .update({
          partnerships: [...state1.partnerships, state2.name],
          updated_at: new Date().toISOString(),
        })
        .eq('id', stateId1);

      const { error: error2 } = await supabase
        .from('network_states')
        .update({
          partnerships: [...state2.partnerships, state1.name],
          updated_at: new Date().toISOString(),
        })
        .eq('id', stateId2);

      if (error1 || error2) throw error1 || error2;
      
      toast.success('Partnership established successfully!');
    } catch (error) {
      console.error('Error establishing partnership:', error);
      toast.error('Failed to establish partnership');
    }
  };

  return {
    networkStates,
    loading,
    establishPartnership,
  };
}

export function useSupabaseAIAnalyses() {
  const [analyses, setAnalyses] = useState<Tables['ai_analyses']['Row'][]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalyses = async () => {
      try {
        const { data, error } = await supabase
          .from('ai_analyses')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setAnalyses(data || []);
      } catch (error) {
        console.error('Error fetching AI analyses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyses();
  }, []);

  const saveAnalysis = async (analysisData: {
    proposalId: string;
    economicImpact: number;
    citizenSentiment: number;
    implementationRisk: number;
    recommendation: string;
    confidence: number;
    reasoning: string[];
  }) => {
    try {
      const { data, error } = await supabase
        .from('ai_analyses')
        .insert({
          proposal_id: analysisData.proposalId,
          economic_impact: analysisData.economicImpact,
          citizen_sentiment: analysisData.citizenSentiment,
          implementation_risk: analysisData.implementationRisk,
          recommendation: analysisData.recommendation,
          confidence: analysisData.confidence,
          reasoning: analysisData.reasoning,
        })
        .select()
        .single();

      if (error) throw error;
      
      setAnalyses(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error saving analysis:', error);
      return null;
    }
  };

  return {
    analyses,
    loading,
    saveAnalysis,
  };
}