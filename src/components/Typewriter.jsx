import { useEffect, useState } from 'react';

const rand = (a, b) => a + Math.random() * (b - a);
const RU = 'абвгдежзиклмнопрстуфхцчшэюя';
const EN = 'abcdefghiklmnoprstuvwy';

const pickLetter = (phrase) => {
  const set = /[a-z]/i.test(phrase) ? EN : RU;
  return set[Math.floor(Math.random() * set.length)];
};

/**
 * Console-style title ending: shows the first phrase, then keeps erasing it and typing a random
 * different one. Speed varies per phrase, and now and then a wrong letter is typed and corrected.
 */
export default function Typewriter({ phrases }) {
  const [text, setText] = useState(phrases[0]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setText(phrases[0]);
      return undefined;
    }
    let current = 0;
    let shown = phrases[0];
    setText(phrases[0]);
    let timer;
    const later = (fn, ms) => {
      timer = setTimeout(fn, ms);
    };
    const show = (v) => {
      shown = v;
      setText(v);
    };

    const pickNext = () => {
      let next = current;
      while (next === current && phrases.length > 1) next = Math.floor(Math.random() * phrases.length);
      current = next;
      return phrases[next];
    };

    const erase = (then) => {
      // sometimes erase the whole thing fast, sometimes letter by letter
      const speed = rand(18, 55);
      const tick = () => {
        if (shown.length === 0) {
          later(then, rand(250, 700));
          return;
        }
        show(shown.slice(0, -1));
        later(tick, speed);
      };
      tick();
    };

    const type = (phrase, done) => {
      const speed = rand(45, 150);
      let i = 0;
      const tick = () => {
        if (i >= phrase.length) {
          done();
          return;
        }
        // occasional typo: wrong letter, short pause, backspace, carry on
        if (i > 2 && i < phrase.length - 1 && Math.random() < 0.06) {
          show(phrase.slice(0, i) + pickLetter(phrase));
          later(() => {
            later(() => {
              show(phrase.slice(0, i));
              later(tick, rand(120, 260));
            }, rand(180, 360));
          }, speed);
          return;
        }
        i += 1;
        show(phrase.slice(0, i));
        // longer pause after spaces, like thinking
        later(tick, phrase[i - 1] === ' ' ? speed + rand(80, 260) : speed * rand(0.7, 1.3));
      };
      tick();
    };

    const cycle = () => {
      erase(() => type(pickNext(), () => later(cycle, rand(1500, 3200))));
    };
    later(cycle, 2500);
    return () => clearTimeout(timer);
  }, [phrases]);

  return (
    <span className="typewriter">
      {phrases.map((phrase) => (
        <span key={phrase} className="typewriter__reserve" aria-hidden="true">
          {phrase}<span className="typewriter__caret" />
        </span>
      ))}
      <span className="typewriter__live">
        <span>{text}</span>
        <span className="typewriter__caret" aria-hidden="true" />
      </span>
    </span>
  );
}
