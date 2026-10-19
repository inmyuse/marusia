import FeatureList from './FeatureList.jsx';
import members from '../assets/members.svg';
import crown from '../assets/crown.svg';
import laptop from '../assets/laptop.png';
import { REPO_URL } from '../config.js';

export default function Security({ t }) {
  return (
    <section className="security" id="security">
      <div className="security__text">
        <h2>{t.title}</h2>
        <FeatureList items={t.items} icons={[members, crown]} />
        <a className="btn btn--blue" href={REPO_URL} target="_blank" rel="noopener noreferrer">{t.more}</a>
      </div>
      <div className="security__img">
        <img src={laptop} alt="" loading="lazy" />
      </div>
    </section>
  );
}
