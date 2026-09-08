import React from 'react';
import './Skills.css';
import { useTranslation } from 'react-i18next';

const Skills = () => {
  const { t } = useTranslation();

  return (
    <div className="skills" id="skills">
      <h3 className="resume-subtitle">{t('skills.title')}</h3>
      <div className="skills-tags">
        {t('skills.skills', { returnObjects: true }).map((skill, index) => (
          <span className="skill-tag" key={index}>{skill}</span>
        ))}
      </div>

      <h3 className="resume-subtitle certifications-title">{t('skills.certifications_title')}</h3>
      <ul className="certifications-list">
        {t('skills.certifications', { returnObjects: true }).map((certification, index) => (
          <li key={index}>{certification}</li>
        ))}
      </ul>
    </div>
  );
};

export default Skills;
