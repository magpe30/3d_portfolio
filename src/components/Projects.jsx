// src/components/Projects.jsx
import { motion } from 'framer-motion';
import { fadeIn, staggerContainer } from '../utils/motion';

const personalProjects = [
  {
    title: 'RIDE SD',
    tagline: 'Motorcycle route map & GPX ride analysis',
    description:
      "A game-styled motorcycle route map for San Diego's canyon and mountain roads, paired with a from-scratch GPX analysis pipeline that turns ride recordings into corner-by-corner speed and lean-angle comparisons across sessions.",
    highlights: [
      'Real OpenStreetMap road geometry for 4 San Diego backcountry routes, with corner detection run directly on that geometry',
      'GPX map-matching + direction-aware pass splitting, with Savitzky-Golay smoothed speed to preserve real corner shape',
      'Side-by-side comparison of up to 3 rides per route, with per-corner speed and estimated lean angle',
    ],
    stack: ['NEXT.JS', 'REACT', 'THREE.JS', 'MAPLIBRE GL', 'TYPESCRIPT'],
    link: 'https://github.com/magpe30/ride-sd',
  },
];

const Projects = () => {
  return (
    <motion.section
      id="projects"
      className="scroll-mt-24 space-y-6"
      variants={staggerContainer(0.12, 0)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      <motion.div variants={fadeIn('up', 'tween', 0, 0.6)} className="section-line pt-6">
        <p className="label-upper text-white/50 mb-2">PERSONAL PROJECTS</p>
        <p className="text-sm text-white/80 max-w-2xl">
          Independent builds where I own the whole stack, end to end.
        </p>
      </motion.div>

      {personalProjects.map((project, idx) => (
        <motion.div
          key={project.title}
          variants={fadeIn('up', 'tween', 0.15 + idx * 0.08, 0.6)}
          className="glass-panel p-5 sm:p-7 space-y-4"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="heading-display text-2xl text-[var(--green-glow)]">
              {project.title}
            </h3>
            <a
              href={project.link}
              target="_blank"
              rel="noreferrer"
              className="
                label-upper text-[10px] px-3 py-1.5 rounded-full
                border border-[var(--green-glow)] text-[var(--green-glow)]
                transition-all duration-200
                hover:bg-[var(--green-glow)] hover:text-[var(--on-accent)]
                hover:-translate-y-[2px]
              "
            >
              VIEW ON GITHUB
            </a>
          </div>

          <p className="text-xs label-upper text-white/50">{project.tagline}</p>

          <p className="text-sm text-white/80 leading-relaxed">
            {project.description}
          </p>

          <ul className="space-y-1.5 text-[0.82rem] text-white/80">
            {project.highlights.map((point) => (
              <li key={point} className="flex gap-2">
                <span className="text-[var(--green-glow)] shrink-0">·</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-2 pt-1">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="text-[10px] label-upper px-2.5 py-1 rounded-full chip-green"
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.div>
      ))}
    </motion.section>
  );
};

export default Projects;
