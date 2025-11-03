import React from 'react';
import './Education.css';
import { useTranslation } from 'react-i18next';

const Education = () => {
  const { t } = useTranslation();

  return (
    <section id="education">
      <h2>{t('education.title')}</h2>
      <div>
        <h3>{t('education.degree1')}</h3>
        <p>{t('education.date1')}</p>
      </div>
      <div>
        <h3>{t('education.degree2')}</h3>
        <p>{t('education.date2')}</p>
      </div>
    </section>
  );
};

export default Education;
