import { MotionConfig, motion, useScroll, useSpring } from 'framer-motion';
import { useMotionPreference } from './utils/useMotionPreference';
import { useSmoothScroll } from './utils/useSmoothScroll';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Projects from './components/Projects';
import About from './components/About';
import Experience from './components/Experience';
import Contact from './components/Contact';

export default function App() {
  const reducedMotion = useMotionPreference();
  const animate = !reducedMotion;
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  useSmoothScroll(animate);

  return (
    <MotionConfig reducedMotion={animate ? 'never' : 'always'}>
      <div className="portfolio" data-motion={animate ? 'on' : 'off'}>
        <a className="skip-link" href="#projects">
          Skip to selected work
        </a>
        <motion.div
          className="reading-progress"
          aria-hidden="true"
          style={{ scaleX: animate ? progress : scrollYProgress }}
        />
        <Navbar />
        <main>
          <Hero animate={animate} />
          <Projects animate={animate} />
          <About animate={animate} />
          <Experience animate={animate} />
          <Contact animate={animate} />
        </main>
      </div>
    </MotionConfig>
  );
}
