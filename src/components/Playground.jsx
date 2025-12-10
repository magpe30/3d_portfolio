import { useEffect, useRef, useState } from 'react';

const MODES = ['neon', 'bubbles', 'stars', 'fire'];

const Playground = () => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationRef = useRef(null);
  const drawingRef = useRef(false);
  const modeRef = useRef('neon');

  const [mode, setMode] = useState('neon');

  const handleModeChange = (next) => {
    setMode(next);
    modeRef.current = next;
    // clear particles when switching, so each mode feels distinct
    particlesRef.current = [];
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.clientWidth;
    let height = canvas.clientHeight;
    canvas.width = width;
    canvas.height = height;

    const handleResize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', handleResize);

    const draw = () => {
      const mode = modeRef.current;

      // background per mode
      if (mode === 'neon') {
        ctx.fillStyle = 'rgba(5, 20, 70, 0.4)';
      } else if (mode === 'bubbles') {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
      } else if (mode === 'stars') {
        ctx.fillStyle = 'rgba(2, 6, 23, 0.9)';
      } else if (mode === 'fire') {
        ctx.fillStyle = 'rgba(15, 10, 5, 0.85)';
      }
      ctx.fillRect(0, 0, width, height);

      // update & draw particles
      particlesRef.current = particlesRef.current.filter((p) => p.life > 0);
      particlesRef.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.016;

        const alpha = Math.max(p.life, 0);
        const r = p.radius;

        if (alpha <= 0) return;

        if (mode === 'neon') {
          // soft blobs (what you had)
          const gradient = ctx.createRadialGradient(
            p.x,
            p.y,
            0,
            p.x,
            p.y,
            r * 4
          );
          gradient.addColorStop(0, `rgba(80, 182, 255, ${alpha})`);
          gradient.addColorStop(0.4, `rgba(236, 72, 153, ${alpha * 0.9})`);
          gradient.addColorStop(1, `rgba(59, 130, 246, 0)`);

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(p.x, p.y, r * 4, 0, Math.PI * 2);
          ctx.fill();
        } else if (mode === 'bubbles') {
          // hollow-ish bubbles with highlight
          ctx.beginPath();
          ctx.arc(p.x, p.y, r * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(34, 211, 238, ${alpha * 0.3})`;
          ctx.fill();

          ctx.lineWidth = 1.3;
          ctx.strokeStyle = `rgba(125, 211, 252, ${alpha})`;
          ctx.stroke();

          // small highlight
          ctx.beginPath();
          ctx.arc(p.x - r * 0.8, p.y - r * 0.8, r * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.7})`;
          ctx.fill();
        } else if (mode === 'stars') {
          // plus-shaped star ✦
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation || 0);

          ctx.strokeStyle = `rgba(250, 250, 255, ${alpha})`;
          ctx.lineWidth = 1;

          const len = r * 3;
          ctx.beginPath();
          ctx.moveTo(-len, 0);
          ctx.lineTo(len, 0);
          ctx.moveTo(0, -len);
          ctx.lineTo(0, len);
          ctx.stroke();

          // tiny core
          ctx.beginPath();
          ctx.arc(0, 0, r * 0.7, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(253, 224, 71, ${alpha})`;
          ctx.fill();

          ctx.restore();
        } else if (mode === 'fire') {
          // flame triangle
          const gradient = ctx.createLinearGradient(
            p.x,
            p.y,
            p.x,
            p.y - r * 4
          );
          gradient.addColorStop(0, `rgba(249, 115, 22, ${alpha})`);
          gradient.addColorStop(0.4, `rgba(248, 150, 30, ${alpha * 0.9})`);
          gradient.addColorStop(1, `rgba(254, 249, 195, 0)`);

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.moveTo(p.x - r, p.y);
          ctx.lineTo(p.x, p.y - r * 4);
          ctx.lineTo(p.x + r, p.y);
          ctx.closePath();
          ctx.fill();
        }
      });

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  const addSpark = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const mode = modeRef.current;
    const particles = particlesRef.current;
    let count = 14;

    if (mode === 'bubbles') count = 10;
    if (mode === 'stars') count = 8;
    if (mode === 'fire') count = 18;

    for (let i = 0; i < count; i++) {
      let vx = (Math.random() - 0.5) * 2.1;
      let vy = (Math.random() - 0.5) * 2.1 - 0.4;
      let radius = 1.2 + Math.random() * 2.5;
      let life = 1;
      let rotation = Math.random() * Math.PI * 2;

      if (mode === 'bubbles') {
        vy = -Math.random() * 1.4 - 0.2; // float up
        vx = (Math.random() - 0.5) * 0.6;
        radius = 2.0 + Math.random() * 3;
        life = 1.4;
      } else if (mode === 'stars') {
        vx = (Math.random() - 0.5) * 0.5;
        vy = (Math.random() - 0.5) * 0.5;
        radius = 1 + Math.random() * 2;
        life = 1.8;
      } else if (mode === 'fire') {
        vy = -Math.random() * 2.1 - 0.7; // rise faster
        vx = (Math.random() - 0.5) * 1.0;
        radius = 1.4 + Math.random() * 3;
        life = 0.9;
      }

      particles.push({
        x,
        y,
        vx,
        vy,
        life,
        radius,
        rotation,
      });
    }
  };

  const handleMouseDown = (e) => {
    drawingRef.current = true;
    addSpark(e);
  };

  const handleMouseUp = () => {
    drawingRef.current = false;
  };

  const handleMouseMove = (e) => {
    if (!drawingRef.current) return;
    addSpark(e);
  };

  const handleTouchStart = (e) => {
    drawingRef.current = true;
    const touch = e.touches[0];
    addSpark({
      clientX: touch.clientX,
      clientY: touch.clientY,
    });
  };
  
  const handleTouchMove = (e) => {
    if (!drawingRef.current) return;
    const touch = e.touches[0];
    addSpark({
      clientX: touch.clientX,
      clientY: touch.clientY,
    });
  };
  
  const handleTouchEnd = () => {
    drawingRef.current = false;
  };

  return (
    <section id="playground" className="scroll-mt-24 space-y-4">
      <div className="section-line pt-6 pb-2">
        <p className="label-upper text-slate-500">PLAYGROUND</p>
      </div>

      <p className="text-xs max-w-md text-slate-700">
        Drag inside the panel to draw different effects.
      </p>

      <div className="glass-panel p-4">
        <div className="flex justify-between items-center mb-3 text-[11px] label-upper text-slate-500">
          <span>
            {mode === 'neon' && 'NEON BLOBS · V0.1'}
            {mode === 'bubbles' && 'BUBBLE FIELD · V0.1'}
            {mode === 'stars' && 'STARFIELD · V0.1'}
            {mode === 'fire' && 'EMBER TRAILS · V0.1'}
          </span>
          <span>DRAG TO DRAW</span>
        </div>

        {/* mode buttons */}
        <div className="flex gap-2 mb-3 text-[10px]">
          {MODES.map((m) => (
            <button
              key={m}
              onClick={() => handleModeChange(m)}
              className={`px-3 py-1 rounded-full border border-[var(--blue-main)] transition
                ${
                  mode === m
                    ? 'bg-[var(--blue-main)] text-[var(--bg-main)]'
                    : 'bg-white text-[var(--blue-main)] hover:bg-[var(--blue-main)]/10'
                }`}
            >
              {m.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="rounded-xl overflow-hidden border border-[var(--blue-main)]">
          <canvas
            ref={canvasRef}
            className="w-full h-[260px] cursor-crosshair touch-none"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onMouseMove={handleMouseMove}
          
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          />
        </div>
      </div>
    </section>
  );
};

export default Playground;
