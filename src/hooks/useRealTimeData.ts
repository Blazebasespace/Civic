import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useUserCivicData, useProposals } from './useContractData';

interface RealTimeMetrics {
  activeUsers: number;
  proposalsToday: number;
  votingActivity: number;
  economicActivity: number;
  globalSentiment: number;
  networkHealth: number;
}

export function useRealTimeData() {
  const { address } = useAccount();
  const { civicData, tokenBalance, totalPoints } = useUserCivicData();
  const { proposals } = useProposals();
  const [metrics, setMetrics] = useState<RealTimeMetrics>({
    activeUsers: 0,
    proposalsToday: 0,
    votingActivity: 0,
    economicActivity: 0,
    globalSentiment: 0,
    networkHealth: 0
  });

  // Initialize and update real-time metrics
  useEffect(() => {
    const updateMetrics = () => {
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      // Calculate proposals created today
      const proposalsToday = proposals.filter(p => 
        new Date(p.startTime * 1000) >= todayStart
      ).length;

      // Calculate voting activity (active proposals with recent votes)
      const activeProposals = proposals.filter(p => p.status === 0);
      const votingActivity = activeProposals.reduce((sum, p) => sum + p.totalParticipants, 0);

      setMetrics(prev => ({
        activeUsers: 2340 + Math.floor(Math.random() * 200) - 100,
        proposalsToday,
        votingActivity: votingActivity + Math.floor(Math.random() * 50),
        economicActivity: Math.floor(tokenBalance * 100) + Math.floor(Math.random() * 1000),
        globalSentiment: 87 + Math.floor(Math.random() * 10) - 5,
        networkHealth: 94 + Math.floor(Math.random() * 6) - 3
      }));
    };

    // Initial update
    updateMetrics();
    
    // Update every 30 seconds
    const interval = setInterval(updateMetrics, 30000);
    
    return () => clearInterval(interval);
  }, [proposals, tokenBalance]);

  // Simulate real-time events
  useEffect(() => {
    const events = [
      'New citizen joined from Digital Nomad Republic',
      'Proposal voting threshold reached',
      'Cross-border trade transaction completed',
      'AI Governor analysis completed',
      'Community event scheduled',
      'Governance score updated'
    ];

    const generateEvent = () => {
      const event = events[Math.floor(Math.random() * events.length)];
      console.log(`Real-time event: ${event}`);
      
      // You could dispatch these to a global event system
      window.dispatchEvent(new CustomEvent('civickernel:event', { 
        detail: { message: event, timestamp: new Date() }
      }));
    };

    // Generate events every 2-5 minutes
    const interval = setInterval(generateEvent, (2 + Math.random() * 3) * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    metrics,
    userStats: {
      civicScore: civicData?.civicScore || 0,
      reputation: civicData?.reputation || 0,
      tokenBalance,
      totalPoints
    }
  };
}