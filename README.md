# Marusia

Site for the Marusia speaker: React + Vite, with a 3D model (three.js / react-three-fiber).

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
```

The site is published to GitHub Pages by `.github/workflows/deploy.yml` on every push to `main`.

## Responsive checks

The layout supports phone, tablet, and desktop widths. To check it with a local Vite server running:

```bash
python -m pip install playwright
python -m playwright install chromium
python tools/check_responsive.py
```

The browser check covers 11 viewport sizes (320–1920px), RU/EN, both themes,
section navigation, legal pages, overflow, and stability of the animated heading.
Screenshots and results are saved under `artifacts/responsive/` (not committed).
Use `PLAYWRIGHT_CHANNEL=msedge` to test with installed Edge instead of Chromium.
Pass a base URL as the first script argument to test another server.

See [MEMORY-BANK.md](MEMORY-BANK.md) for implementation decisions and validation notes.

## License

Marusia Non-Commercial License v1.0 — open source code, but commercial use is not allowed. See [LICENSE](LICENSE).
