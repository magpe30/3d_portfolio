import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

export default function HeroObjects({ animate }) {
  const hostRef = useRef(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!animate) return undefined;
    let cancelled = false,
      dispose;
    import('./heroObjectScene')
      .then(({ createHeroObjectScene }) => {
        if (cancelled) return;
        dispose = createHeroObjectScene(
          hostRef.current,
          () => setReady(true),
          () => setReady(false),
        );
      })
      .catch(() => {
        if (!cancelled) setReady(false);
      });
    return () => {
      cancelled = true;
      dispose?.();
      setReady(false);
    };
  }, [animate]);
  return (
    <div
      ref={hostRef}
      className="hero-objects"
      data-renderer={ready && animate ? 'webgl' : 'static'}
      aria-hidden="true"
    >
      <div className="hero-object-fallback">
        <svg className="hero-object hero-object--opening" viewBox="0 0 120 140">
          <defs>
            <linearGradient id="code-glass-blue" x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="#ffffff" stopOpacity=".85" />
              <stop offset=".35" stopColor="#94b1d2" stopOpacity=".25" />
              <stop offset=".7" stopColor="#e6eef8" stopOpacity=".85" />
              <stop offset="1" stopColor="#8dabc9" stopOpacity=".5" />
            </linearGradient>
          </defs>
          <path
            d="M89 12 108 32 45 70 108 108 89 128 10 70Z"
            fill="url(#code-glass-blue)"
            stroke="#a4b8d0"
            strokeWidth="2"
          />
          <path
            d="M88 19 99 32 34 70 99 108"
            fill="none"
            stroke="#fff"
            strokeWidth="3"
            opacity=".8"
          />
        </svg>
        <svg className="hero-object hero-object--closing" viewBox="0 0 190 140">
          <defs>
            <linearGradient id="code-glass-pink" x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="#fff" stopOpacity=".8" />
              <stop offset=".4" stopColor="#d8b8d0" stopOpacity=".3" />
              <stop offset=".75" stopColor="#faeaf6" stopOpacity=".85" />
              <stop offset="1" stopColor="#ae8da5" stopOpacity=".5" />
            </linearGradient>
          </defs>
          <path
            d="M15 128 37 128 80 12 58 12ZM106 12 88 32 150 70 88 108 106 128 186 70Z"
            fill="url(#code-glass-pink)"
            stroke="#b9a2b5"
            strokeWidth="2"
          />
          <path
            d="M22 123 64 17M106 19 97 32 163 70 97 108"
            fill="none"
            stroke="#fff"
            strokeWidth="3"
            opacity=".8"
          />
        </svg>
      </div>
    </div>
  );
}
HeroObjects.propTypes = { animate: PropTypes.bool.isRequired };
