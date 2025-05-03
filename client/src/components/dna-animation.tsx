import { useEffect, useRef } from 'react';

export function DNAAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };
    
    setCanvasDimensions();
    window.addEventListener('resize', setCanvasDimensions);
    
    // Create a black background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // DNA properties
    const nucleotides = 20; // Number of nucleotide pairs
    const radius = canvas.width / 18; // Size of each nucleotide
    const spaceY = canvas.height / nucleotides; // Vertical spacing
    const amplitude = canvas.width / 5; // Width of the helix
    const frequency = 0.9; // Density of twists
    
    // Define vibrant neon color pairs for the nucleotides (base pairs)
    // Using colors from the reference image
    const colorPairs = [
      ['#ff00ff', '#00ffff'], // magenta-cyan
      ['#ff66ff', '#66ffff'], // light magenta-light cyan
      ['#aa00ff', '#00ffaa'], // purple-teal
      ['#ff3300', '#00ccff']  // orange-blue
    ];
    
    // Add particle system
    const particles: { x: number; y: number; radius: number; color: string; vx: number; vy: number; life: number; }[] = [];
    
    // Generate random particles
    const createParticles = () => {
      if (particles.length < 80) { // Limit particles for performance
        const colors = ['#ff00ff', '#00ffff', '#ffcc00', '#ff3300', '#aa00ff'];
        
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 2 + 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          life: Math.random() * 300 + 100
        });
      }
    };
    
    // Animation properties
    let rotation = 0;
    const rotationSpeed = 0.007;
    
    // Draw background with particles
    const drawBackground = () => {
      // Clear canvas with black background
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        // Update particle position
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        
        // Draw particle with glow effect
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 2);
        gradient.addColorStop(0, p.color);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.arc(p.x, p.y, p.radius * 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Remove dead particles
        if (p.life <= 0) {
          particles.splice(i, 1);
          i--;
        }
      }
      
      // Add new particles randomly
      if (Math.random() < 0.3) {
        createParticles();
      }
    };
    
    // Create glow effect
    const createGlow = (color: string, strength: number) => {
      ctx.shadowBlur = strength;
      ctx.shadowColor = color;
    };
    
    // Draw function
    const draw = () => {
      // Draw background with particles
      drawBackground();
      
      // Update rotation
      rotation += rotationSpeed;
      
      // Reset shadow for clean drawing
      ctx.shadowBlur = 0;
      
      // Draw DNA backbone (two strands)
      const backboneWidth = 6;
      ctx.lineWidth = backboneWidth;
      ctx.lineCap = 'round';
      
      // First backbone strand
      ctx.beginPath();
      createGlow('#ff00ff', 10);
      ctx.strokeStyle = '#ff00ff';
      for (let i = 0; i <= nucleotides; i += 0.1) {
        const y = i * spaceY;
        const x = Math.sin(i * frequency + rotation) * amplitude + canvas.width / 2;
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      
      // Second backbone strand
      ctx.beginPath();
      createGlow('#00ffff', 10);
      ctx.strokeStyle = '#00ffff';
      for (let i = 0; i <= nucleotides; i += 0.1) {
        const y = i * spaceY;
        const x = Math.sin(i * frequency + rotation + Math.PI) * amplitude + canvas.width / 2;
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      
      // Draw nucleotide pairs (connecting the backbones)
      for (let i = 0; i < nucleotides; i++) {
        const y = (i + 0.5) * spaceY;
        
        // Calculate positions on the two backbone strands
        const x1 = Math.sin(i * frequency + rotation) * amplitude + canvas.width / 2;
        const x2 = Math.sin(i * frequency + rotation + Math.PI) * amplitude + canvas.width / 2;
        
        // Choose a color pair for this nucleotide
        const colorIdx = i % colorPairs.length;
        
        // Draw connecting line with subtle glow
        ctx.beginPath();
        createGlow('#ffffff', 3);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1.5;
        ctx.moveTo(x1, y);
        ctx.lineTo(x2, y);
        ctx.stroke();
        
        // Calculate pulse effect based on rotation (optional)
        const pulse = Math.sin(rotation * 5 + i * 0.5) * 0.2 + 0.8;
        
        // Draw nucleotides (circles at each end)
        const nucleotideSize = radius * 0.6 * pulse;
        
        // First nucleotide
        ctx.beginPath();
        createGlow(colorPairs[colorIdx][0], 15);
        ctx.arc(x1, y, nucleotideSize, 0, Math.PI * 2);
        ctx.fillStyle = colorPairs[colorIdx][0] + '60';
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = colorPairs[colorIdx][0];
        ctx.stroke();
        
        // Second nucleotide
        ctx.beginPath();
        createGlow(colorPairs[colorIdx][1], 15);
        ctx.arc(x2, y, nucleotideSize, 0, Math.PI * 2);
        ctx.fillStyle = colorPairs[colorIdx][1] + '60';
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = colorPairs[colorIdx][1];
        ctx.stroke();
      }
      
      // Reset shadow
      ctx.shadowBlur = 0;
      
      // Request next frame
      requestAnimationFrame(draw);
    };
    
    // Initialize with some particles
    for (let i = 0; i < 40; i++) {
      createParticles();
    }
    
    // Start animation
    draw();
    
    // Clean up
    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
    };
  }, []);
  
  return (
    <div className="relative w-full h-full bg-black">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full"
      />
    </div>
  );
}