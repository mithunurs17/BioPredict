import { useEffect, useRef } from 'react';

const STAR_COUNT = 120;
const PARTICLE_COUNT = 40;
const DNA_CURVES = 3;
const COLORS = [
  '#ff00ea', // neon magenta
  '#ffb800', // neon orange
  '#00f6ff', // neon cyan
];
const PARTICLE_COLORS = [
  '#ff00ea', '#ffb800', '#00f6ff', '#fff', '#00ffae', '#ffd700', '#ff6f00', '#00ffea', '#ff0080', '#fff'
];

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

const DnaHeroBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // Star field
    const stars = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.2 + 0.2,
      o: Math.random() * 0.5 + 0.3,
    }));

    // Floating particles
    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: randomBetween(3, 7),
      color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
      dx: randomBetween(-0.2, 0.2),
      dy: randomBetween(-0.2, 0.2),
    }));

    // Animation loop
    let frame = 0;
    let running = true;
    function draw() {
      if (!running) return;
      ctx.clearRect(0, 0, width, height);

      // Draw star field
      for (const s of stars) {
        ctx.save();
        ctx.globalAlpha = s.o;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.restore();
      }

      // Draw DNA curves
      for (let c = 0; c < DNA_CURVES; c++) {
        ctx.save();
        ctx.strokeStyle = COLORS[c % COLORS.length];
        ctx.shadowColor = COLORS[c % COLORS.length];
        ctx.shadowBlur = 16;
        ctx.lineWidth = 6;
        ctx.beginPath();
        const amplitude = height * 0.18;
        const yOffset = height * 0.25 + c * amplitude * 0.7;
        for (let i = 0; i <= width; i += 2) {
          const t = (i / width) * Math.PI * 2 * 2 + frame * 0.01 + c * 1.2;
          const y = yOffset + Math.sin(t) * amplitude;
          if (i === 0) ctx.moveTo(i, y);
          else ctx.lineTo(i, y);
        }
        ctx.stroke();
        ctx.restore();
      }

      // Draw floating particles
      for (const p of particles) {
        ctx.save();
        ctx.globalAlpha = 0.85;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();
        // Move
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;
      }

      frame++;
      requestAnimationFrame(draw);
    }

    draw();

    // Handle resize
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      running = false;
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
      style={{ background: '#111' }}
    />
  );
};

export default DnaHeroBackground; 