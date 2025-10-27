import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook to handle scroll to element with id matching hash in URL
 * Supports both initial page load and hash changes
 */
export function useScrollToHash() {
  const location = useLocation();

  useEffect(() => {
    // Get hash from URL (e.g., #history)
    const hash = location.hash;

    if (hash) {
      // Remove the # symbol
      const id = hash.replace('#', '');

      // Wait for the DOM to be ready
      const timer = setTimeout(() => {
        const element = document.getElementById(id);

        if (element) {
          // Calculate offset for fixed header (adjust as needed)
          const headerOffset = 80; // Height of sticky header
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 100); // Small delay to ensure DOM is ready

      return () => clearTimeout(timer);
    } else {
      // If no hash, scroll to top
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.hash]);
}
