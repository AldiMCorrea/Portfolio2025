import React, { useState } from 'react';
import './Hero.css';
import { useTranslation } from 'react-i18next';
import { FaPaperPlane } from 'react-icons/fa';

const Hero = () => {
  const { t } = useTranslation();
  const [question, setQuestion] = useState('');

  const handleAskMeAnything = () => {
    // Future AI integration logic here
    console.log("User asked: ", question);
    setQuestion(''); // Clear input after asking
  };

  return (
    <section id="hero">
      <div className="hero-content">
        <h1>{t('hero.title')}</h1>
        <h2>{t('hero.subtitle')}</h2>
        <p>{t('hero.description')}</p>
        <div className="hero-buttons">
          <button>{t('hero.downloadResume')}</button>
          <a href="#contact" className="hero-button">{t('hero.contactMe')}</a>
        </div>
        <div className="ask-me-container">
          <input
            type="text"
            placeholder={t('hero.askMePlaceholder')}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="ask-me-input"
          />
          <button className="ask-me-button" onClick={handleAskMeAnything}>
            {t('hero.askMeAnything')} <FaPaperPlane />
          </button>
        </div>
      </div>
      <div className="hero-image">
        <div className="profile-picture-container">
          <img src="src/assets/icons/me.png" alt="Aldana Correa" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
