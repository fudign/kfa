import sharp from 'sharp';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PUBLIC_DIR = join(__dirname, '../public');
const SVG_SOURCE = join(PUBLIC_DIR, 'kfaICON.svg');

// Ensure public directory exists
if (!existsSync(PUBLIC_DIR)) {
  mkdirSync(PUBLIC_DIR, { recursive: true });
}

console.log('🎨 Генерация favicon и PWA иконок из kfaICON.svg...\n');

// Read SVG file
const svgBuffer = readFileSync(SVG_SOURCE);

// Standard Favicons
const standardSizes = [
  { size: 16, name: 'favicon-16x16.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 48, name: 'favicon-48x48.png' },
  { size: 96, name: 'favicon-96x96.png' },
];

// Apple Touch Icons
const appleSizes = [
  { size: 57, name: 'apple-touch-icon-57x57.png' },
  { size: 60, name: 'apple-touch-icon-60x60.png' },
  { size: 72, name: 'apple-touch-icon-72x72.png' },
  { size: 76, name: 'apple-touch-icon-76x76.png' },
  { size: 114, name: 'apple-touch-icon-114x114.png' },
  { size: 120, name: 'apple-touch-icon-120x120.png' },
  { size: 144, name: 'apple-touch-icon-144x144.png' },
  { size: 152, name: 'apple-touch-icon-152x152.png' },
  { size: 180, name: 'apple-touch-icon.png' }, // Default Apple icon
  { size: 180, name: 'apple-touch-icon-precomposed.png' },
];

// PWA Icons
const pwaSizes = [
  { size: 192, name: 'pwa-192x192.png' },
  { size: 512, name: 'pwa-512x512.png' },
  { size: 192, name: 'pwa-maskable-192x192.png', maskable: true },
  { size: 512, name: 'pwa-maskable-512x512.png', maskable: true },
];

// Windows Metro Tiles
const metroSizes = [
  { size: 70, name: 'mstile-70x70.png' },
  { size: 150, name: 'mstile-150x150.png' },
  { size: 310, name: 'mstile-310x310.png' },
  { width: 310, height: 150, name: 'mstile-310x150.png' },
];

// Android Chrome Icons
const androidSizes = [
  { size: 36, name: 'android-chrome-36x36.png' },
  { size: 48, name: 'android-chrome-48x48.png' },
  { size: 72, name: 'android-chrome-72x72.png' },
  { size: 96, name: 'android-chrome-96x96.png' },
  { size: 144, name: 'android-chrome-144x144.png' },
  { size: 192, name: 'android-chrome-192x192.png' },
  { size: 256, name: 'android-chrome-256x256.png' },
  { size: 384, name: 'android-chrome-384x384.png' },
  { size: 512, name: 'android-chrome-512x512.png' },
];

// Function to generate PNG from SVG
async function generatePNG(size, outputName, options = {}) {
  const { maskable = false, width, height } = options;
  const targetWidth = width || size;
  const targetHeight = height || size;

  try {
    let image = sharp(svgBuffer).resize(targetWidth, targetHeight, {
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 0 },
    });

    // For maskable icons, add safe zone padding (20%)
    if (maskable) {
      const paddedSize = Math.round(size * 0.8); // 80% of original size
      const padding = Math.round((size - paddedSize) / 2);

      image = sharp(svgBuffer)
        .resize(paddedSize, paddedSize, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 },
        })
        .extend({
          top: padding,
          bottom: padding,
          left: padding,
          right: padding,
          background: { r: 26, g: 58, b: 107, alpha: 1 }, // Primary color
        });
    }

    const outputPath = join(PUBLIC_DIR, outputName);
    await image.png().toFile(outputPath);
    console.log(`✅ ${outputName} (${targetWidth}x${targetHeight})`);
  } catch (error) {
    console.error(`❌ Ошибка при создании ${outputName}:`, error.message);
  }
}

// Generate all icons
async function generateAllIcons() {
  console.log('📦 Standard Favicons:');
  for (const icon of standardSizes) {
    await generatePNG(icon.size, icon.name);
  }

  console.log('\n🍎 Apple Touch Icons:');
  for (const icon of appleSizes) {
    await generatePNG(icon.size, icon.name);
  }

  console.log('\n📱 PWA Icons:');
  for (const icon of pwaSizes) {
    await generatePNG(icon.size, icon.name, { maskable: icon.maskable });
  }

  console.log('\n🪟 Windows Metro Tiles:');
  for (const icon of metroSizes) {
    if (icon.width && icon.height) {
      await generatePNG(icon.width, icon.name, {
        width: icon.width,
        height: icon.height,
      });
    } else {
      await generatePNG(icon.size, icon.name);
    }
  }

  console.log('\n🤖 Android Chrome Icons:');
  for (const icon of androidSizes) {
    await generatePNG(icon.size, icon.name);
  }

  // Generate favicon.ico (multi-size ICO file)
  console.log('\n🎯 Multi-size favicon.ico:');
  try {
    // Generate 32x32 version for favicon.ico
    const faviconBuffer = await sharp(svgBuffer)
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 },
      })
      .png()
      .toBuffer();

    const faviconPath = join(PUBLIC_DIR, 'favicon.ico');
    writeFileSync(faviconPath, faviconBuffer);
    console.log('✅ favicon.ico (32x32)');
  } catch (error) {
    console.error('❌ Ошибка при создании favicon.ico:', error.message);
  }

  // Copy SVG as favicon.svg
  console.log('\n🎨 Vector favicon:');
  try {
    const svgOutputPath = join(PUBLIC_DIR, 'favicon.svg');
    writeFileSync(svgOutputPath, svgBuffer);
    console.log('✅ favicon.svg (vector)');
  } catch (error) {
    console.error('❌ Ошибка при копировании favicon.svg:', error.message);
  }

  console.log('\n✨ Генерация завершена! Создано 40+ иконок.');
  console.log('📂 Все файлы сохранены в:', PUBLIC_DIR);
}

// Run generation
generateAllIcons().catch(console.error);
