import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

export default function CaseDisclosure({ title, className, animate, children }) {
  const detailsRef = useRef(null);
  const contentRef = useRef(null);
  const innerRef = useRef(null);
  const animationRef = useRef(null);
  const fadeRef = useRef(null);
  const expandedRef = useRef(false);

  useEffect(() => {
    if (!animate) {
      animationRef.current?.cancel();
      fadeRef.current?.cancel();
      animationRef.current = null;
      detailsRef.current.open = expandedRef.current;
    }
  }, [animate]);

  useEffect(
    () => () => {
      animationRef.current?.cancel();
      fadeRef.current?.cancel();
    },
    [],
  );

  function toggle(event) {
    event.preventDefault();
    const details = detailsRef.current;
    const content = contentRef.current;
    const inner = innerRef.current;
    const expanding = !expandedRef.current;
    expandedRef.current = expanding;
    details.dataset.expanded = String(expanding);

    // Read the current animated height before cancelling, so rapid clicks reverse smoothly.
    const height = details.open ? content.getBoundingClientRect().height : 0;
    const opacity = details.open ? getComputedStyle(inner).opacity : 0;
    animationRef.current?.cancel();
    fadeRef.current?.cancel();
    animationRef.current = null;

    if (!animate) {
      details.open = expanding;
      return;
    }

    // Keep native details open until the closing animation has finished.
    details.open = true;
    const targetHeight = expanding ? inner.getBoundingClientRect().height : 0;
    // A gentle acceleration matters for the long case study: a fast ease-out
    // moves hundreds of pixels in its first frames and feels like a jump.
    const duration = Math.min(950, 600 + Math.abs(targetHeight - height) * 0.2);
    const fade = inner.animate([{ opacity }, { opacity: expanding ? 1 : 0 }], {
      duration: expanding ? duration * 0.7 : duration * 0.55,
      delay: expanding ? duration * 0.12 : 0,
      easing: 'ease-in-out',
      fill: 'both',
    });
    fadeRef.current = fade;
    const animation = content.animate(
      [{ height: `${height}px` }, { height: `${targetHeight}px` }],
      { duration, easing: 'cubic-bezier(0.45, 0, 0.2, 1)', fill: 'both' },
    );
    animationRef.current = animation;
    animation.onfinish = () => {
      details.open = expanding;
      animation.cancel();
      fade.cancel();
      animationRef.current = null;
      fadeRef.current = null;
    };
  }

  return (
    <details ref={detailsRef} className={`case-disclosure ${className}`}>
      <summary onClick={toggle}>
        <span>{title}</span>
        <span className="case-plus" aria-hidden="true">
          +
        </span>
      </summary>
      <div ref={contentRef} className="case-disclosure-content">
        <div ref={innerRef} className="case-disclosure-inner">
          {children}
        </div>
      </div>
    </details>
  );
}

CaseDisclosure.propTypes = {
  title: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
  animate: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
};
