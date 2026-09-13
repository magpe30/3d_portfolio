// src/components/Navbar.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';

const navItems = [
  { id: 'about', label: 'ABOUT' },
  { id: 'experience', label: 'EXPERIENCE' },
  { id: 'projects', label: 'PROJECTS' },
  { id: 'contact', label: 'CONTACT' },
];

const Navbar = () => {
  const [active, setActive] = useState('EXPERIENCE');

  return (
    <header className="fixed top-0 inset-x-0 z-40 navbar-glass">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          <Link
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-baseline gap-2"
          >
            <span className="text-xs label-upper text-white">MAGDA</span>
            <span className="text-[11px] text-white/50">SOFTWARE · DESIGN ENGINEER</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-[11px] label-upper">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id.toLowerCase()}`}
                onClick={() => setActive(item.label)}
                className={`relative pb-1 ${
                  active === item.label
                    ? 'text-[var(--green-glow)]'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {item.label}
                {active === item.label && (
                  <span className="absolute inset-x-0 -bottom-0.5 h-[2px] bg-[var(--green-glow)]" />
                )}
              </a>
            ))}
          </nav>

          <span className="md:hidden text-[10px] label-upper text-white/60">SCROLL</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
