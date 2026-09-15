import PropTypes from 'prop-types';
import { Component, lazy, Suspense, useEffect, useRef, useState } from 'react';

const GalaxyScene = lazy(() => import('./canvas/GalaxyScene'));

// A decorative scene must never prevent someone from reading the portfolio.
class SceneBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function Background({ animate }) {
  const progressRef = useRef(0);
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!animate) return undefined;
    // Let the content paint before requesting the optional WebGL bundle.
    const timer = window.setTimeout(() => setReady(true), 600);
    return () => window.clearTimeout(timer);
  }, [animate]);

  useEffect(() => {
    let raf = null;
    // This is a full-page backdrop: scrolling must never stop its render loop.
    const updateVisibility = () => setVisible(!document.hidden);
    const updateProgress = () => {
      raf = null;
      const scrollRange = document.documentElement.scrollHeight - window.innerHeight;
      progressRef.current = scrollRange > 0
        ? Math.min(Math.max(window.scrollY / scrollRange, 0), 1)
        : 0;
    };
    const onScroll = () => {
      if (raf === null) raf = requestAnimationFrame(updateProgress);
    };
    const resizeObserver = new ResizeObserver(onScroll);
    resizeObserver.observe(document.body);
    updateVisibility();
    updateProgress();
    document.addEventListener('visibilitychange', updateVisibility);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      resizeObserver.disconnect();
      document.removeEventListener('visibilitychange', updateVisibility);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="scene-backdrop fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
      {ready && animate && (
        <SceneBoundary>
          <Suspense fallback={null}>
            <GalaxyScene progressRef={progressRef} running={visible} />
          </Suspense>
        </SceneBoundary>
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#030a06]/[0.35] to-[#030a06]/90" />
    </div>
  );
}

SceneBoundary.propTypes = { children: PropTypes.node };
Background.propTypes = { animate: PropTypes.bool.isRequired };
