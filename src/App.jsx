import { BrowserRouter } from 'react-router-dom';
import { About, Contact, Experience, Hero, Navbar, Works } from './components';

const App = () => {

  return (
    <BrowserRouter>
      <div className='relative bg-primary'>
        <div className='bg-hero-pattern bg-cover bg-no-repeat bg-center'>
          <Navbar />
          <Hero />
        </div>
        <About />
        <div className='bg-work-pattern bg-no-repeat bg-center'>
          <Experience />
        </div>
        <Works />
        <div className="relative">
          <Contact />
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
