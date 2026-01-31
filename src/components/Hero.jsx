import React, { useState } from 'react';
import './Hero.css';
import { useTranslation } from 'react-i18next';
import { FaPaperPlane } from 'react-icons/fa';
import profilePicture from '../assets/icons/me.png';
import emailjs from '@emailjs/browser';

const Hero = () => {
  const { t } = useTranslation();
  const [question, setQuestion] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAskMeAnything = async () => {
    if (!question.trim() || isLoading) return;
    setIsLoading(true);
    setStatus('');
    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ASK,
        {
          question: question,
          to_name: 'Aldana',
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );
      setStatus('sent');
      setQuestion('');
    } catch (error) {
      console.error('Error sending question:', error);
      setStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="hero">
      <div className="hero-content">
        <h1>{t('hero.title')}</h1>
        <h2>{t('hero.subtitle')}</h2>
        <p>{t('hero.description')}</p>
        <div className="hero-buttons">
          <a href="/mainresume/mainresume.pdf" download className="hero-button">{t('hero.downloadResume')}</a>
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
            disabled={isLoading}
          />
          <button className="ask-me-button" onClick={handleAskMeAnything} disabled={isLoading}>
            {isLoading ? t('hero.loading') : t('hero.askMeAnything')} <FaPaperPlane />
          </button>
        </div>
        {(status || isLoading) && (
          <div className={`answer-container ${status === 'sent' ? 'success' : ''} ${status === 'error' ? 'error' : ''}`}>
            {isLoading && <p>{t('hero.loading')}</p>}
            {status === 'sent' && <p>{t('hero.successMessage')}</p>}
            {status === 'error' && <p>{t('hero.errorMessage')}</p>}
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
