// src/components/Experience.jsx
import { motion } from 'framer-motion';
import { fadeIn, staggerContainer } from '../utils/motion';

const experience = [
  {
    title: 'BLACKCLOAK · CYBERSECURITY',
    role: 'MOBILE · BACKEND',
    time: 'Guided experience',
  },
  {
    title: 'ROADRA · CAR MARKETPLACE',
    role: 'PRODUCT UI · FRONTEND & BACKEND',
    time: 'Marketplace / Auctions / Internal tooling',
  },
  {
    title: 'MOTORWAY · CAR MARKETPLACE',
    role: 'PRODUCT UI · FRONTEND',
    time: 'Car profiling',
  },
];

const Experience = () => {
  return (
    <motion.section
      id="experience"
      className="scroll-mt-24"
      variants={staggerContainer(0.1, 0)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div
        className="
          callout-panel
          text-[#FFF7E8]
          rounded-3xl
          px-6 sm:px-10 md:px-16
          py-14
          shadow-[0_18px_45px_rgba(0,0,0,0.35)]
        "
      >
        {/* HEADER */}
        <motion.h2
          variants={fadeIn('up', 'tween', 0, 0.6)}
          className="
          heading-display text-3xl sm:text-4xl
          text-[#FFF7E8]
          leading-none
          mb-12
        "
        >
          PROFESSIONAL EXPERIENCE:
        </motion.h2>

        {/* TABLE-like area */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 text-sm">

          {/* LEFT EMPTY OR DESCRIPTION COLUMN */}
          <motion.div variants={fadeIn('right', 'tween', 0.1, 0.6)} className="col-span-1">
            <p className="text-[#e9e2d2] leading-relaxed opacity-80 text-[0.9rem]">
              A quick overview of the products I've built across different teams
              and projects.
            </p>
          </motion.div>

          {/* RIGHT SIDE TABLE */}
          <div className="col-span-1 sm:col-span-2 flex flex-col divide-y divide-[#FFF7E8]/40">

            {experience.map((p, idx) => (
              <motion.div
                key={p.title}
                variants={fadeIn('up', 'tween', 0.15 + idx * 0.08, 0.6)}
                className="
                  grid grid-cols-1 sm:grid-cols-[1.4fr_1fr_0.6fr]
                  gap-1 sm:gap-4
                  py-3
                  sm:items-center
                "
              >
                {/* PROJECT TITLE */}
                <div className="font-medium">
                  {p.title}
                </div>

                {/* ROLE */}
                <div className="opacity-90 text-[0.82rem] tracking-wide">
                  {p.role}
                </div>

                {/* TIME / CATEGORY */}
                <div className="opacity-90 text-[0.82rem] sm:text-right">
                  {p.time}
                </div>
              </motion.div>
            ))}

          </div>
        </div>

        {/* FOOTER STRIP */}
        <div className="mt-12 flex justify-between text-[0.7rem] tracking-wider opacity-70">
          <span></span>
          <span>© {new Date().getFullYear()}</span>
          <span></span>
        </div>
      </div>
    </motion.section>
  );
};

export default Experience;
