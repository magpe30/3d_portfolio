// src/components/Hero.jsx
const Hero = () => {
  return (
    <section className="space-y-10">
      {/* Top poster strip */}
      <div className="text-center space-y-4">
        <p className="label-upper text-slate-500">
          PORTFOLIO / FRONTEND &amp; UI
        </p>
        <h1 className="heading-display text-4xl sm:text-5xl text-[var(--blue-main)] leading-none">
          HI THERE
        </h1>
        <h2 className="heading-display text-4xl sm:text-5xl text-[var(--blue-main)] leading-none">
          NICE TO MEET YOU
        </h2>
        <p className="text-[11px] mt-3 text-slate-600 max-w-md mx-auto">
          I'm Magda. I like to build interfaces, flows, and playful experiments.
        </p>
      </div>

      {/* Date / tags strip */}
      <div className="grid grid-cols-3 text-center text-xs label-upper text-slate-600 section-line pt-4 pb-3">
        <div>
          <p>STACK</p>
          <p className="mt-1 text-[var(--blue-main)]">
            REACT · VUE · TYPESCRIPT · NODE.JS 
          </p>
        </div>
        <div>
          <p>FOCUS</p>
          <p className="mt-1 text-[var(--blue-main)]">FULL STACK · MOTION</p>
        </div>
        <div>
          <p>LOCATION</p>
          <p className="mt-1 text-[var(--blue-main)]">REMOTE · SAN DIEGO</p>
        </div>
      </div>

      {/* Main statement */}
      <div className="text-center pt-4">
        <h3 className="heading-display text-3xl sm:text-4xl text-[var(--blue-main)]">
          IT&apos;S BEEN A LONG FEW RELEASES.
        </h3>
        <p className="mt-3 text-sm text-slate-700 max-w-2xl mx-auto">
        My work spans marketplace systems, internal tooling, AI API integrations, and mobile flows.
        I focus on shaping products where behavior, clarity, and design work together.
        This page is a snapshot.
        </p>
      </div>
    </section>
  );
};

export default Hero;
