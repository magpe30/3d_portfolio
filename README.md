# Magda Pelka — Portfolio

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

## Project media

`src/constants/portfolio.js` points to the screenshot and recording supplied by
Magda. The original screenshot lives in `public/images/ride-sd.png` and can be
opened at full size from the project card.

`public/videos/ride-sd-preview.mp4` is a silent, 25-second H.264 preview (1280 × 600),
trimmed from seconds 1–26 of the supplied recording. It uses a 1.4 Mbps encoding
target and a frame-rate cap of 24 fps, with fast-start MP4 metadata.

The preview loads when visible, loops automatically, and has a keyboard-accessible
play/pause button. It pauses offscreen and when the tab is hidden. Reduced motion
shows the still image without requesting the video until someone explicitly
chooses Play preview. A failed video leaves the screenshot available.

## Content boundaries

- No résumé download or CV link.
- No live demo link until a demo exists and is requested.
- Professional experience uses only the short CV summaries already supplied.
- No professional case studies, code, screenshots, or additional project details:
  that work is under NDA.
- The detailed project overview and media feature the independent RIDE SD project.
- Keep edits local; do not commit, push, or deploy without a new instruction.

Once a public domain is available, canonical and social-sharing URLs can be added
separately. No public domain is assumed by the local site.

## Manual verification

- Navigate at desktop, tablet, and 320px mobile widths.
- Use Tab and Enter to follow links and expand the project overview.
- Check the active section while scrolling and jumping to anchors.
- Toggle animation, then change the OS reduced-motion preference while the page is open.
- Confirm the content remains readable with WebGL unavailable.
- Verify video looping, keyboard pause, reduced-motion stills, and offscreen pause.

Dependency version modernization and a TypeScript migration are separate follow-up
work; the application currently retains its React 18 / Vite 4 foundation.
