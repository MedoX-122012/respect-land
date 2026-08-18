import fs from "node:fs";
import path from "node:path";

const creators = [
  ["ahmedshadly", "A"],
  ["saramansour", "S"],
  ["yousefadel", "Y"],
  ["laylahassan", "L"],
  ["omarnabil", "O"],
  ["mennafathy", "M"],
  ["khaledsamir", "K"],
  ["nooribrahim", "N"],
  ["mostafareda", "M"],
  ["hodakhalil", "H"],
  ["alifouad", "A"],
  ["reemmahmoud", "R"],
];

const root = process.cwd();
const avatarsDir = path.join(root, "public", "avatars");
const coversDir = path.join(root, "public", "covers");
fs.mkdirSync(avatarsDir, { recursive: true });
fs.mkdirSync(coversDir, { recursive: true });

const avatar = (letter) => `<svg width="300" height="300" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="300" y2="300" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#13221A"/>
      <stop offset="0.55" stop-color="#0B0F0D"/>
      <stop offset="1" stop-color="#101B16"/>
    </linearGradient>
    <linearGradient id="t" x1="0" y1="0" x2="300" y2="300" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#BEF264"/>
      <stop offset="1" stop-color="#22C55E"/>
    </linearGradient>
  </defs>
  <rect x="12" y="12" width="276" height="276" rx="80" fill="url(#bg)" stroke="rgba(255,255,255,0.12)" stroke-width="3"/>
  <circle cx="150" cy="150" r="98" stroke="url(#t)" stroke-width="4" stroke-dasharray="14 10" opacity="0.4"/>
  <circle cx="150" cy="150" r="70" fill="rgba(34,197,94,0.08)"/>
  <text x="150" y="158" text-anchor="middle" dominant-baseline="middle" font-family="Inter, Arial, sans-serif" font-size="128" font-weight="800" fill="url(#t)">${letter}</text>
</svg>
`;

const cover = (letter) => `<svg width="1600" height="500" viewBox="0 0 1600 500" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1600" y2="500" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#0E1512"/>
      <stop offset="0.5" stop-color="#0B0F0D"/>
      <stop offset="1" stop-color="#14251A"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.85" cy="0.15" r="0.7" gradientUnits="objectBoundingBox">
      <stop offset="0" stop-color="#22C55E" stop-opacity="0.3"/>
      <stop offset="1" stop-color="#22C55E" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="txt" x1="0" y1="0" x2="900" y2="400" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#A3E635" stop-opacity="0.07"/>
      <stop offset="1" stop-color="#22C55E" stop-opacity="0.04"/>
    </linearGradient>
    <pattern id="grid" width="64" height="64" patternUnits="userSpaceOnUse">
      <path d="M64 0H0V64" fill="none" stroke="rgba(255,255,255,0.045)" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="1600" height="500" fill="url(#bg)"/>
  <rect width="1600" height="500" fill="url(#glow)"/>
  <rect width="1600" height="500" fill="url(#grid)"/>
  <text x="1300" y="405" font-family="Inter, Arial, sans-serif" font-size="340" font-weight="800" fill="url(#txt)">${letter}</text>
  <rect x="60" y="60" width="230" height="60" rx="30" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.07)" stroke-width="1.5"/>
</svg>
`;

for (const [username, letter] of creators) {
  fs.writeFileSync(path.join(avatarsDir, `${username}.svg`), avatar(letter));
  fs.writeFileSync(path.join(coversDir, `${username}.svg`), cover(letter));
  console.log(`generated ${username}`);
}
console.log("done");