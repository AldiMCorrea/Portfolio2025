import React from 'react';
import './Header.css';
import { FaMoon, FaSun, FaGithubSquare, FaLinkedin } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import logo from '../assets/icons/logo.png'; // Import your logo
import ReactFlagsSelect from 'react-flags-select';

const Header = ({ toggleTheme, isDarkMode }) => {
  const { t, i18n } = useTranslation();

  const onSelect = (code) => {
    i18n.changeLanguage(code.toLowerCase());
  };

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
          <div className="language-selector-container">
            <ReactFlagsSelect
              countries={["US", "ES", "BR"]}
              customLabels={{ "US": "English", "ES": "Español", "BR": "Português (BR)" }}
              selected={i18n.language.toUpperCase()}
              onSelect={onSelect}
              className="flags-select"
            />
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
