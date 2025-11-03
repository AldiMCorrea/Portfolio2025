import React from 'react';
import './Skills.css';
import { useTranslation } from 'react-i18next';

const Skills = () => {
  const { t } = useTranslation();

  return (
    <section id="skills">
      <h2>{t('skills.title')}</h2>
      <ul>
        {t('skills.skills', { returnObjects: true }).map((skill, index) => (
          <li key={index}>{skill}</li>
        ))}
      </ul>
      <h2>{t('skills.certifications_title')}</h2>
      <ul>
        {t('skills.certifications', { returnObjects: true }).map((certification, index) => (
          <li key={index}>{certification}</li>
        ))}
      </ul>
    </section>
  );
};

export default Skills;
