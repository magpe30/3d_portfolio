// Shared by the blocks and morphing objects so their hover response feels consistent.
export function asciiRipple(x, y, pointer, phase, radius) {
  const dx = x - pointer.x;
  const dy = y - pointer.y;
  const distance = Math.hypot(dx, dy);
  const proximity = Math.max(0, 1 - distance / radius);
  const influence = proximity * proximity * (3 - 2 * proximity) * pointer.strength;
  const wave = Math.sin(distance * 0.055 - phase * 5);
  const push = influence * (16 + wave * 8);
  const swirl = influence * Math.cos(phase * 3 - distance * 0.035) * 4;
  const normal = Math.max(1, distance);
  return {
    x: x + (dx * push - dy * swirl) / normal,
    y: y + (dy * push + dx * swirl) / normal,
    alphaBoost: influence * 0.45,
  };
}
