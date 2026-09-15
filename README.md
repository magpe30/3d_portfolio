# Portfolio

A local portfolio for design engineer and frontend UX engineer applications.
Built with React, Vite, Tailwind CSS, Framer Motion, and React Three Fiber.

## Run locally

```bash
npm ci
npm run dev
```

Open http://localhost:5173. Nothing deploys automatically from these commands.

```bash
npm run lint
npm run build
npm run preview
```

## Page structure

- Introduction with work and contact links
- Selected work: RIDE SD, with an expandable project overview
- Professional experience: one sentence per role
- About and contact

The starfield loads after the page content and animates throughout the page.
Its render loop pauses only when the tab is hidden, with animation time preserved
on return. Scroll-driven camera motion eases toward its target. Reduced motion uses a CSS backdrop
and skips WebGL; the preference updates live. A manual pause control is also
available. Scene failures leave the page content available.
