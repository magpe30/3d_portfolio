import { useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

export function useSmoothScroll(enabled) {
  useEffect(() => {
    if (!enabled) return undefined;
    const scroll = new Lenis({ autoRaf: true, lerp: 0.09, smoothWheel: true, syncTouch: false });
    // Preserve native touch scrolling and explicit focus/history for anchor links.
    const onAnchor = (event) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const link = event.target.closest('a[href^="#"]');
      if (!link) return;
      const hash = link.getAttribute('href');
      const target = document.getElementById(hash.slice(1));
      if (!target) return;
      event.preventDefault();
      scroll.scrollTo(target, {
        offset: -(document.querySelector('.site-header')?.getBoundingClientRect().height ?? 0),
        duration: 1.1,
        lerp: 0,
        easing: (t) => 1 - Math.pow(1 - t, 4),
        onComplete: () => {
          if (window.location.hash !== hash) window.history.pushState(null, '', hash);
          target.focus({ preventScroll: true });
        },
      });
    };
    document.addEventListener('click', onAnchor);
    return () => {
      document.removeEventListener('click', onAnchor);
      scroll.destroy();
    };
  }, [enabled]);
}
