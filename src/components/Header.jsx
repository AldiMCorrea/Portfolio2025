import React, { useState, useRef, useEffect } from 'react';
import './Header.css';
import { FaMoon, FaSun, FaGithubSquare, FaLinkedin, FaGlobe } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import logo from '../assets/icons/logo.png';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'pt', label: 'Português' }
];

const Header = ({ toggleTheme, isDarkMode }) => {
  const { t, i18n } = useTranslation();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langRef = useRef(null);

  const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

  const onSelectLang = (code) => {
    i18n.changeLanguage(code);
    setIsLangOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const closeMenu = () => {
    document.getElementById('menu-toggle').checked = false;
  };

  return (
    <div className="header-wrapper">
      {/* Checkbox fuera del header para que position: fixed del menú funcione */}
      <input type="checkbox" id="menu-toggle" className="menu-toggle" />

      <header className="header">
        <div className="logo">
          <img src={logo} alt="Amelanicorrea Logo" className="logo-img" />
        </div>

        <label htmlFor="menu-toggle" className="hamburger" aria-label="Toggle navigation menu">
          <span></span>
          <span></span>
          <span></span>
        </label>

        <div className="header-right">
          <div className="language-selector" ref={langRef}>
            <button
              className="language-btn"
              onClick={() => setIsLangOpen(!isLangOpen)}
              aria-label="Select language"
            >
              <FaGlobe />
              <span>{currentLang.code.toUpperCase()}</span>
            </button>
            {isLangOpen && (
              <ul className="language-dropdown">
                {languages.map((lang) => (
                  <li key={lang.code}>
                    <button
                      className={`language-option ${lang.code === i18n.language ? 'active' : ''}`}
                      onClick={() => onSelectLang(lang.code)}
                    >
                      {lang.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button className="theme-switcher" onClick={toggleTheme}>
            {isDarkMode ? <FaSun /> : <FaMoon />}
          </button>
          <a href="https://github.com/AldiMCorrea" target="_blank" rel="noopener noreferrer">
            <FaGithubSquare />
          </a>
          <a href="https://linkedin.com/in/aldanamelanicorrea" target="_blank" rel="noopener noreferrer">
            <FaLinkedin />
          </a>
        </div>
      </header>

      {/* Nav fuera del header para evitar el stacking context del backdrop-filter */}
      <nav className="nav-menu">
        <ul>
          <li><a href="#about" onClick={closeMenu}>{t('header.about')}</a></li>
          <li><a href="#projects" onClick={closeMenu}>{t('header.projects')}</a></li>
          <li><a href="#technologies" onClick={closeMenu}>{t('header.technologies')}</a></li>
          <li><a href="#contact" onClick={closeMenu}>{t('header.contact')}</a></li>
        </ul>
      </nav>
    </div>
  );
};

export default Header;
