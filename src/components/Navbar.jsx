import ArrowIcon from './ArrowIcon';
import PropTypes from 'prop-types';
import { useActiveSection } from '../utils/useActiveSection';

export default function Navbar({ isCase = false }) {
  const activeSection = useActiveSection();
  const prefix = isCase ? '/' : '';
  return (
    <header className="site-header">
      <div className="nav-pill">
        <a className="header-name" href={`${prefix}#home`} aria-label="Magda Pelka, home">
          <span aria-hidden="true">mp.</span>
        </a>
        <nav aria-label="Main navigation">
          {[
            ['projects', 'Work'],
            ['about', 'About'],
            ['experience', 'Experience'],
          ].map(([id, label]) => (
            <a
              key={id}
              href={`${prefix}#${id}`}
              aria-current={!isCase && activeSection === id ? 'location' : undefined}
            >
              {label}
            </a>
          ))}
        </nav>
      </div>
      <div className="header-actions">
        <a className="contact-link" href={`${prefix}#contact`}>
          Let’s make something move{' '}
          <span aria-hidden="true">
            <ArrowIcon />
          </span>
        </a>
      </div>
    </header>
  );
}
Navbar.propTypes = { isCase: PropTypes.bool };
