import DotField from './DotField.jsx';
import Typewriter from './Typewriter.jsx';
import Robot3D from './Robot3D.jsx';
import { REPO_URL } from '../config.js';

export default function Hero({ t }) {
  return (
    <section className="hero" id="top">
      <DotField className="dots--hero" />
      <div className="hero__text">
        <h1>
          {t.title} <Typewriter phrases={t.phrases} />
        </h1>
        <a className="btn btn--dark" href={REPO_URL} target="_blank" rel="noopener noreferrer">{t.download}</a>
      </div>
      <div className="hero__img">
        <Robot3D />
      </div>
    </section>
  );
}
