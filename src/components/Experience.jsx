import PropTypes from 'prop-types';
import { jobs } from '../constants/experience';
import HeadingReveal from './editorial/HeadingReveal';
import Reveal from './editorial/Reveal';
import ExperienceRow from './ExperienceRow';

export default function Experience({ animate }) {
  return (
    <section
      id="experience"
      tabIndex={-1}
      className="experience-section section-pad"
      aria-labelledby="experience-title"
    >
      <div className="experience-header">
        <span className="micro">The experience so far / 2021—Now</span>
        <HeadingReveal animate={animate} id="experience-title">
          Where I’ve <em>been.</em>
        </HeadingReveal>
      </div>
      <div className="experience-list">
        {jobs.map((job, index) => (
          <Reveal animate={animate} key={job.company}>
            <ExperienceRow job={job} index={index} animate={animate} />
          </Reveal>
        ))}
      </div>
      <a
        className="text-link resume-link"
        href="mailto:mpelka892@gmail.com?subject=R%C3%A9sum%C3%A9%20request"
      >
        Request my résumé by email <span aria-hidden="true">↗</span>
      </a>
    </section>
  );
}
Experience.propTypes = { animate: PropTypes.bool.isRequired };
