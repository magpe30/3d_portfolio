import { contactLinks } from '../constants/index';
const Contact = () => {
  return (
    <section id="contact" className="scroll-mt-24 mt-6">
  <div className="section-line pt-6 pb-6">
    <p className="label-upper text-slate-500 mb-2">CONTACT</p>

    <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-4">
      <p className="text-sm text-slate-700 max-w-md">
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
              px-3 py-2 rounded-full border border-[var(--blue-main)]
              flex items-center gap-2 transition-all duration-200
              hover:-translate-y-[2px]
              hover:shadow-[0_4px_12px_rgba(20,89,255,0.25)]

              ${item.name.toLowerCase() === "email"
                ? "bg-[var(--blue-main)] text-[var(--bg-main)] hover:bg-[var(--blue-main)]/90"
                : "text-[var(--blue-main)] hover:bg-[var(--blue-main)] hover:text-[var(--bg-main)]"
              }
            `}
          >
            {item.name.toUpperCase()}
          </a>
        ))}
      </div>
    </div>
  </div>
</section>
  );
};

export default Contact;
