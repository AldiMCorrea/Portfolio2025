import React from 'react';
import './Education.css';
import { useTranslation } from 'react-i18next';

const Education = () => {
  const { t } = useTranslation();

  return (
    <div className="education" id="education">
      <h3 className="resume-subtitle">{t('education.title')}</h3>
      <div className="education-grid">
        <div className="edu-card">
          <h4>{t('education.degree1')}</h4>
          <p>{t('education.date1')}</p>
        </div>
        <div className="edu-card">
          <h4>{t('education.degree2')}</h4>
          <p>{t('education.date2')}</p>
        </div>
      </div>
    </div>
  );
};

export default Education;
