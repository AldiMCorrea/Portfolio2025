import React from 'react';
import './About.css';
import { useTranslation } from 'react-i18next';
import Lottie from 'react-lottie-player';
import animationData from '../assets/animations/chip-animation.json';

const About = () => {
  const { t } = useTranslation();

  return (
    <section id="about">
      <div className="about-container">
        <div className="about-content">
          <h2>{t('about.title')}</h2>
          <p>{t('about.content')}</p>
          <a href="#contact" className="cta-button">{t('hero.contactMe')}</a>
        </div>
        <div className="chip-animation">
          <Lottie
            loop
            animationData={animationData}
            play
            style={{ width: 300, height: 300 }}
          />
        </div>
      </div>
    </section>
  );
};

export default About;
