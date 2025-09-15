import { useEffect, useRef } from 'react';

export function EyeRippleAnimation({ onComplete }: { onComplete?: () => void }) {
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

    // Enhanced theme colors from the project's biomarker theme
    const colors = {
      background: {
        primary: '#0a0f1e',
        secondary: '#1a1f3e',
        accent: '#2a2f5e'
      },
      iris: {
        blood: 'rgba(237, 29, 37, 0.9)',  // Blood red with transparency
        saliva: 'rgba(0, 163, 173, 0.9)',   // Saliva teal with transparency
        urine: 'rgba(255, 196, 0, 0.9)',    // Urine yellow with transparency
        csf: 'rgba(138, 43, 226, 0.9)'      // CSF purple with transparency
      },
      pupil: '#000000',
      sclera: {
        base: '#ffffff',
        shadow: 'rgba(200, 200, 255, 0.8)',
        veins: 'rgba(255, 100, 100, 0.1)'
      },
      highlight: '#f0f8ff',
      ripple: 'rgba(244, 114, 182, 0.6)', // Pink/fuchsia from the project theme
      text: '#ffffff',
      glow: {
        blood: 'rgba(237, 29, 37, 0.3)',
        saliva: 'rgba(0, 163, 173, 0.3)',
        urine: 'rgba(255, 196, 0, 0.3)',
        csf: 'rgba(138, 43, 226, 0.3)'
      },
      // Neon colors from the project theme
      neon: {
        blue: 'rgba(0, 255, 255, 0.8)',
        pink: 'rgba(255, 0, 255, 0.8)',
        green: 'rgba(0, 255, 0, 0.8)',
        yellow: 'rgba(255, 255, 0, 0.8)'
      }
    };

    // Mouse position
    let mouseX = canvas.width / 2;
    let mouseY = canvas.height / 2;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;

    // Enhanced eye properties with more realistic structure
    const eyeCenter = {
      x: canvas.width / 2,
      y: canvas.height / 2
    };
    const eyeRadius = Math.min(canvas.width, canvas.height) * 0.22; // Slightly larger eye
    const irisRadius = eyeRadius * 0.65;
    const pupilRadius = irisRadius * 0.4;
    const pupilMaxConstriction = 0.7; // How much pupil can constrict based on light
    const pupilMinConstriction = 1.3; // How much pupil can dilate based on light
    let currentPupilSize = 1.0; // Current pupil size multiplier

    // Blinking properties - disabled
    let isBlinking = false;
    let blinkProgress = 0;
    let blinkDirection = 0; // 0: not blinking, 1: closing, -1: opening
    let nextBlinkTime = Date.now() + 2000 + Math.random() * 3000;
    const blinkDuration = 150; // ms
    let blinkIntensity = 1.0; // Controls how much the eye closes during a blink

    // Eyelid properties - disabled
    const upperEyelidRest = eyeCenter.y - eyeRadius * 1.1;
    const lowerEyelidRest = eyeCenter.y + eyeRadius * 1.1;
    let upperEyelidPos = upperEyelidRest;
    let lowerEyelidPos = lowerEyelidRest;
    let eyelidCurvature = 0.8; // Controls the curvature of eyelids

    // Eyelash properties - disabled
    const eyelashCount = 15;
    const eyelashLength = eyeRadius * 0.15;
    const eyelashCurve = 0.3;
    let eyelashes = [];

    // Initialize eyelashes - disabled
    const initializeEyelashes = () => {
      eyelashes = [];
      for (let i = 0; i < eyelashCount; i++) {
        const angle = (i / eyelashCount) * Math.PI - Math.PI/2;
        eyelashes.push({
          angle: angle,
          length: eyelashLength * (0.8 + Math.random() * 0.4),
          curve: eyelashCurve * (0.8 + Math.random() * 0.4)
        });
      }
    };

    // Background particles
    interface Particle {
      x: number;
      y: number;
      size: number;
      speed: number;
      color: string;
      opacity: number;
    }
    
    const particles: Particle[] = [];
    const particleCount = 180; // More particles for richer background
    
    // DNA helix particles (theme-specific background element)
    interface DNAParticle {
      x: number;
      y: number;
      size: number;
      color: string;
      opacity: number;
      angle: number;
      radius: number;
      speed: number;
      helix: number; // 0 or 1 for which helix strand
    }
    
    const dnaParticles: DNAParticle[] = [];
    const dnaParticleCount = 100;
    const dnaHelixRadius = Math.min(canvas.width, canvas.height) * 0.4;
    const dnaHelixHeight = canvas.height * 1.5;
    const dnaHelixY = canvas.height / 2;
    const dnaHelixX = canvas.width / 2;
    
    // Initialize DNA helix particles
    const initializeDNAParticles = () => {
      dnaParticles.length = 0;
      for (let i = 0; i < dnaParticleCount; i++) {
        const helix = Math.round(Math.random()); // 0 or 1
        const angle = (i / dnaParticleCount) * Math.PI * 10 + (helix * Math.PI); // Offset second helix
        const y = (i / dnaParticleCount) * dnaHelixHeight - dnaHelixHeight / 2 + dnaHelixY;
        
        // Choose color based on biomarker theme
        const colorType = ['blood', 'saliva', 'urine', 'csf', 'blue', 'pink', 'green', 'yellow'][
          Math.floor(Math.random() * 8)
        ] as keyof (typeof colors.iris | typeof colors.neon);
        
        const color = colorType in colors.iris 
          ? colors.iris[colorType as keyof typeof colors.iris]
          : colors.neon[colorType as keyof typeof colors.neon];
        
        dnaParticles.push({
          x: dnaHelixX + Math.cos(angle) * dnaHelixRadius * 0.2,
          y: y,
          size: 1.5 + Math.random() * 2.5,
          color: color,
          opacity: 0.5 + Math.random() * 0.5,
          angle: angle,
          radius: dnaHelixRadius * 0.2,
          speed: 0.01 + Math.random() * 0.01,
          helix: helix
        });
      }
    };
    
    // Initialize background particles
    const initializeParticles = () => {
      particles.length = 0;
      for (let i = 0; i < particleCount; i++) {
        const biomarkerType = ['blood', 'saliva', 'urine', 'csf'][Math.floor(Math.random() * 4)] as keyof typeof colors.iris;
        const direction = Math.random() * Math.PI * 2; // Random direction
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: 0.5 + Math.random() * 2,
          speed: 0.2 + Math.random() * 0.5,
          color: colors.iris[biomarkerType],
          opacity: 0.1 + Math.random() * 0.3,
          direction: direction
        });
      }
    };
    
    // Ripple properties
    interface Ripple {
      x: number;
      y: number;
      radius: number;
      maxRadius: number;
      opacity: number;
      color: string;
      width: number;
    }
    
    const ripples: Ripple[] = [];
    
    // Biomarker data points
    interface DataPoint {
      x: number;
      y: number;
      color: string;
      size: number;
      speed: number;
      angle: number;
      distance: number;
      type: keyof typeof colors.iris;
      opacity: number;
      pulse: number;
      pulseSpeed: number;
    }
    
    const dataPoints: DataPoint[] = [];
    const dataPointCount = 120; // More data points for richer iris
    
    // Iris texture patterns
    interface IrisPattern {
      angle: number;
      width: number;
      length: number;
      color: string;
      opacity: number;
    }
    
    const irisPatterns: IrisPattern[] = [];
    const patternCount = 60; // Iris texture patterns
    
    // Initialize iris patterns
    const initializeIrisPatterns = () => {
      irisPatterns.length = 0;
      for (let i = 0; i < patternCount; i++) {
        const angle = (i / patternCount) * Math.PI * 2;
        irisPatterns.push({
          angle: angle,
          width: 0.05 + Math.random() * 0.1,
          length: 0.6 + Math.random() * 0.3,
          color: ['blood', 'saliva', 'urine', 'csf'][Math.floor(Math.random() * 4)],
          opacity: 0.3 + Math.random() * 0.4
        });
      }
    };
    
    // Initialize data points
    const initializeDataPoints = () => {
      dataPoints.length = 0;
      const types = ['blood', 'saliva', 'urine', 'csf'] as const;
      
      for (let i = 0; i < dataPointCount; i++) {
        const type = types[Math.floor(Math.random() * types.length)];
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * irisRadius * 0.9;
        
        dataPoints.push({
          x: eyeCenter.x + Math.cos(angle) * distance,
          y: eyeCenter.y + Math.sin(angle) * distance,
          color: colors.iris[type],
          size: 1 + Math.random() * 2.5,
          speed: 0.002 + Math.random() * 0.005,
          angle: angle,
          distance: distance,
          type: type,
          opacity: 0.5 + Math.random() * 0.5,
          pulse: 0,
          pulseSpeed: 0.03 + Math.random() * 0.05
        });
      }
    };
    
    // Create ripple effect
    const createRipple = (x: number, y: number, color: string) => {
      const maxRadius = Math.min(canvas.width, canvas.height) * 0.3;
      ripples.push({
        x,
        y,
        radius: 0,
        maxRadius,
        opacity: 1,
        color,
        width: 2 + Math.random() * 3
      });
    };
    
    // Trigger a blink - disabled
    const triggerBlink = (intensity = 1.0) => {
      // Disabled blinking functionality
      // if (!isBlinking) {
      //   isBlinking = true;
      //   blinkProgress = 0;
      //   blinkDirection = 1; // Start closing
      //   blinkIntensity = intensity; // Set how intense the blink should be
      // }
    };
    
    // Automatically create ripples periodically
    let lastRippleTime = 0;
    const rippleInterval = 1800; // ms - slightly faster ripples
    
    // Track animation progress
    let animationProgress = 0;
    const animationDuration = 8000; // ms
    let startTime = Date.now();
    
    // Animation text
    const texts = [
      { text: "Analyzing biomarkers...", duration: 2000 },
      { text: "Processing visual data...", duration: 2000 },
      { text: "Detecting patterns...", duration: 2000 },
      { text: "BioPredict AI ready", duration: 2000 }
    ];
    let currentTextIndex = 0;
    let textOpacity = 0;
    let textFadeDirection = 1; // 1 for fade in, -1 for fade out
    
    // Handle mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
      
      // Create ripple on significant mouse movement
      const movementDistance = Math.sqrt(
        Math.pow(targetMouseX - mouseX, 2) + 
        Math.pow(targetMouseY - mouseY, 2)
      );
      
      // Adjust pupil size based on movement (simulate light response)
      // Fast movement = more light = smaller pupil
      if (movementDistance > 5) {
        // Gradually constrict pupil with fast movement
        currentPupilSize = Math.max(pupilMaxConstriction, 
          currentPupilSize - (movementDistance * 0.001));
      } else {
        // Gradually dilate pupil during slow/no movement
        currentPupilSize = Math.min(pupilMinConstriction, 
          currentPupilSize + 0.005);
      }
      
      if (movementDistance > 40) { // More sensitive to movement
        const now = Date.now();
        if (now - lastRippleTime > 400) { // Limit ripple creation rate
          const type = ['blood', 'saliva', 'urine', 'csf'][Math.floor(Math.random() * 4)] as keyof typeof colors.iris;
          createRipple(targetMouseX, targetMouseY, colors.iris[type]);
          lastRippleTime = now;
          
          // Chance to trigger a blink when mouse moves significantly - DISABLED
          // if (Math.random() < 0.3 && !isBlinking) {
          //   const blinkIntensity = Math.min(1.0, movementDistance / 200);
          //   triggerBlink(blinkIntensity);
          // }
        }
      }
    };
    
    // Handle mouse click - ripple only (blink disabled)
    const handleMouseClick = () => {
      // triggerBlink(); // Disabled
      
      // Create a ripple at the mouse position
      const type = ['blood', 'saliva', 'urine', 'csf'][Math.floor(Math.random() * 4)] as keyof typeof colors.iris;
      createRipple(targetMouseX, targetMouseY, colors.iris[type]);
    };
    
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleMouseClick);
    
    // Animation loop
    const animate = () => {
      // Update animation progress
      const currentTime = Date.now();
      animationProgress = Math.min(1, (currentTime - startTime) / animationDuration);
      
      // Clear canvas with enhanced gradient background
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width
      );
      gradient.addColorStop(0, 'rgba(15, 23, 42, 0.98)');
      gradient.addColorStop(0.5, 'rgba(10, 15, 30, 0.95)');
      gradient.addColorStop(1, 'rgba(5, 10, 20, 1)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw DNA helix in background
      dnaParticles.forEach(particle => {
        // Update particle position
        particle.angle += particle.speed;
        particle.x = dnaHelixX + Math.cos(particle.angle) * particle.radius;
        
        // Move particles up and reset when they go off screen
        particle.y -= 0.2;
        if (particle.y < -dnaHelixHeight / 2 + dnaHelixY) {
          particle.y = dnaHelixHeight / 2 + dnaHelixY;
        }
        
        // Draw particle with glow effect
        ctx.save();
        ctx.globalAlpha = particle.opacity;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
        
        // Add glow
        const glow = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 3
        );
        glow.addColorStop(0, particle.color);
        glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.globalAlpha = particle.opacity * 0.5;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();
        
        // Draw connecting lines between adjacent particles in same helix
        if (Math.random() < 0.3) { // Only draw some connections for performance
          const nextParticle = dnaParticles.find(p => 
            p.helix === particle.helix && 
            Math.abs(p.y - particle.y) < 20 && 
            p !== particle
          );
          
          if (nextParticle) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(nextParticle.x, nextParticle.y);
            ctx.strokeStyle = `${particle.color}${Math.floor(particle.opacity * 0.3 * 255).toString(16).padStart(2, '0')}`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
        
        ctx.restore();
      });
      
      // Draw background particles
      particles.forEach(particle => {
        // Move particles in their direction
        particle.x += Math.cos(particle.direction) * particle.speed;
        particle.y += Math.sin(particle.direction) * particle.speed;
        
        // Reset particles that go off screen
        if (particle.x < -10) particle.x = canvas.width + 10;
        if (particle.x > canvas.width + 10) particle.x = -10;
        if (particle.y < -10) particle.y = canvas.height + 10;
        if (particle.y > canvas.height + 10) particle.y = -10;
        
        // Draw particle with glow effect
        ctx.save();
        ctx.globalAlpha = particle.opacity;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
        
        // Add glow
        const glow = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 3
        );
        glow.addColorStop(0, particle.color);
        glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.globalAlpha = particle.opacity * 0.5;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();
        ctx.restore();
      });
      
      // Smooth mouse movement
      mouseX += (targetMouseX - mouseX) * 0.1;
      mouseY += (targetMouseY - mouseY) * 0.1;
      
      // Calculate eye look direction (limited range)
      const dx = mouseX - eyeCenter.x;
      const dy = mouseY - eyeCenter.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const maxLookDistance = eyeRadius * 0.3;
      
      let lookX = eyeCenter.x;
      let lookY = eyeCenter.y;
      
      if (distance > 0) {
        const limitedDistance = Math.min(distance, maxLookDistance);
        lookX = eyeCenter.x + (dx / distance) * limitedDistance;
        lookY = eyeCenter.y + (dy / distance) * limitedDistance;
      }
      
      // Handle blinking - DISABLED
      if (false) { // Changed from: if (isBlinking)
        // Blinking code removed
      } else {
        // Check if it's time for the next automatic blink - DISABLED
        // if (currentTime > nextBlinkTime) {
        //   triggerBlink();
        // }
      }
      
      // Draw outer glow for the eye
      const outerGlow = ctx.createRadialGradient(
        eyeCenter.x, eyeCenter.y, eyeRadius * 0.9,
        eyeCenter.x, eyeCenter.y, eyeRadius * 1.5
      );
      outerGlow.addColorStop(0, 'rgba(100, 100, 255, 0.2)');
      outerGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.beginPath();
      ctx.arc(eyeCenter.x, eyeCenter.y, eyeRadius * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = outerGlow;
      ctx.fill();
      
      // Draw sclera (white part of eye) with enhanced realism
      ctx.beginPath();
      ctx.arc(eyeCenter.x, eyeCenter.y, eyeRadius, 0, Math.PI * 2);
      
      // Create sclera gradient for more realistic look
      const scleraGradient = ctx.createRadialGradient(
        eyeCenter.x, eyeCenter.y - eyeRadius * 0.2, eyeRadius * 0.1,
        eyeCenter.x, eyeCenter.y, eyeRadius
      );
      scleraGradient.addColorStop(0, colors.sclera.shadow);
      scleraGradient.addColorStop(0.7, colors.sclera.base);
      scleraGradient.addColorStop(1, 'rgba(220, 220, 255, 0.9)');
      
      ctx.fillStyle = scleraGradient;
      ctx.fill();
      
      // Add subtle veins to sclera
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const startX = eyeCenter.x + Math.cos(angle) * (eyeRadius * 0.6);
        const startY = eyeCenter.y + Math.sin(angle) * (eyeRadius * 0.6);
        const endX = eyeCenter.x + Math.cos(angle) * eyeRadius;
        const endY = eyeCenter.y + Math.sin(angle) * eyeRadius;
        
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = colors.sclera.veins;
        ctx.lineWidth = 1 + Math.random();
        ctx.stroke();
      }
      
      // Draw iris with enhanced biomarker data points and patterns
      ctx.save();
      ctx.beginPath();
      ctx.arc(lookX, lookY, irisRadius, 0, Math.PI * 2);
      ctx.clip();
      
      // Create enhanced iris gradient base
      const irisGradient = ctx.createRadialGradient(
        lookX, lookY, 0,
        lookX, lookY, irisRadius
      );
      
      // Use different colors based on animation progress with smoother transitions
      const progressColor = (progress: number) => {
        const colors = [
          { r: 237, g: 29, b: 37 },    // Blood red
          { r: 0, g: 163, b: 173 },     // Saliva teal
          { r: 255, g: 196, b: 0 },     // Urine yellow
          { r: 138, g: 43, b: 226 }     // CSF purple
        ];
        
        // Ensure progress is between 0 and 0.999 to avoid index out of bounds
        const safeProgress = progress >= 1 ? 0.999 : progress;
        
        const index = Math.floor(safeProgress * colors.length);
        const nextIndex = (index + 1) % colors.length;
        const colorProgress = (safeProgress * colors.length) % 1;
        
        // Smoother easing function for color transition
        const eased = colorProgress < 0.5 
          ? 2 * colorProgress * colorProgress 
          : -1 + (4 - 2 * colorProgress) * colorProgress;
        
        const r = Math.floor(colors[index].r + (colors[nextIndex].r - colors[index].r) * eased);
        const g = Math.floor(colors[index].g + (colors[nextIndex].g - colors[index].g) * eased);
        const b = Math.floor(colors[index].b + (colors[nextIndex].b - colors[index].b) * eased);
        
        return `rgb(${r}, ${g}, ${b})`;
      };
      
      irisGradient.addColorStop(0, progressColor(animationProgress));
      irisGradient.addColorStop(0.7, progressColor((animationProgress + 0.3) % 1));
      irisGradient.addColorStop(1, 'rgba(0, 0, 0, 0.9)');
      
      ctx.fillStyle = irisGradient;
      ctx.fill();
      
      // Draw iris patterns (radial lines)
      irisPatterns.forEach(pattern => {
        const startDistance = irisRadius * 0.3;
        const endDistance = irisRadius * pattern.length;
        
        const startX = lookX + Math.cos(pattern.angle) * startDistance;
        const startY = lookY + Math.sin(pattern.angle) * startDistance;
        const endX = lookX + Math.cos(pattern.angle) * endDistance;
        const endY = lookY + Math.sin(pattern.angle) * endDistance;
        
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.lineWidth = irisRadius * pattern.width;
        ctx.strokeStyle = `${colors.iris[pattern.color as keyof typeof colors.iris]}${Math.floor(pattern.opacity * 255).toString(16).padStart(2, '0')}`;
        ctx.stroke();
      });
      
      // Draw and update data points with pulsing effect
      dataPoints.forEach(point => {
        // Update pulse
        point.pulse = (point.pulse + point.pulseSpeed) % (Math.PI * 2);
        const pulseFactor = 1 + Math.sin(point.pulse) * 0.3;
        
        // Rotate points around iris center
        point.angle += point.speed;
        point.x = lookX + Math.cos(point.angle) * point.distance;
        point.y = lookY + Math.sin(point.angle) * point.distance;
        
        // Draw point with pulse effect
        ctx.beginPath();
        ctx.arc(point.x, point.y, point.size * pulseFactor, 0, Math.PI * 2);
        ctx.fillStyle = `${point.color}${Math.floor(point.opacity * 255).toString(16).padStart(2, '0')}`;
        ctx.fill();
        
        // Add glow effect
        const glow = ctx.createRadialGradient(
          point.x, point.y, 0,
          point.x, point.y, point.size * 3 * pulseFactor
        );
        glow.addColorStop(0, point.color);
        glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.globalAlpha = point.opacity * 0.3;
        ctx.beginPath();
        ctx.arc(point.x, point.y, point.size * 3 * pulseFactor, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();
        ctx.globalAlpha = 1;
      });
      
      ctx.restore();
      
      // Draw pupil with enhanced depth and dynamic size
      const pupilGradient = ctx.createRadialGradient(
        lookX, lookY, 0,
        lookX, lookY, pupilRadius * currentPupilSize
      );
      pupilGradient.addColorStop(0, 'rgba(0, 0, 0, 0.8)');
      pupilGradient.addColorStop(1, 'rgba(0, 0, 0, 1)');
      
      ctx.beginPath();
      ctx.arc(lookX, lookY, pupilRadius * currentPupilSize, 0, Math.PI * 2);
      ctx.fillStyle = pupilGradient;
      ctx.fill();
      
      // Draw pupil highlight with enhanced realism
      const highlightSize = pupilRadius * 0.5;
      const highlightOffsetX = pupilRadius * 0.3;
      const highlightOffsetY = pupilRadius * 0.3;
      
      // Main highlight
      ctx.beginPath();
      ctx.arc(
        lookX - highlightOffsetX,
        lookY - highlightOffsetY,
        highlightSize,
        0, Math.PI * 2
      );
      ctx.fillStyle = 'rgba(240, 248, 255, 0.8)';
      ctx.fill();
      
      // Secondary smaller highlight
      ctx.beginPath();
      ctx.arc(
        lookX + highlightOffsetX * 0.5,
        lookY + highlightOffsetY * 0.5,
        highlightSize * 0.4,
        0, Math.PI * 2
      );
      ctx.fillStyle = 'rgba(240, 248, 255, 0.6)';
      ctx.fill();
      
      // Draw and update ripples with enhanced effects
      for (let i = ripples.length - 1; i >= 0; i--) {
        const ripple = ripples[i];
        
        // Update ripple
        ripple.radius += 2.5;
        ripple.opacity -= 0.01;
        
        // Draw ripple with varying width
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
        // Parse the rgba color to add opacity properly
        const rippleColorMatch = ripple.color.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
        let rippleStrokeStyle;
        if (rippleColorMatch) {
          // If it's an rgba color, create a new rgba with modified opacity
          const [, r, g, b] = rippleColorMatch;
          rippleStrokeStyle = `rgba(${r}, ${g}, ${b}, ${ripple.opacity})`;
        } else {
          // Fallback for non-rgba colors
          rippleStrokeStyle = ripple.color;
        }
        ctx.strokeStyle = rippleStrokeStyle;
        ctx.lineWidth = ripple.width * (1 - ripple.radius / ripple.maxRadius);
        ctx.stroke();
        
        // Add glow effect to ripples
        ctx.save();
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
        const innerRadius = Math.max(0, ripple.radius - 5); // Ensure inner radius is never negative
        const rippleGlow = ctx.createRadialGradient(
          ripple.x, ripple.y, innerRadius,
          ripple.x, ripple.y, ripple.radius + 5
        );
        // Create proper rgba color for glow with modified opacity
        let rippleGlowColor;
        if (rippleColorMatch) {
          const [, r, g, b] = rippleColorMatch;
          rippleGlowColor = `rgba(${r}, ${g}, ${b}, ${ripple.opacity * 0.5})`;
        } else {
          rippleGlowColor = 'rgba(244, 114, 182, 0.3)'; // Fallback color
        }
        rippleGlow.addColorStop(0, rippleGlowColor);
        rippleGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.strokeStyle = rippleGlow;
        ctx.lineWidth = 10;
        ctx.stroke();
        ctx.restore();
        
        // Remove faded ripples
        if (ripple.opacity <= 0 || ripple.radius >= ripple.maxRadius) {
          ripples.splice(i, 1);
        }
      }
      
      // Create automatic ripples
      const now = Date.now();
      if (now - lastRippleTime > rippleInterval) {
        const type = ['blood', 'saliva', 'urine', 'csf'][Math.floor(Math.random() * 4)] as keyof typeof colors.iris;
        createRipple(
          eyeCenter.x + (Math.random() - 0.5) * canvas.width * 0.8,
          eyeCenter.y + (Math.random() - 0.5) * canvas.height * 0.8,
          colors.iris[type]
        );
        lastRippleTime = now;
      }
      
      // Draw text with enhanced fade effect and glow
      const currentTextObj = texts[currentTextIndex];
      const textTimeProgress = (now - startTime) % currentTextObj.duration / currentTextObj.duration;
      
      if (textTimeProgress < 0.2) {
        // Fade in
        textOpacity = textTimeProgress / 0.2;
        textFadeDirection = 1;
      } else if (textTimeProgress > 0.8) {
        // Fade out
        textOpacity = 1 - ((textTimeProgress - 0.8) / 0.2);
        textFadeDirection = -1;
        
        // Prepare for next text
        if (textTimeProgress >= 0.99 && textFadeDirection === -1) {
          currentTextIndex = (currentTextIndex + 1) % texts.length;
        }
      } else {
        // Fully visible
        textOpacity = 1;
      }
      
      // Draw text with enhanced styling and effects
      ctx.save();
      // Change font to a more modern, futuristic style
      ctx.font = 'bold 32px "Segoe UI", Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Add multiple shadow layers for a more dramatic effect
      ctx.shadowColor = 'rgba(0, 255, 255, 0.8)';
      ctx.shadowBlur = 15;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      
      // Create gradient text fill
      const textGradient = ctx.createLinearGradient(
        canvas.width / 2 - 150, canvas.height - 100,
        canvas.width / 2 + 150, canvas.height - 100
      );
      textGradient.addColorStop(0, '#00ffff'); // Cyan
      textGradient.addColorStop(0.5, '#ffffff'); // White
      textGradient.addColorStop(1, '#ff00ff'); // Magenta
      
      // Apply opacity to maintain fade effect
      ctx.globalAlpha = textOpacity;
      ctx.fillStyle = textGradient;
      ctx.fillText(currentTextObj.text, canvas.width / 2, canvas.height - 100);
      
      // Add a subtle outline to the text
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.strokeText(currentTextObj.text, canvas.width / 2, canvas.height - 100);
      ctx.globalAlpha = 1; // Reset opacity
      
      ctx.restore();
      
      // Draw 3D effect for eye (shadow and highlight)
      ctx.beginPath();
      const shadowGradient = ctx.createRadialGradient(
        eyeCenter.x, eyeCenter.y, eyeRadius * 0.9,
        eyeCenter.x, eyeCenter.y, eyeRadius * 1.2
      );
      shadowGradient.addColorStop(0, 'rgba(0, 0, 0, 0.4)');
      shadowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.fillStyle = shadowGradient;
      ctx.arc(eyeCenter.x, eyeCenter.y, eyeRadius * 1.2, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw enhanced connection lines between eye and ripples
      ripples.forEach(ripple => {
        if (ripple.opacity > 0.3) {
          // Calculate distance for line intensity
          const lineDist = Math.sqrt(
            Math.pow(ripple.x - lookX, 2) + 
            Math.pow(ripple.y - lookY, 2)
          );
          
          // Draw main connection line
          ctx.beginPath();
          ctx.moveTo(lookX, lookY);
          ctx.lineTo(ripple.x, ripple.y);
          ctx.strokeStyle = ripple.color + '90'; // 56% opacity
          ctx.lineWidth = 1.5;
          ctx.setLineDash([5, 8]);
          ctx.stroke();
          ctx.setLineDash([]);
          
          // Add pulsing data particles along the connection line
          const particleCount = Math.floor(lineDist / 30);
          for (let i = 0; i < particleCount; i++) {
            const progress = (i / particleCount) + ((now % 2000) / 2000);
            const modProgress = progress % 1;
            
            const particleX = lookX + (ripple.x - lookX) * modProgress;
            const particleY = lookY + (ripple.y - lookY) * modProgress;
            
            ctx.beginPath();
            ctx.arc(particleX, particleY, 2, 0, Math.PI * 2);
            ctx.fillStyle = ripple.color + Math.floor(ripple.opacity * 255 * (1 - modProgress)).toString(16).padStart(2, '0');
            ctx.fill();
          }
        }
      });
      
      // Enhanced eyelid drawing with eyelashes - DISABLED
      // if (isBlinking || blinkProgress > 0) {
      //   // Calculate eyelid positions based on blink progress and intensity
      //   const effectiveBlinkProgress = blinkProgress * blinkIntensity;
      //   
      //   // Upper eyelid
      //   ctx.beginPath();
      //   ctx.moveTo(eyeCenter.x - eyeRadius * 1.2, upperEyelidPos);
      //   ctx.quadraticCurveTo(
      //     eyeCenter.x, 
      //     upperEyelidPos + eyeRadius * eyelidCurvature * effectiveBlinkProgress, 
      //     eyeCenter.x + eyeRadius * 1.2, 
      //     upperEyelidPos
      //   );
      //   ctx.quadraticCurveTo(eyeCenter.x, upperEyelidPos - eyeRadius * 0.3, eyeCenter.x - eyeRadius * 1.2, upperEyelidPos);
      //   ctx.fillStyle = 'rgba(10, 15, 30, 0.95)';
      //   ctx.fill();
      //   
      //   // Lower eyelid
      //   ctx.beginPath();
      //   ctx.moveTo(eyeCenter.x - eyeRadius * 1.2, lowerEyelidPos);
      //   ctx.quadraticCurveTo(
      //     eyeCenter.x, 
      //     lowerEyelidPos - eyeRadius * eyelidCurvature * effectiveBlinkProgress, 
      //     eyeCenter.x + eyeRadius * 1.2, 
      //     lowerEyelidPos
      //   );
      //   ctx.quadraticCurveTo(eyeCenter.x, lowerEyelidPos + eyeRadius * 0.3, eyeCenter.x - eyeRadius * 1.2, lowerEyelidPos);
      //   ctx.fillStyle = 'rgba(10, 15, 30, 0.95)';
      //   ctx.fill();
      //   
      //   // Draw eyelashes on upper eyelid
      //   if (effectiveBlinkProgress < 0.7) { // Only show eyelashes when eye is mostly open
      //     eyelashes.forEach(lash => {
      //       const eyelidY = upperEyelidPos + eyeRadius * eyelidCurvature * effectiveBlinkProgress * Math.sin(lash.angle + Math.PI/2);
      //       const eyelidX = eyeCenter.x + (eyeRadius * 1.2) * Math.cos(lash.angle + Math.PI/2);
      //       
      //       ctx.beginPath();
      //       ctx.moveTo(eyelidX, eyelidY);
      //       
      //       // Calculate control point for curved eyelash
      //       const controlX = eyelidX + Math.cos(lash.angle) * lash.length * 0.5 + Math.cos(lash.angle + Math.PI/2) * lash.curve * lash.length;
      //       const controlY = eyelidY + Math.sin(lash.angle) * lash.length * 0.5 + Math.sin(lash.angle + Math.PI/2) * lash.curve * lash.length;
      //       
      //       // Calculate end point
      //       const endX = eyelidX + Math.cos(lash.angle) * lash.length;
      //       const endY = eyelidY + Math.sin(lash.angle) * lash.length;
      //       
      //       ctx.quadraticCurveTo(controlX, controlY, endX, endY);
      //       ctx.strokeStyle = 'rgba(10, 10, 20, 0.7)';
      //       ctx.lineWidth = 1.5;
      //       ctx.stroke();
      //     });
      //   }
      // }
      
      requestAnimationFrame(animate);
    };
    
    // Initialize and start animation
    initializeParticles();
    initializeDataPoints();
    initializeIrisPatterns();
    initializeDNAParticles();
    // initializeEyelashes(); // Disabled as blinking is removed
    animate();
    
    // Create initial ripple
    createRipple(canvas.width / 2, canvas.height / 2, colors.iris.blood);
    
    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleMouseClick);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-none"
      />
    </div>
  );
}