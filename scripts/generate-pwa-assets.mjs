import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const svgPath = path.resolve(root, "src/assets/bitmap-vm.svg");
const outDir = path.resolve(root, "public");

const bgColor = { r: 26, g: 25, b: 23, alpha: 1 };

const iconSizes = {
  "favicon.ico": 48,
  "icon.png": 96,
  "web-app-manifest-192x192.png": 192,
  "web-app-manifest-512x512.png": 512,
  "apple-touch-icon.png": 180,
};

const splashSizes = [
  { name: "iPad Pro 12.9", w: 2048, h: 2732 },
  { name: "iPad Pro 11", w: 1668, h: 2388 },
  { name: "iPad Pro 10.5", w: 1668, h: 2388 },
  { name: "iPad Pro 9.7", w: 1536, h: 2048 },
  { name: "iPad Air 13", w: 2048, h: 2732 },
  { name: "iPad Air 11", w: 1640, h: 2360 },
  { name: "iPad Air 10.5", w: 1668, h: 2224 },
  { name: "iPad 10.2", w: 1620, h: 2160 },
  { name: "iPad mini 8.3", w: 1488, h: 2266 },
  { name: "iPad mini 7.9", w: 1536, h: 2048 },
  { name: "iPhone 16 Pro Max", w: 1320, h: 2868 },
  { name: "iPhone 16 Pro", w: 1206, h: 2622 },
  { name: "iPhone 16 Plus", w: 1290, h: 2796 },
  { name: "iPhone 16", w: 1179, h: 2556 },
  { name: "iPhone 16e", w: 1170, h: 2532 },
  { name: "iPhone 15 Pro Max", w: 1290, h: 2796 },
  { name: "iPhone 15 Pro", w: 1179, h: 2556 },
  { name: "iPhone 15 Plus", w: 1290, h: 2796 },
  { name: "iPhone 15", w: 1179, h: 2556 },
  { name: "iPhone 14 Pro Max", w: 1290, h: 2796 },
  { name: "iPhone 14 Pro", w: 1179, h: 2556 },
  { name: "iPhone 14 Plus", w: 1284, h: 2778 },
  { name: "iPhone 14", w: 1170, h: 2532 },
  { name: "iPhone 13 Pro Max", w: 1284, h: 2778 },
  { name: "iPhone 13 Pro", w: 1170, h: 2532 },
  { name: "iPhone 13", w: 1170, h: 2532 },
  { name: "iPhone 13 mini", w: 1125, h: 2436 },
  { name: "iPhone 12 Pro Max", w: 1284, h: 2778 },
  { name: "iPhone 12 Pro", w: 1170, h: 2532 },
  { name: "iPhone 12", w: 1170, h: 2532 },
  { name: "iPhone 12 mini", w: 1125, h: 2436 },
  { name: "iPhone 11 Pro Max", w: 1242, h: 2688 },
  { name: "iPhone 11 Pro", w: 1125, h: 2436 },
  { name: "iPhone 11", w: 828, h: 1792 },
  { name: "iPhone XS Max", w: 1242, h: 2688 },
  { name: "iPhone XS", w: 1125, h: 2436 },
  { name: "iPhone XR", w: 828, h: 1792 },
  { name: "iPhone X", w: 1125, h: 2436 },
  { name: "iPhone 8 Plus", w: 1242, h: 2208 },
  { name: "iPhone 8", w: 750, h: 1334 },
];

function generateHtmlLinks() {
  let html = "";
  for (const { w, h } of splashSizes) {
    const ratio = Math.round(h / w * 10) / 10;
    html += `<link rel="apple-touch-startup-image" media="screen and (device-width: ${w}px) and (device-height: ${h}px) and (-webkit-device-pixel-ratio: ${ratio}) and (orientation: portrait)" href="/apple-splash-portrait-${w}x${h}.png" />\n`;
    html += `<link rel="apple-touch-startup-image" media="screen and (device-width: ${h}px) and (device-height: ${w}px) and (-webkit-device-pixel-ratio: ${ratio}) and (orientation: landscape)" href="/apple-splash-landscape-${h}x${w}.png" />\n`;
  }
  return html;
}

async function generateSplash(svgBuffer) {
  for (const { w, h } of splashSizes) {
    const logoSize = Math.min(w, h) * 0.35;

    const splash = await sharp({
      create: {
        width: w,
        height: h,
        channels: 4,
        background: bgColor,
      },
    })
      .composite([
        {
          input: await sharp(svgBuffer)
            .resize(Math.round(logoSize), Math.round(logoSize), {
              fit: "contain",
              background: { r: 0, g: 0, b: 0, alpha: 0 },
            })
            .png()
            .toBuffer(),
          top: Math.round((h - logoSize) / 2),
          left: Math.round((w - logoSize) / 2),
        },
      ])
      .png()
      .toFile(path.join(outDir, `apple-splash-portrait-${w}x${h}.png`));
    console.log(`\u2713 apple-splash-portrait-${w}x${h}.png`);

    const logoSizeL = Math.min(w, h) * 0.35;
    const splashL = await sharp({
      create: {
        width: h,
        height: w,
        channels: 4,
        background: bgColor,
      },
    })
      .composite([
        {
          input: await sharp(svgBuffer)
            .resize(Math.round(logoSizeL), Math.round(logoSizeL), {
              fit: "contain",
              background: { r: 0, g: 0, b: 0, alpha: 0 },
            })
            .png()
            .toBuffer(),
          top: Math.round((w - logoSizeL) / 2),
          left: Math.round((h - logoSizeL) / 2),
        },
      ])
      .png()
      .toFile(path.join(outDir, `apple-splash-landscape-${h}x${w}.png`));
    console.log(`\u2713 apple-splash-landscape-${h}x${w}.png`);
  }
}

async function main() {
  const svgBuffer = fs.readFileSync(svgPath);

  // Generate standard icons
  for (const [name, size] of Object.entries(iconSizes)) {
    await sharp(svgBuffer)
      .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(path.join(outDir, name));
    console.log(`\u2713 ${name} ${size}x${size}`);
  }

  // Generate maskable icons (with bg color)
  for (const [name, size] of [["icon-maskable-192.png", 192], ["icon-maskable-512.png", 512]]) {
    await sharp(svgBuffer)
      .resize(size, size, { fit: "contain", background: bgColor })
      .png()
      .toFile(path.join(outDir, name));
    console.log(`\u2713 ${name} ${size}x${size}`);
  }

  // Generate splash screens
  console.log("\nGenerating splash screens...");
  await generateSplash(svgBuffer);

  // Output HTML links for index.html
  console.log("\n<!-- Add these <link> tags inside <head> in index.html -->");
  console.log(generateHtmlLinks());

  console.log("\nAll assets generated successfully!");
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
