/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { VitePWA } from 'vite-plugin-pwa';
import viteCompression from 'vite-plugin-compression';
import viteImagemin from 'vite-plugin-imagemin';

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.spec.ts',
        '**/*.test.ts',
        '**/*.spec.tsx',
        '**/*.test.tsx',
      ],
    },
  },
  plugins: [
    react(),

    // PWA поддержка
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.ico',
        'favicon.svg',
        'robots.txt',
        'apple-touch-icon.png',
        'apple-touch-icon-*.png',
        'mstile-*.png',
        'android-chrome-*.png',
      ],
      manifest: {
        name: 'Кыргызский Финансовый Альянс',
        short_name: 'КФА',
        description:
          'Саморегулируемая организация профессиональных участников рынка ценных бумаг Кыргызской Республики',
        theme_color: '#1A3A6B',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait-primary',
        start_url: '/',
        scope: '/',
        lang: 'ru',
        dir: 'ltr',
        categories: ['finance', 'business', 'productivity'],

        icons: [
          // Android Chrome Icons
          {
            src: '/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          // PWA Icons with maskable variants
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/pwa-maskable-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: '/pwa-maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],

        // Shortcuts для быстрого доступа
        shortcuts: [
          {
            name: 'Новости',
            short_name: 'Новости',
            description: 'Последние новости КФА',
            url: '/news',
            icons: [
              {
                src: '/android-chrome-192x192.png',
                sizes: '192x192',
                type: 'image/png',
              },
            ],
          },
          {
            name: 'События',
            short_name: 'События',
            description: 'Предстоящие события и мероприятия',
            url: '/events',
            icons: [
              {
                src: '/android-chrome-192x192.png',
                sizes: '192x192',
                type: 'image/png',
              },
            ],
          },
          {
            name: 'Вступить',
            short_name: 'Вступить',
            description: 'Стать членом КФА',
            url: '/join',
            icons: [
              {
                src: '/android-chrome-192x192.png',
                sizes: '192x192',
                type: 'image/png',
              },
            ],
          },
          {
            name: 'Вход',
            short_name: 'Вход',
            description: 'Войти в личный кабинет',
            url: '/login',
            icons: [
              {
                src: '/android-chrome-192x192.png',
                sizes: '192x192',
                type: 'image/png',
              },
            ],
          },
        ],
      },

      workbox: {
        // Стратегии кэширования
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'image-cache',
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
          {
            urlPattern: /\/api\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              networkTimeoutSeconds: 10,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 5, // 5 minutes
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          // Навигация - показывать offline.html при отсутствии сети
          {
            urlPattern: ({ request }) => request.mode === 'navigate',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'pages-cache',
              networkTimeoutSeconds: 3,
              plugins: [
                {
                  handlerDidError: async () => {
                    return Response.redirect('/offline.html', 302);
                  },
                },
              ],
            },
          },
        ],
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
        // Включить offline.html в precache
        additionalManifestEntries: [{ url: '/offline.html', revision: null }],
      },

      devOptions: {
        enabled: true,
        type: 'module',
      },
    }),

    // Сжатие сборки
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 10240,
    }),

    // Оптимизация изображений
    viteImagemin({
      gifsicle: {
        optimizationLevel: 7,
        interlaced: false,
      },
      optipng: {
        optimizationLevel: 7,
      },
      mozjpeg: {
        quality: 85,
      },
      pngquant: {
        quality: [0.8, 0.9],
        speed: 4,
      },
      svgo: {
        plugins: [
          {
            name: 'removeViewBox',
            active: false,
          },
          {
            name: 'removeEmptyAttrs',
            active: true,
          },
        ],
      },
    }),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Core vendors
          if (id.includes('node_modules')) {
            // React core - check FIRST with exact matches
            // This ensures React loads before any React-dependent libraries
            if (
              id.includes('/react/') ||
              id.includes('/react-dom/') ||
              id.includes('/react-router-dom/') ||
              id.includes('/react-router/') ||
              id.endsWith('/react') ||
              id.endsWith('/react-dom') ||
              id.endsWith('/react-router-dom') ||
              id.endsWith('/react-router')
            ) {
              return 'vendor-react';
            }

            // Heavy libraries - separate chunks for lazy loading
            if (id.includes('mermaid')) {
              return 'vendor-mermaid';
            }
            if (id.includes('cytoscape')) {
              return 'vendor-cytoscape';
            }
            if (id.includes('katex')) {
              return 'vendor-katex';
            }
            if (id.includes('d3-')) {
              return 'vendor-d3';
            }

            // Markdown rendering (contains 'react-markdown')
            if (id.includes('react-markdown') || id.includes('remark') || id.includes('rehype')) {
              return 'vendor-markdown';
            }

            // Charts (contains 'recharts')
            if (id.includes('recharts')) {
              return 'vendor-charts';
            }

            // Forms (contains 'react-hook-form')
            if (id.includes('react-hook-form') || id.includes('zod') || id.includes('@hookform')) {
              return 'vendor-forms';
            }

            // State management (contains 'react-query')
            if (id.includes('zustand') || id.includes('@tanstack/react-query') || id.includes('@tanstack/react-table')) {
              return 'vendor-state';
            }

            // Animation (contains 'framer-motion')
            if (id.includes('framer-motion')) {
              return 'vendor-animation';
            }

            // Icons (contains 'lucide-react')
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }

            // i18n (contains 'react-i18next')
            if (id.includes('i18next') || id.includes('react-i18next')) {
              return 'vendor-i18n';
            }

            // React Helmet (contains 'react-helmet')
            if (id.includes('react-helmet')) {
              return 'vendor-helmet';
            }

            // UI components
            if (id.includes('@radix-ui')) {
              return 'vendor-ui';
            }

            // Other node_modules - don't bundle into single chunk
            // Let Vite handle them individually or with app code
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info'],
        passes: 2,
      },
      mangle: {
        safari10: true,
      },
    },
  },

  server: {
    port: 3000,
    open: true,
    host: true,
  },

  preview: {
    port: 4173,
    host: true,
  },
});
