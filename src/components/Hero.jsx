import PropTypes from 'prop-types';
import { useLocalTime } from '../utils/useLocalTime';
import HeadingReveal from './editorial/HeadingReveal';
import AsciiBlocks from './editorial/AsciiBlocks';

export default function Hero({ animate }) {
  const time = useLocalTime('America/Los_Angeles');
  return (
    <section id="home" tabIndex={-1} className="hero" aria-labelledby="hero-title">
      <div className="hero-topline micro">
        <span>Creative developer & design engineer</span>
        <span>
          San Diego, CA <span className="clock">{time}</span>
        </span>
      </div>
      <div className="hero-copy">
        <HeadingReveal as="h1" animate={animate} id="hero-title">
          <span className="hero-title-line">I build thoughtful interfaces</span>
          <span className="hero-title-line">
            with a little <em className="heading-accent">personality.</em>
          </span>
        </HeadingReveal>
      </div>
      <div className="hero-support">
        <div className="hero-intro">
          <p>I design and build web interfaces, interactive tools, and shared component systems.</p>
          <div className="hero-links">
            <a className="text-link" href="#projects">
              View selected work <span aria-hidden="true">↓</span>
            </a>
            <a className="text-link" href="#experience">
              My experience <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
        <div className="hero-art">
          <AsciiBlocks animate={animate} />
        </div>
      </div>
      <div className="hero-bottom micro">
        <span>Design in the details. Care in the code.</span>
        <span>Selected work / {new Date().getFullYear()}</span>
      </div>
    </section>
  );
}
Hero.propTypes = { animate: PropTypes.bool.isRequired };
