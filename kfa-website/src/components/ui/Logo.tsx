import { useTranslation } from 'react-i18next';
import { useTheme } from '@/lib/contexts/ThemeContext';
import { useEffect, useState } from 'react';

interface LogoProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  variant?: 'default' | 'light' | 'dark';
}

/**
 * Adaptive Logo component that:
 * - Automatically switches based on i18n language (RU/KY/EN)
 * - Adapts colors to dark/light theme
 * - Optimized SVG rendering with currentColor
 * - Accessibility compliant
 * - Responsive sizing
 */
export function Logo({ className = '', width = 'auto', height = 40, variant }: LogoProps) {
  const { i18n } = useTranslation();
  const { theme } = useTheme();
  const [svgContent, setSvgContent] = useState<string>('');

  // Determine the effective theme
  const effectiveTheme = variant || (theme === 'system'
    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : theme);

  // Map language to SVG file
  const getSvgPath = () => {
    const lang = i18n.language.toLowerCase();
    // Support RU, KY (mapped to KG.svg), EN - fallback to RU
    if (lang === 'ky') {
      return '/KG.svg';
    }
    if (lang === 'en') {
      return '/EN.svg';
    }
    if (lang === 'ru') {
      return '/RU.svg';
    }
    return '/RU.svg'; // Default fallback
  };

  useEffect(() => {
    // Fetch and process SVG
    const loadSvg = async () => {
      try {
        const response = await fetch(getSvgPath());
        let svg = await response.text();

        // Optimize SVG: remove CorelDRAW metadata and apply theme colors
        svg = svg
          // Remove XML declaration and DOCTYPE
          .replace(/<\?xml[^>]*>/g, '')
          .replace(/<!DOCTYPE[^>]*>/g, '')
          // Remove CorelDRAW metadata
          .replace(/<metadata[^>]*>.*?<\/metadata>/gs, '')
          // Replace hardcoded colors with CSS variables and currentColor
          .replace(/\.fil0\s*{[^}]*}/g, effectiveTheme === 'dark'
            ? '.fil0 {fill:var(--logo-primary, currentColor)}'
            : '.fil0 {fill:var(--logo-primary, currentColor)}')
          .replace(/\.fil1\s*{[^}]*}/g, effectiveTheme === 'dark'
            ? '.fil1 {fill:var(--logo-primary, currentColor);fill-rule:nonzero}'
            : '.fil1 {fill:var(--logo-primary, currentColor);fill-rule:nonzero}')
          .replace(/\.fil2\s*{[^}]*}/g, effectiveTheme === 'dark'
            ? '.fil2 {fill:var(--logo-secondary, #D1D5DB)}'
            : '.fil2 {fill:var(--logo-secondary, #2B2A29)}')
          // Remove comments
          .replace(/<!--[\s\S]*?-->/g, '')
          // Add responsive viewBox if missing
          .replace(/<svg/, '<svg preserveAspectRatio="xMidYMid meet"')
          .trim();

        setSvgContent(svg);
      } catch (error) {
        console.error('Failed to load logo SVG:', error);
      }
    };

    loadSvg();
  }, [i18n.language, effectiveTheme]);

  if (!svgContent) {
    // Fallback skeleton while loading
    return (
      <div
        className={`animate-pulse bg-neutral-200 dark:bg-neutral-700 ${className}`}
        style={{ width, height }}
        aria-label="Loading logo..."
      />
    );
  }

  return (
    <div
      className={`logo-container ${className}`}
      style={{
        width,
        height,
        // CSS custom properties for theme-aware colors
        '--logo-primary': effectiveTheme === 'dark' ? '#E5E7EB' : '#1F2937',
        '--logo-secondary': effectiveTheme === 'dark' ? '#9CA3AF' : '#2B2A29',
      } as React.CSSProperties}
      aria-label={`КФА Logo (${i18n.language === 'ky' ? 'KG' : i18n.language.toUpperCase()})`}
      role="img"
    >
      <div
        dangerouslySetInnerHTML={{ __html: svgContent }}
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      />
      <style>{`
        .logo-container svg {
          width: 100%;
          height: 100%;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .logo-container:hover svg {
          transform: scale(1.02);
        }

        /* Ensure smooth color transitions */
        .logo-container .fil0,
        .logo-container .fil1,
        .logo-container .fil2 {
          transition: fill 0.3s ease-in-out;
        }

        /* Accessibility: high contrast mode support */
        @media (prefers-contrast: high) {
          .logo-container svg .fil0,
          .logo-container svg .fil1 {
            fill: currentColor !important;
          }
        }

        /* Print optimization */
        @media print {
          .logo-container svg .fil0,
          .logo-container svg .fil1 {
            fill: black !important;
          }
          .logo-container svg .fil2 {
            fill: #2B2A29 !important;
          }
        }
      `}</style>
    </div>
  );
}

/**
 * Compact Logo variant for mobile/small spaces
 */
export function LogoCompact(props: Omit<LogoProps, 'height'>) {
  return <Logo {...props} height={32} />;
}

/**
 * Large Logo variant for hero sections
 */
export function LogoLarge(props: Omit<LogoProps, 'height'>) {
  return <Logo {...props} height={64} />;
}
