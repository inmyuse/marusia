import chevron from '../assets/chevron.svg';

export default function FeatureList({ items, icons }) {
  return (
    <ul className="flist">
      {items.map((it, i) => (
        <li key={it.title} className="flist__row">
          <span className="flist__icon"><img src={icons[i]} alt="" /></span>
          <span className="flist__body">
            <strong>{it.title}</strong>
            <span>{it.text}</span>
          </span>
          <img className="flist__chev" src={chevron} alt="" />
        </li>
      ))}
    </ul>
  );
}
