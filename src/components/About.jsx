// src/components/About.jsx
import { motion } from 'framer-motion';
import { fadeIn } from '../utils/motion';

const About = () => {
  return (
    <motion.section
      id="about"
      className="scroll-mt-24 space-y-6"
      variants={fadeIn('up', 'tween', 0, 0.6)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
    >
      <p className="label-upper text-white/50 mb-2">ABOUT</p>
      <div className="glass-panel p-6 sm:p-8">
        <div className="grid gap-8 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] items-start">
          <p className="text-sm text-white/80 leading-relaxed">
          I’m a software developer with a background in film and photography —
          it shows in how I approach interfaces: clear, considered, intentional.
          Frontend is my specialty, but I build the backend logic and APIs behind
          it too, end to end.
          </p>
          <div className="text-xs text-white/80 space-y-2">
            <div>
              <p className="font-medium text-[var(--green-glow)]">
                I&apos;M GOOD AT
              </p>
              <p>React / Vue, TypeScript, design systems, UX flows.</p>
            </div>
            <div>
              <p className="font-medium text-[var(--green-glow)]">I ENJOY</p>
              <p>Creative tools, camera work, motion &amp; animation.</p>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default About;
