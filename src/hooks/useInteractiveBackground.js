import { useEffect } from 'react';

export function useInteractiveBackground() {
  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const originalBackground = document.body.style.background;
    document.body.style.background = 'var(--color-bg-page, #fafaf8)';

    return () => {
      document.body.style.background = originalBackground;
    };
  }, []);
}
