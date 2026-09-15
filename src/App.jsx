import { useState } from 'react';
import { MotionConfig } from 'framer-motion';
import { useMotionPreference } from './utils/useMotionPreference';
import About from './components/About';
import Contact from './components/Contact';
import Experience from './components/Experience';
import Hero from './components/Hero';
import Navbar from './components/Navbar';
import Projects from './components/Projects';
import Background from './components/Background';

export default function App() {
  const prefersReducedMotion = useMotionPreference();
  const [motionPaused, setMotionPaused] = useState(false);
  const animate = !prefersReducedMotion && !motionPaused;

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-screen">
        <Background animate={animate} />
        <div className="relative z-10">
          <a className="skip-link" href="#projects">Skip to selected work</a>
          <Navbar />
          <main>
            <Hero
              animate={animate}
              motionPaused={motionPaused}
              onToggleMotion={() => setMotionPaused((paused) => !paused)}
              prefersReducedMotion={prefersReducedMotion}
            />
            <div className="content-shell space-y-24 pb-20">
              <Projects />
              <Experience />
              <About />
              <Contact />
            </div>
          </main>
          <footer className="content-shell border-t border-white/[0.15] py-6 text-sm text-white/[0.65] flex flex-wrap justify-between gap-3">
            <p>© {new Date().getFullYear()} Magda Pelka</p>
            <a href="#home" className="hover:text-white">Back to top ↑</a>
          </footer>
        </div>
      </div>
    </MotionConfig>
  );
}
