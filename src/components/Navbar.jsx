import { useActiveSection } from '../utils/useActiveSection';

export default function Navbar() {
  const activeSection = useActiveSection();
  return (
    <>
      <aside className="identity-rail" aria-label="Identity">
        <a href="#home" className="monogram" aria-label="Magda Pelka, back to home">
          m<span>p</span>
          <i>✳</i>
        </a>
        <span className="rail-caption">Magda Pelka — Portfolio</span>
        <a href="#contact" className="rail-bottom" aria-label="Go to contact">
          ↗
        </a>
      </aside>
      <header className="site-header">
        <a className="header-name" href="#home">
          Magda Pelka<span>Design & engineering</span>
        </a>
        <nav aria-label="Main navigation">
          {[
            ['projects', 'Work'],
            ['about', 'About'],
            ['experience', 'Experience'],
          ].map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              aria-current={activeSection === id ? 'location' : undefined}
            >
              {label}
              <span className="nav-star" aria-hidden="true">
                ✳
              </span>
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <a className="contact-link" href="#contact" aria-label="Let’s talk">
            Let’s talk <span aria-hidden="true">↗</span>
          </a>
        </div>
      </header>
    </>
  );
}
