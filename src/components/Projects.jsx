import { portfolio } from '../constants/portfolio';
import ProjectMedia from './ProjectMedia';

const decisions = [
  {
    title: 'Make the route the focal point',
    text: 'A muted base map gives the selected route visual priority. Color connects each ride to its comparison data.',
  },
  {
    title: 'Connect the overview to the detail',
    text: 'Selecting a corner zooms the map to that location, keeping the numbers connected to the road.',
  },
  {
    title: 'Compare the same direction',
    text: 'The GPX pipeline separates outbound and return passes, so opposite directions are not treated as one ride.',
  },
];

export default function Projects() {
  return (
    <section id="projects" tabIndex={-1} aria-labelledby="work-heading" className="space-y-8">
      <div className="section-line pt-6 flex flex-wrap items-end justify-between gap-3">
        <h2 id="work-heading" className="heading-display text-3xl sm:text-4xl">Selected work</h2>
        <p className="text-sm text-white/70">Independent design & development</p>
      </div>

      <article className="glass-panel overflow-hidden" aria-labelledby="ride-heading">
        <ProjectMedia image={portfolio.rideImage} video={portfolio.rideVideo} />
        <div className="p-6 sm:p-10 space-y-8">
          <div className="grid gap-6 md:grid-cols-[1.1fr_1fr] md:items-end">
            <div>
              <p className="label-upper text-[var(--green-soft)] mb-4">Maps · Data visualization · Interaction</p>
              <h3 id="ride-heading" className="heading-display text-4xl sm:text-5xl">RIDE SD</h3>
              <p className="mt-4 text-lg text-white/[0.85] max-w-md">Explore the road. Understand the ride.</p>
            </div>
            <div className="space-y-5">
              <p className="text-base text-white/80 leading-relaxed">
                A motorcycle route map that turns GPS recordings into corner-by-corner ride comparisons.
              </p>
              <div className="flex flex-wrap gap-3">
                <a className="button button-secondary" href="https://github.com/magpe30/ride-sd" target="_blank" rel="noreferrer">View code <span aria-hidden="true">↗</span></a>
              </div>
            </div>
          </div>

          <dl className="project-facts grid gap-5 sm:grid-cols-3 border-y border-white/[0.15] py-6">
            <div><dt>My role</dt><dd>Design & development</dd></div>
            <div><dt>Scope</dt><dd>Route discovery & ride analysis</dd></div>
            <div><dt>Built with</dt><dd>Next.js · TypeScript · MapLibre</dd></div>
          </dl>

          <details className="case-study">
            <summary>Inside the project <span className="case-study-plus" aria-hidden="true">+</span></summary>
            <div className="pt-7 space-y-8">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <h4 className="case-heading">The problem</h4>
                  <p className="case-copy">A GPS trace shows where you rode. Comparing what happened at each corner takes more context.</p>
                </div>
                <div>
                  <h4 className="case-heading">The experience</h4>
                  <p className="case-copy">Choose a route, add recordings, and compare up to three rides on the map and in the corner panel.</p>
                </div>
              </div>
              <div>
                <h4 className="case-heading">Design & engineering decisions</h4>
                <ol className="grid gap-6 md:grid-cols-3 mt-5">
                  {decisions.map((decision, index) => (
                    <li key={decision.title} className="border-t border-[#34d399]/30 pt-4">
                      <span className="text-sm text-[var(--green-soft)]">0{index + 1}</span>
                      <h5 className="font-medium mt-3 mb-2">{decision.title}</h5>
                      <p className="case-copy">{decision.text}</p>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="border-t border-white/[0.15] pt-6">
                <h4 className="case-heading">Under the hood</h4>
                <p className="case-copy max-w-3xl">GPS points are matched to real road geometry before speed is smoothed and corners are compared. Files are processed in the browser.</p>
              </div>
            </div>
          </details>
        </div>
      </article>
    </section>
  );
}
