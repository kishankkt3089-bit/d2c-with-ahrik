// Generate PNG favicon from SVG using Canvas API in Node.js (no external deps)
const fs = require('fs');
const { createCanvas } = require('canvas');

// We'll create the favicon directly using Canvas drawing commands
// matching the SVG design: dark bg, gradient A monogram, orange bar

function drawFavicon(size) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    const r = size * (110 / 512); // border radius ratio

    // --- Background rounded rect ---
    ctx.beginPath();
    ctx.moveTo(r, 0);
    ctx.lineTo(size - r, 0);
    ctx.quadraticCurveTo(size, 0, size, r);
    ctx.lineTo(size, size - r);
    ctx.quadraticCurveTo(size, size, size - r, size);
    ctx.lineTo(r, size);
    ctx.quadraticCurveTo(0, size, 0, size - r);
    ctx.lineTo(0, r);
    ctx.quadraticCurveTo(0, 0, r, 0);
    ctx.closePath();

    const bgGrad = ctx.createLinearGradient(0, 0, size, size);
    bgGrad.addColorStop(0, '#16112a');
    bgGrad.addColorStop(1, '#0a0c10');
    ctx.fillStyle = bgGrad;
    ctx.fill();

    // --- Gradient for A monogram ---
    const aGrad = ctx.createLinearGradient(0, size, size, 0);
    aGrad.addColorStop(0, '#a855f7');
    aGrad.addColorStop(0.5, '#c084fc');
    aGrad.addColorStop(1, '#38bdf8');

    const scale = size / 512;

    // --- Draw stylized A (same polygon as SVG) ---
    ctx.shadowColor = '#c084fc';
    ctx.shadowBlur = size * 0.05;
    ctx.fillStyle = aGrad;
    ctx.beginPath();
    // Left leg
    ctx.moveTo(256 * scale, 108 * scale);
    ctx.lineTo(152 * scale, 390 * scale);
    ctx.lineTo(208 * scale, 390 * scale);
    ctx.lineTo(256 * scale, 228 * scale);
    ctx.closePath();
    ctx.fill();

    // Right leg
    ctx.beginPath();
    ctx.moveTo(256 * scale, 108 * scale);
    ctx.lineTo(360 * scale, 390 * scale);
    ctx.lineTo(304 * scale, 390 * scale);
    ctx.lineTo(256 * scale, 228 * scale);
    ctx.closePath();
    ctx.fill();

    // Crossbar
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = size * 0.03;
    ctx.beginPath();
    const cbX = 196 * scale, cbY = 282 * scale, cbW = 120 * scale, cbH = 34 * scale, cbR = 6 * scale;
    ctx.moveTo(cbX + cbR, cbY);
    ctx.lineTo(cbX + cbW - cbR, cbY);
    ctx.quadraticCurveTo(cbX + cbW, cbY, cbX + cbW, cbY + cbR);
    ctx.lineTo(cbX + cbW, cbY + cbH - cbR);
    ctx.quadraticCurveTo(cbX + cbW, cbY + cbH, cbX + cbW - cbR, cbY + cbH);
    ctx.lineTo(cbX + cbR, cbY + cbH);
    ctx.quadraticCurveTo(cbX, cbY + cbH, cbX, cbY + cbH - cbR);
    ctx.lineTo(cbX, cbY + cbR);
    ctx.quadraticCurveTo(cbX, cbY, cbX + cbR, cbY);
    ctx.closePath();
    ctx.fill();

    // --- Orange accent bar ---
    ctx.shadowColor = '#fb923c';
    ctx.shadowBlur = size * 0.04;
    const obX = 178 * scale, obY = 400 * scale, obW = 156 * scale, obH = 12 * scale, obR = 6 * scale;
    const orangeGrad = ctx.createLinearGradient(obX, 0, obX + obW, 0);
    orangeGrad.addColorStop(0, '#ff7e00');
    orangeGrad.addColorStop(0.5, '#fb923c');
    orangeGrad.addColorStop(1, '#ffb703');
    ctx.fillStyle = orangeGrad;
    ctx.beginPath();
    ctx.moveTo(obX + obR, obY);
    ctx.lineTo(obX + obW - obR, obY);
    ctx.quadraticCurveTo(obX + obW, obY, obX + obW, obY + obR);
    ctx.lineTo(obX + obW, obY + obH - obR);
    ctx.quadraticCurveTo(obX + obW, obY + obH, obX + obW - obR, obY + obH);
    ctx.lineTo(obX + obR, obY + obH);
    ctx.quadraticCurveTo(obX, obY + obH, obX, obY + obH - obR);
    ctx.lineTo(obX, obY + obR);
    ctx.quadraticCurveTo(obX, obY, obX + obR, obY);
    ctx.closePath();
    ctx.fill();

    return canvas.toBuffer('image/png');
}

try {
    const buf192 = drawFavicon(192);
    fs.writeFileSync('favicon-192.png', buf192);
    const buf512 = drawFavicon(512);
    fs.writeFileSync('favicon-512.png', buf512);
    const buf32 = drawFavicon(32);
    fs.writeFileSync('favicon.png', buf32);
    console.log('PNG favicons generated successfully');
} catch(e) {
    console.error('canvas error:', e.message);
}
