import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const clamp = (value) => Math.min(1, Math.max(0, value));

export default function DisciplineStack({ animate, children }) {
  const trackRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    const cards = [...track.querySelectorAll('.discipline-card')];
    let pinned = false;
    let travel = 0;
    let top = 0;
    let frame = 0;

    const update = () => {
      frame = 0;
      const progress = pinned ? clamp((top - track.getBoundingClientRect().top) / travel) : 0;
      // Reading pauses surround two short, scroll-controlled slide-over transitions.
      const reveals = [1, clamp((progress - 0.24) / 0.12), clamp((progress - 0.6) / 0.12)];
      cards.forEach((card, index) => {
        const visible = !pinned || (reveals[index] > 0 && (reveals[index + 1] ?? 0) < 1);
        card.style.setProperty('--card-shift', `${pinned ? (1 - reveals[index]) * 105 : 0}%`);
        card.style.setProperty('--card-opacity', visible ? '1' : '0');
        card.dataset.active = String(visible);
      });
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const measure = () => {
      top = parseFloat(getComputedStyle(track).getPropertyValue('--stack-top'));
      const height = Math.max(...cards.map((card) => card.offsetHeight));
      // Fall back to regular reading flow whenever a complete card cannot fit.
      pinned = animate && height + top + 24 <= window.innerHeight;
      travel = window.innerHeight * 2.4;
      track.style.setProperty('--card-height', `${height}px`);
      track.style.setProperty('--scroll-travel', `${travel}px`);
      track.dataset.stacking = pinned ? 'on' : 'off';
      schedule();
    };

    const observer = new ResizeObserver(measure);
    cards.forEach((card) => observer.observe(card));
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', schedule, { passive: true });
    measure();
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', schedule);
      cancelAnimationFrame(frame);
    };
  }, [animate]);

  return (
    <div className="discipline-stack" ref={trackRef} data-stacking="off">
      <div className="discipline-stage">{children}</div>
    </div>
  );
}

DisciplineStack.propTypes = {
  animate: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
};
