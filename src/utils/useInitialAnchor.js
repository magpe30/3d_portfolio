import { useLayoutEffect } from 'react';

// On a fresh document navigation the browser may resolve the fragment before
// React has mounted its destination. Restore it once the layout exists.
export function useInitialAnchor() {
  useLayoutEffect(() => {
    if (!window.location.hash) return undefined;
    let id;
    try {
      id = decodeURIComponent(window.location.hash.slice(1));
    } catch {
      return undefined;
    }
    const frame = requestAnimationFrame(() => {
      const target = document.getElementById(id);
      if (!target) return;
      const header = document.querySelector('.site-header');
      const top = target.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: top - (header?.getBoundingClientRect().height ?? 0),
        behavior: 'instant',
      });
      target.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, []);
}
