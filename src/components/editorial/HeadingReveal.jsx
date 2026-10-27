import { Children, cloneElement, isValidElement, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

function splitLetters(children, cursor) {
  return Children.map(children, (child) => {
    if (typeof child === 'string' || typeof child === 'number') {
      return String(child)
        .split(/(\s+)/)
        .map((word, wordIndex) => {
          if (!word || /^\s+$/.test(word)) return word;
          return (
            <span className="heading-word" key={wordIndex}>
              <span className="sr-only">{word}</span>
              <span aria-hidden="true">
                {Array.from(word).map((letter) => {
                  const index = cursor.value++;
                  return (
                    <span
                      className="heading-letter"
                      key={index}
                      style={{ '--letter-index': index }}
                    >
                      {letter}
                    </span>
                  );
                })}
              </span>
            </span>
          );
        });
    }
    // Preserve emphasis, language, line breaks, and real links; skip decorative icons.
    if (!isValidElement(child) || !child.props.children || child.props['aria-hidden']) return child;
    return cloneElement(child, {}, splitLetters(child.props.children, cursor));
  });
}

export default function HeadingReveal({
  as: Tag = 'h2',
  children,
  animate = true,
  className = '',
  id,
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const cursor = { value: 0 };
  const content = splitLetters(children, cursor);

  useEffect(() => {
    if (!animate || visible) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.15) setVisible(true);
      },
      { threshold: [0, 0.15], rootMargin: '0px 0px -8% 0px' },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [animate, visible]);

  return (
    <Tag
      ref={ref}
      id={id}
      className={`heading heading-reveal ${className}`.trim()}
      data-reveal={!animate ? 'static' : visible ? 'visible' : 'waiting'}
      style={{ '--letter-step': `${Math.min(28, 800 / Math.max(1, cursor.value - 1))}ms` }}
      onFocusCapture={() => setVisible(true)}
    >
      {content}
    </Tag>
  );
}

HeadingReveal.propTypes = {
  as: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4']),
  children: PropTypes.node.isRequired,
  animate: PropTypes.bool,
  className: PropTypes.string,
  id: PropTypes.string,
};
