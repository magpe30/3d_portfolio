const MASK_WIDTH = 320;
const MASK_HEIGHT = 256;
const POINT_COUNT = 7200;
const cache = new Map();
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

// A processor with a small connected network: the same sampled-character
// treatment as the camera and keyboard, without an external image asset.
function drawProcessor(ctx) {
  for (let pin = 0; pin < 8; pin++) {
    const offset = 84 + pin * 21;
    roundedRect(ctx, offset, 34, 8, 24, 2, '#aaaaaa');
    roundedRect(ctx, offset, 204, 8, 24, 2, '#aaaaaa');
  }
  for (let pin = 0; pin < 6; pin++) {
    const offset = 72 + pin * 22;
    roundedRect(ctx, 42, offset, 24, 8, 2, '#aaaaaa');
    roundedRect(ctx, 254, offset, 24, 8, 2, '#aaaaaa');
  }
  roundedRect(ctx, 64, 55, 192, 155, 10, '#cccccc');
  roundedRect(ctx, 64, 49, 192, 155, 10, '#888888');
  roundedRect(ctx, 75, 60, 170, 132, 6, '#333333');
  roundedRect(ctx, 84, 69, 152, 114, 4, '#666666');
  const nodes = [
    [110, 94],
    [110, 158],
    [160, 126],
    [210, 94],
    [210, 158],
  ];
  ctx.strokeStyle = '#bbbbbb';
  ctx.lineWidth = 3;
  for (const index of [0, 1, 3, 4]) {
    ctx.beginPath();
    ctx.moveTo(...nodes[index]);
    ctx.lineTo(...nodes[2]);
    ctx.stroke();
  }
  nodes.forEach(([x, y], index) => {
    const size = index === 2 ? 25 : 15;
    roundedRect(ctx, x - size / 2, y - size / 2, size, size, 2, '#eeeeee');
  });
}

// Sample in a stable spatial order to distribute glyphs across each silhouette.
function spatialKey(x, y) {
  let key = 0;
  for (let bit = 0; bit < 9; bit++) {
    key |= ((x >> bit) & 1) << (bit * 2);
    key |= ((y >> bit) & 1) << (bit * 2 + 1);
  }
  return key;
}

export function objectPoints(shape) {
  if (cache.has(shape)) return cache.get(shape);
  const mask = document.createElement('canvas');
  mask.width = MASK_WIDTH;
  mask.height = MASK_HEIGHT;
  const ctx = mask.getContext('2d', { willReadFrequently: true });
  if (!ctx) return new Float32Array(0);
  ({
    keyboard: drawKeyboard,
    camera: drawCamera,
    processor: drawProcessor,
  })[shape](ctx);
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
  cache.set(shape, points);
  return points;
}
