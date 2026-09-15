import { useEffect, useState } from 'react';

const navItems = [
  { id: 'projects', label: 'Work' },
  { id: 'experience', label: 'Experience' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
];

export default function Navbar() {
  const [active, setActive] = useState(null);

  useEffect(() => {
    let raf = null;
    const update = () => {
      raf = null;
      const marker = Math.min(window.innerHeight * 0.35, 250);
      const current = navItems.filter(({ id }) => {
        const section = document.getElementById(id);
        return section && section.getBoundingClientRect().top <= marker;
      }).at(-1);
      const atBottom = Math.ceil(window.scrollY + window.innerHeight) >= document.documentElement.scrollHeight - 2;
      setActive(atBottom ? 'contact' : current?.id ?? null);
    };
    const schedule = () => {
      if (raf === null) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <header className="fixed top-0 inset-x-0 z-40 navbar-glass">
      <div className="content-shell flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-6 py-2">
        <a href="#home" className="brand-link text-white font-medium">Magda Pelka <span className="text-[var(--green-glow)]" aria-hidden="true">↗</span></a>
        <nav aria-label="Main navigation" className="flex flex-wrap gap-x-4 sm:gap-x-6">
          {navItems.map((item) => (
            <a key={item.id} href={`#${item.id}`} aria-current={active === item.id ? 'location' : undefined} className="nav-link">
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
