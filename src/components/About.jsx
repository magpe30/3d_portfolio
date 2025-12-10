// src/components/About.jsx
const About = () => {
  return (
    <section id="about" className="scroll-mt-24 space-y-6">
      <div className="section-line pt-6">
        <p className="label-upper text-slate-500 mb-2">ABOUT</p>
        <div className="grid gap-8 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] items-start">
          <p className="text-sm text-slate-700 leading-relaxed">
          I’m a frontend developer with a film and photography background. 
          I focus on clear, intentional interfaces.While frontend is my specialty, 
          I also build backend logic and APIs to support the product end-to-end
          </p>
          <div className="text-xs text-slate-700 space-y-2">
            <div>
              <p className="font-medium text-[var(--blue-main)]">
                I&apos;M GOOD AT
              </p>
              <p>React / Vue, TypeScript, design systems, UX flows.</p>
            </div>
            <div>
              <p className="font-medium text-[var(--blue-main)]">I ENJOY</p>
              <p>Creative tools, camera / visual experiments, Unreal Engine.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

