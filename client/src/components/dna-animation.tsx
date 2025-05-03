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
    
    // DNA properties
    const nucleotides = 18; // Number of nucleotide pairs
    const radius = canvas.width / 20; // Size of each nucleotide
    const spaceY = canvas.height / nucleotides; // Vertical spacing
    const amplitude = canvas.width / 6; // Width of the helix
    const frequency = 0.8; // Density of twists
    
    // Define color pairs for the nucleotides (base pairs)
    const colorPairs = [
      ['#3b82f6', '#ef4444'], // blue-red (A-T)
      ['#10b981', '#f97316']  // green-orange (G-C)
    ];
    
    // Animation properties
    let rotation = 0;
    const rotationSpeed = 0.01;
    
    // Draw function
    const draw = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update rotation
      rotation += rotationSpeed;
      
      // Draw DNA backbone (two strands)
      const backboneWidth = 8;
      ctx.lineWidth = backboneWidth;
      ctx.lineCap = 'round';
      
      // First backbone strand
      ctx.beginPath();
      ctx.strokeStyle = 'hsl(var(--primary))';
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
      ctx.strokeStyle = 'hsl(var(--primary))';
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
        
        // Draw connecting line
        ctx.beginPath();
        ctx.strokeStyle = '#ffffff30';
        ctx.lineWidth = 3;
        ctx.moveTo(x1, y);
        ctx.lineTo(x2, y);
        ctx.stroke();
        
        // Draw nucleotides (circles at each end)
        const nucleotideSize = radius * 0.7;
        
        // First nucleotide
        ctx.beginPath();
        ctx.arc(x1, y, nucleotideSize, 0, Math.PI * 2);
        ctx.fillStyle = colorPairs[colorIdx][0] + '60';
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = colorPairs[colorIdx][0];
        ctx.stroke();
        
        // Second nucleotide
        ctx.beginPath();
        ctx.arc(x2, y, nucleotideSize, 0, Math.PI * 2);
        ctx.fillStyle = colorPairs[colorIdx][1] + '60';
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = colorPairs[colorIdx][1];
        ctx.stroke();
      }
      
      // Request next frame
      requestAnimationFrame(draw);
    };
    
    // Start animation
    draw();
    
    // Clean up
    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-full opacity-90"
      style={{ filter: 'blur(0.5px)' }}
    />
  );
}