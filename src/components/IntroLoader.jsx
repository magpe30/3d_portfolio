import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { animate as animateValue, useMotionValue } from 'framer-motion';
import PropTypes from 'prop-types';
import ArrowIcon from './ArrowIcon';
import './IntroLoader.css';

export default function IntroLoader({ progress, animate, onComplete, onSkip }) {
  const rootRef = useRef(null);
  const value = useMotionValue(0);
  const [displayed, setDisplayed] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => value.on('change', (next) => setDisplayed(Math.floor(next))), [value]);
  useEffect(() => {
    const controls = animateValue(value, progress, {
      duration: animate ? 0.55 : 0,
      ease: [0.22, 1, 0.36, 1],
    });
    return () => controls.stop();
  }, [progress, animate, value]);

  useEffect(() => {
    if (displayed !== 100) return undefined;
    const timer = window.setTimeout(() => setLeaving(true), animate ? 180 : 0);
    return () => window.clearTimeout(timer);
  }, [displayed, animate]);
  useEffect(() => {
    if (!leaving) return undefined;
    const timer = window.setTimeout(onComplete, animate ? 650 : 0);
    return () => window.clearTimeout(timer);
  }, [leaving, animate, onComplete]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    return () => {
      if (root.contains(document.activeElement)) {
        requestAnimationFrame(() => document.querySelector('.skip-link')?.focus());
      }
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="intro-loader"
      data-leaving={leaving}
      data-motion={animate ? 'on' : 'off'}
    >
      <div className="loader-header">
        <span className="loader-monogram" aria-hidden="true">
          mp.
        </span>
        <p className="micro">Magda Pelka / Creative engineer</p>
      </div>
      <div className="loader-body">
        <div className="loader-message">
          <svg className="loader-symbol" viewBox="0 0 180 100" fill="none" aria-hidden="true">
            <path d="m49 17-32 33 32 33" stroke="currentColor" strokeWidth="2" />
            <path d="m105 10-30 80" stroke="currentColor" strokeWidth="2" />
            <path d="m131 17 32 33-32 33" stroke="currentColor" strokeWidth="2" />
            <circle cx="163" cy="50" r="6" fill="#243aca" />
          </svg>
          <p className="micro">A little preparation.</p>
          <p className="loader-title">
            Making
            <br />
            things move.
          </p>
        </div>
        <div
          className="loader-counter"
          role="progressbar"
          aria-label="Preparing portfolio"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={displayed}
        >
          <span aria-hidden="true">{String(displayed).padStart(2, '0')}</span>
          <span className="loader-percent" aria-hidden="true">
            %
          </span>
        </div>
      </div>
      <div className="loader-footer">
        <div className="loader-track" aria-hidden="true">
          <span style={{ transform: `scaleX(${displayed / 100})` }} />
        </div>
        <div className="loader-bottom">
          <p className="micro" role="status">
            {displayed === 100 ? 'Ready when you are.' : 'Getting everything in place.'}
          </p>
          <button type="button" className="loader-skip" onClick={onSkip}>
            Enter portfolio <ArrowIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

IntroLoader.propTypes = {
  progress: PropTypes.number.isRequired,
  animate: PropTypes.bool.isRequired,
  onComplete: PropTypes.func.isRequired,
  onSkip: PropTypes.func.isRequired,
};
