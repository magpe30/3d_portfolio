import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import PropTypes from 'prop-types';
import { projects } from '../constants/portfolio';
import HeadingReveal from './editorial/HeadingReveal';
import Reveal from './editorial/Reveal';

function WorkChapter({ project, animate }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 20%'] });
  const backgroundColor = useTransform(scrollYProgress, [0, 1], [project.from, project.color]);
  const clipPath = useTransform(
    scrollYProgress,
    [0, 0.9],
    ['inset(9% 7% 9% 7%)', 'inset(0% 0% 0% 0%)'],
  );
  return (
    <motion.article
      ref={ref}
      className={`work-chapter work-chapter--${project.id}`}
      style={{ backgroundColor: animate ? backgroundColor : project.color }}
      aria-labelledby={`${project.id}-title`}
    >
      <div className="project-topline micro">
        <span>
          {project.number} / {project.category}
        </span>
        <span>Independent project · Working prototype</span>
      </div>
      <div className="project-layout">
        <div className="project-intro">
          <div>
            <span className="project-number" aria-hidden="true">
              ({project.number})
            </span>
            <h3 id={`${project.id}-title`} className="project-wordmark">
              {project.name}
              <span>{project.suffix}</span>
            </h3>
            <p className="project-tagline">{project.tagline}</p>
          </div>
          <div className="project-description">
            <p>{project.description}</p>
            <a className="text-link" href={`/work/${project.id}`}>
              Explore the case study <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
        <Reveal animate={animate}>
          <motion.div
            className="project-preview-clip"
            style={{ clipPath: animate ? clipPath : 'none' }}
          >
            <a
              href={`/work/${project.id}`}
              className="project-stage"
              aria-label={`Read the ${project.name}${project.suffix} case study`}
            >
              <div className="project-stage-label micro">
                <span>{project.previewLabel}</span>
                <span aria-hidden="true">↗</span>
              </div>
              <img
                src={project.image.src}
                width={project.image.width}
                height={project.image.height}
                alt={project.image.alt}
                loading="lazy"
                decoding="async"
              />
              <span className="project-open">
                View project <span aria-hidden="true">↗</span>
              </span>
            </a>
          </motion.div>
        </Reveal>
      </div>
      <div className="project-summary">
        <div>
          <p className="micro muted">The decision</p>
          <h4>{project.decision}</h4>
          <p>{project.reason}</p>
        </div>
        <dl className="project-facts">
          <div>
            <dt className="micro muted">My contribution</dt>
            <dd>Interface design & development</dd>
          </div>
          <div>
            <dt className="micro muted">Built with</dt>
            <dd>{project.stack}</dd>
          </div>
        </dl>
      </div>
    </motion.article>
  );
}
WorkChapter.propTypes = {
  project: PropTypes.object.isRequired,
  animate: PropTypes.bool.isRequired,
};

export default function Projects({ animate }) {
  return (
    <section id="projects" tabIndex={-1} className="work-section" aria-labelledby="work-title">
      <div className="section-heading section-pad">
        <div>
          <p className="micro">01 / Selected work</p>
          <HeadingReveal animate={animate} id="work-title">
            Work<span className="work-count">(02)</span>
          </HeadingReveal>
        </div>
        <p className="section-intro">
          Two projects I’m building.
          <br />
          The interfaces, the code, and what I’m learning along the way.
        </p>
      </div>
      {projects.map((project) => (
        <WorkChapter key={project.id} project={project} animate={animate} />
      ))}
    </section>
  );
}
Projects.propTypes = { animate: PropTypes.bool.isRequired };
