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

  return (
    <header className="header">
      <div className="logo">
        <img src={logo} alt="Amelanicorrea Logo" className="logo-img" />
      </div>
      <nav>
        <ul>
          <li><a href="#about">{t('header.about')}</a></li>
          <li><a href="#projects">{t('header.projects')}</a></li>
          <li><a href="#technologies">{t('header.technologies')}</a></li>
          <li><a href="#resume">{t('header.resume')}</a></li>
          <li><a href="#contact">{t('header.contact')}</a></li>
        </ul>
      </nav>
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
  );
};

export default Header;
