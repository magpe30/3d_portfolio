import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { createBinaryGlyphs, SCREENS, objectPoints } from './asciiObjects';

const FORMS = ['camera', 'corded-keyboard'];
const CYCLE_SECONDS = 7;
const HOLD_SECONDS = 4.5;
const smoothstep = (value) => value * value * (3 - 2 * value);

export default function AsciiSculpture({
  animate,
  shape = 'keyboard',
  binaryRain = false,
  morph = false,
  disperse = false,
  onShapeChange,
  color = '#bd3925',
}) {
  const canvasRef = useRef(null);
  const simulation = useRef({ elapsed: 0, phase: 0.65, index: 0, rotationX: 0, rotationY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return undefined;
    const shapes = morph ? FORMS : [shape];
    const screen = !morph && (binaryRain || shape === 'monitor') ? SCREENS[shape] : null;
    const surfaces = shapes.map((form) => objectPoints(form, !!screen));
    const binaryGlyphs = screen ? createBinaryGlyphs(color) : null;
    const state = simulation.current;
    let width = 0,
      height = 0,
      frame,
      lastTime = 0,
      visible = false;
    let pointerX = 0,
      pointerY = 0,
      cursorX = -1000,
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
      const index = morph ? Math.floor(state.elapsed / CYCLE_SECONDS) % shapes.length : 0;
      const nextIndex = (index + 1) % shapes.length;
      const cycleTime = state.elapsed % CYCLE_SECONDS;
      const blend = morph
        ? smoothstep(Math.max(0, (cycleTime - HOLD_SECONDS) / (CYCLE_SECONDS - HOLD_SECONDS)))
        : 0;
      const source = surfaces[index],
        destination = surfaces[nextIndex];
      if (state.index !== index) {
        state.index = index;
        onShapeChange?.(index);
      }
      const rotation =
        Math.sin(state.phase * 0.35) * (binaryGlyphs ? 0.045 : 0.12) + state.rotationX;
      const tilt =
        (binaryGlyphs ? -0.06 : -0.12) + Math.cos(state.phase * 0.4) * 0.035 + state.rotationY;
      const roll =
        (binaryGlyphs ? -0.035 : morph ? -0.025 : -0.16) +
        Math.sin(state.phase * 0.3) * (binaryGlyphs ? 0.01 : 0.025);
      const cy = Math.cos(rotation),
        sy = Math.sin(rotation),
        cx = Math.cos(tilt),
        sx = Math.sin(tilt);
      const cr = Math.cos(roll),
        sr = Math.sin(roll);
      const size = Math.min(width, height) * (binaryGlyphs ? 0.4 : 0.29);
      const float = Math.sin(state.phase * 0.65) * 4;
      for (let i = 0; i < source.length; i += 3) {
        const x = source[i] + (destination[i] - source[i]) * blend;
        const y = source[i + 1] + (destination[i + 1] - source[i + 1]) * blend;
        const tone = source[i + 2] + (destination[i + 2] - source[i + 2]) * blend;
        // The monitor and its content share one flat plane, keeping the bezel straight.
        const z = binaryGlyphs ? 0 : tone * 0.14;
        const rx = x * cy + z * sy,
          rz = z * cy - x * sy;
        const ry = y * cx - rz * sx,
          dz = y * sx + rz * cx;
        const perspective = binaryGlyphs ? 1 : 6 / (6 - dz);
        const col = Math.floor((width / 2 + (rx * cr - ry * sr) * size * perspective) / step);
        const row = Math.floor(
          (height / 2 + (rx * sr + ry * cr) * size * perspective + float) / line,
        );
        if (col >= 0 && col < cols && row >= 0 && row < rows) {
          const cell = row * cols + col;
          tones[cell] += tone;
          weights[cell]++;
        }
      }
      context.font = `${step * 1.5}px "Courier New", monospace`;
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillStyle = color;
      const radius = Math.min(110, width * 0.22);
      for (let cell = 0; cell < tones.length; cell++) {
        if (!weights[cell]) continue;
        const tone = tones[cell] / weights[cell];
        const x = (cell % cols) * step,
          y = Math.floor(cell / cols) * line;
        const distance = Math.hypot(x - cursorX, y - cursorY);
        const fade = disperse
          ? 1 -
            cursorStrength *
              (1 -
                smoothstep(Math.min(1, Math.max(0, (distance - radius * 0.25) / (radius * 0.75)))))
          : 1;
        context.globalAlpha = (0.3 + tone * 0.7) * fade;
        context.fillText(glyphs[Math.min(8, Math.floor(tone * 9))], x, y);
      }
      context.globalAlpha = 1;
      if (binaryGlyphs) {
        // Project the screen plane with the sculpture, then clip the binary rain.
        const project = (px, py) => {
          const x = (px - 160) / 88,
            y = (py - 128) / 88,
            z = 0;
          const rx = x * cy + z * sy,
            rz = z * cy - x * sy;
          const ry = y * cx - rz * sx;
          return [
            width / 2 + (rx * cr - ry * sr) * size,
            height / 2 + (rx * sr + ry * cr) * size + float,
          ];
        };
        const origin = project(screen.x, screen.y),
          right = project(screen.x + screen.width, screen.y),
          bottom = project(screen.x, screen.y + screen.height);
        context.save();
        context.transform(
          (right[0] - origin[0]) / screen.width,
          (right[1] - origin[1]) / screen.width,
          (bottom[0] - origin[0]) / screen.height,
          (bottom[1] - origin[1]) / screen.height,
          origin[0],
          origin[1],
        );
        context.beginPath();
        context.rect(0, 0, screen.width, screen.height);
        context.clip();
        for (let column = 0; column < Math.floor(screen.width / 9); column++) {
          const length = 5 + ((column * 7) % 5);
          const speed = 17 + ((column * 11) % 17);
          const travel = screen.height + length * 9 + 24;
          const head = ((state.elapsed + 4) * speed + column * 37) % travel;
          const pass = Math.floor(((state.elapsed + 4) * speed + column * 37) / travel);
          for (let tail = 0; tail < length; tail++) {
            const y = head - tail * 9;
            if (y < 0 || y > screen.height) continue;
            const edge = Math.min(1, y / 6, (screen.height - y) / 8);
            context.globalAlpha =
              (tail === 0 ? 0.95 : 0.7 * Math.pow(1 - tail / length, 1.6)) * edge;
            const digit =
              ((column * 13 + tail * 7 + pass * 3) ^ ((column * 11 + tail * 5) >> 2)) & 1;
            context.drawImage(binaryGlyphs[digit], 4 + column * 9, y - 4, 7, 9);
          }
        }
        context.restore();
      }
    };
    const tick = (time) => {
      if (!visible || document.hidden) lastTime = time;
      else if (time - lastTime > 32) {
        const delta = Math.min((time - lastTime) / 1000, 0.1);
        state.phase += delta;
        state.elapsed += delta;
        lastTime = time;
        state.rotationX += (pointerX - state.rotationX) * 0.06;
        state.rotationY += (pointerY - state.rotationY) * 0.06;
        cursorStrength += ((pointerInside ? 1 : 0) - cursorStrength) * 0.18;
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
    });
    const pointer = (event) => {
      if (!animate || event.pointerType === 'touch') return;
      const rect = canvas.getBoundingClientRect();
      cursorX = event.clientX - rect.left;
      cursorY = event.clientY - rect.top;
      pointerInside = true;
      pointerX = (cursorX / rect.width - 0.5) * (binaryGlyphs ? 0.18 : 0.5);
      pointerY = (cursorY / rect.height - 0.5) * (binaryGlyphs ? 0.12 : 0.3);
    };
    const reset = () => {
      pointerX = 0;
      pointerY = 0;
      pointerInside = false;
    };
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
  }, [animate, color, shape, binaryRain, morph, disperse, onShapeChange]);
  return <canvas ref={canvasRef} className="ascii-sculpture" aria-hidden="true" />;
}

AsciiSculpture.propTypes = {
  animate: PropTypes.bool.isRequired,
  shape: PropTypes.oneOf(['keyboard', 'corded-keyboard', 'monitor', 'camera', 'laptop']),
  binaryRain: PropTypes.bool,
  morph: PropTypes.bool,
  disperse: PropTypes.bool,
  onShapeChange: PropTypes.func,
  color: PropTypes.string,
};
