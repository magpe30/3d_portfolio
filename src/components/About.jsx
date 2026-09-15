export default function About() {
  return (
    <section id="about" tabIndex={-1} aria-labelledby="about-heading" className="section-line pt-6">
      <div className="grid gap-8 md:grid-cols-[1fr_1.8fr]">
        <h2 id="about-heading" className="heading-display text-3xl sm:text-4xl">Behind the interface</h2>
        <div className="space-y-5 text-base leading-relaxed text-white/[0.85] max-w-xl">
          <p>I’m a software engineer with a background in film and photography. I care about how an interface looks, moves, and works.</p>
          <p>My work spans product UI, shared components, and the backend logic behind them. I enjoy creative tools, camera work, and motion.</p>
        </div>
      </div>
    </section>
  );
}
