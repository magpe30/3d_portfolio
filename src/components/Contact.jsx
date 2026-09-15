import { contactLinks } from '../constants/index';

export default function Contact() {
  return (
    <section id="contact" tabIndex={-1} aria-labelledby="contact-heading" className="callout-panel rounded-3xl p-6 sm:p-10">
      <p className="label-upper text-[var(--green-soft)] mb-4">Let’s work together</p>
      <h2 id="contact-heading" className="heading-display text-3xl sm:text-4xl">Have something in mind?</h2>
      <p className="text-base text-white/[0.85] max-w-xl leading-relaxed mt-5">
        Open to design engineer and frontend UX engineer roles. Based in San Diego, available remotely.
      </p>
      <div className="flex flex-wrap gap-3 mt-7">
        {contactLinks.map((item) => (
          <a
            key={item.name}
            href={item.link}
            target={item.name === 'Email' ? undefined : '_blank'}
            rel={item.name === 'Email' ? undefined : 'noreferrer'}
            className={`button ${item.name === 'Email' ? 'button-primary' : 'button-secondary'}`}
          >
            {item.name}
          </a>
        ))}
      </div>
    </section>
  );
}
