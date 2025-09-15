import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Brain, TrendingUp, Beaker } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';

type BiomarkerRecord = {
  id: string;
  fluidType: string;
  biomarkers: any;
  predictions: any;
  createdAt: string;
};

type HealthInsight = {
  insight: string;
  type: 'positive' | 'warning' | 'neutral';
  icon: 'activity' | 'brain' | 'trending';
};

export function HealthInsights({ records }: { records: BiomarkerRecord[] }) {
  const [insights, setInsights] = useState<HealthInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const generateInsights = async () => {
      try {
        // Prepare the data for AI analysis
        const analysisData = records.map(record => ({
          type: record.fluidType,
          biomarkers: record.biomarkers,
          predictions: record.predictions,
          date: record.createdAt
        }));

        const response = await fetch('http://localhost:5000/api/ai/analyze-health', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ analysisData }),
        });

        if (!response.ok) {
          throw new Error('Failed to generate insights');
        }

        const data = await response.json();
        setInsights(data.insights);
      } catch (error) {
        console.error('Error generating insights:', error);
        // Fallback insights if AI analysis fails
        setInsights([
          {
            insight: "Continue regular health check-ups and maintain a balanced lifestyle.",
            type: "neutral",
            icon: "activity"
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    if (records.length > 0) {
      generateInsights();
    } else {
      setIsLoading(false);
    }
  }, [records]);

  const getIcon = (icon: string) => {
    switch (icon) {
      case 'activity':
        return <Activity className="w-6 h-6" />;
      case 'brain':
        return <Brain className="w-6 h-6" />;
      case 'trending':
        return <TrendingUp className="w-6 h-6" />;
      default:
        return <Activity className="w-6 h-6" />;
    }
  };

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'positive':
        return 'bg-green-500/10 border-green-500/20 text-green-400';
      case 'warning':
        return 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400';
      default:
        return 'bg-blue-500/10 border-blue-500/20 text-blue-400';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-zinc-900/60 backdrop-blur-sm border border-zinc-800 rounded-lg p-6 hover:border-fuchsia-500/50 transition-colors">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-fuchsia-500/10 rounded-lg">
            <Brain className="w-6 h-6 text-fuchsia-400 animate-pulse" />
          </div>
          <div>
            <p className="text-sm text-zinc-400">Generating Health Insights</p>
            <div className="w-5 h-5 border-2 border-fuchsia-500 border-t-transparent rounded-full animate-spin mt-2" />
          </div>
        </div>
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-zinc-900/60 backdrop-blur-sm border border-zinc-800 rounded-lg p-6 hover:border-fuchsia-500/50 transition-colors"
      >
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="p-4 bg-fuchsia-500/10 rounded-full">
            <Beaker className="w-8 h-8 text-fuchsia-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Start Your Health Journey</h3>
            <p className="text-zinc-400 mb-6">
              Get personalized health insights by analyzing your biomarkers. Choose from blood, saliva, urine, or CSF analysis.
            </p>
          </div>
          <Button
            onClick={() => setLocation('/home')}
            className="bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:from-fuchsia-600 hover:to-purple-700 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Start Analysis
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="bg-zinc-900/60 backdrop-blur-sm border border-zinc-800 rounded-lg p-6 hover:border-fuchsia-500/50 transition-colors">
      <div className="flex items-center space-x-4 mb-4">
        <div className="p-3 bg-fuchsia-500/10 rounded-lg">
          <Brain className="w-6 h-6 text-fuchsia-400" />
        </div>
        <div>
          <p className="text-sm text-zinc-400">AI Health Insights</p>
          <p className="text-lg font-semibold">Personalized Recommendations</p>
        </div>
      </div>
      
      <div className="space-y-4">
        {insights.map((insight, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-lg border ${getTypeStyles(insight.type)}`}
          >
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-lg bg-white/5">
                {getIcon(insight.icon)}
              </div>
              <p className="text-sm">{insight.insight}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 