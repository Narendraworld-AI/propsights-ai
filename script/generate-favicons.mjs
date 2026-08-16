import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const publicDir = path.resolve('client/public');
const resourcesDir = path.resolve('resources');

if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
if (!fs.existsSync(resourcesDir)) fs.mkdirSync(resourcesDir, { recursive: true });

// High quality vector SVG for PropSight India
const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1E40AF" />
      <stop offset="50%" stop-color="#2563EB" />
      <stop offset="100%" stop-color="#3B82F6" />
    </linearGradient>
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#60A5FA" />
      <stop offset="100%" stop-color="#93C5FD" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#0F172A" flood-opacity="0.3" />
    </filter>
  </defs>

  <!-- Rounded Squircle Background -->
  <rect width="512" height="512" rx="128" fill="url(#bgGrad)" />

  <!-- Location Pin Container -->
  <g filter="url(#glow)">
    <!-- Location Pin Body -->
    <path d="M 256 64 C 172 64 104 132 104 216 C 104 316 236 428 248 438 C 252.8 442 259.2 442 264 438 C 276 428 408 316 408 216 C 408 132 340 64 256 64 Z" fill="#FFFFFF" fill-opacity="0.15" />
    <path d="M 256 76 C 178 76 116 138 116 216 C 116 306 240 408 256 422 C 272 408 396 306 396 216 C 396 138 334 76 256 76 Z" fill="#0F172A" fill-opacity="0.25" />
  </g>

  <!-- Real Estate Skyline / Growth Chart Icon in Pure Crisp White -->
  <g fill="#FFFFFF" transform="translate(146, 120)">
    <!-- Central Tower -->
    <path d="M 80 40 L 110 12 L 140 40 L 140 220 L 80 220 Z" />
    <!-- Left Building -->
    <rect x="24" y="80" width="46" height="140" rx="4" />
    <!-- Right Building -->
    <rect x="150" y="100" width="46" height="120" rx="4" />
    <!-- Ground Platform -->
    <rect x="10" y="214" width="200" height="16" rx="6" />

    <!-- Windows Tower (Primary Blue Cutouts) -->
    <rect x="94" y="60" width="14" height="20" rx="3" fill="#2563EB" />
    <rect x="112" y="60" width="14" height="20" rx="3" fill="#2563EB" />
    <rect x="94" y="96" width="14" height="20" rx="3" fill="#2563EB" />
    <rect x="112" y="96" width="14" height="20" rx="3" fill="#2563EB" />
    <rect x="94" y="132" width="14" height="20" rx="3" fill="#2563EB" />
    <rect x="112" y="132" width="14" height="20" rx="3" fill="#2563EB" />
    <rect x="100" y="174" width="20" height="40" rx="3" fill="#2563EB" />

    <!-- Left Building Windows -->
    <rect x="36" y="98" width="22" height="18" rx="2" fill="#2563EB" />
    <rect x="36" y="130" width="22" height="18" rx="2" fill="#2563EB" />
    <rect x="36" y="162" width="22" height="18" rx="2" fill="#2563EB" />

    <!-- Right Building Windows -->
    <rect x="162" y="118" width="22" height="18" rx="2" fill="#2563EB" />
    <rect x="162" y="150" width="22" height="18" rx="2" fill="#2563EB" />
    <rect x="162" y="182" width="22" height="18" rx="2" fill="#2563EB" />

    <!-- Growth Trend Arrow upward right -->
    <path d="M 20 60 L 90 20 L 150 48 L 205 10" stroke="url(#accentGrad)" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" fill="none" />
    <polygon points="205,10 185,12 198,25" fill="#93C5FD" />
  </g>
</svg>`;

// Also a clean transparent favicon SVG for pure tab clarity
const svgFavicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="tabBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2563EB" />
      <stop offset="100%" stop-color="#1D4ED8" />
    </linearGradient>
    <linearGradient id="trendLine" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#60A5FA" />
      <stop offset="100%" stop-color="#93C5FD" />
    </linearGradient>
  </defs>

  <!-- Rounded Squircle Badge -->
  <rect width="512" height="512" rx="120" fill="url(#tabBg)" />

  <!-- Buildings in crisp white -->
  <g fill="#FFFFFF" transform="translate(146, 120)">
    <!-- Central Tower -->
    <path d="M 80 40 L 110 12 L 140 40 L 140 220 L 80 220 Z" />
    <!-- Left Building -->
    <rect x="24" y="80" width="46" height="140" rx="4" />
    <!-- Right Building -->
    <rect x="150" y="100" width="46" height="120" rx="4" />
    <!-- Ground Platform -->
    <rect x="10" y="214" width="200" height="16" rx="6" />

    <!-- Windows Tower (Blue Cutouts) -->
    <rect x="94" y="60" width="14" height="20" rx="3" fill="#1D4ED8" />
    <rect x="112" y="60" width="14" height="20" rx="3" fill="#1D4ED8" />
    <rect x="94" y="96" width="14" height="20" rx="3" fill="#1D4ED8" />
    <rect x="112" y="96" width="14" height="20" rx="3" fill="#1D4ED8" />
    <rect x="94" y="132" width="14" height="20" rx="3" fill="#1D4ED8" />
    <rect x="112" y="132" width="14" height="20" rx="3" fill="#1D4ED8" />
    <rect x="100" y="174" width="20" height="40" rx="3" fill="#1D4ED8" />

    <!-- Left Building Windows -->
    <rect x="36" y="98" width="22" height="18" rx="2" fill="#1D4ED8" />
    <rect x="36" y="130" width="22" height="18" rx="2" fill="#1D4ED8" />
    <rect x="36" y="162" width="22" height="18" rx="2" fill="#1D4ED8" />

    <!-- Right Building Windows -->
    <rect x="162" y="118" width="22" height="18" rx="2" fill="#1D4ED8" />
    <rect x="162" y="150" width="22" height="18" rx="2" fill="#1D4ED8" />
    <rect x="162" y="182" width="22" height="18" rx="2" fill="#1D4ED8" />

    <!-- Trend Arrow -->
    <path d="M 20 60 L 90 20 L 150 48 L 205 10" stroke="url(#trendLine)" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" fill="none" />
    <polygon points="205,10 185,12 198,25" fill="#93C5FD" />
  </g>
</svg>`;

async function createIco(pngBuffers) {
  // pngBuffers: array of { width, height, buffer }
  const count = pngBuffers.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type 1 = ICO
  header.writeUInt16LE(count, 4); // number of images

  let offset = 6 + count * 16;
  const entries = [];
  const imageBuffers = [];

  for (const img of pngBuffers) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(img.width >= 256 ? 0 : img.width, 0);
    entry.writeUInt8(img.height >= 256 ? 0 : img.height, 1);
    entry.writeUInt8(0, 2); // color palette count
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(img.buffer.length, 8); // image size
    entry.writeUInt32LE(offset, 12); // image offset

    entries.push(entry);
    imageBuffers.push(img.buffer);
    offset += img.buffer.length;
  }

  return Buffer.concat([header, ...entries, ...imageBuffers]);
}

async function run() {
  console.log('Generating PropSight favicon and icon assets...');

  // Save SVGs
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), svgFavicon, 'utf8');
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgIcon, 'utf8');

  const svgBuffer = Buffer.from(svgFavicon);

  // Generate PNG sizes
  const png16 = await sharp(svgBuffer).resize(16, 16).png().toBuffer();
  const png32 = await sharp(svgBuffer).resize(32, 32).png().toBuffer();
  const png48 = await sharp(svgBuffer).resize(48, 48).png().toBuffer();
  const png64 = await sharp(svgBuffer).resize(64, 64).png().toBuffer();
  const png180 = await sharp(svgBuffer).resize(180, 180).png().toBuffer();
  const png192 = await sharp(svgBuffer).resize(192, 192).png().toBuffer();
  const png512 = await sharp(svgBuffer).resize(512, 512).png().toBuffer();

  // Multi-size favicon.ico
  const icoBuffer = await createIco([
    { width: 16, height: 16, buffer: png16 },
    { width: 32, height: 32, buffer: png32 },
    { width: 48, height: 48, buffer: png48 },
  ]);

  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);
  fs.writeFileSync(path.join(publicDir, 'favicon.png'), png32);
  fs.writeFileSync(path.join(publicDir, 'favicon-16x16.png'), png16);
  fs.writeFileSync(path.join(publicDir, 'favicon-32x32.png'), png32);
  fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), png180);
  fs.writeFileSync(path.join(publicDir, 'icon-192.png'), png192);
  fs.writeFileSync(path.join(publicDir, 'icon-512.png'), png512);
  fs.writeFileSync(path.join(publicDir, 'icon.png'), png512);
  fs.writeFileSync(path.join(publicDir, 'app-icon.png'), png512);

  // Save into Capacitor resources too
  fs.writeFileSync(path.join(resourcesDir, 'icon.png'), png512);
  fs.writeFileSync(path.join(resourcesDir, 'splash.png'), png512);

  console.log('✅ Generated all icons & favicons successfully.');
}

run().catch(console.error);
