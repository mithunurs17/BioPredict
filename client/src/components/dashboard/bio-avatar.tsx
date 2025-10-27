import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';

interface BioAvatarProps {
  healthScore?: number; // 0-100
  riskLevel?: 'low' | 'medium' | 'high';
}

export function BioAvatar({ healthScore = 75, riskLevel = 'low' }: BioAvatarProps) {
  // Determine orb color based on health score
  const getOrbColor = () => {
    if (healthScore >= 80) return 'from-green-400 to-emerald-600';
    if (healthScore >= 60) return 'from-yellow-400 to-orange-500';
    return 'from-red-400 to-rose-600';
  };

  const getGlowColor = () => {
    if (healthScore >= 80) return 'shadow-green-500/50';
    if (healthScore >= 60) return 'shadow-yellow-500/50';
    return 'shadow-red-500/50';
  };

  const getRiskColor = () => {
    if (riskLevel === 'low') return 'text-green-400';
    if (riskLevel === 'medium') return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <Card className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border-indigo-800/50 backdrop-blur-sm" data-testid="card-bio-avatar">
      <CardHeader>
        <CardTitle className="flex items-center text-xl text-indigo-100">
          <Heart className="w-5 h-5 mr-2 text-pink-400" />
          Your Bio-Avatar
        </CardTitle>
        <CardDescription className="text-indigo-300">
          Real-time health visualization
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-6">
        {/* 3D-like orb with CSS */}
        <div className="relative w-48 h-48 flex items-center justify-center">
          {/* Outer glow rings */}
          <motion.div
            className={`absolute w-full h-full rounded-full bg-gradient-to-br ${getOrbColor()} opacity-20 blur-2xl`}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          
          {/* Middle ring */}
          <motion.div
            className={`absolute w-40 h-40 rounded-full bg-gradient-to-br ${getOrbColor()} opacity-30 blur-xl`}
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.3, 0.4, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          />
          
          {/* Main orb */}
          <motion.div
            className={`relative w-32 h-32 rounded-full bg-gradient-to-br ${getOrbColor()} shadow-2xl ${getGlowColor()}`}
            animate={{
              scale: [1, 1.05, 1],
              boxShadow: [
                `0 0 40px ${healthScore >= 80 ? '#10b981' : healthScore >= 60 ? '#eab308' : '#ef4444'}`,
                `0 0 60px ${healthScore >= 80 ? '#10b981' : healthScore >= 60 ? '#eab308' : '#ef4444'}`,
                `0 0 40px ${healthScore >= 80 ? '#10b981' : healthScore >= 60 ? '#eab308' : '#ef4444'}`,
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            data-testid="div-bio-orb"
          >
            {/* Light reflection */}
            <div className="absolute top-4 left-6 w-12 h-12 rounded-full bg-white/30 blur-xl" />
            
            {/* Health score in center */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold text-white" data-testid="text-health-score">
                  {healthScore}
                </div>
                <div className="text-xs text-white/80">Health</div>
              </div>
            </div>
          </motion.div>

          {/* Floating particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-2 h-2 rounded-full bg-gradient-to-br ${getOrbColor()}`}
              style={{
                left: `${50 + Math.cos((i * Math.PI * 2) / 6) * 40}%`,
                top: `${50 + Math.sin((i * Math.PI * 2) / 6) * 40}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 2 + i * 0.3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.2,
              }}
            />
          ))}
        </div>

        {/* Stats */}
        <div className="w-full space-y-2">
          <div className="flex justify-between items-center p-3 bg-black/20 rounded-lg">
            <span className="text-sm text-indigo-300">Risk Level</span>
            <span className={`text-sm font-semibold ${getRiskColor()}`} data-testid="text-risk-level">
              {riskLevel.toUpperCase()}
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-black/20 rounded-lg">
            <span className="text-sm text-indigo-300">Overall Status</span>
            <span className="text-sm font-semibold text-indigo-200">
              {healthScore >= 80 ? 'Excellent' : healthScore >= 60 ? 'Good' : 'Needs Attention'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
