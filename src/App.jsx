import { useEffect, useRef } from 'react';
import { BrowserRouter } from 'react-router-dom';
import About from './components/About';
import Contact from './components/Contact';
import Experience from './components/Experience';
import Hero from './components/Hero';
import Navbar from './components/Navbar';
import Projects from './components/Projects';
import GalaxyScene from './components/canvas/GalaxyScene';

const App = () => {
  const progressRef = useRef(0);

  useEffect(() => {
    let raf = null;

    const update = () => {
      raf = null;
      const scrollRange = document.documentElement.scrollHeight - window.innerHeight;
      progressRef.current =
        scrollRange > 0 ? Math.min(Math.max(window.scrollY / scrollRange, 0), 1) : 0;
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <BrowserRouter>
      <div className="relative min-h-screen">
        <div className="fixed inset-0 z-0 pointer-events-none">
          <GalaxyScene progressRef={progressRef} />
        </div>

        <div className="relative z-10">
          <Navbar />
          <Hero />
          <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-16 space-y-20">
            <About />
            <Experience />
            <Projects />
            <Contact />
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
