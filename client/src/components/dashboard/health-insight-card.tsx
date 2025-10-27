import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { motion } from 'framer-motion';

export type InsightType = 'warning' | 'positive' | 'info' | 'tip';

export interface HealthInsight {
  title: string;
  text: string;
  type: InsightType;
  biomarkers?: string[];
}

interface HealthInsightCardProps {
  insight: HealthInsight;
  index?: number;
}

const insightStyles = {
  warning: {
    gradient: 'from-red-900/40 to-orange-900/40',
    border: 'border-red-800/50',
    icon: AlertTriangle,
    iconColor: 'text-red-400',
    textColor: 'text-red-100',
    descColor: 'text-red-300',
  },
  positive: {
    gradient: 'from-green-900/40 to-emerald-900/40',
    border: 'border-green-800/50',
    icon: CheckCircle,
    iconColor: 'text-green-400',
    textColor: 'text-green-100',
    descColor: 'text-green-300',
  },
  info: {
    gradient: 'from-blue-900/40 to-indigo-900/40',
    border: 'border-blue-800/50',
    icon: Info,
    iconColor: 'text-blue-400',
    textColor: 'text-blue-100',
    descColor: 'text-blue-300',
  },
  tip: {
    gradient: 'from-purple-900/40 to-fuchsia-900/40',
    border: 'border-purple-800/50',
    icon: Lightbulb,
    iconColor: 'text-purple-400',
    textColor: 'text-purple-100',
    descColor: 'text-purple-300',
  },
};

export function HealthInsightCard({ insight, index = 0 }: HealthInsightCardProps) {
  const style = insightStyles[insight.type];
  const Icon = style.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <Card 
        className={`bg-gradient-to-br ${style.gradient} ${style.border} backdrop-blur-sm hover:scale-105 transition-transform duration-300`}
        data-testid={`card-health-insight-${insight.type}`}
      >
        <CardHeader className="pb-3">
          <CardTitle className={`flex items-center text-lg ${style.textColor}`}>
            <div className={`p-2 rounded-full bg-black/20 mr-3`}>
              <Icon className={`w-5 h-5 ${style.iconColor}`} />
            </div>
            {insight.title}
          </CardTitle>
          {insight.biomarkers && insight.biomarkers.length > 0 && (
            <CardDescription className={`${style.descColor} text-xs`}>
              Related: {insight.biomarkers.join(', ')}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <p className={`text-sm ${style.descColor}`} data-testid="text-insight-content">
            {insight.text}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
