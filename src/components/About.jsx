import React from 'react';
import './About.css';
import { useTranslation } from 'react-i18next';
import Lottie from 'react-lottie-player';
import circuitAnimationData from '../assets/animations/circuit-animation.json';

const About = () => {
  const { t } = useTranslation();

  return (
    <section id="about">
      <div className="about-content">
        <h2>{t('about.title')}</h2>
        <p>{t('about.content')}</p>
      </div>
      <div className="circuit-animation">
        <Lottie
          loop
          animationData={circuitAnimationData}
          play
          style={{ width: 400, height: 300 }}
        />
      </div>
    </section>
  );
};

export default About;
