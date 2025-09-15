import { useEffect, useRef } from 'react';

// Interface definitions
interface Star {
  x: number;
  y: number;
  z: number;
  radius: number;
  color: string;
  twinkle: number;
  twinkleSpeed: number;
}

interface Molecule {
  x: number;
  y: number;
  size: number;
  color: string;
  alpha: number;
  speed: number;
  angle: number;
  distance: number;
  originalDistance: number;
  type: 'blood' | 'saliva' | 'urine' | 'csf';
}

interface MolecularChain {
  startAngle: number;
  length: number;
  width: number;
  particles: Molecule[];
  color: string;
  rotationSpeed: number;
  type: 'blood' | 'saliva' | 'urine' | 'csf';
}

export function GalaxyAnimation({ onComplete }: { onComplete: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Complete animation after 8 seconds (or your desired duration)
    const timer = setTimeout(onComplete, 8000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasDimensions();
    window.addEventListener('resize', setCanvasDimensions);

    const stars: Star[] = [];
    const molecules: Molecule[] = [];
    const molecularChains: MolecularChain[] = [];

    // Biomarker theme colors
    const biomarkerColors = {
      blood: ['rgba(237, 29, 37, 0.7)', 'rgba(255, 89, 94, 0.7)'],  // Blood reds
      saliva: ['rgba(0, 163, 173, 0.7)', 'rgba(64, 224, 208, 0.7)'],  // Saliva teals
      urine: ['rgba(255, 196, 0, 0.7)', 'rgba(255, 153, 51, 0.7)'],   // Urine yellows
      csf: ['rgba(138, 43, 226, 0.7)', 'rgba(186, 85, 211, 0.7)']     // CSF purples
    };
    
    const starColors = [
      '#FFFFFF', '#F8F8FF', '#F5F5F5', '#FFFAFA', '#F0F8FF',
      '#F0FFFF', '#F5FFFA', '#FFFFF0'
    ];

    const initializeStars = () => {
      stars.length = 0; // Clear existing stars
      const starCount = Math.floor(window.innerWidth * window.innerHeight / 800); // Reduced star count
      for (let i = 0; i < starCount; i++) {
        const z = Math.random() * 2;
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          z: z,
          radius: Math.random() * 1.2 / z, // Smaller stars
          color: starColors[Math.floor(Math.random() * starColors.length)],
          twinkle: Math.random() * Math.PI * 2,
          twinkleSpeed: 0.01 + Math.random() * 0.03
        });
      }
    };

    const initializeMolecularChains = () => {
      molecularChains.length = 0; // Clear existing chains
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const chainCount = 4; // One for each biomarker type
      const types: Array<'blood' | 'saliva' | 'urine' | 'csf'> = ['blood', 'saliva', 'urine', 'csf'];
      
      for (let a = 0; a < chainCount; a++) {
        const startAngle = (a / chainCount) * Math.PI * 2;
        const chainLength = Math.min(canvas.width, canvas.height) * 0.4;
        const chainWidth = chainLength * 0.15;
        const particleCount = 200;
        const type = types[a];
        const chainColor = biomarkerColors[type][Math.floor(Math.random() * 2)];
        const rotationSpeed = 0.0001 + Math.random() * 0.0001; // Slower rotation
        const chainParticles: Molecule[] = [];
        
        for (let i = 0; i < particleCount; i++) {
          const distance = Math.random() * chainLength;
          const angle = startAngle + (distance / chainLength) * Math.PI * 0.5;
          const x = centerX + Math.sin(angle) * distance;
          const y = centerY + Math.cos(angle) * distance;
          const offsetX = (Math.random() - 0.5) * chainWidth * (distance / chainLength);
          const offsetY = (Math.random() - 0.5) * chainWidth * (distance / chainLength);
          chainParticles.push({
            x: x + offsetX, y: y + offsetY,
            size: 1 + Math.random() * 2, color: chainColor,
            alpha: 0.1 + Math.random() * 0.5, speed: 0.0005 + Math.random() * 0.001,
            angle: angle, distance: distance, originalDistance: distance,
            type: type
          });
        }
        
        molecularChains.push({
          startAngle, length: chainLength, width: chainWidth,
          particles: chainParticles, color: chainColor, rotationSpeed, type
        });
      }
    };

    const initializeMolecules = () => {
      molecules.length = 0; // Clear existing molecules
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const moleculeCount = 800; // Reduced count
      const types: Array<'blood' | 'saliva' | 'urine' | 'csf'> = ['blood', 'saliva', 'urine', 'csf'];
      
      for (let i = 0; i < moleculeCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * Math.min(canvas.width, canvas.height) * 0.45;
        const type = types[Math.floor(Math.random() * types.length)];
        const color = biomarkerColors[type][Math.floor(Math.random() * 2)];
        
        molecules.push({
          x: centerX + Math.sin(angle) * distance,
          y: centerY + Math.cos(angle) * distance,
          size: 0.5 + Math.random() * 1.5, // Smaller particles
          color: color,
          alpha: 0.2 + Math.random() * 0.5, // More subtle
          speed: 0.0005 + Math.random() * 0.001, // Slower movement
          angle: angle, distance: distance, originalDistance: distance,
          type: type
        });
      }
    };

    let animationFrameId: number;
    const animate = () => {
      // Dark background with subtle medical gradient
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width * 0.7
      );
      gradient.addColorStop(0, 'rgba(5, 10, 20, 0.9)');
      gradient.addColorStop(0.5, 'rgba(10, 15, 25, 0.95)');
      gradient.addColorStop(1, 'rgba(15, 20, 30, 1)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw stars with subtle twinkle
      stars.forEach(star => {
        const effectiveRadius = star.radius * (1 + Math.sin(star.twinkle) * 0.2);
        ctx.beginPath();
        ctx.arc(star.x, star.y, effectiveRadius, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = 0.4 + Math.abs(Math.sin(star.twinkle)) * 0.3; // More subtle twinkle
        ctx.fill();
        star.twinkle += star.twinkleSpeed;
      });
      ctx.globalAlpha = 1;

      // Draw molecular connections (subtle lines between some particles)
      ctx.lineWidth = 0.3;
      for (let i = 0; i < molecules.length; i += 20) { // Only connect some molecules
        const m1 = molecules[i];
        for (let j = i + 1; j < molecules.length && j < i + 5; j++) {
          const m2 = molecules[j];
          const dx = m2.x - m1.x;
          const dy = m2.y - m1.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 50 && m1.type === m2.type) { // Only connect nearby molecules of same type
            ctx.beginPath();
            ctx.moveTo(m1.x, m1.y);
            ctx.lineTo(m2.x, m2.y);
            ctx.strokeStyle = m1.color;
            ctx.globalAlpha = 0.1 * (1 - distance / 50);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;

      // Draw and update molecular chains
      molecularChains.forEach(chain => {
        chain.particles.forEach(p => {
          p.angle += chain.rotationSpeed; // Rotate particle around center
          p.x = canvas.width / 2 + Math.sin(p.angle) * p.distance;
          p.y = canvas.height / 2 + Math.cos(p.angle) * p.distance;
          
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.fill();
        });
      });
      ctx.globalAlpha = 1;

      // Draw and update molecules
      molecules.forEach(p => {
        p.angle += p.speed; // Rotate particle around center
        p.x = canvas.width / 2 + Math.sin(p.angle) * p.distance;
        p.y = canvas.height / 2 + Math.cos(p.angle) * p.distance;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha * 0.7; // More subtle
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      animationFrameId = requestAnimationFrame(animate);
    };

    initializeStars();
    initializeMolecularChains();
    initializeMolecules();
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', setCanvasDimensions);
    };
  }, []); // Empty dependency array ensures this runs once on mount and cleans up on unmount

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
      />
    </div>
  );
}