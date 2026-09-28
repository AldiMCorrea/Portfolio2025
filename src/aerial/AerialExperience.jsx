import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaMoon, FaSun, FaInstagram, FaWhatsapp, FaUsers, FaMapMarkerAlt } from 'react-icons/fa';
import './AerialExperience.css';
import logoBlack from './aerial-logo-black.png';
import logoWhite from './aerial-logo-white.png';
import { LANG_STORAGE_KEY } from './i18n';

const INSTAGRAM_HANDLE = 'aerialexperience_';
const INSTAGRAM_URL = `https://www.instagram.com/${INSTAGRAM_HANDLE}/`;

const WHATSAPP_NUMBER = '5493517892061';
const whatsappUrl = (message) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

const WHATSAPP_GROUP_URL = 'https://chat.whatsapp.com/HAQjnj4hVdiAiHxRNlQw2N';

const ADDRESS = 'Brasil 155, Nueva Córdoba, Córdoba, Argentina';
const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`;
const MAPS_EMBED_URL = `https://www.google.com/maps?q=${encodeURIComponent(ADDRESS)}&output=embed`;

const THEME_STORAGE_KEY = 'ae-theme';
const LANGUAGES = ['es', 'en'];

const save = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Storage can be unavailable (private mode); the choice just won't persist.
  }
};

const getInitialTheme = () => {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {
    // fall through to the OS preference
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

// ---- Satin background ---------------------------------------------------
// Out-of-focus satin: wide blurred diagonal bands of light (hi) and shadow (lo).
const SATIN_BANDS = [
  { tone: 'hi', top: -8, height: 34, opacity: 0.95 },
  { tone: 'lo', top: 18, height: 22, opacity: 0.8 },
  { tone: 'hi', top: 38, height: 30, opacity: 0.8 },
  { tone: 'lo', top: 62, height: 26, opacity: 0.9 },
  { tone: 'hi', top: 82, height: 34, opacity: 0.7 },
];

function Satin() {
  return (
    <div className="ae-satin" aria-hidden="true">
      <div className="ae-satin-bands">
        {SATIN_BANDS.map((band, i) => (
          <span
            key={i}
            className={`ae-satin-${band.tone}`}
            style={{ top: `${band.top}%`, height: `${band.height}%`, opacity: band.opacity }}
          />
        ))}
      </div>
      <span className="ae-satin-veil" />
    </div>
  );
}

function StrapsIcon() {
  return (
    <svg viewBox="0 0 100 120" aria-hidden="true">
      <path d="M20 8 H80" />
      <path d="M34 8 V78 a6 6 0 0 0 12 0 V8" />
      <path d="M54 8 V78 a6 6 0 0 0 12 0 V8" />
    </svg>
  );
}

function TrapezeIcon() {
  return (
    <svg viewBox="0 0 100 120" aria-hidden="true">
      <path d="M20 8 H80" />
      <path d="M30 8 L28 88" />
      <path d="M70 8 L72 88" />
      <path d="M20 88 H80" strokeWidth="5" />
    </svg>
  );
}

function HammockIcon() {
  return (
    <svg viewBox="0 0 100 120" aria-hidden="true">
      <path d="M20 8 H80" />
      <path d="M44 8 C30 50 22 80 50 100 C78 80 70 50 56 8" />
      <path d="M40 30 C44 60 56 60 60 30" opacity="0.5" />
    </svg>
  );
}

const DISCIPLINES = [
  {
    key: 'straps',
    title: 'Aerial Straps',
    Icon: StrapsIcon,
  },
  {
    key: 'trapeze',
    title: 'Dance Trapeze',
    Icon: TrapezeIcon,
  },
  {
    key: 'hammock',
    title: 'Aerial Hammock',
    Icon: HammockIcon,
  },
];

function Controls({ theme, onToggleTheme }) {
  const { t, i18n } = useTranslation();

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    save(LANG_STORAGE_KEY, code);
  };

  return (
    <div className="ae-controls">
      <div className="ae-lang" role="group" aria-label={t('controls.language')}>
        {LANGUAGES.map((code) => (
          <button
            key={code}
            type="button"
            className={i18n.resolvedLanguage === code ? 'is-active' : ''}
            aria-pressed={i18n.resolvedLanguage === code}
            onClick={() => changeLanguage(code)}
          >
            {code.toUpperCase()}
          </button>
        ))}
      </div>
      <button
        type="button"
        className="ae-theme"
        onClick={onToggleTheme}
        aria-label={theme === 'dark' ? t('controls.toLight') : t('controls.toDark')}
      >
        {theme === 'dark' ? <FaSun /> : <FaMoon />}
      </button>
    </div>
  );
}

function AerialExperience() {
  const { t, i18n } = useTranslation();
  const [theme, setTheme] = useState(getInitialTheme);
  const wppLink = whatsappUrl(t('contact.whatsappMessage'));

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Keep <html lang>, the tab title and the meta description in the chosen language.
  useEffect(() => {
    document.documentElement.lang = i18n.resolvedLanguage;
    document.title = t('meta.title');
    document.querySelector('meta[name="description"]')?.setAttribute('content', t('meta.description'));
  }, [i18n.resolvedLanguage, t]);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    save(THEME_STORAGE_KEY, next);
  };

  return (
    <div className="ae">
      <Satin />
      <Controls theme={theme} onToggleTheme={toggleTheme} />

      <header className="ae-hero">
        <h1 className="ae-title">
          <img className="ae-logo" src={theme === 'dark' ? logoWhite : logoBlack} alt="Aerial Experience" />
        </h1>
        <p className="ae-tagline">{t('hero.tagline')}</p>
        <a className="ae-btn" href={wppLink} target="_blank" rel="noopener noreferrer">
          {t('hero.cta')}
        </a>
      </header>

      <main>
        <section className="ae-section ae-about" id="about">
          <p className="ae-eyebrow">{t('about.eyebrow')}</p>
          <h2>{t('about.title')}</h2>
          {t('about.paragraphs', { returnObjects: true }).map((text, i) => (
            <p key={i}>{text}</p>
          ))}
          <p className="ae-about-closing">{t('about.closing')}</p>
        </section>

        <section className="ae-section" id="disciplinas">
          <p className="ae-eyebrow">{t('disciplines.eyebrow')}</p>
          <h2>{t('disciplines.title')}</h2>
          <div className="ae-cards">
            {DISCIPLINES.map((d) => (
              <article className="ae-card" key={d.key} id={d.key}>
                <div className="ae-card-icon"><d.Icon /></div>
                <h3>{d.title}</h3>
                <p>{t(`disciplines.${d.key}`)}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="ae-section ae-instagram" id="instagram">
          <p className="ae-eyebrow">Instagram</p>
          <h2>{t('instagram.title')}</h2>
          <a className="ae-ig-card" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
            <span className="ae-ig-avatar">
              <img src={theme === 'dark' ? logoWhite : logoBlack} alt="" />
            </span>
            <span className="ae-ig-info">
              <span className="ae-ig-handle">@{INSTAGRAM_HANDLE}</span>
              <span className="ae-ig-name">Aerial Experience</span>
              <span className="ae-ig-bio">{t('instagram.bio')}</span>
            </span>
            <span className="ae-ig-follow">
              <FaInstagram aria-hidden="true" />
              {t('instagram.follow')}
            </span>
          </a>
        </section>

        <section className="ae-section ae-contact" id="contacto">
          <p className="ae-eyebrow">{t('contact.eyebrow')}</p>
          <h2>{t('contact.title')}</h2>
          <p>{t('contact.text')}</p>
          <a className="ae-btn ae-btn-wpp" href={wppLink} target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.08.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zM12.05 21.5h-.01a9.43 9.43 0 0 1-4.8-1.32l-.35-.2-3.57.93.96-3.48-.23-.36a9.4 9.4 0 0 1-1.44-5.02c0-5.2 4.24-9.43 9.45-9.43a9.4 9.4 0 0 1 9.43 9.44c0 5.2-4.24 9.44-9.44 9.44zm8.03-17.47A11.3 11.3 0 0 0 12.05.7C5.8.7.7 5.8.7 12.05c0 2 .52 3.95 1.52 5.67L.6 23.3l5.72-1.5a11.3 11.3 0 0 0 5.72 1.46h.01c6.25 0 11.35-5.1 11.35-11.35 0-3.03-1.18-5.88-3.32-8.02z" />
            </svg>
            +54 9 351 789-2061
          </a>
          <p className="ae-contact-group">
            <a href={WHATSAPP_GROUP_URL} target="_blank" rel="noopener noreferrer">
              <FaUsers aria-hidden="true" />
              {t('contact.group')}
            </a>
          </p>
        </section>
      </main>

      <footer className="ae-footer">
        <div className="ae-footer-grid">
          <div className="ae-footer-brand">
            <img className="ae-footer-logo" src={theme === 'dark' ? logoWhite : logoBlack} alt="Aerial Experience" />
            <p className="ae-footer-text">{t('footer.desc')}</p>
          </div>

          <nav aria-label={t('footer.links')}>
            <div className="ae-footer-title">{t('footer.links')}</div>
            <ul className="ae-footer-links">
              <li><a href="#about">About</a></li>
              <li><a href="#disciplinas">{t('disciplines.eyebrow')}</a></li>
              <li><a href="#instagram">Instagram</a></li>
              <li><a href="#contacto">{t('contact.eyebrow')}</a></li>
            </ul>
          </nav>

          <div>
            <div className="ae-footer-title">{t('footer.contact')}</div>
            <ul className="ae-footer-links">
              <li>
                <a href={wppLink} target="_blank" rel="noopener noreferrer">
                  <FaWhatsapp aria-hidden="true" /> +54 9 351 789-2061
                </a>
              </li>
              <li>
                <a href={WHATSAPP_GROUP_URL} target="_blank" rel="noopener noreferrer">
                  <FaUsers aria-hidden="true" /> {t('footer.group')}
                </a>
              </li>
              <li>
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
                  <FaInstagram aria-hidden="true" /> @{INSTAGRAM_HANDLE}
                </a>
              </li>
              <li>
                <a href={MAPS_URL} target="_blank" rel="noopener noreferrer">
                  <FaMapMarkerAlt aria-hidden="true" /> Brasil 155, Nueva Córdoba
                </a>
              </li>
            </ul>
            <div className="ae-footer-social">
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram /></a>
              <a href={wppLink} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><FaWhatsapp /></a>
            </div>
          </div>

          <div>
            <div className="ae-footer-title">{t('footer.location')}</div>
            <div className="ae-footer-map">
              <iframe
                title={t('footer.mapTitle')}
                src={MAPS_EMBED_URL}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </div>

        <div className="ae-footer-divider" />
        <p className="ae-footer-copyright">
          © {new Date().getFullYear()} Aerial Experience. {t('footer.rights')} · <a href="/">aldicorrea.com</a>
        </p>
      </footer>
    </div>
  );
}

export default AerialExperience;
