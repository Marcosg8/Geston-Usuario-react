import React, { useEffect, useRef } from 'react';

const defaultOptions = {
  backgroundColor: '#070b14',
  trailAlpha: 0.25,
  lineCount: 180,
  minSpeed: 1.2,
  maxSpeed: 6,
  lineLength: 16,
  lineWidth: 1,
  glow: 8,
  centerJitter: 10,
  colors: ['#67e8f9', '#38bdf8', '#818cf8']
};

const randomRange = (min, max) => Math.random() * (max - min) + min;

const hexToRgb = (hex) => {
  const normalized = hex.replace('#', '');
  if (normalized.length !== 6) {
    return { r: 7, g: 11, b: 20 };
  }

  return {
    r: Number.parseInt(normalized.slice(0, 2), 16),
    g: Number.parseInt(normalized.slice(2, 4), 16),
    b: Number.parseInt(normalized.slice(4, 6), 16)
  };
};

function createParticle(width, height, options) {
  const centerX = width / 2 + randomRange(-options.centerJitter, options.centerJitter);
  const centerY = height / 2 + randomRange(-options.centerJitter, options.centerJitter);
  const angle = Math.random() * Math.PI * 2;
  const speed = randomRange(options.minSpeed, options.maxSpeed);

  return {
    x: centerX,
    y: centerY,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    life: randomRange(10, 70),
    maxLife: randomRange(70, 130),
    color: options.colors[Math.floor(Math.random() * options.colors.length)]
  };
}

function Hyperspeed({ effectOptions = defaultOptions }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const options = { ...defaultOptions, ...effectOptions };
    const { r, g, b } = hexToRgb(options.backgroundColor || '#070b14');
    const canvas = canvasRef.current;

    if (!canvas) {
      return undefined;
    }

    const context = canvas.getContext('2d');
    if (!context) {
      return undefined;
    }

    let width = 0;
    let height = 0;
    let animationFrameId = null;
    let particles = [];

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      width = parent?.clientWidth || window.innerWidth;
      height = parent?.clientHeight || window.innerHeight;

      canvas.width = width;
      canvas.height = height;

      particles = Array.from({ length: options.lineCount }, () => createParticle(width, height, options));
    };

    const drawFrame = () => {
      context.fillStyle = `rgba(${r}, ${g}, ${b}, ${options.trailAlpha})`;
      context.fillRect(0, 0, width, height);

      context.lineCap = 'round';
      context.lineJoin = 'round';

      for (let index = 0; index < particles.length; index += 1) {
        const particle = particles[index];
        const previousX = particle.x;
        const previousY = particle.y;

        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life += 1;

        const alive =
          particle.x > -60 &&
          particle.x < width + 60 &&
          particle.y > -60 &&
          particle.y < height + 60 &&
          particle.life < particle.maxLife;

        if (!alive) {
          particles[index] = createParticle(width, height, options);
          continue;
        }

        const alpha = 1 - particle.life / particle.maxLife;
        const directionX = particle.vx;
        const directionY = particle.vy;
        const magnitude = Math.hypot(directionX, directionY) || 1;
        const tailX = previousX - (directionX / magnitude) * options.lineLength;
        const tailY = previousY - (directionY / magnitude) * options.lineLength;

        context.strokeStyle = particle.color;
        context.globalAlpha = Math.max(alpha, 0.12);
        context.shadowBlur = options.glow;
        context.shadowColor = particle.color;
        context.lineWidth = options.lineWidth;

        context.beginPath();
        context.moveTo(tailX, tailY);
        context.lineTo(particle.x, particle.y);
        context.stroke();
      }

      context.globalAlpha = 1;
      context.shadowBlur = 0;
      animationFrameId = window.requestAnimationFrame(drawFrame);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    animationFrameId = window.requestAnimationFrame(drawFrame);

    return () => {
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [effectOptions]);

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />;
}

export default Hyperspeed;
