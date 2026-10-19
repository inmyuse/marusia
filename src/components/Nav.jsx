import { forwardRef, useEffect, useLayoutEffect, useRef, useState } from 'react';
import keyboard from '../assets/keyboard.svg';
import union from '../assets/union.svg';
import vector from '../assets/vector.svg';

const Item = forwardRef(function Item({ item, ...props }, ref) {
  return (
    <a ref={ref} href={`#${item.id}`} className="nav__item" {...props}>
      <span className="nav__icon" style={{ '--icon': `url(${item.icon})` }} aria-hidden="true" />
      <span>{item.label}</span>
    </a>
  );
});

export default function Nav({ t }) {
  const [active, setActive] = useState('top');
  const [box, setBox] = useState(null); // null until measured, so nothing is drawn in a wrong spot
  const [animate, setAnimate] = useState(false); // slide only after the first placement
  const trackRef = useRef(null);
  const itemRefs = useRef({});

  const items = [
    { id: 'top', label: t.home, icon: vector },
    { id: 'security', label: t.code, icon: union },
    { id: 'features', label: t.features, icon: keyboard },
  ];

  useEffect(() => {
    const update = () => {
      const mark = window.innerHeight * 0.4;
      let current = 'top';
      let best = -Infinity;
      for (const { id } of items) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top <= mark && top > best) {
          best = top;
          current = id;
        }
      }
      setActive(current);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  useLayoutEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      const el = itemRefs.current[active];
      if (!track || !el) return;
      const left = el.offsetLeft;
      const next = { left, width: el.offsetWidth, right: track.offsetWidth - left - el.offsetWidth };
      setBox((prev) => (prev && prev.left === next.left && prev.width === next.width && prev.right === next.right ? prev : next));
    };
    measure();
    window.addEventListener('resize', measure);
    // fonts / layout can settle after mount: re-measure so the highlight never ends up misplaced
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    document.fonts?.ready.then(measure);
    return () => {
      window.removeEventListener('resize', measure);
      ro.disconnect();
    };
  }, [active, t]);

  useEffect(() => {
    if (!box || animate) return undefined;
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setAnimate(true)));
    return () => cancelAnimationFrame(id);
  }, [box, animate]);

  const go = (e, id) => {
    e.preventDefault();
    setActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className={`nav${animate ? ' nav--animate' : ''}`} aria-label="Main">
      <div className="nav__track" ref={trackRef}>
        <span
          className="nav__pill"
          style={box ? { transform: `translateX(${box.left}px)`, width: box.width } : { opacity: 0 }}
        />
        <div className="nav__row">
          {items.map((i) => (
            <Item
              key={i.id}
              item={i}
              ref={(el) => { itemRefs.current[i.id] = el; }}
              onClick={(e) => go(e, i.id)}
              aria-current={active === i.id ? 'page' : undefined}
            />
          ))}
        </div>
        <div
          className="nav__row nav__row--blue"
          aria-hidden="true"
          style={box ? { clipPath: `inset(0 ${box.right}px 0 ${box.left}px round 33px)` } : { visibility: 'hidden' }}
        >
          {items.map((i) => (
            <Item key={i.id} item={i} tabIndex={-1} />
          ))}
        </div>
      </div>
    </nav>
  );
}
