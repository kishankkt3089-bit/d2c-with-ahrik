/**
 * Pure Node.js favicon.ico generator — no external dependencies
 * Creates a 32x32 ICO file with PNG embedded inside
 * Design: D2C WITH AHRIK brand favicon
 * Colors: Dark bg #16112a, A monogram purple→cyan, orange accent bar
 */
const zlib = require('zlib');
const fs = require('fs');

const SIZE = 32;

// ── Helper: write 4-byte little-endian uint32 ──
function u32le(n) {
  const b = Buffer.alloc(4);
  b.writeUInt32LE(n >>> 0, 0);
  return b;
}
function u16le(n) {
  const b = Buffer.alloc(2);
  b.writeUInt16LE(n >>> 0, 0);
  return b;
}

// ── Build RGBA pixel grid 32×32 ──
const pixels = [];
for (let y = 0; y < SIZE; y++) {
  pixels.push([]);
  for (let x = 0; x < SIZE; x++) {
    pixels[y].push([0, 0, 0, 0]); // transparent initially
  }
}

// ── Draw helpers ──
function setPixel(x, y, r, g, b, a = 255) {
  if (x < 0 || x >= SIZE || y < 0 || y >= SIZE) return;
  pixels[y][x] = [r, g, b, a];
}

// Blend two colours by position along gradient (0..1)
function gradAB(t, r1, g1, b1, r2, g2, b2) {
  return [
    Math.round(r1 + (r2 - r1) * t),
    Math.round(g1 + (g2 - g1) * t),
    Math.round(b1 + (b2 - b1) * t),
  ];
}

// ── 1. Rounded-square background #16112a ──
const BG = [22, 17, 42];          // #16112a
const RADIUS = 5;
for (let y = 0; y < SIZE; y++) {
  for (let x = 0; x < SIZE; x++) {
    // corner test
    const inCorner = (
      (x < RADIUS && y < RADIUS && Math.hypot(x - RADIUS, y - RADIUS) > RADIUS) ||
      (x >= SIZE - RADIUS && y < RADIUS && Math.hypot(x - (SIZE - RADIUS - 1), y - RADIUS) > RADIUS) ||
      (x < RADIUS && y >= SIZE - RADIUS && Math.hypot(x - RADIUS, y - (SIZE - RADIUS - 1)) > RADIUS) ||
      (x >= SIZE - RADIUS && y >= SIZE - RADIUS && Math.hypot(x - (SIZE - RADIUS - 1), y - (SIZE - RADIUS - 1)) > RADIUS)
    );
    if (!inCorner) setPixel(x, y, BG[0], BG[1], BG[2], 255);
  }
}

// ── 2. Geometric "A" monogram — purple(#a855f7) → cyan(#38bdf8) ──
// Scale SVG coords (512×512) down to 32×32
const sc = SIZE / 512;
// Polygon vertices for "A" shape (left leg, right leg, crossbar)
// Left leg: 256,108 → 152,390 → 208,390 → 256,228
// Right leg: 256,108 → 360,390 → 304,390 → 256,228
// We rasterise using a simple scanline approach

// Colour function: purple at bottom, cyan at top
function aColor(x, y) {
  const t = 1 - (y / SIZE); // 0=bottom(purple) → 1=top(cyan)
  return gradAB(t, 168, 85, 247, 56, 189, 248); // #a855f7 → #38bdf8
}

// Point-in-polygon test (ray casting)
function ptInPoly(px, py, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i][0], yi = poly[i][1];
    const xj = poly[j][0], yj = poly[j][1];
    if (((yi > py) !== (yj > py)) && px < (xj - xi) * (py - yi) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

// Left leg polygon (in 32px coords)
const leftLeg = [
  [256*sc, 108*sc],
  [152*sc, 390*sc],
  [208*sc, 390*sc],
  [256*sc, 228*sc],
];

// Right leg polygon
const rightLeg = [
  [256*sc, 108*sc],
  [360*sc, 390*sc],
  [304*sc, 390*sc],
  [256*sc, 228*sc],
];

// Crossbar rect (simplified as polygon)
const cbX1 = 196*sc, cbX2 = (196+120)*sc;
const cbY1 = 282*sc, cbY2 = (282+34)*sc;
const crossbar = [
  [cbX1, cbY1],
  [cbX2, cbY1],
  [cbX2, cbY2],
  [cbX1, cbY2],
];

for (let y = 0; y < SIZE; y++) {
  for (let x = 0; x < SIZE; x++) {
    if (pixels[y][x][3] === 0) continue; // skip transparent corners
    if (ptInPoly(x, y, leftLeg) || ptInPoly(x, y, rightLeg) || ptInPoly(x, y, crossbar)) {
      const [r, g, b] = aColor(x, y);
      setPixel(x, y, r, g, b, 255);
    }
  }
}

// ── 3. Orange accent bar #fb923c (bottom centre) ──
const barY1 = Math.round(400 * sc);
const barY2 = Math.round((400 + 12) * sc);
const barX1 = Math.round(178 * sc);
const barX2 = Math.round((178 + 156) * sc);
for (let y = barY1; y <= Math.min(barY2, SIZE - 1); y++) {
  for (let x = barX1; x <= Math.min(barX2, SIZE - 1); x++) {
    if (pixels[y][x][3] > 0) {
      setPixel(x, y, 251, 146, 60, 255); // #fb923c
    }
  }
}

// ── Build PNG binary (pure Node.js, uses built-in zlib) ──
function adler32(buf) {
  let a = 1, b = 0;
  for (const byte of buf) { a = (a + byte) % 65521; b = (b + a) % 65521; }
  return (b << 16) | a;
}

function makePNG(w, h, pixelGrid) {
  // PNG signature
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(w, 0);
  ihdrData.writeUInt32BE(h, 4);
  ihdrData[8] = 8;  // bit depth
  ihdrData[9] = 2;  // colour type RGB (no alpha — we handle bg ourselves)
  ihdrData[10] = 0; ihdrData[11] = 0; ihdrData[12] = 0;
  const ihdr = makeChunk('IHDR', ihdrData);

  // IDAT — raw image rows, each prefixed with filter byte 0
  const rawRows = [];
  for (let y = 0; y < h; y++) {
    rawRows.push(0); // filter byte None
    for (let x = 0; x < w; x++) {
      const [r, g, b] = pixelGrid[y][x];
      rawRows.push(r, g, b);
    }
  }
  const rawBuf = Buffer.from(rawRows);
  const compressed = zlib.deflateSync(rawBuf, { level: 9 });
  const idat = makeChunk('IDAT', compressed);

  // IEND
  const iend = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, ihdr, idat, iend]);
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeB = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.concat([typeB, data]);
  const crc = crc32(crcBuf);
  const crcOut = Buffer.alloc(4);
  crcOut.writeInt32BE(crc, 0);
  return Buffer.concat([len, typeB, data, crcOut]);
}

function crc32(buf) {
  let c = 0xFFFFFFFF;
  if (!crc32.table) {
    crc32.table = [];
    for (let n = 0; n < 256; n++) {
      let k = n;
      for (let i = 0; i < 8; i++) k = (k & 1) ? (0xEDB88320 ^ (k >>> 1)) : (k >>> 1);
      crc32.table[n] = k;
    }
  }
  for (const byte of buf) c = crc32.table[(c ^ byte) & 0xFF] ^ (c >>> 8);
  return (c ^ 0xFFFFFFFF) | 0;
}

const pngData = makePNG(SIZE, SIZE, pixels);

// ── Wrap PNG into ICO container ──
// ICO = ICONDIR(6) + ICONDIRENTRY(16) + PNG bytes
const icoHeader = Buffer.concat([
  u16le(0),        // reserved
  u16le(1),        // type: 1 = ICO
  u16le(1),        // count: 1 image
]);

const pngLen = pngData.length;
const dataOffset = 6 + 16; // header + one directory entry

const dirEntry = Buffer.concat([
  Buffer.from([SIZE, SIZE, 0, 0]),  // width, height, colorcount, reserved
  u16le(1),         // planes
  u16le(32),        // bit count
  u32le(pngLen),    // size of image data
  u32le(dataOffset),// offset of image data
]);

const ico = Buffer.concat([icoHeader, dirEntry, pngData]);
fs.writeFileSync('favicon.ico', ico);
console.log('favicon.ico created successfully! Size:', ico.length, 'bytes');
