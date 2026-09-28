import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import es from './locales/es.json';
import en from './locales/en.json';

// Separate instance from the portfolio's i18n: different languages and default.
export const LANG_STORAGE_KEY = 'ae-lang';

const readSavedLang = () => {
  try {
    return localStorage.getItem(LANG_STORAGE_KEY);
  } catch {
    return null;
  }
};

// Saved choice first; otherwise Spanish, unless the browser asks for English.
const initialLang =
  readSavedLang() ||
  (typeof navigator !== 'undefined' && navigator.language?.startsWith('en') ? 'en' : 'es');

const i18n = i18next.createInstance();

i18n.use(initReactI18next).init({
  resources: {
    es: { translation: es },
    en: { translation: en },
  },
  lng: initialLang,
  fallbackLng: 'es',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
