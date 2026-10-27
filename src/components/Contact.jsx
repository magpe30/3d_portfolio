import PropTypes from 'prop-types';
import { contactLinks } from '../constants';
import HeadingReveal from './editorial/HeadingReveal';

export default function Contact({ animate }) {
  return (
    <section
      id="contact"
      tabIndex={-1}
      className="contact-section section-pad"
      aria-labelledby="contact-title"
    >
      <div className="section-label micro">
        <span>03 / Your next idea</span>
        <span>
          <span className="status-dot" /> Open to the right opportunity
        </span>
      </div>
      <HeadingReveal animate={animate} id="contact-title">
        Let’s make
        <br />
        <a className="heading-link" href="mailto:mpelka892@gmail.com">
          <em>something move.</em>
          <span className="heading-link-arrow" aria-hidden="true">
            ↗
          </span>
        </a>
      </HeadingReveal>
      <div className="contact-bottom">
        <p>
          Have a project, a role, or a good conversation?
          <br />
          I’d love to hear what you have in mind.
        </p>
        <a className="email-link" href="mailto:mpelka892@gmail.com">
          mpelka892@gmail.com <span aria-hidden="true">↗</span>
        </a>
      </div>
      <footer>
        <span className="micro">© {new Date().getFullYear()} Magda Pelka</span>
        <div className="social-links">
          {contactLinks
            .filter((link) => link.name !== 'Email')
            .map((link) => (
              <a key={link.name} href={link.link} target="_blank" rel="noreferrer">
                {link.name} ↗
              </a>
            ))}
        </div>
        <a href="#home" className="back-top micro">
          Back to top ↑
        </a>
      </footer>
    </section>
  );
}
Contact.propTypes = { animate: PropTypes.bool.isRequired };
