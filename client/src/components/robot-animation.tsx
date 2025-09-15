import { useEffect, useRef } from 'react';

export function RobotAnimation({ onComplete }: { onComplete?: () => void }) {
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

    // Theme colors
    const colors = {
      background: '#0a0f1e',
      robotBody: '#2a2a2a',
      robotAccent: '#3b82f6', // Blue
      robotEyes: '#f472b6', // Pink
      robotGlow: 'rgba(59, 130, 246, 0.3)', // Blue glow
      objectGlow: 'rgba(244, 114, 182, 0.3)', // Pink glow
      // Biomarker colors
      blood: '#ed1d25',
      saliva: '#00a3ad',
      urine: '#ffc400',
      csf: '#8a2be2'
    };

    // Animation properties
    let frame = 0;
    let objectRotation = 0;
    let robotArmAngle = 0;
    let robotEyeSize = 1;
    let robotHoverOffset = 0;
    let speechBubbleSize = 0;
    let speechBubbleOpacity = 0;
    let textOpacity = 0;
    
    // Timing for animation sequence
    const timings = {
      robotAppear: 60,
      armExtend: 120,
      objectAppear: 180,
      objectSpin: 240,
      speechAppear: 300
    };

    // DNA helix properties
    const dnaProperties = {
      radius: 40,
      height: 80,
      segments: 20,
      strandsWidth: 5,
      nucleotidesRadius: 6,
      rotationSpeed: 0.02
    };

    // Draw robot
    const drawRobot = (x: number, y: number, scale: number, armAngle: number, eyeSize: number, hoverOffset: number) => {
      // Apply hover effect
      y += Math.sin(frame * 0.05) * hoverOffset;
      
      // Robot head
      ctx.fillStyle = colors.robotBody;
      ctx.beginPath();
      ctx.roundRect(x - 40 * scale, y - 50 * scale, 80 * scale, 60 * scale, 15 * scale);
      ctx.fill();
      
      // Robot eyes
      ctx.fillStyle = colors.robotEyes;
      
      // Left eye
      ctx.beginPath();
      ctx.arc(x - 15 * scale, y - 25 * scale, 8 * scale * eyeSize, 0, Math.PI * 2);
      ctx.fill();
      
      // Right eye
      ctx.beginPath();
      ctx.arc(x + 15 * scale, y - 25 * scale, 8 * scale * eyeSize, 0, Math.PI * 2);
      ctx.fill();
      
      // Robot body
      ctx.fillStyle = colors.robotBody;
      ctx.beginPath();
      ctx.roundRect(x - 30 * scale, y + 10 * scale, 60 * scale, 70 * scale, 10 * scale);
      ctx.fill();
      
      // Robot accent lights
      ctx.fillStyle = colors.robotAccent;
      ctx.beginPath();
      ctx.arc(x, y + 30 * scale, 5 * scale, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.beginPath();
      ctx.arc(x, y + 50 * scale, 5 * scale, 0, Math.PI * 2);
      ctx.fill();
      
      // Robot arms
      // Left arm (static)
      ctx.strokeStyle = colors.robotBody;
      ctx.lineWidth = 10 * scale;
      ctx.lineCap = 'round';
      
      ctx.beginPath();
      ctx.moveTo(x - 30 * scale, y + 20 * scale);
      ctx.lineTo(x - 60 * scale, y + 40 * scale);
      ctx.stroke();
      
      // Right arm (animated)
      ctx.save();
      ctx.translate(x + 30 * scale, y + 20 * scale);
      ctx.rotate(armAngle);
      
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(40 * scale, 20 * scale);
      ctx.stroke();
      
      // Hand/gripper
      ctx.strokeStyle = colors.robotAccent;
      ctx.lineWidth = 6 * scale;
      
      ctx.beginPath();
      ctx.moveTo(40 * scale, 20 * scale);
      ctx.lineTo(50 * scale, 15 * scale);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(40 * scale, 20 * scale);
      ctx.lineTo(50 * scale, 25 * scale);
      ctx.stroke();
      
      ctx.restore();
      
      // Robot legs
      ctx.strokeStyle = colors.robotBody;
      ctx.lineWidth = 12 * scale;
      
      // Left leg
      ctx.beginPath();
      ctx.moveTo(x - 15 * scale, y + 80 * scale);
      ctx.lineTo(x - 20 * scale, y + 110 * scale);
      ctx.stroke();
      
      // Right leg
      ctx.beginPath();
      ctx.moveTo(x + 15 * scale, y + 80 * scale);
      ctx.lineTo(x + 20 * scale, y + 110 * scale);
      ctx.stroke();
      
      // Robot glow
      const glowGradient = ctx.createRadialGradient(
        x, y, 0,
        x, y, 100 * scale
      );
      glowGradient.addColorStop(0, colors.robotGlow);
      glowGradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = glowGradient;
      ctx.beginPath();
      ctx.arc(x, y, 100 * scale, 0, Math.PI * 2);
      ctx.fill();
    };

    // Draw DNA helix
    const drawDNA = (x: number, y: number, rotation: number) => {
      const { radius, height, segments, strandsWidth, nucleotidesRadius, rotationSpeed } = dnaProperties;
      
      // Rotate the entire DNA
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      
      // Draw the two strands
      for (let strand = 0; strand < 2; strand++) {
        const strandOffset = Math.PI * strand; // Offset second strand by 180 degrees
        
        // Draw strand
        ctx.strokeStyle = strand === 0 ? colors.robotAccent : colors.robotEyes;
        ctx.lineWidth = strandsWidth;
        ctx.beginPath();
        
        for (let i = 0; i <= segments; i++) {
          const segmentAngle = (i / segments) * Math.PI * 4;
          const segmentHeight = (i / segments) * height - height / 2;
          const xPos = Math.sin(segmentAngle + strandOffset) * radius;
          const yPos = segmentHeight;
          
          if (i === 0) {
            ctx.moveTo(xPos, yPos);
          } else {
            ctx.lineTo(xPos, yPos);
          }
        }
        
        ctx.stroke();
        
        // Draw nucleotides (connecting bars)
        for (let i = 0; i < segments; i++) {
          const segmentAngle = (i / segments) * Math.PI * 4;
          const segmentHeight = (i / segments) * height - height / 2;
          
          const x1 = Math.sin(segmentAngle) * radius;
          const x2 = Math.sin(segmentAngle + Math.PI) * radius;
          const y = segmentHeight;
          
          // Only draw nucleotides at every other segment for cleaner look
          if (i % 2 === 0) {
            // Determine nucleotide color based on position
            let nucleotideColor;
            const colorIndex = i % 4;
            switch (colorIndex) {
              case 0: nucleotideColor = colors.blood; break;
              case 1: nucleotideColor = colors.saliva; break;
              case 2: nucleotideColor = colors.urine; break;
              case 3: nucleotideColor = colors.csf; break;
              default: nucleotideColor = colors.robotAccent;
            }
            
            // Draw connecting bar
            ctx.strokeStyle = nucleotideColor;
            ctx.lineWidth = strandsWidth - 1;
            ctx.beginPath();
            ctx.moveTo(x1, y);
            ctx.lineTo(x2, y);
            ctx.stroke();
            
            // Draw nucleotide spheres at ends
            ctx.fillStyle = nucleotideColor;
            
            ctx.beginPath();
            ctx.arc(x1, y, nucleotidesRadius, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(x2, y, nucleotidesRadius, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
      
      // Object glow
      const glowGradient = ctx.createRadialGradient(
        0, 0, 0,
        0, 0, radius * 2
      );
      glowGradient.addColorStop(0, colors.objectGlow);
      glowGradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = glowGradient;
      ctx.beginPath();
      ctx.arc(0, 0, radius * 2, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    };

    // Draw speech bubble
    const drawSpeechBubble = (x: number, y: number, width: number, height: number, radius: number, opacity: number, textOpacity: number) => {
      // Speech bubble
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
      ctx.beginPath();
      ctx.roundRect(x, y, width, height, radius);
      ctx.fill();
      
      // Pointer
      ctx.beginPath();
      ctx.moveTo(x + 20, y + height);
      ctx.lineTo(x + 30, y + height + 15);
      ctx.lineTo(x + 40, y + height);
      ctx.fill();
      
      // Text
      ctx.fillStyle = `rgba(0, 0, 0, ${textOpacity})`;
      ctx.font = '20px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Here you go!', x + width / 2, y + height / 2);
    };

    // Animation loop
    const animate = () => {
      // Clear canvas with gradient background
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width
      );
      gradient.addColorStop(0, 'rgba(15, 23, 42, 1)');
      gradient.addColorStop(1, 'rgba(10, 15, 30, 1)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Calculate positions
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      // Animation sequence
      if (frame < timings.robotAppear) {
        // Robot appearing
        const progress = frame / timings.robotAppear;
        const scale = progress;
        drawRobot(centerX - 100, centerY, scale, 0, 1, 0);
      } else if (frame < timings.armExtend) {
        // Robot arm extending
        const progress = (frame - timings.robotAppear) / (timings.armExtend - timings.robotAppear);
        robotArmAngle = progress * (Math.PI / 4);
        robotEyeSize = 1 + progress * 0.5;
        drawRobot(centerX - 100, centerY, 1, robotArmAngle, robotEyeSize, 0);
      } else if (frame < timings.objectAppear) {
        // Object appearing
        const progress = (frame - timings.armExtend) / (timings.objectAppear - timings.armExtend);
        drawRobot(centerX - 100, centerY, 1, robotArmAngle, robotEyeSize, 0);
        
        // Draw DNA with scale effect
        ctx.save();
        ctx.globalAlpha = progress;
        ctx.scale(progress, progress);
        drawDNA(centerX + 100, centerY, objectRotation);
        ctx.restore();
      } else if (frame < timings.objectSpin) {
        // Object spinning
        objectRotation += dnaProperties.rotationSpeed;
        robotHoverOffset = 3;
        
        drawRobot(centerX - 100, centerY, 1, robotArmAngle, robotEyeSize, robotHoverOffset);
        drawDNA(centerX + 100, centerY, objectRotation);
      } else if (frame < timings.speechAppear) {
        // Speech bubble appearing
        const progress = (frame - timings.objectSpin) / (timings.speechAppear - timings.objectSpin);
        speechBubbleSize = progress;
        speechBubbleOpacity = progress;
        textOpacity = progress > 0.5 ? (progress - 0.5) * 2 : 0;
        
        objectRotation += dnaProperties.rotationSpeed;
        
        drawRobot(centerX - 100, centerY, 1, robotArmAngle, robotEyeSize, robotHoverOffset);
        drawDNA(centerX + 100, centerY, objectRotation);
        
        // Draw speech bubble with scale effect
        const bubbleWidth = 150 * speechBubbleSize;
        const bubbleHeight = 60 * speechBubbleSize;
        drawSpeechBubble(
          centerX - 150, 
          centerY - 100, 
          bubbleWidth, 
          bubbleHeight, 
          10 * speechBubbleSize, 
          speechBubbleOpacity,
          textOpacity
        );
      } else {
        // Final state - everything animated
        objectRotation += dnaProperties.rotationSpeed;
        
        drawRobot(centerX - 100, centerY, 1, robotArmAngle, robotEyeSize, robotHoverOffset);
        drawDNA(centerX + 100, centerY, objectRotation);
        drawSpeechBubble(centerX - 150, centerY - 100, 150, 60, 10, 1, 1);
      }
      
      frame++;
      requestAnimationFrame(animate);
    };
    
    // Start animation
    animate();
    
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