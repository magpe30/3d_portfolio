// src/components/Hero.jsx
import { motion } from 'framer-motion';
import { fadeIn, staggerContainer, textAnimation } from '../utils/motion';

const Hero = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      <div className="relative z-10 flex h-full flex-col justify-between px-6 sm:px-10 pt-20 pb-8">
        <div className="flex justify-between text-[10px] label-upper text-white/50">
          <span>SCROLL TO DIVE IN</span>
          <span>REMOTE · SAN DIEGO</span>
        </div>

        <motion.div
          variants={staggerContainer(0.15, 0.1)}
          initial="hidden"
          animate="show"
          className="text-center space-y-5"
        >
          <motion.p
            variants={fadeIn('down', 'tween', 0, 0.6)}
            className="label-upper text-[var(--green-soft)]"
          >
            PORTFOLIO / DESIGN ENGINEER
          </motion.p>
          <motion.h1
            variants={textAnimation(0.1)}
            className="heading-display text-4xl sm:text-6xl lg:text-7xl leading-none text-white"
          >
            HI THERE
          </motion.h1>
          <motion.h2
            variants={textAnimation(0.2)}
            className="heading-display text-4xl sm:text-6xl lg:text-7xl leading-none bg-gradient-to-r from-[var(--green-soft)] to-[var(--green-glow)] bg-clip-text text-transparent"
          >
            NICE TO MEET YOU
          </motion.h2>
          <motion.p
            variants={fadeIn('up', 'tween', 0.3, 0.6)}
            className="text-[11px] mt-3 text-white/60 max-w-md mx-auto"
          >
            I'm Magda. I build interfaces, motion, and the details in between.
          </motion.p>
        </motion.div>

        <motion.div
          variants={fadeIn('up', 'tween', 0.3, 0.6)}
          initial="hidden"
          animate="show"
          className="grid grid-cols-3 text-center text-xs label-upper text-white/50 border-t border-white/10 pt-4"
        >
          <div>
            <p>STACK</p>
            <p className="mt-1 text-[var(--green-soft)]">
              REACT · VUE · TYPESCRIPT · NODE.JS
            </p>
          </div>
          <div>
            <p>FOCUS</p>
            <p className="mt-1 text-[var(--green-soft)]">FULL STACK · MOTION</p>
          </div>
          <div>
            <p>SCENE</p>
            <p className="mt-1 text-[var(--green-soft)]">WEBGL · THREE.JS</p>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 text-white/40 scroll-cue">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 4v16m0 0l-6-6m6 6l6-6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
