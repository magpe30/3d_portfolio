import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const COLUMNS = 14;
const ROWS = 8;
const SETTLE_SECONDS = 0.85;
const PIECES = [
  {
    x: 6,
    y: 0,
    width: 2,
    height: 2,
    delay: 0.45,
    duration: 2.4,
    distance: 4,
    rotation: 0,
  },
  {
    x: 8,
    y: 5,
    width: 4,
    height: 1,
    delay: 1.65,
    duration: 4.2,
    distance: 7,
    rotation: Math.PI / 2,
  },
];
const FINISH_SECONDS =
  Math.max(...PIECES.map((piece) => piece.delay + piece.duration)) + SETTLE_SECONDS;

// Cache the heavier bevel and face; moving characters are layered over this texture.
function createTile(size, ratio, color) {
  const tile = document.createElement('canvas');
  tile.width = Math.ceil(size * ratio);
  tile.height = Math.ceil(size * ratio);
  const ctx = tile.getContext('2d');
  if (!ctx) return tile;
  ctx.scale(ratio, ratio);
  const columns = Math.max(5, Math.round(size / 4.5));
  const rows = Math.max(4, Math.round(size / 6));
  const stepX = size / columns;
  const stepY = size / rows;
  ctx.font = `600 ${Math.min(stepX * 1.55, stepY * 1.15)}px "Courier New", monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = color;
  const texture = ['+', 'x', 'X', 'x', '+', ':'];
  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      const bevel = Math.min(columns, rows) > 6 ? 2 : 1;
      const edge =
        row < bevel || column < bevel || row >= rows - bevel || column >= columns - bevel;
      const shade = (column / columns + row / rows) / 2;
      const side = column >= columns - bevel || row >= rows - bevel;
      ctx.globalAlpha = edge ? (side ? 0.88 : 0.65) : 0.28 + shade * 0.26;
      ctx.fillText(
        edge ? (side ? '@' : '#') : texture[(row * 3 + column * 7) % texture.length],
        (column + 0.5) * stepX,
        (row + 0.5) * stepY,
      );
    }
  }
  return tile;
}

export default function AsciiBlocks({ animate, color = '#bd3925' }) {
  const canvasRef = useRef(null);
  const elapsedRef = useRef(0);
  const phaseRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;
    let width = 0,
      height = 0,
      cell = 0,
      gap = 0,
      ratio = 1;
    let tile,
      foundation,
      frame,
      lastTime = null,
      visible = false;
    let facePoints = [],
      baseTiles = [];
    let faceFont = '',
      lastDraw = 0;
    const pointer = { x: -1000, y: -1000, active: false, strength: 0 };
    const tilt = { x: 0, y: 0 };

    if (!animate) elapsedRef.current = FINISH_SECONDS;

    const drawTile = (target, x, y) => {
      target.drawImage(tile, x * cell + gap / 2, y * cell + gap / 2, cell - gap, cell - gap);
    };

    const drawLiveFace = (x, y, worldX = x, worldY = y) => {
      if (!animate) return;
      const phase = phaseRef.current;
      const seed = worldX * 0.73 + worldY * 0.41;
      const radius = Math.min(110, width * 0.18);
      ctx.save();
      // Keep flowing glyphs inside the bevel, including during a falling piece's turn.
      ctx.beginPath();
      ctx.rect(x * cell + gap + 3, y * cell + gap + 3, cell - gap * 2 - 6, cell - gap * 2 - 6);
      ctx.clip();
      ctx.font = faceFont;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = color;
      for (const point of facePoints) {
        const wave = (phase * 0.42 + seed + point.column * 0.19) % 1;
        const trail = (point.v - wave + 1) % 1;
        const glow = Math.max(0, 1 - trail / 0.32);
        const worldPointX = (width - cell * COLUMNS) / 2 + worldX * cell + point.x;
        const worldPointY = (height - cell * ROWS) / 2 + worldY * cell + point.y;
        const dx = worldPointX - pointer.x;
        const dy = worldPointY - pointer.y;
        const distance = Math.hypot(dx, dy);
        const influence = Math.max(0, 1 - distance / radius) * pointer.strength;
        const driftX = Math.sin(phase * 1.4 + point.v * 5 + seed) * 0.8;
        const driftY = Math.cos(phase * 1.1 + point.column * 0.7 + seed) * 1.1;
        const shift = influence * 4;
        ctx.globalAlpha = 0.12 + glow * 0.48 + influence * 0.2;
        const digit = (point.column + Math.floor(phase * 2 + seed)) % 2 ? '1' : '0';
        ctx.fillText(
          glow > 0.45 ? digit : '+',
          x * cell + point.x + driftX + (dx / Math.max(1, distance)) * shift,
          y * cell + point.y + driftY + (dy / Math.max(1, distance)) * shift,
        );
      }
      ctx.restore();
    };

    const draw = () => {
      if (!width || !height || !foundation) return;
      ctx.clearRect(0, 0, width, height);
      ctx.save();
      // A restrained tilt recalls the laptop without disturbing the block arrangement.
      ctx.translate(width / 2, height / 2);
      ctx.transform(1, tilt.y * 0.012, tilt.x * 0.018, 1, 0, 0);
      ctx.rotate(animate ? Math.sin(phaseRef.current * 0.35) * 0.004 : 0);
      ctx.translate((-cell * COLUMNS) / 2, (-cell * ROWS) / 2);
      ctx.drawImage(foundation, 0, 0, cell * COLUMNS, cell * ROWS);
      for (const [x, y] of baseTiles) drawLiveFace(x, y);

      for (const piece of PIECES) {
        const time = elapsedRef.current - piece.delay;
        if (time < 0) continue;
        const progress = Math.min(1, time / piece.duration);
        const landingTime = Math.max(0, time - piece.duration);
        const settling = progress === 1 && landingTime < SETTLE_SECONDS;
        const rebound = settling
          ? Math.exp(-8 * landingTime) * Math.abs(Math.sin(14 * landingTime))
          : 0;
        // A steady descent gives the pieces a deliberate, Tetris-like pace.
        const drop = -piece.distance * cell * (1 - progress) - rebound * cell * 0.24;
        const turnProgress = Math.min(1, Math.max(0, (progress - 0.38) / 0.27));
        const turnEase = turnProgress * turnProgress * (3 - 2 * turnProgress);
        const rotation = piece.rotation * (1 - turnEase);
        const squash = settling
          ? 1 - 0.07 * Math.exp(-10 * landingTime) * Math.cos(14 * landingTime)
          : 1;

        // Anchor the small compression at the contact edge, so the stack stays grounded.
        ctx.save();
        ctx.translate((piece.x + piece.width / 2) * cell, (piece.y + piece.height) * cell + drop);
        ctx.scale(1 / Math.sqrt(squash), squash);
        // Turn around the piece's center while keeping landing compression at its base.
        ctx.translate(0, (-piece.height * cell) / 2);
        ctx.rotate(rotation);
        ctx.translate((-piece.width * cell) / 2, (-piece.height * cell) / 2);
        for (let row = 0; row < piece.height; row++) {
          for (let column = 0; column < piece.width; column++) {
            drawTile(ctx, column, row);
            drawLiveFace(column, row, piece.x + column, piece.y + row + drop / cell);
          }
        }
        ctx.restore();
      }
      ctx.restore();
    };

    const tick = (time) => {
      frame = undefined;
      if (!animate || !visible || document.hidden) return;
      // Cap drawing at 30fps; no frames run while offscreen or in a hidden tab.
      if (time - lastDraw >= 1000 / 30) {
        const delta = lastTime === null ? 0 : Math.min((time - lastTime) / 1000, 0.1);
        elapsedRef.current = Math.min(FINISH_SECONDS, elapsedRef.current + delta);
        phaseRef.current += delta;
        lastTime = time;
        lastDraw = time;
        pointer.strength += ((pointer.active ? 1 : 0) - pointer.strength) * 0.14;
        const targetX = pointer.active ? (pointer.x / width - 0.5) * 2 : 0;
        const targetY = pointer.active ? (pointer.y / height - 0.5) * 2 : 0;
        tilt.x += (targetX - tilt.x) * 0.06;
        tilt.y += (targetY - tilt.y) * 0.06;
        draw();
      }
      frame = requestAnimationFrame(tick);
    };
    const syncPlayback = () => {
      cancelAnimationFrame(frame);
      lastTime = null;
      if (animate && visible && !document.hidden) frame = requestAnimationFrame(tick);
    };
    const movePointer = (event) => {
      if (!animate || event.pointerType === 'touch') return;
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active = true;
    };
    const resetPointer = () => {
      pointer.active = false;
    };

    const resize = new ResizeObserver(([entry]) => {
      width = entry.contentRect.width;
      height = entry.contentRect.height;
      if (!width || !height) return;
      ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      cell = Math.min(width / COLUMNS, height / ROWS) * 0.95;
      gap = Math.max(2, cell * 0.07);
      tile = createTile(cell - gap, ratio, color);
      const steps = Math.max(4, Math.round((cell - gap) / 6));
      const step = (cell - gap) / steps;
      faceFont = `600 ${step * 1.25}px "Courier New", monospace`;
      facePoints = [];
      for (let row = 1; row < steps - 1; row++) {
        for (let column = 1; column < steps - 1; column += 2) {
          facePoints.push({
            x: gap / 2 + (column + 0.5) * step,
            y: gap / 2 + (row + 0.5) * step,
            v: row / steps,
            column,
          });
        }
      }
      baseTiles = [];
      foundation = document.createElement('canvas');
      foundation.width = Math.ceil(cell * COLUMNS * ratio);
      foundation.height = Math.ceil(cell * ROWS * ratio);
      const base = foundation.getContext('2d');
      if (!base) return;
      base.scale(ratio, ratio);
      // A low stepped base and central tower echo the reference's block silhouette.
      for (let row = 0; row < ROWS; row++) {
        for (let column = 0; column < COLUMNS; column++) {
          const floor = row === 7 || (row === 6 && column < 12);
          const leftStep = row >= 4 && row <= 5 && column < 2;
          const tower = row <= 5 && column >= 4 && column <= 7;
          const squareSlot = row < 2 && column >= 6;
          if (floor || leftStep || (tower && !squareSlot)) {
            drawTile(base, column, row);
            baseTiles.push([column, row]);
          }
        }
      }
      draw();
    });
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      syncPlayback();
    });
    resize.observe(canvas);
    intersection.observe(canvas);
    document.addEventListener('visibilitychange', syncPlayback);
    canvas.addEventListener('pointermove', movePointer);
    canvas.addEventListener('pointerleave', resetPointer);
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      intersection.disconnect();
      document.removeEventListener('visibilitychange', syncPlayback);
      canvas.removeEventListener('pointermove', movePointer);
      canvas.removeEventListener('pointerleave', resetPointer);
    };
  }, [animate, color]);

  return <canvas ref={canvasRef} className="ascii-sculpture ascii-blocks" aria-hidden="true" />;
}

AsciiBlocks.propTypes = {
  animate: PropTypes.bool.isRequired,
  color: PropTypes.string,
};
