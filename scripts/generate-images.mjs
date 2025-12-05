import { Resvg } from '@resvg/resvg-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// SVG for icon (500x500)
const iconSVG = `
<svg width="500" height="500" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
  <!-- Gradient background -->
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#f3f4f6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#fefce8;stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="500" height="500" fill="url(#bgGradient)"/>

  <!-- Rounded square with yellow border -->
  <rect x="110" y="105" width="280" height="280" rx="40" fill="white" stroke="#FCFF52" stroke-width="12"/>

  <!-- Yellow sparkle -->
  <text x="250" y="145" font-size="32" text-anchor="middle" fill="#FCFF52">✦</text>

  <!-- Mastermind pegs (colored circles) -->
  <!-- Peg 1: Red -->
  <circle cx="170" cy="245" r="25" fill="#ef4444" stroke="rgba(0,0,0,0.2)" stroke-width="2"/>
  <circle cx="165" cy="240" r="8" fill="rgba(255,255,255,0.4)"/>

  <!-- Peg 2: Blue -->
  <circle cx="230" cy="245" r="25" fill="#3b82f6" stroke="rgba(0,0,0,0.2)" stroke-width="2"/>
  <circle cx="225" cy="240" r="8" fill="rgba(255,255,255,0.4)"/>

  <!-- Peg 3: Green -->
  <circle cx="290" cy="245" r="25" fill="#22c55e" stroke="rgba(0,0,0,0.2)" stroke-width="2"/>
  <circle cx="285" cy="240" r="8" fill="rgba(255,255,255,0.4)"/>

  <!-- Peg 4: Yellow -->
  <circle cx="350" cy="245" r="25" fill="#eab308" stroke="rgba(0,0,0,0.2)" stroke-width="2"/>
  <circle cx="345" cy="240" r="8" fill="rgba(255,255,255,0.4)"/>
</svg>
`;

// SVG for OG image (1200x630 - Standard OG format) - Blackjack style
const ogImageSVG = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <!-- Gradient background - Yellow to Gray like Blackjack -->
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#FCFF52;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#fef3c7;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#9ca3af;stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bgGradient)"/>

  <!-- White card on left with yellow border -->
  <rect x="110" y="165" width="225" height="300" rx="30" fill="white" stroke="#FCFF52" stroke-width="6"/>

  <!-- Yellow sparkle at top -->
  <text x="222" y="210" font-size="24" text-anchor="middle" fill="#FCFF52">✦</text>

  <!-- Mastermind pegs - 2 rows of 4 -->
  <!-- Top row of pegs -->
  <circle cx="160" cy="280" r="20" fill="#ef4444" stroke="rgba(0,0,0,0.2)" stroke-width="2"/>
  <circle cx="156" cy="276" r="6" fill="rgba(255,255,255,0.4)"/>

  <circle cx="208" cy="280" r="20" fill="#3b82f6" stroke="rgba(0,0,0,0.2)" stroke-width="2"/>
  <circle cx="204" cy="276" r="6" fill="rgba(255,255,255,0.4)"/>

  <circle cx="256" cy="280" r="20" fill="#22c55e" stroke="rgba(0,0,0,0.2)" stroke-width="2"/>
  <circle cx="252" cy="276" r="6" fill="rgba(255,255,255,0.4)"/>

  <circle cx="304" cy="280" r="20" fill="#eab308" stroke="rgba(0,0,0,0.2)" stroke-width="2"/>
  <circle cx="300" cy="276" r="6" fill="rgba(255,255,255,0.4)"/>

  <!-- Bottom row of pegs -->
  <circle cx="160" cy="370" r="20" fill="#f97316" stroke="rgba(0,0,0,0.2)" stroke-width="2"/>
  <circle cx="156" cy="366" r="6" fill="rgba(255,255,255,0.4)"/>

  <circle cx="208" cy="370" r="20" fill="#a855f7" stroke="rgba(0,0,0,0.2)" stroke-width="2"/>
  <circle cx="204" cy="366" r="6" fill="rgba(255,255,255,0.4)"/>

  <circle cx="256" cy="370" r="20" fill="#ef4444" stroke="rgba(0,0,0,0.2)" stroke-width="2"/>
  <circle cx="252" cy="366" r="6" fill="rgba(255,255,255,0.4)"/>

  <circle cx="304" cy="370" r="20" fill="#3b82f6" stroke="rgba(0,0,0,0.2)" stroke-width="2"/>
  <circle cx="300" cy="366" r="6" fill="rgba(255,255,255,0.4)"/>

  <!-- Text on the right -->
  <!-- Main title -->
  <text x="440" y="235" font-size="70" font-weight="bold" fill="#1a1a1a" font-family="Arial, sans-serif">Mastermind on Celo</text>

  <!-- Subtitle -->
  <text x="440" y="300" font-size="34" fill="#374151" font-family="Arial, sans-serif">Crack the code on Celo blockchain</text>

  <!-- Features with checkmarks -->
  <text x="440" y="375" font-size="28" fill="#6b7280" font-family="Arial, sans-serif">✓ Free or On-Chain mode</text>
  <text x="440" y="425" font-size="28" fill="#6b7280" font-family="Arial, sans-serif">✓ 10 attempts to crack the code</text>
  <text x="440" y="475" font-size="28" fill="#6b7280" font-family="Arial, sans-serif">✓ Powered by Farcaster</text>
</svg>
`;

// SVG for splash (200x200)
const splashSVG = `
<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <!-- Gradient background -->
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#f3f4f6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#fefce8;stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="200" height="200" fill="url(#bgGradient)"/>

  <!-- Rounded square with yellow border -->
  <rect x="45" y="42" width="112" height="112" rx="16" fill="white" stroke="#FCFF52" stroke-width="5"/>

  <!-- Yellow sparkle -->
  <text x="100" y="62" font-size="13" text-anchor="middle" fill="#FCFF52">✦</text>

  <!-- Mastermind pegs (small) -->
  <circle cx="70" cy="90" r="8" fill="#ef4444" stroke="rgba(0,0,0,0.2)" stroke-width="1"/>
  <circle cx="68" cy="88" r="2.5" fill="rgba(255,255,255,0.4)"/>

  <circle cx="88" cy="90" r="8" fill="#3b82f6" stroke="rgba(0,0,0,0.2)" stroke-width="1"/>
  <circle cx="86" cy="88" r="2.5" fill="rgba(255,255,255,0.4)"/>

  <circle cx="106" cy="90" r="8" fill="#22c55e" stroke="rgba(0,0,0,0.2)" stroke-width="1"/>
  <circle cx="104" cy="88" r="2.5" fill="rgba(255,255,255,0.4)"/>

  <circle cx="124" cy="90" r="8" fill="#eab308" stroke="rgba(0,0,0,0.2)" stroke-width="1"/>
  <circle cx="122" cy="88" r="2.5" fill="rgba(255,255,255,0.4)"/>
</svg>
`;

// Function to convert SVG to PNG
function svgToPng(svg, outputPath) {
  const resvg = new Resvg(svg, {
    fitTo: {
      mode: 'original',
    },
  });

  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  fs.writeFileSync(outputPath, pngBuffer);
  console.log(`✓ Generated: ${outputPath}`);
}

// Generate all images
const publicDir = path.join(__dirname, '..', 'public');

// Create public directory if it doesn't exist
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

console.log('Generating Mastermind images...\n');

svgToPng(iconSVG, path.join(publicDir, 'icon.png'));
svgToPng(ogImageSVG, path.join(publicDir, 'og-image.png'));
svgToPng(splashSVG, path.join(publicDir, 'splash.png'));

console.log('\n✅ All images generated successfully!');
