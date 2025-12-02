import React, { useState } from 'react';
import './Hero.css';
import { useTranslation } from 'react-i18next';
import { FaPaperPlane } from 'react-icons/fa';
import profilePicture from '../assets/icons/me.png';

const Hero = () => {
  const { t } = useTranslation();
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const handleAskMeAnything = async () => {
    if (!question.trim()) return;
    try {
      const response = await fetch('http://localhost:3001/api/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      });
      const data = await response.json();
      setAnswer(data.answer);
    } catch (error) {
      console.error('Error asking question:', error);
      setAnswer('Sorry, something went wrong.');
    }
  };

  return (
    <section id="hero">
      <div className="hero-content">
        <h1>{t('hero.title')}</h1>
        <h2>{t('hero.subtitle')}</h2>
        <p>{t('hero.description')}</p>
        <div className="hero-buttons">
          <a href="/src/mainresume/resume.pdf" download className="hero-button">{t('hero.downloadResume')}</a>
          <a href="#contact" className="hero-button">{t('hero.contactMe')}</a>
        </div>
        <div className="ask-me-container">
          <input
            type="text"
            placeholder={t('hero.askMePlaceholder')}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAskMeAnything()}
            className="ask-me-input"
          />
          <button className="ask-me-button" onClick={handleAskMeAnything}>
            {t('hero.askMeAnything')} <FaPaperPlane />
          </button>
        </div>
        {answer && (
          <div className="answer-container">
            <p>{answer}</p>
          </div>
        )}
      </div>
      <div className="hero-image">
        <div className="profile-picture-container">
          <img src={profilePicture} alt="Aldana Correa" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
