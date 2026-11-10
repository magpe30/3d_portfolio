import PropTypes from 'prop-types';
import { linkedIn } from '../constants/contact';
import { jobs } from '../constants/experience';
import HeadingReveal from './editorial/HeadingReveal';
import Reveal from './editorial/Reveal';
import ExperienceRow from './ExperienceRow';
import ColorSection from './editorial/ColorSection';

export default function Experience({ animate }) {
  return (
    <ColorSection
      animate={animate}
      from="#bfd0ed"
      to="#deded8"
      id="experience"
      tabIndex={-1}
      className="experience-section section-pad"
      aria-labelledby="experience-title"
    >
      <div className="experience-header">
        <div>
          <p className="micro">03 / Experience</p>
          <HeadingReveal animate={animate} id="experience-title">
            Where I’ve
            <br />
            <em>worked.</em>
          </HeadingReveal>
        </div>
        <p className="experience-lead">
          I’ve worked on marketplace interfaces, AI workflows, and shared component libraries. At
          BlackCloak, my focus is a Tamagui design system used across web and mobile.
        </p>
      </div>
      <div className="experience-list">
        {jobs.map((job, index) => (
          <Reveal animate={animate} key={job.company}>
            <ExperienceRow job={job} index={index} animate={animate} />
          </Reveal>
        ))}
      </div>
      <a className="text-link resume-link" href={linkedIn} target="_blank" rel="noreferrer">
        More on LinkedIn <span aria-hidden="true">↗</span>
      </a>
    </ColorSection>
  );
}
Experience.propTypes = { animate: PropTypes.bool.isRequired };
