/**
 * Generate all image assets for Reflect.fi
 * - OG image (1200x630) for social previews
 * - Favicon PNGs (16, 32, 180, 192, 512)
 * - favicon.ico
 */
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(__dirname, '..', 'public');

// ── Favicon SVG (square, icon only) ──
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#7c3aed"/>
      <stop offset="100%" stop-color="#06b6d4"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="96" fill="#0A0A1A"/>
  <rect x="128" y="128" width="256" height="256" rx="24" transform="rotate(45 256 256)" fill="url(#g)" opacity="0.9"/>
  <path d="M256 160 L352 256 L256 352 L160 256 Z" fill="rgba(255,255,255,0.15)"/>
  <path d="M256 200 L320 256 L256 312 L192 256 Z" fill="rgba(255,255,255,0.3)"/>
  <path d="M256 228 L292 256 L256 284 L220 256 Z" fill="rgba(255,255,255,0.5)"/>
</svg>`;

// ── OG Image SVG (1200x630) ──
const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0A0A1A"/>
      <stop offset="50%" stop-color="#0F0A2A"/>
      <stop offset="100%" stop-color="#0A1520"/>
    </linearGradient>
    <linearGradient id="diamond" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#7c3aed"/>
      <stop offset="100%" stop-color="#06b6d4"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#7c3aed" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#06b6d4" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="glow1" cx="350" cy="280" r="300" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#7c3aed" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#7c3aed" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="850" cy="350" r="250" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.1"/>
      <stop offset="100%" stop-color="#06b6d4" stop-opacity="0"/>
    </radialGradient>
    <filter id="blur1">
      <feGaussianBlur stdDeviation="12"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- Grid lines -->
  <g opacity="0.04" stroke="#fff" stroke-width="1">
    <line x1="0" y1="0" x2="0" y2="630"/><line x1="60" y1="0" x2="60" y2="630"/>
    <line x1="120" y1="0" x2="120" y2="630"/><line x1="180" y1="0" x2="180" y2="630"/>
    <line x1="240" y1="0" x2="240" y2="630"/><line x1="300" y1="0" x2="300" y2="630"/>
    <line x1="360" y1="0" x2="360" y2="630"/><line x1="420" y1="0" x2="420" y2="630"/>
    <line x1="480" y1="0" x2="480" y2="630"/><line x1="540" y1="0" x2="540" y2="630"/>
    <line x1="600" y1="0" x2="600" y2="630"/><line x1="660" y1="0" x2="660" y2="630"/>
    <line x1="720" y1="0" x2="720" y2="630"/><line x1="780" y1="0" x2="780" y2="630"/>
    <line x1="840" y1="0" x2="840" y2="630"/><line x1="900" y1="0" x2="900" y2="630"/>
    <line x1="960" y1="0" x2="960" y2="630"/><line x1="1020" y1="0" x2="1020" y2="630"/>
    <line x1="1080" y1="0" x2="1080" y2="630"/><line x1="1140" y1="0" x2="1140" y2="630"/>
    <line x1="0" y1="60" x2="1200" y2="60"/><line x1="0" y1="120" x2="1200" y2="120"/>
    <line x1="0" y1="180" x2="1200" y2="180"/><line x1="0" y1="240" x2="1200" y2="240"/>
    <line x1="0" y1="300" x2="1200" y2="300"/><line x1="0" y1="360" x2="1200" y2="360"/>
    <line x1="0" y1="420" x2="1200" y2="420"/><line x1="0" y1="480" x2="1200" y2="480"/>
    <line x1="0" y1="540" x2="1200" y2="540"/>
  </g>

  <!-- Glow orbs -->
  <rect width="1200" height="630" fill="url(#glow1)"/>
  <rect width="1200" height="630" fill="url(#glow2)"/>

  <!-- Diamond icon -->
  <g transform="translate(340, 180)">
    <g filter="url(#blur1)">
      <rect x="40" y="40" width="180" height="180" rx="16" transform="rotate(45 130 130)" fill="url(#diamond)" opacity="0.6"/>
    </g>
    <rect x="40" y="40" width="180" height="180" rx="16" transform="rotate(45 130 130)" fill="url(#diamond)" opacity="0.9"/>
    <path d="M130 55 L205 130 L130 205 L55 130 Z" fill="rgba(255,255,255,0.12)"/>
    <path d="M130 85 L175 130 L130 175 L85 130 Z" fill="rgba(255,255,255,0.25)"/>
    <path d="M130 105 L155 130 L130 155 L105 130 Z" fill="rgba(255,255,255,0.4)"/>
  </g>

  <!-- Text -->
  <text x="600" y="430" text-anchor="middle" font-family="system-ui,-apple-system,sans-serif" font-weight="800" font-size="72" fill="white" letter-spacing="-2">Reflect.fi</text>
  <text x="600" y="480" text-anchor="middle" font-family="system-ui,-apple-system,sans-serif" font-weight="400" font-size="24" fill="#94a3b8">Reflection Token Launchpad on Bitcoin L1</text>

  <!-- Bottom accent line -->
  <rect x="0" y="620" width="1200" height="10" fill="url(#diamond)"/>

  <!-- Subtle badge -->
  <g transform="translate(600, 540)">
    <rect x="-80" y="-16" width="160" height="32" rx="16" fill="rgba(124,58,237,0.15)" stroke="rgba(124,58,237,0.3)" stroke-width="1"/>
    <text x="0" y="5" text-anchor="middle" font-family="system-ui,-apple-system,sans-serif" font-weight="500" font-size="13" fill="#a78bfa">Powered by OPNet</text>
  </g>
</svg>`;

async function generate() {
  console.log('Generating assets...');

  // Favicon PNGs
  const sizes = [16, 32, 180, 192, 512];
  const faviconBuf = Buffer.from(faviconSvg);

  for (const size of sizes) {
    const name = size === 180 ? 'apple-touch-icon.png' :
                 size === 192 ? 'icon-192.png' :
                 size === 512 ? 'icon-512.png' :
                 `favicon-${size}x${size}.png`;
    await sharp(faviconBuf)
      .resize(size, size)
      .png()
      .toFile(path.join(PUBLIC, name));
    console.log(`  ${name}`);
  }

  // favicon.ico (32x32 PNG, browsers accept PNG in .ico)
  await sharp(faviconBuf)
    .resize(32, 32)
    .png()
    .toFile(path.join(PUBLIC, 'favicon.ico'));
  console.log('  favicon.ico');

  // OG image (1200x630)
  await sharp(Buffer.from(ogSvg))
    .resize(1200, 630)
    .png({ quality: 90 })
    .toFile(path.join(PUBLIC, 'og-image.png'));
  console.log('  og-image.png');

  // Twitter card (same dimensions work for Twitter)
  await sharp(Buffer.from(ogSvg))
    .resize(1200, 630)
    .png({ quality: 90 })
    .toFile(path.join(PUBLIC, 'twitter-card.png'));
  console.log('  twitter-card.png');

  console.log('Done!');
}

generate().catch(console.error);
