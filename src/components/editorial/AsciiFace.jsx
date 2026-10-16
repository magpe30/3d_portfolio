import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

// An original devil drawn as vector paths, then sampled into a field of type.
// The small offscreen canvas is a lighting mask, not an image or font dependency.
export default function AsciiFace({ animate }) {
  const canvasRef = useRef(null);
  const pose = useRef({ time: 1.2, x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const mask = document.createElement('canvas');
    mask.width = mask.height = 256;
    const ink = mask.getContext('2d', { willReadFrequently: true });
    if (!context || !ink) return undefined;
    const state = pose.current;
    let width = 0, height = 0, frame, lastTime = 0, visible = false;
    let targetX = 0, targetY = 0;
    const glyphs = '·:;=+xX#@';

    const draw = () => {
      if (!width || !height) return;
      ink.clearRect(0, 0, 256, 256);
      const hornShade = ink.createLinearGradient(0, 30, 0, 112);
      hornShade.addColorStop(0, '#dedede');
      hornShade.addColorStop(1, '#585858');
      ink.fillStyle = hornShade;
      for (const mirrored of [false, true]) {
        ink.save();
        if (mirrored) { ink.translate(256, 0); ink.scale(-1, 1); }
        ink.beginPath();
        ink.moveTo(79, 107);
        ink.bezierCurveTo(48, 94, 37, 59, 42, 31);
        ink.bezierCurveTo(57, 48, 76, 53, 96, 60);
        ink.bezierCurveTo(106, 73, 97, 99, 79, 107);
        ink.fill();
        ink.restore();
      }

      const faceShade = ink.createRadialGradient(102, 103, 8, 138, 146, 105);
      faceShade.addColorStop(0, '#555555');
      faceShade.addColorStop(.5, '#777777');
      faceShade.addColorStop(1, '#c4c4c4');
      ink.fillStyle = faceShade;
      ink.beginPath();
      ink.ellipse(128, 144, 86, 85, 0, 0, Math.PI * 2);
      ink.fill();

      // Raised outer brows, two watchful eyes, and a deliberately crooked grin.
      ink.strokeStyle = '#ffffff';
      ink.fillStyle = '#ffffff';
      ink.lineCap = 'round';
      ink.lineWidth = 6;
      ink.beginPath();
      ink.moveTo(84, 112);
      ink.quadraticCurveTo(103, 112, 114, 125);
      ink.moveTo(142, 125);
      ink.quadraticCurveTo(153, 111, 173, 110);
      ink.stroke();
      const blinkPhase = state.time % 7;
      const openness = blinkPhase < .24 ? 1 - .88 * Math.sin(blinkPhase / .24 * Math.PI) : 1;
      for (const x of [103, 153]) {
        ink.beginPath();
        ink.ellipse(x + state.x * 3, 137 + state.y * 2, 6, 11 * openness, x < 128 ? -.12 : .12, 0, Math.PI * 2);
        ink.fill();
      }
      ink.beginPath();
      ink.moveTo(88, 163);
      ink.bezierCurveTo(110, 183, 145, 182, 170, 158);
      ink.bezierCurveTo(155, 200, 112, 207, 88, 163);
      ink.fill();

      const pixels = ink.getImageData(0, 0, 256, 256).data;
      context.clearRect(0, 0, width, height);
      context.save();
      context.translate(width / 2 + state.x * 7, height / 2 + Math.sin(state.time * .75) * 5);
      context.rotate(-.08 + Math.sin(state.time * .5) * .025 + state.x * .07);
      context.scale(1 - Math.abs(state.x) * .035, 1);
      const size = Math.min(width, height) * .94;
      const step = width < 400 ? 4.5 : 6;
      const line = step * 1.3;
      context.font = `${step * 1.25}px "Courier New", monospace`;
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillStyle = '#b43c29';
      for (let y = 0; y < size; y += line) {
        for (let x = 0; x < size; x += step) {
          const pixel = (Math.floor(y / size * 256) * 256 + Math.floor(x / size * 256)) * 4;
          if (pixels[pixel + 3] < 30) continue;
          const tone = pixels[pixel] / 255;
          context.globalAlpha = (.2 + tone * .8) * pixels[pixel + 3] / 255;
          context.fillText(glyphs[Math.min(8, Math.floor(tone * 9))], x - size / 2, y - size / 2);
        }
      }
      context.restore();
    };

    const tick = (time) => {
      if (!visible || document.hidden) lastTime = time;
      else if (time - lastTime > 32) {
        state.time += Math.min((time - lastTime) / 1000, .1);
        lastTime = time;
        state.x += (targetX - state.x) * .075;
        state.y += (targetY - state.y) * .075;
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
      draw();
    });
    const visibility = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    const onPointer = (event) => {
      if (!animate || event.pointerType === 'touch') return;
      const rect = canvas.getBoundingClientRect();
      targetX = (event.clientX - rect.left) / rect.width * 2 - 1;
      targetY = (event.clientY - rect.top) / rect.height * 2 - 1;
    };
    const resetPointer = () => { targetX = 0; targetY = 0; };
    resize.observe(canvas);
    visibility.observe(canvas);
    canvas.addEventListener('pointermove', onPointer);
    canvas.addEventListener('pointerleave', resetPointer);
    if (animate) frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      visibility.disconnect();
      canvas.removeEventListener('pointermove', onPointer);
      canvas.removeEventListener('pointerleave', resetPointer);
    };
  }, [animate]);

  return <canvas ref={canvasRef} className="ascii-face" aria-hidden="true" />;
}

AsciiFace.propTypes = { animate: PropTypes.bool.isRequired };
