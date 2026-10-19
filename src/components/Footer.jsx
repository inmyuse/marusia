
export default function Footer({ t, lang, setLang, theme, setTheme, navigate }) {
  const link = (to, label) => (
    <a
      href={import.meta.env.BASE_URL.replace(/\/$/, '') + to}
      onClick={(e) => {
        e.preventDefault();
        navigate(to);
      }}
    >
      {label}
    </a>
  );
  const pill = (active, onClick, label) => (
    <button type="button" className={`pill${active ? ' is-active' : ''}`} onClick={onClick}>{label}</button>
  );
  return (
    <footer className="footer">
      <div className="footer__card">
        <div className="footer__row">
          {pill(lang === 'ru', () => setLang('ru'), 'RU')}
          {pill(lang === 'en', () => setLang('en'), 'EN')}
          {pill(theme === 'light', () => setTheme('light'), t.light)}
          {pill(theme === 'dark', () => setTheme('dark'), t.dark)}
        </div>
        <div className="footer__row footer__links">
          {link('/terms', t.terms)}
          {link('/privacy', t.privacy)}
          <a href="#top">{t.app}</a>
        </div>
        <p>© 2025-2026, Design by redjex. All rights reserved.</p>
      </div>
    </footer>
  );
}
