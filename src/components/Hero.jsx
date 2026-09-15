import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

export default function Hero({ animate, motionPaused, onToggleMotion, prefersReducedMotion }) {
  return (
    <section id="home" tabIndex={-1} aria-labelledby="intro-heading" className="hero-section content-shell">
      <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-white/75">
        <p className="label-upper">Design engineer · Frontend UX</p>
        <p>San Diego / Remote</p>
      </div>

      <motion.div
        initial={animate ? { opacity: 0, y: 18 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: animate ? 0.65 : 0 }}
        className="max-w-3xl py-12 sm:py-16"
      >
        <p className="text-lg text-[var(--green-soft)] mb-5">Hi, I’m Magda Pelka.</p>
        <h1 id="intro-heading" className="hero-heading heading-display text-white">
          Thoughtful interfaces.<br />
          <span className="text-[var(--green-soft)]">Built with care.</span>
        </h1>
        <p className="mt-7 max-w-xl text-base sm:text-lg leading-relaxed text-white/80">
          I build interfaces, interactions, and the logic behind them.
          A background in film and photography shapes my eye for hierarchy,
          motion, and the details that make a product feel considered.
        </p>
        <div className="flex flex-wrap gap-3 mt-8">
          <a className="button button-primary" href="#projects">View selected work <span aria-hidden="true">↗</span></a>
          <a className="button button-secondary" href="#contact">Get in touch</a>
        </div>
      </motion.div>

      <div className="border-t border-white/20 pt-5 flex flex-wrap justify-between items-center gap-5 text-sm text-white/75">
        <p>React · Vue · TypeScript <span className="mx-2 text-white/[0.35]" aria-hidden="true">/</span> Interaction & motion</p>
        {prefersReducedMotion ? (
          <span className="text-white/60">Reduced motion enabled</span>
        ) : (
          <button type="button" className="motion-toggle" aria-pressed={motionPaused} onClick={onToggleMotion}>
            Pause background
            <span aria-hidden="true" className={`motion-indicator ${motionPaused ? '' : 'is-running'}`} />
          </button>
        )}
      </div>
    </section>
  );
}

Hero.propTypes = {
  animate: PropTypes.bool.isRequired,
  motionPaused: PropTypes.bool.isRequired,
  onToggleMotion: PropTypes.func.isRequired,
  prefersReducedMotion: PropTypes.bool,
};
