import PropTypes from 'prop-types';
import { email, socialLinks } from '../constants/contact';
import HeadingReveal from './editorial/HeadingReveal';
import ColorSection from './editorial/ColorSection';

export default function Contact({ animate }) {
  return (
    <ColorSection
      animate={animate}
      from="#deded8"
      to="#e5ee8d"
      id="contact"
      tabIndex={-1}
      className="contact-section section-pad"
      aria-labelledby="contact-title"
    >
      <div className="section-label micro">
        <span>04 / Get in touch</span>
        <span>
          <span className="status-dot" /> Open to a new role
        </span>
      </div>
      <HeadingReveal animate={animate} id="contact-title">
        <a className="heading-link" href={`mailto:${email}`}>
          Let’s make
          <br />
          something move<span className="display-dot">.</span>
          <span className="heading-link-arrow" aria-hidden="true">
            ↗
          </span>
        </a>
      </HeadingReveal>
      <div className="contact-bottom">
        <p>
          I’m looking for a creative engineering or frontend role where I can work on both the
          interface and the code. If that sounds like your team, I’d love to hear from you.
        </p>
        <a className="email-link" href={`mailto:${email}`}>
          {email} <span aria-hidden="true">↗</span>
        </a>
      </div>
      <footer>
        <span className="micro">© {new Date().getFullYear()} Magda Pelka</span>
        <div className="social-links">
          {socialLinks.map((link) => (
            <a key={link.name} href={link.link} target="_blank" rel="noreferrer">
              {link.name} ↗
            </a>
          ))}
        </div>
        <a href="#home" className="back-top micro">
          Back to top ↑
        </a>
      </footer>
    </ColorSection>
  );
}
Contact.propTypes = { animate: PropTypes.bool.isRequired };
