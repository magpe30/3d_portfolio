const MASK_WIDTH = 320;
const MASK_HEIGHT = 256;
const POINT_COUNT = 7200;
const cache = new Map();
export const SCREENS = {
  monitor: { x: 43, y: 24, width: 234, height: 122 },
  laptop: { x: 69, y: 49, width: 182, height: 119 },
};

function roundedRect(ctx, x, y, width, height, radius, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, radius);
  ctx.fill();
}

function drawKeyboard(ctx) {
  roundedRect(ctx, 25, 78, 270, 136, 12, '#bcbcbc');
  const plate = ctx.createLinearGradient(30, 74, 290, 195);
  plate.addColorStop(0, '#777777');
  plate.addColorStop(1, '#ababab');
  roundedRect(ctx, 25, 70, 270, 136, 12, plate);
  roundedRect(ctx, 35, 81, 250, 112, 6, '#333333');
  const rows = [14, 14, 13, 12];
  rows.forEach((keys, row) => {
    const offset = row > 1 ? (row - 1) * 4 : 0;
    for (let key = 0; key < keys; key++) {
      const x = 41 + offset + key * 17;
      const y = 88 + row * 20;
      const wide = key === keys - 1 ? 278 - x : 13;
      roundedRect(ctx, x, y + 2, wide, 16, 2, '#626262');
      roundedRect(ctx, x, y, wide, 14, 2, '#dcdcdc');
      // A tiny legend reads as a subtle mark once sampled into characters.
      ctx.fillStyle = '#505050';
      ctx.fillRect(x + 4, y + 4, 4, 3);
    }
  });
  for (const [x, width] of [
    [41, 24],
    [69, 24],
    [97, 104],
    [205, 22],
    [231, 22],
    [257, 21],
  ]) {
    roundedRect(ctx, x, 169, width, 15, 2, '#dcdcdc');
  }
  ctx.fillStyle = '#efefef';
  ctx.fillRect(258, 198, 12, 2);
}

function drawCordedKeyboard(ctx) {
  // Give the cable room to curve above the keyboard, like a desk viewed from above.
  ctx.save();
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(160, 108);
  ctx.bezierCurveTo(144, 65, 238, 83, 275, 42);
  ctx.bezierCurveTo(286, 30, 290, 22, 301, 17);
  ctx.strokeStyle = '#777777';
  ctx.lineWidth = 6;
  ctx.stroke();
  ctx.strokeStyle = '#dddddd';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.translate(0, 48);
  ctx.scale(1, 0.82);
  drawKeyboard(ctx);
  ctx.restore();
}

function drawMonitor(ctx) {
  // A standalone display and stand; the screen is reserved for live binary rain.
  roundedRect(ctx, 150, 156, 20, 22, 3, '#999999');
  roundedRect(ctx, 122, 176, 76, 5, 3, '#cccccc');
  roundedRect(ctx, 35, 19, 250, 146, 6, '#777777');
  roundedRect(ctx, 35, 16, 250, 146, 6, '#bcbcbc');
  roundedRect(ctx, 39, 20, 242, 130, 3, '#626262');
  roundedRect(ctx, 157, 153, 6, 2, 1, '#efefef');
  // Leave the display clear for the falling digits.
  ctx.clearRect(
    SCREENS.monitor.x,
    SCREENS.monitor.y,
    SCREENS.monitor.width,
    SCREENS.monitor.height,
  );
}

// Cache the two glyphs so each rain frame only composites small images.
export function createBinaryGlyphs(color) {
  return ['0', '1'].map((digit) => {
    const sprite = document.createElement('canvas');
    sprite.width = 24;
    sprite.height = 32;
    const ink = sprite.getContext('2d');
    ink.fillStyle = color;
    ink.font = '24px "Courier New", monospace';
    ink.textAlign = 'center';
    ink.textBaseline = 'middle';
    ink.fillText(digit, 12, 16);
    return sprite;
  });
}

function drawCamera(ctx) {
  roundedRect(ctx, 52, 63, 40, 15, 4, '#dddddd');
  roundedRect(ctx, 105, 51, 87, 33, 7, '#bcbcbc');
  roundedRect(ctx, 121, 58, 54, 15, 3, '#494949');
  const body = ctx.createLinearGradient(35, 80, 280, 213);
  body.addColorStop(0, '#ababab');
  body.addColorStop(1, '#626262');
  roundedRect(ctx, 30, 78, 260, 142, 13, '#b8b8b8');
  roundedRect(ctx, 30, 75, 260, 137, 13, body);
  roundedRect(ctx, 41, 96, 37, 99, 7, '#474747');
  for (let x = 47; x < 75; x += 7) {
    ctx.fillStyle = '#777777';
    ctx.fillRect(x, 103, 2, 85);
  }
  roundedRect(ctx, 235, 92, 32, 17, 3, '#e8e8e8');
  roundedRect(ctx, 238, 95, 26, 11, 1, '#9a9a9a');
  for (const [radius, color] of [
    [61, '#dddddd'],
    [54, '#454545'],
    [46, '#ababab'],
    [39, '#303030'],
  ]) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(162, 146, radius, 0, Math.PI * 2);
    ctx.fill();
  }
  const glass = ctx.createRadialGradient(150, 132, 4, 162, 146, 33);
  glass.addColorStop(0, '#bcbcbc');
  glass.addColorStop(0.4, '#666666');
  glass.addColorStop(1, '#999999');
  ctx.fillStyle = glass;
  ctx.beginPath();
  ctx.arc(162, 146, 32, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#333333';
  ctx.beginPath();
  ctx.arc(165, 149, 17, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#e0e0e0';
  ctx.beginPath();
  ctx.ellipse(150, 132, 8, 5, -0.7, 0, Math.PI * 2);
  ctx.fill();
}

function drawLaptop(ctx) {
  roundedRect(ctx, 56, 34, 208, 149, 8, '#cccccc');
  roundedRect(ctx, 63, 41, 194, 135, 4, '#424242');
  roundedRect(ctx, 69, 49, 182, 119, 2, '#585858');
  ctx.fillStyle = '#dddddd';
  ctx.fillRect(155, 37, 9, 2);
  ctx.fillStyle = '#8f8f8f';
  ctx.fillRect(69, 49, 182, 10);
  for (let x = 76; x < 94; x += 7) ctx.fillRect(x, 52, 3, 3);
  // A quiet editor window, with enough contrast to survive the ASCII sampling.
  const lines = [
    [85, 78, 47],
    [99, 92, 88],
    [99, 106, 66],
    [112, 120, 98],
    [99, 134, 50],
    [85, 148, 27],
  ];
  for (const [x, y, length] of lines) {
    ctx.fillStyle = y === 78 || y === 148 ? '#d5d5d5' : '#969696';
    ctx.fillRect(x, y, length, 4);
  }
  ctx.fillStyle = '#aaaaaa';
  ctx.beginPath();
  ctx.moveTo(56, 184);
  ctx.lineTo(264, 184);
  ctx.lineTo(299, 224);
  ctx.lineTo(21, 224);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#626262';
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 13; col++) {
      ctx.fillRect(65 - row * 5 + col * (14 + row * 0.6), 190 + row * 7, 10 + row, 4);
    }
  }
  roundedRect(ctx, 133, 213, 54, 8, 2, '#727272');
  ctx.fillStyle = '#dddddd';
  ctx.beginPath();
  ctx.moveTo(21, 224);
  ctx.lineTo(299, 224);
  ctx.lineTo(291, 232);
  ctx.lineTo(29, 232);
  ctx.closePath();
  ctx.fill();
}

// Spatial ordering keeps nearby points together as they move into the next object.
function spatialKey(x, y) {
  let key = 0;
  for (let bit = 0; bit < 9; bit++) {
    key |= ((x >> bit) & 1) << (bit * 2);
    key |= ((y >> bit) & 1) << (bit * 2 + 1);
  }
  return key;
}

export function objectPoints(shape, clearScreen = false) {
  const key = `${shape}:${clearScreen}`;
  if (cache.has(key)) return cache.get(key);
  const mask = document.createElement('canvas');
  mask.width = MASK_WIDTH;
  mask.height = MASK_HEIGHT;
  const ctx = mask.getContext('2d', { willReadFrequently: true });
  if (!ctx) return new Float32Array(0);
  ({
    keyboard: drawKeyboard,
    'corded-keyboard': drawCordedKeyboard,
    monitor: drawMonitor,
    camera: drawCamera,
    laptop: drawLaptop,
  })[shape](ctx);
  const screen = clearScreen && SCREENS[shape];
  if (screen) ctx.clearRect(screen.x, screen.y, screen.width, screen.height);
  const pixels = ctx.getImageData(0, 0, MASK_WIDTH, MASK_HEIGHT).data;
  const samples = [];
  for (let y = 0; y < MASK_HEIGHT; y += 2) {
    for (let x = 0; x < MASK_WIDTH; x += 2) {
      const pixel = (y * MASK_WIDTH + x) * 4;
      if (pixels[pixel + 3] > 120)
        samples.push({ x, y, tone: pixels[pixel] / 255, key: spatialKey(x, y) });
    }
  }
  samples.sort((a, b) => a.key - b.key);
  const points = new Float32Array(POINT_COUNT * 3);
  for (let i = 0; i < POINT_COUNT; i++) {
    const sample = samples[Math.floor((i / POINT_COUNT) * samples.length)];
    points[i * 3] = (sample.x - 160) / 88;
    points[i * 3 + 1] = (sample.y - 128) / 88;
    points[i * 3 + 2] = sample.tone;
  }
  cache.set(key, points);
  return points;
}
