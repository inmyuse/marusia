import { legal } from '../legal.js';

export default function LegalPage({ kind, lang, navigate }) {
  const L = legal[lang];
  const page = L[kind];

  return (
    <main className="legal">
      <a
        className="legal__back"
        href={import.meta.env.BASE_URL}
        onClick={(e) => {
          e.preventDefault();
          navigate('/');
        }}
      >
        <svg className="legal__back-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M19 12H5" />
          <path d="M11 6l-6 6 6 6" />
        </svg>
        <span>{L.back}</span>
      </a>
      <h1>{page.title}</h1>
      <p className="legal__lead">{page.lead}</p>
      <p className="legal__date">{L.updated}</p>
      {page.sections.map((s) => (
        <section key={s.h} className="legal__section">
          <h2>{s.h}</h2>
          {s.p?.map((t) => <p key={t}>{t}</p>)}
          {s.ul && (
            <ul>
              {s.ul.map((t) => <li key={t}>{t}</li>)}
            </ul>
          )}
        </section>
      ))}
    </main>
  );
}
