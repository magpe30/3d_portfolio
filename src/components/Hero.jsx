import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import PropTypes from 'prop-types';
import HeadingReveal from './editorial/HeadingReveal';
import HeroObjects from './editorial/HeroObjects';

export default function Hero({ animate }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const backgroundColor = useTransform(scrollYProgress, [0, 0.8], ['#e9e8e3', '#e5ee8d']);
  return (
    <motion.section
      ref={ref}
      style={{ backgroundColor: animate ? backgroundColor : '#e9e8e3' }}
      id="home"
      tabIndex={-1}
      className="hero"
      aria-labelledby="hero-title"
    >
      <HeroObjects animate={animate} />
      <div className="hero-copy">
        <p className="hero-eyebrow micro">Magda Pelka / Creative engineer</p>
        <HeadingReveal as="h1" animate={animate} id="hero-title">
          <span className="hero-line">Design with purpose.</span>{' '}
          <span className="hero-line">Build with personality.</span>
        </HeadingReveal>
        <p className="hero-description">
          I design and build interfaces for web and mobile. I like working on the details: how a
          screen is laid out, how it responds, and how the code fits together.
        </p>
        <a className="text-link" href="#projects">
          View selected work <span aria-hidden="true">↘</span>
        </a>
      </div>
      <div className="hero-bottom">
        <span>
          <span className="status-dot" />
          Open to creative engineering roles
        </span>
        <a href="#projects">
          Explore the work <span aria-hidden="true">↓</span>
        </a>
      </div>
    </motion.section>
  );
}
Hero.propTypes = { animate: PropTypes.bool.isRequired };
