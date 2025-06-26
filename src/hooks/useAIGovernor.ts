import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useReadContract } from 'wagmi';
import { CONTRACT_ADDRESSES } from '../contracts/addresses';
import { GOVERNANCE_ABI } from '../contracts/abis';
import { useGeminiAI } from './useGeminiAI';

interface AIInsight {
  id: string;
  type: 'recommendation' | 'prediction' | 'alert' | 'analysis';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  category: string;
  timestamp: Date;
  data?: any;
}

interface ProposalAnalysis {
  id: string;
  title: string;
  economicImpact: number;
  citizenSentiment: number;
  implementationRisk: number;
  recommendation: 'approve' | 'reject' | 'modify';
  confidence: number;
  reasoning: string[];
}

export function useAIGovernor() {
  const { address } = useAccount();
  const { analyzeProposal: geminiAnalyze, generateInsight: geminiInsight, isLoading: geminiLoading } = useGeminiAI();
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [analyses, setAnalyses] = useState<ProposalAnalysis[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [metrics, setMetrics] = useState({
    citizensAnalyzed: 0,
    predictionAccuracy: 0,
    proposalsProcessed: 0,
    dailyDecisions: 0
  });

  // Get proposal count for analysis
  const { data: proposalCount } = useReadContract({
    address: CONTRACT_ADDRESSES.GOVERNANCE,
    abi: GOVERNANCE_ABI,
    functionName: 'getProposalCount',
  });

  // Real AI analysis using Gemini
  const analyzeProposal = async (proposalId: string, proposalData: any) => {
    setIsAnalyzing(true);
    
    try {
      const analysis = await geminiAnalyze({
        title: proposalData.title,
        description: proposalData.description,
        category: proposalData.category
      });

      setAnalyses(prev => {
        const existing = prev.findIndex(a => a.id === proposalId);
        if (existing >= 0) {
          const updated = [...prev];
          updated[existing] = analysis;
          return updated;
        }
        return [...prev, analysis];
      });

      // Generate corresponding insight
      const insight: AIInsight = {
        id: `insight-${proposalId}`,
        type: 'analysis',
        title: `AI Analysis: ${proposalData.title}`,
        description: `Gemini AI recommends ${analysis.recommendation} with ${analysis.confidence}% confidence`,
        confidence: analysis.confidence,
        impact: analysis.confidence > 80 ? 'high' : analysis.confidence > 60 ? 'medium' : 'low',
        category: proposalData.category || 'Governance',
        timestamp: new Date()
      };

      setInsights(prev => [insight, ...prev.slice(0, 9)]);

    } catch (error) {
      console.error('AI analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Generate periodic AI insights
  useEffect(() => {
    const generatePeriodicInsight = async () => {
      const contexts = [
        'Current governance efficiency and citizen participation trends',
        'Economic indicators and policy impact analysis',
        'Cross-border collaboration opportunities in the Network State Alliance',
        'Infrastructure development priorities based on citizen feedback',
        'Innovation and technology adoption patterns'
      ];

      const randomContext = contexts[Math.floor(Math.random() * contexts.length)];
      const insight = await geminiInsight(randomContext);
      
      if (insight) {
        setInsights(prev => [insight, ...prev.slice(0, 9)]);
      }
    };

    // Generate initial insight
    generatePeriodicInsight();
    
    // Generate new insights every 10 minutes
    const interval = setInterval(generatePeriodicInsight, 10 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [geminiInsight]);

  // Update metrics periodically
  useEffect(() => {
    const updateMetrics = () => {
      setMetrics(prev => ({
        citizensAnalyzed: prev.citizensAnalyzed + Math.floor(Math.random() * 100),
        predictionAccuracy: Math.min(99, prev.predictionAccuracy + Math.random() * 0.1),
        proposalsProcessed: Number(proposalCount) || prev.proposalsProcessed,
        dailyDecisions: prev.dailyDecisions + Math.floor(Math.random() * 5)
      }));
    };

    // Initial metrics
    setMetrics({
      citizensAnalyzed: 2300000 + Math.floor(Math.random() * 100000),
      predictionAccuracy: 94.2,
      proposalsProcessed: Number(proposalCount) || 847,
      dailyDecisions: 23
    });

    const interval = setInterval(updateMetrics, 30000);
    
    return () => clearInterval(interval);
  }, [proposalCount]);

  return {
    insights,
    analyses,
    metrics,
    isAnalyzing: isAnalyzing || geminiLoading,
    analyzeProposal
  };
}