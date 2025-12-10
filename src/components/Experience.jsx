const projects = [
  {
    title: 'BLACKCLOAK · CYBERSECURITY',
    role: 'MOBILE · BACKEND',
    time: 'Guided experience',
  },
  {
    title: 'ROADRA · CAR MARKETPLACE',
    role: 'PRODUCT UI · FRONTEND & BACKEND',
    time: 'Marketplace / Auctions / Internal tooling',
  },
  {
    title: 'MOTORWAY · CAR MARKETPLACE',
    role: 'PRODUCT UI · FRONTEND',
    time: 'Car profiling',
  },
];

const Experience = () => {
  return (
    <section id="projects" className="scroll-mt-24">
      <div
        className="
          bg-[var(--blue-main)]
          text-[#FFF7E8]
          rounded-t-3xl
          px-6 sm:px-10 md:px-16
          py-14
          shadow-[0_-8px_40px_rgba(0,0,0,0.15)]
        "
      >
        {/* HEADER */}
        <h2
          className="
          heading-display text-3xl sm:text-4xl
          text-[#FFF7E8]
          leading-none
          mb-12
        "
        >
          EXPERIENCE:
        </h2>

        {/* TABLE-like area */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 text-sm">

          {/* LEFT EMPTY OR DESCRIPTION COLUMN */}
          <div className="col-span-1">
            <p className="text-[#e9e2d2] leading-relaxed opacity-80 text-[0.9rem]">
              A quick overview of product I've built across different teams and
              projects.
            </p>
          </div>

          {/* RIGHT SIDE TABLE */}
          <div className="col-span-1 sm:col-span-2 flex flex-col divide-y divide-[#FFF7E8]/40">

            {projects.map((p, idx) => (
              <div
                key={p.title}
                className="
                  grid grid-cols-[1.4fr_1fr_0.6fr]
                  py-3
                  items-center
                "
              >
                {/* PROJECT TITLE */}
                <div className="font-medium">
                  {p.title}
                </div>

                {/* ROLE */}
                <div className="opacity-90 text-[0.82rem] tracking-wide">
                  {p.role}
                </div>

                {/* TIME / CATEGORY */}
                <div className="text-right opacity-90 text-[0.82rem]">
                  {p.time}
                </div>
              </div>
            ))}

          </div>
        </div>

        {/* FOOTER STRIP */}
        <div className="mt-12 flex justify-between text-[0.7rem] tracking-wider opacity-70">
          <span></span>
          <span>© {new Date().getFullYear()}</span>
          <span></span>
        </div>
      </div>
    </section>
  );
};

export default Experience;