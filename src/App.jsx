import { BrowserRouter } from 'react-router-dom';
import About from './components/About';
import Contact from './components/Contact';
import Experience from './components/Experience';
import Hero from './components/Hero';
import Navbar from './components/Navbar';
import Playground from './components/Playground';

const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen text-slate-900">
        <Navbar />
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 space-y-20">
          <Hero />
          <About />
          <Experience />
          <Playground />
          <Contact />
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;
