import { useEffect, useRef } from 'react';

/**
 * Grid of semi-transparent white dots; random dots light up to solid white
 * one after another and fade back. Meant for the blue gradient sections.
 */
export default function DotField({ className = '' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const BASE = 0.28;
    let cols = 0;
    let rows = 0;
    let cell = 0;
    let w = 0;
    let h = 0;
    let lit = [];
    let nextSpawn = 0;
    let raf = 0;
    let glow = new Float32Array(0);
    const mouse = { x: -1e4, y: -1e4 };
    // touch devices have no hover: the big spot wanders around the screen by itself
    const auto = window.matchMedia('(hover: none)').matches;
    const ph = [Math.random() * 6.28, Math.random() * 6.28, Math.random() * 6.28];
    const pointer = (now) => {
      if (!auto) return mouse;
      const t = now * 0.001;
      return {
        x: window.innerWidth * (0.5 + 0.36 * Math.sin(t * 0.37 + ph[0]) * Math.cos(t * 0.11 + ph[2])),
        y: window.innerHeight * (0.5 + 0.34 * Math.sin(t * 0.29 + ph[1])),
      };
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const target = Math.max(30, w * 0.0242);
      cols = Math.max(1, Math.round(w / target));
      cell = w / cols;
      rows = Math.ceil(h / cell);
      lit = [];
      glow = new Float32Array(cols * rows);
    };

    const onMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onLeave = () => {
      mouse.x = mouse.y = -1e4;
    };

    const draw = (now) => {
      ctx.clearRect(0, 0, w, h);
      const alphas = new Map();
      lit = lit.filter((d) => now - d.start < d.dur);
      for (const d of lit) {
        const p = (now - d.start) / d.dur;
        // quick fade in, hold, slow fade out
        const env = p < 0.2 ? p / 0.2 : p > 0.7 ? (1 - p) / 0.3 : 1;
        alphas.set(d.i, env);
      }
      const box = canvas.getBoundingClientRect();
      const pt = pointer(now);
      const mx = pt.x - box.left;
      const my = pt.y - box.top;
      const R = cell * 9;
      const rMax = cell * 0.33;
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const idx = y * cols + x;
          const d = Math.hypot(x * cell + cell / 2 - mx, y * cell + cell / 2 - my);
          const t = d < R ? 1 - d / R : 0;
          // spherical falloff: dots appear inside a round spot around the cursor
          const target = Math.sqrt(1 - (1 - t) * (1 - t)) * (t > 0 ? 1 : 0);
          glow[idx] = Math.max(target, glow[idx] * 0.94);
          const reveal = glow[idx];
          if (reveal < 0.01) continue;
          const flash = alphas.get(idx) || 0;
          const alpha = reveal * (BASE + (1 - BASE) * flash);
          ctx.fillStyle = `rgba(255,255,255,${alpha})`;
          ctx.beginPath();
          ctx.arc(x * cell + cell / 2, y * cell + cell / 2, rMax * (0.45 + 0.55 * reveal), 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const tick = (now) => {
      if (now >= nextSpawn && !document.hidden) {
        // pick a random dot inside the spot around the cursor and light it up
        const box = canvas.getBoundingClientRect();
        const pt = pointer(now);
        const mx = pt.x - box.left;
        const my = pt.y - box.top;
        if (mx > -cell * 9 && mx < w + cell * 9 && my > -cell * 9 && my < h + cell * 9) {
          const a = Math.random() * Math.PI * 2;
          const rad = Math.sqrt(Math.random()) * cell * 8;
          const gx = Math.floor((mx + Math.cos(a) * rad) / cell);
          const gy = Math.floor((my + Math.sin(a) * rad) / cell);
          if (gx >= 0 && gx < cols && gy >= 0 && gy < rows) {
            lit.push({ i: gy * cols + gx, start: now, dur: 1000 + Math.random() * 1600 });
          }
        }
        nextSpawn = now + 40 + Math.random() * 140;
      }
      draw(now);
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    if (reduce) draw(0);
    else raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className={`dots ${className}`} aria-hidden="true" />;
}
