import { useState, useEffect } from 'react';

interface NetworkState {
  id: string;
  name: string;
  flag: string;
  population: number;
  gdp: number;
  governanceScore: number;
  innovationIndex: number;
  location: string;
  established: string;
  status: 'active' | 'developing' | 'planning';
  specialties: string[];
  partnerships: string[];
  color: string;
}

interface GlobalMetric {
  label: string;
  value: string;
  change: string;
  icon: React.ComponentType<any>;
  color: string;
}

interface AllianceActivity {
  id: string;
  type: 'partnership' | 'governance' | 'innovation';
  title: string;
  description: string;
  timestamp: string;
  participants: string[] | string;
}

export function useGlobalNetwork() {
  const [networkStates, setNetworkStates] = useState<NetworkState[]>([]);
  const [globalMetrics, setGlobalMetrics] = useState<any>({});
  const [recentActivities, setRecentActivities] = useState<AllianceActivity[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialize network states with dynamic data
  useEffect(() => {
    const initializeStates = async () => {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const states: NetworkState[] = [
        {
          id: 'infinita',
          name: 'Infinita City',
          flag: '🏙️',
          population: 45000 + Math.floor(Math.random() * 5000),
          gdp: 2.3 + Math.random() * 0.5,
          governanceScore: 94 + Math.floor(Math.random() * 6),
          innovationIndex: 87 + Math.floor(Math.random() * 10),
          location: 'Caribbean',
          established: '2023',
          status: 'active',
          specialties: ['AI Governance', 'Sustainable Tech', 'Digital Finance'],
          partnerships: ['Próspera', 'Zuzalu', 'Digital Nomad Republic'],
          color: 'from-blue-500 to-cyan-500'
        },
        {
          id: 'prospera',
          name: 'Próspera',
          flag: '🏛️',
          population: 12000 + Math.floor(Math.random() * 2000),
          gdp: 0.8 + Math.random() * 0.3,
          governanceScore: 91 + Math.floor(Math.random() * 8),
          innovationIndex: 82 + Math.floor(Math.random() * 15),
          location: 'Honduras',
          established: '2020',
          status: 'active',
          specialties: ['Charter City', 'Economic Freedom', 'Regulatory Innovation'],
          partnerships: ['Infinita City', 'Nueva Libertad'],
          color: 'from-green-500 to-emerald-500'
        },
        {
          id: 'zuzalu',
          name: 'Zuzalu',
          flag: '🌊',
          population: 8500 + Math.floor(Math.random() * 1500),
          gdp: 0.4 + Math.random() * 0.2,
          governanceScore: 88 + Math.floor(Math.random() * 10),
          innovationIndex: 95 + Math.floor(Math.random() * 5),
          location: 'Montenegro',
          established: '2023',
          status: 'active',
          specialties: ['Research', 'Longevity', 'Crypto Innovation'],
          partnerships: ['Infinita City', 'Digital Nomad Republic'],
          color: 'from-purple-500 to-pink-500'
        },
        {
          id: 'nueva',
          name: 'Nueva Libertad',
          flag: '🗽',
          population: 23000 + Math.floor(Math.random() * 3000),
          gdp: 1.2 + Math.random() * 0.4,
          governanceScore: 89 + Math.floor(Math.random() * 9),
          innovationIndex: 78 + Math.floor(Math.random() * 18),
          location: 'Chile',
          established: '2022',
          status: 'active',
          specialties: ['Mining Tech', 'Renewable Energy', 'Space Industry'],
          partnerships: ['Próspera', 'Aurora Station'],
          color: 'from-orange-500 to-red-500'
        },
        {
          id: 'digital',
          name: 'Digital Nomad Republic',
          flag: '🌐',
          population: 67000 + Math.floor(Math.random() * 8000),
          gdp: 3.1 + Math.random() * 0.7,
          governanceScore: 85 + Math.floor(Math.random() * 12),
          innovationIndex: 92 + Math.floor(Math.random() * 8),
          location: 'Distributed',
          established: '2021',
          status: 'active',
          specialties: ['Remote Work', 'Digital Services', 'Global Mobility'],
          partnerships: ['Infinita City', 'Zuzalu', 'Aurora Station'],
          color: 'from-teal-500 to-blue-500'
        },
        {
          id: 'aurora',
          name: 'Aurora Station',
          flag: '🚀',
          population: 150 + Math.floor(Math.random() * 50),
          gdp: 0.05 + Math.random() * 0.02,
          governanceScore: 76 + Math.floor(Math.random() * 20),
          innovationIndex: 98 + Math.floor(Math.random() * 2),
          location: 'Low Earth Orbit',
          established: '2024',
          status: 'developing',
          specialties: ['Space Governance', 'Zero-G Manufacturing', 'Orbital Research'],
          partnerships: ['Nueva Libertad', 'Digital Nomad Republic'],
          color: 'from-indigo-500 to-purple-500'
        }
      ];
      
      setNetworkStates(states);
      
      // Calculate global metrics
      const totalCitizens = states.reduce((sum, state) => sum + state.population, 0);
      const totalGDP = states.reduce((sum, state) => sum + state.gdp, 0);
      const avgGovernance = states.reduce((sum, state) => sum + state.governanceScore, 0) / states.length;
      const avgInnovation = states.reduce((sum, state) => sum + state.innovationIndex, 0) / states.length;
      
      setGlobalMetrics({
        totalCitizens: `${(totalCitizens / 1000).toFixed(1)}K`,
        totalGDP: `$${totalGDP.toFixed(2)}B`,
        activePartnerships: states.reduce((sum, state) => sum + state.partnerships.length, 0),
        innovationScore: avgInnovation.toFixed(1)
      });
      
      setLoading(false);
    };

    initializeStates();
  }, []);

  // Generate periodic activities
  useEffect(() => {
    const generateActivity = () => {
      const activities = [
        {
          type: 'partnership' as const,
          title: 'New Trade Agreement Signed',
          description: 'Bilateral trade agreement reducing tariffs and enabling seamless citizen mobility',
          participants: ['Infinita City', 'Próspera']
        },
        {
          type: 'governance' as const,
          title: 'Cross-Border Governance Protocol Updated',
          description: 'Enhanced voting rights protocol now active across alliance members',
          participants: 'All Active States'
        },
        {
          type: 'innovation' as const,
          title: 'Joint Research Initiative Launched',
          description: 'Multi-state collaboration on sustainable technology with significant funding',
          participants: ['Zuzalu', 'Nueva Libertad', 'Aurora Station']
        }
      ];

      const randomActivity = activities[Math.floor(Math.random() * activities.length)];
      const timeAgo = Math.floor(Math.random() * 24) + 1;
      
      const newActivity: AllianceActivity = {
        id: `activity-${Date.now()}`,
        type: randomActivity.type,
        title: randomActivity.title,
        description: randomActivity.description,
        timestamp: `${timeAgo} hours ago`,
        participants: randomActivity.participants
      };

      setRecentActivities(prev => [newActivity, ...prev.slice(0, 4)]); // Keep last 5 activities
    };

    // Generate initial activities
    const initialActivities: AllianceActivity[] = [
      {
        id: '1',
        type: 'partnership',
        title: 'New Trade Agreement: Infinita City ↔ Próspera',
        description: 'Bilateral trade agreement reducing tariffs by 95% and enabling seamless citizen mobility',
        timestamp: '2 hours ago',
        participants: ['Infinita City', 'Próspera']
      },
      {
        id: '2',
        type: 'governance',
        title: 'Cross-Border Governance Protocol Adopted',
        description: 'Universal voting rights protocol now active across 5 Network States',
        timestamp: '6 hours ago',
        participants: 'All Active States'
      }
    ];
    
    setRecentActivities(initialActivities);
    
    // Generate new activities every 10 minutes
    const interval = setInterval(generateActivity, 10 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Update metrics periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setNetworkStates(prev => prev.map(state => ({
        ...state,
        population: state.population + Math.floor(Math.random() * 10) - 5,
        governanceScore: Math.min(100, Math.max(0, state.governanceScore + (Math.random() - 0.5) * 2)),
        innovationIndex: Math.min(100, Math.max(0, state.innovationIndex + (Math.random() - 0.5) * 2))
      })));
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const establishPartnership = async (stateId1: string, stateId2: string) => {
    // Simulate API call to establish partnership
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setNetworkStates(prev => prev.map(state => {
      if (state.id === stateId1) {
        const partner = prev.find(s => s.id === stateId2);
        if (partner && !state.partnerships.includes(partner.name)) {
          return { ...state, partnerships: [...state.partnerships, partner.name] };
        }
      }
      if (state.id === stateId2) {
        const partner = prev.find(s => s.id === stateId1);
        if (partner && !state.partnerships.includes(partner.name)) {
          return { ...state, partnerships: [...state.partnerships, partner.name] };
        }
      }
      return state;
    }));

    // Add activity
    const state1 = networkStates.find(s => s.id === stateId1);
    const state2 = networkStates.find(s => s.id === stateId2);
    
    if (state1 && state2) {
      const newActivity: AllianceActivity = {
        id: `partnership-${Date.now()}`,
        type: 'partnership',
        title: `New Partnership: ${state1.name} ↔ ${state2.name}`,
        description: 'Strategic alliance established for mutual cooperation and citizen benefits',
        timestamp: 'Just now',
        participants: [state1.name, state2.name]
      };
      
      setRecentActivities(prev => [newActivity, ...prev.slice(0, 4)]);
    }
  };

  return {
    networkStates,
    globalMetrics,
    recentActivities,
    loading,
    establishPartnership
  };
}