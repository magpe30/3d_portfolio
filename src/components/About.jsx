import { useState } from 'react';
import PropTypes from 'prop-types';
import HeadingReveal from './editorial/HeadingReveal';
import Reveal from './editorial/Reveal';
import AsciiSculpture from './editorial/AsciiSculpture';

export default function About({ animate }) {
  const [study, setStudy] = useState(0);
  return (
    <section
      id="about"
      tabIndex={-1}
      className="about-section section-pad"
      aria-labelledby="about-title"
    >
      <div className="section-label micro">
        <span>02 / Behind the work</span>
      </div>
      <HeadingReveal animate={animate} id="about-title">
        An engineer’s mind.
        <br />A filmmaker’s <em className="heading-accent">eye.</em>
      </HeadingReveal>
      <div className="about-grid">
        <Reveal animate={animate} className="about-copy" delay={0.15}>
          <p>
            I’m a software engineer with a background in film and photography. That background
            shapes how I approach interfaces: I care about how they look, how they respond, and how
            naturally people can use them.
          </p>
          <p>
            I build web and mobile applications and shared component libraries, bringing design
            awareness to practical engineering. I enjoy making complex features easier to use and
            writing code that’s clear, reliable, and easy for others to build on.
          </p>
        </Reveal>
        <div className="about-sculpture">
          <AsciiSculpture animate={animate} morph ripple color="#e8e5d9" onShapeChange={setStudy} />
          <span className="sculpture-index" aria-hidden="true">
            0{study + 1}
          </span>
        </div>
      </div>
    </section>
  );
}
About.propTypes = { animate: PropTypes.bool.isRequired };
