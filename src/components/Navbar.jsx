// src/components/Navbar.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';

const navItems = [
  { id: 'about', label: 'ABOUT' },
  { id: 'projects', label: 'WORK' },
  { id: 'playground', label: 'PLAYGROUND' },
  { id: 'contact', label: 'CONTACT' },
];

const Navbar = () => {
  const [active, setActive] = useState('WORK');

  return (
    <header className="fixed top-0 inset-x-0 z-40 border-b border-[rgba(20,89,255,0.25)] bg-[var(--bg-main)]/95 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          <Link
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-baseline gap-2"
          >
            <span className="text-xs label-upper text-[var(--blue-main)]">
              MAGDA
            </span>
            <span className="text-[11px] text-slate-500">
              SOFTWARE · UI-LEANING
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-[11px] label-upper">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id.toLowerCase()}`}
                onClick={() => setActive(item.label)}
                className={`relative pb-1 ${
                  active === item.label
                    ? 'text-[var(--blue-main)]'
                    : 'text-slate-500 hover:text-[var(--blue-main)]'
                }`}
              >
                {item.label}
                {active === item.label && (
                  <span className="absolute inset-x-0 -bottom-0.5 h-[2px] bg-[var(--blue-main)]" />
                )}
              </a>
            ))}
          </nav>

          <span className="md:hidden text-[10px] label-upper text-slate-500">
            SCROLL
          </span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

