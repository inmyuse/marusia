import { useCallback, useEffect, useState } from 'react';
import { dict } from './i18n.js';
import Nav from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import Security from './components/Security.jsx';
import Features from './components/Features.jsx';
import DotField from './components/DotField.jsx';
import Footer from './components/Footer.jsx';
import LegalPage from './components/LegalPage.jsx';

const LEGAL = { '/terms': 'terms', '/privacy': 'privacy' };
// the site may live under a sub-path (GitHub Pages: /marusia/)
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');
const currentPath = () => window.location.pathname.slice(BASE.length).replace(/\/+$/, '') || '/';

export default function App() {
  const [lang, setLang] = useState('ru');
  const [theme, setTheme] = useState('dark');
  const [path, setPath] = useState(currentPath);
  const t = dict[lang];
  const legalKind = LEGAL[path];

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dataset.theme = theme;
  }, [lang, theme]);

  useEffect(() => {
    const onPop = () => setPath(currentPath());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const navigate = useCallback((to) => {
    window.history.pushState({}, '', BASE + to);
    setPath(to);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const footer = (
    <Footer t={t.footer} lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} navigate={navigate} />
  );

  if (legalKind) {
    return (
      <>
        <div className="blue-zone blue-zone--legal">
          <DotField />
          <LegalPage kind={legalKind} lang={lang} navigate={navigate} />
          {footer}
        </div>
      </>
    );
  }

  return (
    <>
      <Nav t={t.nav} />
      <main>
        <Hero t={t.hero} />
        <Security t={t.security} />
      </main>
      <div className="blue-zone">
        <DotField />
        <Features t={t.features} />
        {footer}
      </div>
    </>
  );
}
