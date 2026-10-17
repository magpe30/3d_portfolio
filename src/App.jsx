import { useEffect, useRef, useState } from 'react';
import { MotionConfig, motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useMotionPreference } from './utils/useMotionPreference';
import { useSmoothScroll } from './utils/useSmoothScroll';
import { contactLinks } from './constants';
import { portfolio } from './constants/portfolio';
import AsciiSculpture from './components/editorial/AsciiSculpture';
import Reveal from './components/editorial/Reveal';
import HeadingReveal from './components/editorial/HeadingReveal';
import ProjectMedia from './components/ProjectMedia';

const jobs = [
  { company: 'BlackCloak', url: 'https://blackcloak.io/', role: 'Software Engineer', dates: '2025 — Present', description: 'Leading a shared Tamagui and TypeScript component library across mobile, web, and internal tools.', stack: 'React Native / TypeScript / Tamagui / Cursor / Claude' },
  { company: 'Roadra', url: 'https://roadra.com/', role: 'Software Developer', dates: '2023 — 2025', description: 'Built marketplace interfaces and AI workflows that reduced dealer profiling time by 60%.', stack: 'Vue.js / TypeScript / Node.js / OpenAI' },
  { company: 'Motorway', url: 'https://motorway.com/', role: 'Junior Frontend Engineer', dates: '2021 — 2023', description: 'Built reusable React components and improved Storybook performance and customer-facing UX.', stack: 'React / TypeScript / Storybook' },
];


export default function App() {
  const reducedMotion = useMotionPreference();
  const [paused, setPaused] = useState(false);
  const animate = !reducedMotion && !paused;
  useSmoothScroll(animate);
  const [activeSection, setActiveSection] = useState('home');
  const [study, setStudy] = useState(0);
  const [time, setTime] = useState('');
  const heroRef = useRef(null);
  const workRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useSpring(useTransform(heroProgress, [0, 1], [0, 160]), { stiffness: 80, damping: 25 });
  const sculptureY = useSpring(useTransform(heroProgress, [0, 1], [0, -100]), { stiffness: 80, damping: 25 });
  const { scrollYProgress: workProgress } = useScroll({ target: workRef, offset: ['start end', 'center center'] });
  const workRotate = useSpring(useTransform(workProgress, [0, 1], [7, 0]), { stiffness: 90, damping: 28 });
  const workScale = useSpring(useTransform(workProgress, [0, 1], [.88, 1]), { stiffness: 90, damping: 28 });

  useEffect(() => {
    const updateTime = () => setTime(new Intl.DateTimeFormat('en-US', { timeZone: 'America/Los_Angeles', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date()));
    updateTime();
    const timer = setInterval(updateTime, 60000);
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) if (entry.isIntersecting) setActiveSection(entry.target.id);
    }, { rootMargin: '-15% 0px -60% 0px' });
    document.querySelectorAll('main > section[id]').forEach((section) => observer.observe(section));
    return () => { clearInterval(timer); observer.disconnect(); };
  }, []);

  return (
    <MotionConfig reducedMotion={animate ? 'never' : 'always'}>
      <div className="portfolio" data-motion={animate ? 'on' : 'off'}>
        <a className="skip-link" href="#projects">Skip to selected work</a>
        <motion.div className="reading-progress" style={{ scaleX: animate ? progress : scrollYProgress }} />
        <aside className="identity-rail" aria-label="Identity">
          <a href="#home" className="monogram" aria-label="Magda Pelka, back to home">m<span>p</span><i>✳</i></a>
          <span className="rail-caption">Magda Pelka — Portfolio</span>
          <a href="#contact" className="rail-bottom" aria-label="Go to contact">↗</a>
        </aside>
        <header className="site-header">
          <a className="header-name" href="#home">Magda Pelka<span>Design & engineering</span></a>
          <nav aria-label="Main navigation">
            {[['projects', 'Work'], ['about', 'About']].map(([id, label]) => (
              <a key={id} href={`#${id}`} aria-current={activeSection === id ? 'location' : undefined}>{label}<span className="nav-dot" /></a>
            ))}
          </nav>
          <a className="contact-link" href="#contact" aria-label="Let’s talk">Let’s talk <span aria-hidden="true">↗</span></a>
        </header>

        <main>
          <section id="home" tabIndex={-1} ref={heroRef} className="hero" aria-labelledby="hero-title">
            <div className="hero-topline micro"><span>Creative developer & design engineer</span><span>San Diego, CA <span className="clock">{time}</span></span></div>
            <motion.div className="hero-copy" style={animate ? { y: heroY } : undefined}>
              <HeadingReveal as="h1" animate={animate} id="hero-title"><span className="hero-greeting" lang="pl"><em>Cześć,</em></span>I build thoughtful interfaces with a little <em className="heading-accent">personality.</em></HeadingReveal>
              <Reveal animate={animate} delay={.3} className="hero-note"><span className="intro-star" aria-hidden="true">✳</span><p>I bring an eye for film and a mind for engineering to the things you see, touch, and interact with.</p></Reveal>
            </motion.div>
            <motion.div className="hero-art" style={animate ? { y: sculptureY } : undefined}>
              <AsciiSculpture animate={animate} shape="desktop" />
            </motion.div>
            <div className="hero-bottom">
              <a className="scroll-link micro" href="#projects"><span className="scroll-arrow" aria-hidden="true">↓</span> Scroll to explore</a>
              <span className="micro edition">Selected works / 2026</span>
            </div>
          </section>

          <section id="projects" tabIndex={-1} className="work-section section-pad" aria-labelledby="work-title">
            <div className="section-heading"><p className="micro">01 / Selected work</p><HeadingReveal animate={animate} id="work-title">Made to <em>move.</em></HeadingReveal></div>
            <article className="featured-project" aria-labelledby="ride-title">
              <div className="project-stage" ref={workRef}>
                <div className="stage-top micro"><span>Independent project / Design + development</span><span>001</span></div>
                <div className="stage-wordmark" aria-hidden="true">RIDE<span>SD</span><span className="stage-arrow">↗</span></div>
                <svg className="route-lines" viewBox="0 0 1200 600" fill="none" aria-hidden="true"><path d="M-50 480C200 550 80 180 330 270S580 650 720 350 1060 60 1290 180" /><path d="M-50 505C200 575 80 205 330 295S580 675 720 375 1060 85 1290 205" /><path d="M-50 530C200 600 80 230 330 320S580 700 720 400 1060 110 1290 230" /></svg>
                <motion.div className="project-screen" style={animate ? { rotateX: workRotate, scale: workScale } : undefined}>
                  <div className="screen-toolbar"><span className="window-dots" aria-hidden="true">● ● ●</span><span>RIDE SD / Route explorer</span><span aria-hidden="true">↗</span></div>
                  <ProjectMedia image={portfolio.rideImage} video={portfolio.rideVideo} motionEnabled={animate} />
                </motion.div>
              </div>
              <Reveal animate={animate} className="project-info">
                <div><p className="micro muted">Maps / Data / Interaction</p><h3 id="ride-title" className="heading heading--title">RIDE SD<span className="project-number">(01)</span></h3></div>
                <div className="project-description"><p>GPS recordings become interactive routes and corner-by-corner ride comparisons.</p><a className="text-link" href="https://github.com/magpe30/ride-sd" target="_blank" rel="noreferrer">Explore the code <span aria-hidden="true">↗</span></a></div>
              </Reveal>
              <details className="case-study">
                <summary><span className="micro">A closer look</span><span>From a line on a map to the story of a ride.</span><span className="case-plus" aria-hidden="true">+</span></summary>
                <div className="case-content"><div><p className="micro">The challenge</p><h4 className="heading heading--subtitle">Context, beyond coordinates.</h4><p>A GPS trace shows where you rode. Understanding what happened at each corner takes more context. RIDE SD connects the map, speed profile, and corner detail in one interface.</p></div><div><p className="micro">The decisions</p><h4 className="heading heading--subtitle">Keep the road in focus.</h4><p>A muted map gives the route visual priority. Selecting a corner zooms to its location. Outbound and return passes are separated, so comparisons stay meaningful.</p></div><div><p className="micro">Under the hood</p><h4 className="heading heading--subtitle">Built from the ground up.</h4><p>Next.js, TypeScript, and MapLibre. GPS points match real road geometry before speed is smoothed and corners are compared. Files are processed in the browser.</p></div></div>
              </details>
            </article>
          </section>

          <section id="about" tabIndex={-1} className="about-section section-pad" aria-labelledby="about-title">
            <div className="section-label micro"><span>02 / Behind the work</span></div>
            <HeadingReveal animate={animate} id="about-title">An engineer’s mind.<br />A filmmaker’s <em className="heading-accent">eye.</em></HeadingReveal>
            <div className="about-grid">
              <Reveal animate={animate} className="about-copy" delay={.15}>
                <p>I’m a software engineer with a background in film and photography. That background shapes how I approach interfaces: I care about how they look, how they respond, and how naturally people can use them.</p>
                <p>I build web and mobile applications and shared component libraries, bringing design awareness to practical engineering. I enjoy making complex features easier to use and writing code that’s clear, reliable, and easy for others to build on.</p>
              </Reveal>
              <div className="about-sculpture">
                <AsciiSculpture animate={animate} morph disperse color="#e8e5d9" onShapeChange={setStudy} />
                <span className="sculpture-index" aria-hidden="true">0{study + 1}</span>
              </div>
            </div>
          </section>

          <section id="experience" tabIndex={-1} className="experience-section section-pad" aria-labelledby="experience-title">
            <div className="experience-header"><span className="micro">The experience so far / 2021—Now</span><HeadingReveal animate={animate} id="experience-title">Where I’ve <em>been.</em></HeadingReveal></div>
            <div className="experience-list">
              {jobs.map((job, index) => (
                <Reveal animate={animate} key={job.company}>
                  <a className="experience-row" href={job.url} target="_blank" rel="noreferrer" aria-label={`${job.company} — visit company website (opens in a new tab)`}>
                    <span className="micro job-index">0{index + 1}</span>
                    <div><h3 className="heading heading--title">{job.company}</h3><p className="job-dates micro">{job.dates}</p></div>
                    <div className="job-detail"><p className="job-role">{job.role}</p><p>{job.description}</p><p className="micro job-stack">{job.stack}</p></div>
                    <span className="job-mark" aria-hidden="true">↗</span>
                  </a>
                </Reveal>
              ))}
            </div>
          </section>

          <section id="contact" tabIndex={-1} className="contact-section section-pad" aria-labelledby="contact-title">
            <div className="section-label micro"><span>03 / Your next idea</span><span><span className="status-dot" /> Open to the right opportunity</span></div>
            <HeadingReveal animate={animate} id="contact-title">Let’s make<br /><a className="heading-link" href="mailto:mpelka892@gmail.com"><em>something move.</em><span className="heading-link-arrow" aria-hidden="true">↗</span></a></HeadingReveal>
            <div className="contact-bottom"><p>Have a project, a role, or a good conversation?<br />I’d love to hear what you have in mind.</p><a className="email-link" href="mailto:mpelka892@gmail.com">mpelka892@gmail.com <span aria-hidden="true">↗</span></a></div>
            <footer><span className="micro">© {new Date().getFullYear()} Magda Pelka</span><div className="social-links">{contactLinks.filter((link) => link.name !== 'Email').map((link) => <a key={link.name} href={link.link} target="_blank" rel="noreferrer">{link.name} ↗</a>)}</div><a href="#home" className="back-top micro">Back to top ↑</a></footer>
          </section>
        </main>
        <button type="button" className="motion-toggle micro" onClick={() => setPaused((value) => !value)} aria-pressed={paused} disabled={reducedMotion} aria-label={reducedMotion ? 'Motion reduced — system preference' : paused ? 'Motion off — enable animations' : 'Motion on — pause animations'}><span className={animate ? 'motion-bars running' : 'motion-bars'} aria-hidden="true"><i /><i /><i /><i /></span>{reducedMotion ? 'Motion reduced' : paused ? 'Motion off' : 'Motion on'}</button>
      </div>
    </MotionConfig>
  );
}
