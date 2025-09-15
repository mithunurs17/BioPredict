import { useEffect, useRef } from 'react';



export function MolecularVisualization({ onComplete }: { onComplete?: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    // Complete animation after 8 seconds if onComplete is provided
    const timer = onComplete ? setTimeout(onComplete, 8000) : null;
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [onComplete]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasDimensions();
    window.addEventListener('resize', setCanvasDimensions);

    // Biomarker theme colors from CSS variables
    const biomarkerColors = {
      blood: ['rgba(237, 29, 37, 0.8)', 'rgba(255, 89, 94, 0.8)'],  // Blood reds
      saliva: ['rgba(0, 163, 173, 0.8)', 'rgba(64, 224, 208, 0.8)'],  // Saliva teals
      urine: ['rgba(255, 196, 0, 0.8)', 'rgba(255, 153, 51, 0.8)'],   // Urine yellows
      csf: ['rgba(138, 43, 226, 0.8)', 'rgba(186, 85, 211, 0.8)']     // CSF purples
    };

    // AI node color
    const aiNodeColor = 'rgba(41, 121, 255, 0.9)';
    const aiGlowColor = 'rgba(41, 121, 255, 0.4)';

    // Define entities
    interface Node {
      id: string;
      x: number;
      y: number;
      radius: number;
      color: string;
      glowColor: string;
      glowRadius: number;
      type: 'biomarker' | 'ai' | 'disease';
      biomarkerType?: 'blood' | 'saliva' | 'urine' | 'csf';
      vx: number;
      vy: number;
      connections: string[];
      pulsePhase: number;
      pulseSpeed: number;
      label?: string;
    }

    interface Connection {
      from: string;
      to: string;
      strength: number;
      color: string;
      dashOffset: number;
      active: boolean;
      pulsePosition: number;
      pulseSpeed: number;
    }

    interface DataParticle {
      x: number;
      y: number;
      targetNodeId: string;
      color: string;
      radius: number;
      speed: number;
      progress: number;
      active: boolean;
    }

    // Create nodes
    const nodes: Node[] = [];
    const connections: Connection[] = [];
    const dataParticles: DataParticle[] = [];

    // Create central AI node
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Add AI node at center
    nodes.push({
      id: 'ai',
      x: centerX,
      y: centerY,
      radius: 40,
      color: aiNodeColor,
      glowColor: aiGlowColor,
      glowRadius: 60,
      type: 'ai',
      vx: 0,
      vy: 0,
      connections: [],
      pulsePhase: 0,
      pulseSpeed: 0.03,
      label: 'AI'
    });

    // Add biomarker nodes
    const biomarkerTypes: Array<'blood' | 'saliva' | 'urine' | 'csf'> = ['blood', 'saliva', 'urine', 'csf'];
    const biomarkerLabels = {
      blood: 'Blood',
      saliva: 'Saliva',
      urine: 'Urine',
      csf: 'CSF'
    };
    
    // Position biomarker nodes in a circle around AI node
    const radius = Math.min(canvas.width, canvas.height) * 0.25;
    biomarkerTypes.forEach((type, index) => {
      const angle = (index / biomarkerTypes.length) * Math.PI * 2;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      const colorIdx = Math.floor(Math.random() * 2);
      
      nodes.push({
        id: type,
        x,
        y,
        radius: 30,
        color: biomarkerColors[type][colorIdx],
        glowColor: biomarkerColors[type][colorIdx].replace('0.8', '0.3'),
        glowRadius: 45,
        type: 'biomarker',
        biomarkerType: type,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        connections: ['ai'],
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.01,
        label: biomarkerLabels[type]
      });
      
      // Connect to AI node
      connections.push({
        from: type,
        to: 'ai',
        strength: 0.8,
        color: biomarkerColors[type][colorIdx],
        dashOffset: 0,
        active: true,
        pulsePosition: 0,
        pulseSpeed: 0.005 + Math.random() * 0.002
      });
    });

    // Add disease detection nodes
    const diseases = [
      { id: 'diabetes', label: 'Diabetes' },
      { id: 'alzheimers', label: 'Alzheimer\'s' },
      { id: 'kidney', label: 'Kidney Disease' },
      { id: 'cancer', label: 'Cancer' }
    ];
    
    // Position disease nodes in outer circle
    const diseaseRadius = radius * 1.8;
    diseases.forEach((disease, index) => {
      const angle = ((index / diseases.length) * Math.PI * 2) + (Math.PI / diseases.length);
      const x = centerX + Math.cos(angle) * diseaseRadius;
      const y = centerY + Math.sin(angle) * diseaseRadius;
      
      nodes.push({
        id: disease.id,
        x,
        y,
        radius: 25,
        color: 'rgba(255, 255, 255, 0.8)',
        glowColor: 'rgba(255, 255, 255, 0.3)',
        glowRadius: 35,
        type: 'disease',
        vx: (Math.random() - 0.5) * 0.1,
        vy: (Math.random() - 0.5) * 0.1,
        connections: ['ai'],
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.01 + Math.random() * 0.01,
        label: disease.label
      });
      
      // Connect to AI node
      connections.push({
        from: disease.id,
        to: 'ai',
        strength: 0.6,
        color: 'rgba(255, 255, 255, 0.6)',
        dashOffset: 0,
        active: true,
        pulsePosition: 0,
        pulseSpeed: 0.003 + Math.random() * 0.002
      });
    });

    // Generate data particles periodically
    const generateDataParticle = () => {
      if (dataParticles.length > 100) return; // Limit particles for performance
      
      // Randomly select source (biomarker) and target (AI or disease)
      const sourceTypes = nodes.filter(n => n.type === 'biomarker');
      const source = sourceTypes[Math.floor(Math.random() * sourceTypes.length)];
      
      let target;
      if (Math.random() > 0.3) {
        // 70% chance to go to AI
        target = nodes.find(n => n.id === 'ai');
      } else {
        // 30% chance to go to a disease node
        const diseaseNodes = nodes.filter(n => n.type === 'disease');
        target = diseaseNodes[Math.floor(Math.random() * diseaseNodes.length)];
      }
      
      if (!source || !target) return;
      
      dataParticles.push({
        x: source.x,
        y: source.y,
        targetNodeId: target.id,
        color: source.color,
        radius: 2 + Math.random() * 3,
        speed: 0.01 + Math.random() * 0.02,
        progress: 0,
        active: true
      });
    };

    // Animation loop
    const animate = () => {
      // Clear canvas with gradient background
      const gradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, canvas.width
      );
      gradient.addColorStop(0, 'rgba(10, 15, 30, 1)');
      gradient.addColorStop(1, 'rgba(5, 10, 20, 1)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw connections
      connections.forEach(conn => {
        const sourceNode = nodes.find(n => n.id === conn.from);
        const targetNode = nodes.find(n => n.id === conn.to);
        
        if (sourceNode && targetNode) {
          // Draw connection line
          ctx.beginPath();
          ctx.strokeStyle = conn.color;
          ctx.lineWidth = 2;
          
          // Create dashed line effect
          ctx.setLineDash([5, 10]);
          ctx.lineDashOffset = conn.dashOffset;
          conn.dashOffset -= 0.5; // Animate dash
          
          ctx.moveTo(sourceNode.x, sourceNode.y);
          ctx.lineTo(targetNode.x, targetNode.y);
          ctx.stroke();
          ctx.setLineDash([]);
          
          // Draw pulse along connection
          if (conn.active) {
            const dx = targetNode.x - sourceNode.x;
            const dy = targetNode.y - sourceNode.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Calculate position along the line
            const pulseX = sourceNode.x + dx * conn.pulsePosition;
            const pulseY = sourceNode.y + dy * conn.pulsePosition;
            
            // Draw pulse
            ctx.beginPath();
            const pulseGradient = ctx.createRadialGradient(
              pulseX, pulseY, 0,
              pulseX, pulseY, 10
            );
            pulseGradient.addColorStop(0, conn.color);
            pulseGradient.addColorStop(1, 'transparent');
            
            ctx.fillStyle = pulseGradient;
            ctx.arc(pulseX, pulseY, 10, 0, Math.PI * 2);
            ctx.fill();
            
            // Update pulse position
            conn.pulsePosition += conn.pulseSpeed;
            if (conn.pulsePosition > 1) {
              conn.pulsePosition = 0;
            }
          }
        }
      });
      
      // Update and draw nodes
      nodes.forEach(node => {
        // Apply subtle movement
        node.x += node.vx;
        node.y += node.vy;
        
        // Boundary check and bounce
        if (node.x < node.radius || node.x > canvas.width - node.radius) {
          node.vx *= -1;
        }
        if (node.y < node.radius || node.y > canvas.height - node.radius) {
          node.vy *= -1;
        }
        
        // Keep nodes within bounds
        node.x = Math.max(node.radius, Math.min(canvas.width - node.radius, node.x));
        node.y = Math.max(node.radius, Math.min(canvas.height - node.radius, node.y));
        
        // Calculate pulse effect
        node.pulsePhase += node.pulseSpeed;
        const pulseFactor = 1 + Math.sin(node.pulsePhase) * 0.2;
        
        // Draw node glow
        const glowGradient = ctx.createRadialGradient(
          node.x, node.y, node.radius * 0.8,
          node.x, node.y, node.glowRadius * pulseFactor
        );
        glowGradient.addColorStop(0, node.glowColor);
        glowGradient.addColorStop(1, 'transparent');
        
        ctx.beginPath();
        ctx.fillStyle = glowGradient;
        ctx.arc(node.x, node.y, node.glowRadius * pulseFactor, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw node
        ctx.beginPath();
        ctx.fillStyle = node.color;
        ctx.arc(node.x, node.y, node.radius * pulseFactor, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw node border
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 2;
        ctx.arc(node.x, node.y, node.radius * pulseFactor, 0, Math.PI * 2);
        ctx.stroke();
        
        // Draw node label
        if (node.label) {
          ctx.font = '16px Arial';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(node.label, node.x, node.y);
        }
      });
      
      // Update and draw data particles
      for (let i = 0; i < dataParticles.length; i++) {
        const particle = dataParticles[i];
        const targetNode = nodes.find(n => n.id === particle.targetNodeId);
        
        if (targetNode && particle.active) {
          // Calculate direction to target
          const dx = targetNode.x - particle.x;
          const dy = targetNode.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Move particle towards target
          particle.progress += particle.speed;
          particle.x = particle.x + (dx * particle.speed);
          particle.y = particle.y + (dy * particle.speed);
          
          // Draw particle with glow
          const particleGradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, particle.radius * 2
          );
          particleGradient.addColorStop(0, particle.color);
          particleGradient.addColorStop(1, 'transparent');
          
          ctx.beginPath();
          ctx.fillStyle = particleGradient;
          ctx.arc(particle.x, particle.y, particle.radius * 2, 0, Math.PI * 2);
          ctx.fill();
          
          // Check if particle reached target
          if (distance < targetNode.radius) {
            // Create absorption effect
            ctx.beginPath();
            const absorbGradient = ctx.createRadialGradient(
              targetNode.x, targetNode.y, 0,
              targetNode.x, targetNode.y, targetNode.radius * 1.5
            );
            absorbGradient.addColorStop(0, particle.color);
            absorbGradient.addColorStop(1, 'transparent');
            
            ctx.fillStyle = absorbGradient;
            ctx.arc(targetNode.x, targetNode.y, targetNode.radius * 1.5, 0, Math.PI * 2);
            ctx.fill();
            
            // Remove particle
            particle.active = false;
            dataParticles.splice(i, 1);
            i--;
          }
        }
      }
      
      // Randomly generate new data particles
      if (Math.random() < 0.1) {
        generateDataParticle();
      }
      
      requestAnimationFrame(animate);
    };
    
    // Start animation
    animate();
    
    // Generate initial data particles
    for (let i = 0; i < 20; i++) {
      generateDataParticle();
    }
    
    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
      />
    </div>
  );
}