import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { asciiRipple } from './asciiRipple';
import { objectPoints } from './asciiObjects';

export default function AsciiSculpture({ animate, shape, color }) {
  const canvasRef = useRef(null);
  const simulation = useRef({ phase: 0.65 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return undefined;
    const points = objectPoints(shape);
    const state = simulation.current;
    let width = 0,
      height = 0,
      frame,
      lastTime = 0,
      visible = false;
    let cursorX = -1000,
      cursorY = -1000;
    let cursorStrength = 0,
      pointerInside = false;
    let step = 6,
      line = 8,
      cols = 0,
      rows = 0;
    let tones = new Float32Array(0),
      weights = new Uint16Array(0);
    const glyphs = '·:;=+xX#@';

    const draw = () => {
      if (!width || !height) return;
      context.clearRect(0, 0, width, height);
      tones.fill(0);
      weights.fill(0);
      const size = Math.min(width, height) * 0.29;
      const float = Math.sin(state.phase * 0.65) * 4;
      for (let i = 0; i < points.length; i += 3) {
        const col = Math.floor((width / 2 + points[i] * size) / step);
        const row = Math.floor((height / 2 + points[i + 1] * size + float) / line);
        if (col >= 0 && col < cols && row >= 0 && row < rows) {
          const cell = row * cols + col;
          tones[cell] += points[i + 2];
          weights[cell]++;
        }
      }
      context.font = `600 ${step * 1.5}px "Courier New", monospace`;
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillStyle = color;
      const radius = Math.min(170, width * 0.25);
      const ripplePointer = { x: cursorX, y: cursorY, strength: cursorStrength };
      for (let cell = 0; cell < tones.length; cell++) {
        if (!weights[cell]) continue;
        const tone = tones[cell] / weights[cell];
        const x = (cell % cols) * step,
          y = Math.floor(cell / cols) * line;
        const displaced = animate
          ? asciiRipple(x, y, ripplePointer, state.phase, radius)
          : { x, y, alphaBoost: 0 };
        context.globalAlpha = Math.min(1, 0.3 + tone * 0.7 + displaced.alphaBoost);
        context.fillText(glyphs[Math.min(8, Math.floor(tone * 9))], displaced.x, displaced.y);
      }
      context.globalAlpha = 1;
    };
    const tick = (time) => {
      if (!visible || document.hidden) return;
      if (time - lastTime > 32) {
        const delta = Math.min((time - lastTime) / 1000, 0.1);
        state.phase += delta;
        lastTime = time;
        cursorStrength += ((pointerInside ? 1 : 0) - cursorStrength) * 0.18;
        draw();
      }
      frame = requestAnimationFrame(tick);
    };
    const syncPlayback = () => {
      cancelAnimationFrame(frame);
      lastTime = performance.now();
      if (animate && visible && !document.hidden) frame = requestAnimationFrame(tick);
    };
    const resize = new ResizeObserver(([entry]) => {
      width = entry.contentRect.width;
      height = entry.contentRect.height;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      step = width < 400 ? 4 : 5;
      line = step * 1.3;
      cols = Math.ceil(width / step);
      rows = Math.ceil(height / line);
      tones = new Float32Array(cols * rows);
      weights = new Uint16Array(cols * rows);
      draw();
    });
    const visibility = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      syncPlayback();
    });
    const pointer = (event) => {
      if (!animate || event.pointerType === 'touch') return;
      const rect = canvas.getBoundingClientRect();
      cursorX = event.clientX - rect.left;
      cursorY = event.clientY - rect.top;
      pointerInside = true;
    };
    const reset = () => {
      pointerInside = false;
    };
    resize.observe(canvas);
    visibility.observe(canvas);
    canvas.addEventListener('pointermove', pointer);
    canvas.addEventListener('pointerleave', reset);
    document.addEventListener('visibilitychange', syncPlayback);
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      visibility.disconnect();
      canvas.removeEventListener('pointermove', pointer);
      canvas.removeEventListener('pointerleave', reset);
      document.removeEventListener('visibilitychange', syncPlayback);
    };
  }, [animate, color, shape]);
  return <canvas ref={canvasRef} className="ascii-sculpture" aria-hidden="true" />;
}

AsciiSculpture.propTypes = {
  animate: PropTypes.bool.isRequired,
  shape: PropTypes.oneOf(['keyboard', 'camera', 'processor']).isRequired,
  color: PropTypes.string.isRequired,
};
