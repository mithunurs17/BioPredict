import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface FireParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  color: string;
}

export function SpaceGadaAnimation({ onComplete }: { onComplete: () => void }) {
  const [fireParticles, setFireParticles] = useState<FireParticle[]>([]);

  useEffect(() => {
    // Generate fire particles
    const colors = [
      '#FF4500', // Red-Orange
      '#FF8C00', // Dark Orange
      '#FFA500', // Orange
      '#FFD700', // Gold
      '#FF0000', // Red
    ];

    const initialParticles = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      opacity: Math.random() * 0.6 + 0.4,
      color: colors[Math.floor(Math.random() * colors.length)]
    }));
    setFireParticles(initialParticles);

    // Complete animation after 5 seconds
    const timer = setTimeout(onComplete, 5000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden">
      {/* Dark background with fire effect */}
      <div className="absolute inset-0">
        {/* Dark gradient background */}
        <div className="absolute inset-0 opacity-80"
          style={{
            background: 'radial-gradient(circle at center, #1a1a1a 0%, #000000 70%)',
          }}
        />

        {/* Fire particles */}
        {fireParticles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            initial={{ y: -20, opacity: 0 }}
            animate={{ 
              y: [0, 100],
              opacity: [particle.opacity, 0],
              scale: [1, 0.5],
            }}
            transition={{
              duration: Math.random() * 2 + 1,
              repeat: Infinity,
              ease: "easeOut",
              delay: Math.random() * 2,
            }}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              boxShadow: `
                0 0 ${particle.size * 2}px ${particle.color},
                0 0 ${particle.size * 4}px ${particle.color}80
              `,
            }}
          />
        ))}

        {/* Fire glow effect */}
        <div className="absolute inset-0 opacity-30"
          style={{
            background: `
              radial-gradient(circle at 50% 50%, rgba(255, 69, 0, 0.3) 0%, rgba(0, 0, 0, 0) 70%),
              radial-gradient(circle at 30% 30%, rgba(255, 140, 0, 0.2) 0%, rgba(0, 0, 0, 0) 60%),
              radial-gradient(circle at 70% 70%, rgba(255, 165, 0, 0.2) 0%, rgba(0, 0, 0, 0) 60%)
            `,
          }}
        />
      </div>

      {/* Central content container */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* Gada */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: 1, 
            opacity: 1,
            y: [0, -10, 0], // Gentle floating motion
            rotate: [-15, 15] // Swing back and forth
          }}
          transition={{
            duration: 1,
            ease: "easeOut",
            y: {
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            },
            rotate: {
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }
          }}
          className="relative"
        >
          <motion.div
            className="w-64 h-64"
          >
            <svg
              viewBox="0 0 100 200"
              className="w-full h-full"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Glow effects */}
              <defs>
                <radialGradient id="gadaGlow" cx="50%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="#FFD700" stopOpacity="1" />
                  <stop offset="40%" stopColor="#F4A460" stopOpacity="0.8" />
                  <stop offset="70%" stopColor="#B8860B" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#8B4513" stopOpacity="0.4" />
                </radialGradient>
                <linearGradient id="handleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8B4513" />
                  <stop offset="50%" stopColor="#A0522D" />
                  <stop offset="100%" stopColor="#8B4513" />
                </linearGradient>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <filter id="metallic" x="-10%" y="-10%" width="120%" height="120%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" result="noise" />
                  <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
                </filter>
              </defs>

              {/* Gada head - more detailed and realistic */}
              <g filter="url(#glow)">
                {/* Main head shape */}
                <path
                  d="M50 10 
                     L65 35 
                     L75 45 
                     L80 60 
                     L75 75 
                     L65 85 
                     L50 90 
                     L35 85 
                     L25 75 
                     L20 60 
                     L25 45 
                     L35 35 Z"
                  fill="url(#gadaGlow)"
                  stroke="#FFD700"
                  strokeWidth="2"
                  filter="url(#metallic)"
                />
                
                {/* Decorative patterns on head - more intricate */}
                <path
                  d="M50 20 L60 40 M50 20 L40 40 M50 30 L70 50 M50 30 L30 50
                     M50 50 L65 60 M50 50 L35 60 M50 60 L60 70 M50 60 L40 70"
                  stroke="#B8860B"
                  strokeWidth="1.5"
                  opacity="0.8"
                />
                
                {/* Enhanced spikes on head */}
                <path
                  d="M50 10 L55 5 M50 10 L45 5 M65 35 L70 30 M35 35 L30 30
                     M75 45 L80 40 M25 45 L20 40 M80 60 L85 60 M20 60 L15 60"
                  stroke="#FFD700"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                
                {/* Highlight reflections */}
                <path
                  d="M45 25 L55 35 M60 50 L50 60"
                  stroke="#FFFFFF"
                  strokeWidth="1"
                  opacity="0.7"
                  strokeLinecap="round"
                />
              </g>

              {/* Gada handle - more detailed */}
              <g>
                {/* Main handle */}
                <rect
                  x="45"
                  y="90"
                  width="10"
                  height="80"
                  fill="url(#handleGradient)"
                  stroke="#654321"
                  strokeWidth="2"
                />
                
                {/* Handle decorations - more detailed */}
                <path
                  d="M45 100 L55 100 M45 120 L55 120 M45 140 L55 140"
                  stroke="#654321"
                  strokeWidth="1.5"
                />
                
                {/* Handle grip patterns - more detailed */}
                <path
                  d="M45 110 L55 110 M45 130 L55 130 M45 150 L55 150
                     M47 105 L53 105 M47 115 L53 115 M47 125 L53 125 M47 135 L53 135 M47 145 L53 145 M47 155 L53 155"
                  stroke="#A0522D"
                  strokeWidth="0.8"
                  opacity="0.7"
                />
                
                {/* Handle texture */}
                <rect
                  x="46"
                  y="91"
                  width="8"
                  height="78"
                  fill="none"
                  stroke="#8B4513"
                  strokeWidth="0.3"
                  strokeDasharray="1,2"
                  opacity="0.5"
                />
                
                {/* Handle end cap - more ornate */}
                <path
                  d="M40 170 L60 170 L57 180 L43 180 Z"
                  fill="#654321"
                  stroke="#4B2F0F"
                  strokeWidth="1.5"
                />
                
                {/* End cap decoration */}
                <path
                  d="M43 172 L57 172 M45 175 L55 175 M47 178 L53 178"
                  stroke="#B8860B"
                  strokeWidth="0.5"
                  opacity="0.8"
                />
              </g>
            </svg>
          </motion.div>
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-8 text-center"
        >
          <motion.p
            className="text-white text-4xl font-semibold drop-shadow-lg"
            style={{
              fontFamily: "'Cinzel', serif",
              textShadow: "0 0 10px rgba(255, 215, 0, 0.5)",
              letterSpacing: "0.1em",
            }}
          >
            "He Always Protects Us"
          </motion.p>
        </motion.div>
      </div>

      {/* Add Cinzel font */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&display=swap');
        `}
      </style>
    </div>
  );
}