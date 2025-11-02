import sharp from 'sharp';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PUBLIC_DIR = join(__dirname, '../public');
const SVG_SOURCE = join(PUBLIC_DIR, 'kfaICON.svg');

console.log('🎨 Генерация Social Media изображений...\n');

const svgBuffer = readFileSync(SVG_SOURCE);

// Цвета КФА
const PRIMARY_COLOR = '#1A3A6B'; // Primary Blue
const ACCENT_COLOR = '#C19A6B'; // Accent Gold

/**
 * Создание Open Graph изображения (1200x630)
 * Используется для Facebook, LinkedIn, и других соцсетей
 */
async function generateOGImage() {
  console.log('📱 Создание Open Graph изображения (1200x630)...');

  try {
    // Создаем градиентный фон
    const background = await sharp({
      create: {
        width: 1200,
        height: 630,
        channels: 4,
        background: PRIMARY_COLOR,
      },
    })
      .png()
      .toBuffer();

    // Подготавливаем логотип
    const logo = await sharp(svgBuffer).resize(300, 300).png().toBuffer();

    // Создаем текст SVG overlay
    const textSvg = `
      <svg width="1200" height="630">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${PRIMARY_COLOR};stop-opacity:1" />
            <stop offset="100%" style="stop-color:#2d5a9c;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="1200" height="630" fill="url(#grad)"/>

        <!-- Декоративные элементы -->
        <circle cx="100" cy="100" r="150" fill="#ffffff" opacity="0.05"/>
        <circle cx="1100" cy="530" r="200" fill="#ffffff" opacity="0.05"/>

        <!-- Текст -->
        <text x="600" y="480" font-family="Arial, sans-serif" font-size="56" font-weight="bold" fill="#ffffff" text-anchor="middle">
          Кыргызский Финансовый Альянс
        </text>
        <text x="600" y="540" font-family="Arial, sans-serif" font-size="28" fill="#ffffff" text-anchor="middle" opacity="0.9">
          Саморегулируемая организация участников рынка ценных бумаг КР
        </text>
      </svg>
    `;

    // Композиция: фон + текст + логотип
    await sharp(Buffer.from(textSvg))
      .composite([
        {
          input: logo,
          top: 80,
          left: 450,
        },
      ])
      .png()
      .toFile(join(PUBLIC_DIR, 'og-image.png'));

    console.log('✅ og-image.png создан (1200x630)');
  } catch (error) {
    console.error('❌ Ошибка при создании OG изображения:', error.message);
  }
}

/**
 * Создание Twitter Card изображения (1200x630)
 * Оптимизировано для Twitter
 */
async function generateTwitterCard() {
  console.log('🐦 Создание Twitter Card изображения (1200x630)...');

  try {
    // Подготавливаем логотип
    const logo = await sharp(svgBuffer).resize(280, 280).png().toBuffer();

    // Создаем Twitter card дизайн
    const twitterSvg = `
      <svg width="1200" height="630">
        <defs>
          <linearGradient id="twitterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${PRIMARY_COLOR};stop-opacity:1" />
            <stop offset="100%" style="stop-color:#3d6aa0;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="1200" height="630" fill="url(#twitterGrad)"/>

        <!-- Декоративная сетка -->
        <line x1="0" y1="210" x2="1200" y2="210" stroke="#ffffff" stroke-width="1" opacity="0.1"/>
        <line x1="0" y1="420" x2="1200" y2="420" stroke="#ffffff" stroke-width="1" opacity="0.1"/>
        <line x1="400" y1="0" x2="400" y2="630" stroke="#ffffff" stroke-width="1" opacity="0.1"/>
        <line x1="800" y1="0" x2="800" y2="630" stroke="#ffffff" stroke-width="1" opacity="0.1"/>

        <!-- Акцентная полоса -->
        <rect x="0" y="580" width="1200" height="50" fill="${ACCENT_COLOR}" opacity="0.8"/>

        <!-- Текст -->
        <text x="600" y="470" font-family="Arial, sans-serif" font-size="52" font-weight="bold" fill="#ffffff" text-anchor="middle">
          КФА
        </text>
        <text x="600" y="530" font-family="Arial, sans-serif" font-size="32" font-weight="600" fill="#ffffff" text-anchor="middle">
          Кыргызский Финансовый Альянс
        </text>
      </svg>
    `;

    // Композиция
    await sharp(Buffer.from(twitterSvg))
      .composite([
        {
          input: logo,
          top: 100,
          left: 460,
        },
      ])
      .png()
      .toFile(join(PUBLIC_DIR, 'twitter-card.png'));

    console.log('✅ twitter-card.png создан (1200x630)');
  } catch (error) {
    console.error('❌ Ошибка при создании Twitter Card:', error.message);
  }
}

/**
 * Создание Apple Touch Startup Image (750x1334)
 * Показывается при запуске PWA на iOS
 */
async function generateAppleStartupImage() {
  console.log('🍎 Создание Apple Startup изображения (750x1334)...');

  try {
    const logo = await sharp(svgBuffer).resize(200, 200).png().toBuffer();

    const startupSvg = `
      <svg width="750" height="1334">
        <defs>
          <linearGradient id="startupGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:${PRIMARY_COLOR};stop-opacity:1" />
            <stop offset="100%" style="stop-color:#2d5a9c;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="750" height="1334" fill="url(#startupGrad)"/>

        <!-- Центральный круг -->
        <circle cx="375" cy="667" r="280" fill="#ffffff" opacity="0.1"/>
        <circle cx="375" cy="667" r="220" fill="#ffffff" opacity="0.05"/>

        <!-- Текст -->
        <text x="375" y="950" font-family="Arial, sans-serif" font-size="42" font-weight="bold" fill="#ffffff" text-anchor="middle">
          КФА
        </text>
        <text x="375" y="1010" font-family="Arial, sans-serif" font-size="24" fill="#ffffff" text-anchor="middle" opacity="0.8">
          Кыргызский Финансовый Альянс
        </text>
      </svg>
    `;

    await sharp(Buffer.from(startupSvg))
      .composite([
        {
          input: logo,
          top: 517,
          left: 275,
        },
      ])
      .png()
      .toFile(join(PUBLIC_DIR, 'apple-touch-startup-image.png'));

    console.log('✅ apple-touch-startup-image.png создан (750x1334)');
  } catch (error) {
    console.error('❌ Ошибка при создании Apple Startup Image:', error.message);
  }
}

// Запуск генерации
async function generateAll() {
  await generateOGImage();
  await generateTwitterCard();
  await generateAppleStartupImage();
  console.log('\n✨ Все Social Media изображения созданы!');
}

generateAll().catch(console.error);
