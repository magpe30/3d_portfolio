const experience = [
  {
    company: 'BlackCloak',
    role: 'Software Engineer',
    dates: '2025 — Present',
    description: 'Leading a shared Tamagui and TypeScript component library across mobile, web, and internal tools.',
    stack: 'React Native · TypeScript · Tamagui',
  },
  {
    company: 'Roadra',
    role: 'Software Developer',
    dates: '2023 — 2025',
    description: 'Built marketplace interfaces and AI workflows that reduced dealer profiling time by 60%.',
    stack: 'Vue.js · TypeScript · Node.js',
  },
  {
    company: 'Motorway',
    role: 'Junior Frontend Engineer',
    dates: '2021 — 2023',
    description: 'Built reusable React components and improved Storybook performance and customer-facing UX.',
    stack: 'React · TypeScript · Storybook',
  },
];

export default function Experience() {
  return (
    <section id="experience" tabIndex={-1} aria-labelledby="experience-heading">
      <div className="section-line pt-6 mb-8">
        <h2 id="experience-heading" className="heading-display text-3xl sm:text-4xl">Professional experience</h2>
      </div>
      <div className="divide-y divide-white/[0.15]">
        {experience.map((job) => (
          <article key={job.company} className="grid gap-4 md:grid-cols-[1fr_1.8fr] py-7 first:pt-0">
            <div>
              <h3 className="text-xl font-medium">{job.company}</h3>
              <p className="text-sm text-white/70 mt-2">{job.dates}</p>
            </div>
            <div>
              <p className="text-[var(--green-soft)] font-medium mb-2">{job.role}</p>
              <p className="text-base leading-relaxed text-white/[0.85] max-w-xl">{job.description}</p>
              <p className="text-sm text-white/[0.65] mt-3">{job.stack}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
