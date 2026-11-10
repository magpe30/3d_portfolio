# Magda Pelka — Creative Engineer

An editorial portfolio built with React, Vite, Framer Motion, Lenis, and Three.js.

## Local preview

```bash
npm ci
npm run dev
```

Open the local URL printed by Vite (usually http://localhost:5173).
Nothing deploys automatically, and no hosting account is required.

```bash
npm run lint
npm run build
npm run test
```

## Content

- The hero features glass `<` and `/>` symbols that drop and shatter as you scroll,
  then reassemble when you scroll back.
- Selected work presents RIDE SD and Fluent with real product screenshots and
  visible design decisions.
- `/work/ride-sd` and `/work/fluent` contain dedicated case studies, current scope,
  and implementation details. They use normal links and browser history.
- The About section presents Engineering, Design, and AI as wide numbered panels.
  Copy sits on the left and interactive ASCII artwork on the right. The panels
  share a pinned frame, appearing one at a time on scroll before the page continues.
  Reduced motion and viewports too short for a full card use a normal flowing layout.
- Professional experience and contact explain the work and roles sought.

Both case studies link to their GitHub repositories. Fluent is labeled as a prototype and its
feedback screenshot as a scripted demo. A public résumé file and live product URLs
were not supplied; the site links to the existing LinkedIn profile and email.

## Motion and rendering

Three.js is dynamically imported only when motion is enabled. The glass code symbols
use beveled geometry, studio reflections, and a fixed set of triangular fragments
in one canvas confined to the introduction. Falling, scattering, and settling
follow scroll position, so the sequence reverses consistently. Rendering pauses
offscreen and in hidden tabs.
Pixel density is capped at 1.5, and SVG versions remain available during loading,
when WebGL is unavailable, after context loss, and for reduced motion.

The operating system's reduced-motion preference applies across the page and
updates live, including the hero objects and ASCII illustrations. Native touch scrolling is preserved.

Work chapters interpolate their background colors on scroll. About, Experience,
and Contact continue the palette transitions through the bottom of the page.
These transitions follow scroll in both directions and use static destination
colors for reduced motion. Headlines and project
previews reveal as they enter the viewport. Case-study content is readable with
motion disabled; keyboard navigation moves focus to section destinations.

The RIDE SD video loads on demand for reduced-motion visitors, preserves its
screenshot if playback fails, and can always be paused. The supplied recording's
bottom development-toolbar edge is cropped in the preview presentation.

## Source layout

- `src/constants/portfolio.js`: shared project content and media.
- `src/constants/contact.js`: email and social links.
- `src/components/Projects.jsx`: selected-work layout and chapter transitions.
- `src/components/CaseStudy.jsx`: case-study narratives.
- `src/components/editorial/DisciplineStack.jsx`: pinned skills sequence and responsive fallback.
- `src/components/editorial/AsciiSculpture.jsx`: keyboard, camera, and processor glyph rendering.
- `src/components/editorial/HeroObjects.jsx`: progressive WebGL loading and SVG fallback.
- `src/components/editorial/heroObjectScene.js`: Three.js rendering and resource lifecycle.
- `src/components/editorial/heroObjectMeshes.js`: object geometry and surface materials.
- `src/index.css`: shared design tokens, typography, layouts, and breakpoints.
- `tests/portfolio.spec.js`: responsive, navigation, motion, media, and fallback checks.

Vite provides the local deep-link fallback. Future static hosting must rewrite
`/work/*` to `index.html` (while serving asset requests normally).
