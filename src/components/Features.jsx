import FeatureList from './FeatureList.jsx';
import bots from '../assets/bots.svg';
import boost from '../assets/boost.svg';
import led from '../assets/led.svg';
import Robot3D from './Robot3D.jsx';

export default function Features({ t }) {
  return (
    <section className="features" id="features">
      <div className="features__img">
        <Robot3D tilt={{ x: 0.2, y: 0.35, z: 0.14 }} />
      </div>
      <div className="features__text">
        <h2>{t.title}</h2>
        <FeatureList items={t.items} icons={[bots, boost, led]} />
      </div>
    </section>
  );
}
