import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const FORMS = ['orbit', 'wave', 'knot'];
const CYCLE_SECONDS = 6;
const HOLD_SECONDS = 3.8;
const smoothstep = (value) => value * value * (3 - 2 * value);

// Matching surface grids let every point travel continuously between all three forms.
function makeSurface(shape) {
  const points = new Float32Array(160 * 48 * 3);
  const tau = Math.PI * 2;
  const curve = (u) => shape === 'orbit'
    ? [1.35 * Math.cos(u), 1.35 * Math.sin(u), 0]
    : [(Math.sin(u) + 2 * Math.sin(2 * u)) * .53, (Math.cos(u) - 2 * Math.cos(2 * u)) * .53, -Math.sin(3 * u) * .53];
  for (let i = 0; i < 160; i++) {
    const u = i / 160 * tau;
    const p = curve(u), q = curve(u + .001);
    const tangent = q.map((v, k) => v - p[k]);
    const length = Math.hypot(...tangent);
    const t = tangent.map((v) => v / length);
    const nLength = Math.hypot(t[0], t[1]);
    const n = [-t[1] / nLength, t[0] / nLength, 0];
    const b = [-t[2] * n[1], t[2] * n[0], t[0] * n[1] - t[1] * n[0]];
    for (let j = 0; j < 48; j++) {
      const index = (i * 48 + j) * 3;
      if (shape === 'wave') {
        points[index] = (i / 159 - .5) * 4;
        points[index + 1] = (j / 47 - .5) * 3;
      } else {
        const v = j / 48 * tau;
        const radius = shape === 'orbit' ? .52 : .32;
        for (let k = 0; k < 3; k++) points[index + k] = p[k] + radius * (n[k] * Math.cos(v) + b[k] * Math.sin(v));
      }
    }
  }
  return points;
}

export default function AsciiSculpture({ animate, shape = 'knot', morph = false, disperse = false, onShapeChange, color = '#bd3925', className = '' }) {
  const canvasRef = useRef(null);
  // Keep the exact form and its progress when motion is paused and resumed.
  const simulation = useRef({ elapsed: 0, phase: .65, index: 0, rotationX: 0, rotationY: 0 });
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return undefined;
    const shapes = morph ? FORMS : [shape];
    const surfaces = shapes.map(makeSurface);
    const state = simulation.current;
    let width = 0, height = 0, frame;
    let visible = false, lastTime = 0;
    let pointerX = 0, pointerY = 0;
    let cursorX = -1000, cursorY = -1000, cursorStrength = 0, pointerInside = false;
    let step = 6.5, line = step * 1.35, cols = 0;
    let depth = new Float32Array(0);
    const glyphs = '·:;+*xX#@';
    const waveZ = (x, y) => Math.sin(x * 2.2 + state.phase * 2) * .36 + Math.cos(y * 2.5 + state.phase) * .28;

    const draw = () => {
      if (!width || !height) return;
      context.clearRect(0, 0, width, height);
      depth.fill(-Infinity);
      const index = morph ? Math.floor(state.elapsed / CYCLE_SECONDS) % shapes.length : 0;
      const nextIndex = (index + 1) % shapes.length;
      const cycleTime = state.elapsed % CYCLE_SECONDS;
      const blend = morph ? smoothstep(Math.max(0, (cycleTime - HOLD_SECONDS) / (CYCLE_SECONDS - HOLD_SECONDS))) : 0;
      const source = surfaces[index], destination = surfaces[nextIndex];
      if (state.index !== index) {
        state.index = index;
        onShapeChange?.(index);
      }
      const rotation = state.phase * .24 + state.rotationX, tilt = -.32 + state.rotationY;
      const cy = Math.cos(rotation), sy = Math.sin(rotation), cx = Math.cos(tilt), sx = Math.sin(tilt);
      const size = Math.min(width, height) * .235;
      for (let i = 0; i < source.length; i += 3) {
        const fromZ = shapes[index] === 'wave' ? waveZ(source[i], source[i + 1]) : source[i + 2];
        const toZ = shapes[nextIndex] === 'wave' ? waveZ(destination[i], destination[i + 1]) : destination[i + 2];
        const x = source[i] + (destination[i] - source[i]) * blend;
        const y = source[i + 1] + (destination[i + 1] - source[i + 1]) * blend;
        const z = fromZ + (toZ - fromZ) * blend;
        const rx = x * cy + z * sy, rz = z * cy - x * sy;
        const ry = y * cx - rz * sx, dz = y * sx + rz * cx;
        const perspective = 5.8 / (5.8 - dz);
        const col = Math.floor((width / 2 + rx * size * perspective) / step);
        const row = Math.floor((height / 2 + ry * size * perspective) / line);
        if (col >= 0 && col < cols && row >= 0 && row < depth.length / cols) {
          const cell = row * cols + col;
          if (dz > depth[cell]) depth[cell] = dz;
        }
      }
      context.font = `${step * 1.3}px "Courier New", monospace`;
      context.textAlign = 'center';
      context.fillStyle = color;
      const radius = Math.min(110, width * .22);
      for (let cell = 0; cell < depth.length; cell++) {
        if (depth[cell] === -Infinity) continue;
        const shade = Math.max(0, Math.min(1, (depth[cell] + 2) / 4));
        const x = (cell % cols) * step, y = Math.floor(cell / cols) * line;
        const distance = Math.hypot(x - cursorX, y - cursorY);
        const fade = disperse ? 1 - cursorStrength * (1 - smoothstep(Math.min(1, Math.max(0, (distance - radius * .25) / (radius * .75))))) : 1;
        context.globalAlpha = (.25 + shade * .75) * fade;
        context.fillText(glyphs[Math.min(glyphs.length - 1, Math.floor(shade * glyphs.length))], x, y);
      }
      context.globalAlpha = 1;
    };
    const tick = (time) => {
      if (!visible || document.hidden) {
        lastTime = time;
      } else if (time - lastTime > 32) {
        const delta = Math.min((time - lastTime) / 1000, .1);
        state.phase += delta;
        state.elapsed += delta;
        lastTime = time;
        state.rotationX += (pointerX - state.rotationX) * .045;
        state.rotationY += (pointerY - state.rotationY) * .045;
        cursorStrength += ((pointerInside ? 1 : 0) - cursorStrength) * .18;
        draw();
      }
      frame = requestAnimationFrame(tick);
    };
    const resize = new ResizeObserver(([entry]) => {
      width = entry.contentRect.width;
      height = entry.contentRect.height;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      step = width < 400 ? 5.5 : 6.5;
      line = step * 1.35;
      cols = Math.ceil(width / step);
      depth = new Float32Array(cols * Math.ceil(height / line));
      draw();
    });
    const visibility = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    const pointer = (event) => {
      if (!animate || event.pointerType === 'touch') return;
      const rect = canvas.getBoundingClientRect();
      cursorX = event.clientX - rect.left;
      cursorY = event.clientY - rect.top;
      pointerInside = true;
      pointerX = (cursorX / rect.width - .5) * (disperse ? .3 : 1.4);
      pointerY = (cursorY / rect.height - .5) * (disperse ? .2 : .7);
    };
    const reset = () => { pointerX = 0; pointerY = 0; pointerInside = false; };
    resize.observe(canvas);
    visibility.observe(canvas);
    canvas.addEventListener('pointermove', pointer);
    canvas.addEventListener('pointerleave', reset);
    if (animate) frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      visibility.disconnect();
      canvas.removeEventListener('pointermove', pointer);
      canvas.removeEventListener('pointerleave', reset);
    };
  }, [animate, color, shape, morph, disperse, onShapeChange]);
  return <canvas ref={canvasRef} className={`ascii-sculpture ${className}`} aria-hidden="true" />;
}

AsciiSculpture.propTypes = {
  animate: PropTypes.bool.isRequired,
  shape: PropTypes.oneOf(['knot', 'orbit', 'wave']),
  morph: PropTypes.bool,
  disperse: PropTypes.bool,
  onShapeChange: PropTypes.func,
  color: PropTypes.string,
  className: PropTypes.string,
};
