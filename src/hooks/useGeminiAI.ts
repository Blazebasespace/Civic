import { useState } from 'react';

export function useGeminiAI() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeProposal = async (proposalData: {
    title: string;
    description: string;
    category: string;
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Return mock analysis data instead of calling Gemini API
      return {
        id: `analysis-${Date.now()}`,
        title: proposalData.title,
        economicImpact: Math.floor(Math.random() * 40) + 60,
        citizenSentiment: Math.floor(Math.random() * 30) + 70,
        implementationRisk: Math.floor(Math.random() * 30) + 10,
        recommendation: 'approve' as const,
        confidence: Math.floor(Math.random() * 20) + 80,
        reasoning: [
          'Economic indicators show positive trends for this proposal',
          'Community engagement metrics are favorable',
          'Implementation complexity is within acceptable parameters'
        ]
      };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Analysis failed';
      setError(errorMessage);
      console.error('Analysis Error:', err);
      
      // Fallback analysis
      return {
        id: `analysis-${Date.now()}`,
        title: proposalData.title,
        economicImpact: 75,
        citizenSentiment: 80,
        implementationRisk: 20,
        recommendation: 'approve' as const,
        confidence: 85,
        reasoning: [
          'Analysis completed with fallback system',
          'Economic indicators show positive trends',
          'Community engagement metrics are favorable'
        ]
      };
    } finally {
      setIsLoading(false);
    }
  };

  const generateInsight = async (context: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Generate mock insight based on context
      const insights = [
        {
          title: "Optimize Governance Participation",
          description: "Current voting participation could be improved through gamification and incentive mechanisms. Consider implementing reputation-based rewards for active civic engagement.",
          impact: "high" as const,
          confidence: 88,
          category: "governance"
        },
        {
          title: "Economic Growth Opportunity",
          description: "Analysis suggests potential for economic expansion through strategic partnerships with neighboring network states. Focus on trade agreements and resource sharing.",
          impact: "medium" as const,
          confidence: 75,
          category: "economy"
        },
        {
          title: "Infrastructure Development Priority",
          description: "Digital infrastructure improvements could enhance citizen services and operational efficiency. Prioritize upgrading communication networks and data systems.",
          impact: "high" as const,
          confidence: 92,
          category: "infrastructure"
        },
        {
          title: "Social Cohesion Enhancement",
          description: "Community events and cultural initiatives show strong correlation with citizen satisfaction. Increase funding for social programs and community building activities.",
          impact: "medium" as const,
          confidence: 82,
          category: "social"
        }
      ];

      const randomInsight = insights[Math.floor(Math.random() * insights.length)];
      
      return {
        id: `insight-${Date.now()}`,
        type: 'recommendation' as const,
        title: randomInsight.title,
        description: randomInsight.description,
        confidence: randomInsight.confidence,
        impact: randomInsight.impact,
        category: randomInsight.category,
        timestamp: new Date()
      };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Insight generation failed';
      setError(errorMessage);
      console.error('Insight Generation Error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    analyzeProposal,
    generateInsight,
    isLoading,
    error
  };
}