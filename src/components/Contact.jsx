import { motion } from 'framer-motion';
import { contactLinks } from '../constants/index';
import { fadeIn } from '../utils/motion';

const Contact = () => {
  return (
    <motion.section
      id="contact"
      className="scroll-mt-24 mt-6"
      variants={fadeIn('up', 'tween', 0, 0.6)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
    >
  <div className="glass-panel p-6 sm:p-8">
    <p className="label-upper text-white/50 mb-2">CONTACT</p>

    <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-4">
      <p className="text-sm text-white/80 max-w-md">
        Open to roles and collaborations where design and engineering
        sit close together.
      </p>

      <div className="flex flex-wrap gap-3 text-[11px] label-upper">
        {contactLinks.map((item) => (
          <a
            key={item.name}
            href={item.link}
            target="_blank"
            rel="noreferrer"
            className={`
              group
              px-3 py-2 rounded-full border border-[var(--green-glow)]
              flex items-center gap-2 transition-all duration-200
              hover:-translate-y-[2px]
              hover:shadow-[0_4px_12px_rgba(52,211,153,0.25)]

              ${item.name.toLowerCase() === "email"
                ? "pill-accent"
                : "text-[var(--green-glow)] hover:bg-[var(--green-glow)] hover:text-[var(--on-accent)]"
              }
            `}
          >
            {item.name.toUpperCase()}
          </a>
        ))}
      </div>
    </div>
  </div>
</motion.section>
  );
};

export default Contact;
