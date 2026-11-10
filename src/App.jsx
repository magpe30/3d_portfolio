import { useEffect } from 'react';
import { MotionConfig, motion, useScroll, useSpring } from 'framer-motion';
import { useMotionPreference } from './utils/useMotionPreference';
import { useSmoothScroll } from './utils/useSmoothScroll';
import { useInitialAnchor } from './utils/useInitialAnchor';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Projects from './components/Projects';
import About from './components/About';
import Experience from './components/Experience';
import Contact from './components/Contact';
import CaseStudy from './components/CaseStudy';

export default function App() {
  const reducedMotion = useMotionPreference();
  const animate = !reducedMotion;
  const slug = window.location.pathname.replace(/\/$/, '').split('/work/')[1];
  const isCase = ['ride-sd', 'fluent'].includes(slug);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  useSmoothScroll(animate);
  useInitialAnchor();
  useEffect(() => {
    document.title = isCase
      ? `${slug === 'ride-sd' ? 'RIDE SD' : 'Fluent'} — Magda Pelka`
      : 'Magda Pelka — Creative Engineer';
  }, [slug, isCase]);
  return (
    <MotionConfig reducedMotion={animate ? 'never' : 'always'}>
      <div className="portfolio" data-motion={animate ? 'on' : 'off'}>
        <a className="skip-link" href={isCase ? '#case-main' : '#projects'}>
          {isCase ? 'Skip to case study' : 'Skip to selected work'}
        </a>
        <motion.div
          className="reading-progress"
          aria-hidden="true"
          style={{ scaleX: animate ? progress : scrollYProgress }}
        />
        <Navbar isCase={isCase} />
        {isCase ? (
          <CaseStudy slug={slug} animate={animate} />
        ) : (
          <main>
            <Hero animate={animate} />
            <Projects animate={animate} />
            <About animate={animate} />
            <Experience animate={animate} />
            <Contact animate={animate} />
          </main>
        )}
      </div>
    </MotionConfig>
  );
}
