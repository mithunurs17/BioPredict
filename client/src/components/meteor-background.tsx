import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';

interface MeteorProps {
  size?: number;
  speed?: number;
  color?: string;
}

const COSMIC_COLORS = [
  // Deep space colors with more vibrant and varied tones
  'rgba(135, 206, 250, 0.7)',   // Light Sky Blue
  'rgba(70, 130, 180, 0.7)',    // Steel Blue
  'rgba(106, 90, 205, 0.7)',    // Slate Blue
  'rgba(173, 216, 230, 0.7)',   // Powder Blue
  'rgba(255, 160, 122, 0.7)',   // Light Salmon (warm tone)
  'rgba(188, 143, 143, 0.7)',   // Rosy Brown
  'rgba(220, 20, 60, 0.5)',     // Crimson (intense red)
  'rgba(255, 255, 224, 0.6)',   // Light Yellow
];

export function Meteor({ 
  size = 100, 
  speed = 10, 
  color = COSMIC_COLORS[0] 
}: MeteorProps) {
  // More dynamic and varied meteor characteristics
  const meteorWidth = Math.random() * 10 + 5; // Larger, more varied width
  const trailLength = Math.random() * 500 + 200; // Longer trails
  const angle = Math.random() * 360;
  const opacity = Math.random() * 0.8 + 0.2; // Varied opacity

  return (
    <div 
      className={cn(
        "pointer-events-none absolute",
        "animate-meteor",
        "transition-all duration-500 ease-in-out"
      )}
      style={{
        animationDuration: `${speed * 2}s`, // Slower, more natural movement
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * speed}s`,
        transform: `rotate(${angle}deg)`,
        opacity: opacity
      }}
    >
      {/* Meteor Head */}
      <span 
        className="absolute block rounded-full blur-sm" 
        style={{
          width: `${meteorWidth}px`,
          height: `${meteorWidth}px`,
          backgroundColor: color,
          boxShadow: `0 0 20px 5px ${color}`,
        }}
      />
      
      {/* Meteor Trail */}
      <span 
        className="absolute block" 
        style={{
          width: `${trailLength}px`,
          height: '2px', // Slightly thicker trail
          background: `linear-gradient(to right, ${color}, transparent)`,
          transform: 'translateX(-100%)',
          opacity: opacity / 2,
          filter: 'blur-sm' // Soft, blurred trail
        }}
      />
    </div>
  );
}

export function MeteorBackground() {
  const meteors = useMemo(() => {
    return Array.from({ length: 100 }).map((_, idx) => (
      <Meteor 
        key={idx} 
        size={Math.random() * 300 + 100} // Larger size range
        speed={Math.random() * 30 + 15} // More varied speed
        color={COSMIC_COLORS[Math.floor(Math.random() * COSMIC_COLORS.length)]}
      />
    ));
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden z-[-1] bg-gradient-to-b from-[#000010] via-[#00001a] to-[#000020] animate-background-shift">
      <div className="absolute inset-0 w-full h-full">
        {meteors}
      </div>
    </div>
  );
}
