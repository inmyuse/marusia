# Project memory

## Active context — 2026-10-19

Objective: make the existing Marusia site usable on phones and computers, preserving
the React/Vite stack, blue styling, 3D speakers, languages, and themes.

Changes: flexible two-column desktop grids and a single column below 901px;
bounded typography and spacing; contained laptop illustration; navigation that fits
320px screens; safe-area offsets; 44px footer controls; legal-page word wrapping.
The typewriter reserves space for every translated phrase so the download button
does not move during typing. Hidden measuring spans are excluded from accessibility.
Section navigation accounts for the fixed header and reduced-motion preference.

## Validation

- Production build passed with `VITE_BASE=/marusia/`.
- `tools/check_responsive.py` passed using Playwright with installed Edge:
  320x568, 375x667, 390x844, 430x932, 768x1024, 844x390, 900x900, 901x900,
  1024x768, 1440x900, 1920x1080. Both languages/themes, legal pages, navigation,
  horizontal overflow, JavaScript errors, and animated button position checked.
- Full-page screenshots visually reviewed at 320px, 901px, and 1440px.
- These are browser viewport checks; physical iOS/Android devices were not tested.
- Existing build warning: the Three.js application bundle exceeds 500kB.

## Runbook and decisions

- Install with `npm ci`, serve with `npm run dev`, build with `npm run build`.
- For Pages, set `VITE_BASE=/marusia/` before building; main pushes trigger deploy.
- See README for browser-check setup. Generated artifacts stay outside Git.
- Keep breakpoint checks at both 900px and 901px when changing layout.
- Avoid scaling text directly from viewport width without minimum/maximum bounds.
