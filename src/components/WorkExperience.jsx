import React from 'react';
import './WorkExperience.css';
import { useTranslation } from 'react-i18next';

const WorkExperience = () => {
  const { t } = useTranslation();

  return (
    <section id="work-experience">
      <h2>{t('workExperience.title')}</h2>
      <div>
        <h3>{t('workExperience.job1_title')}</h3>
        <p>{t('workExperience.job1_date')}</p>
        <ul>
          {t('workExperience.job1_desc', { returnObjects: true }).map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3>{t('workExperience.job2_title')}</h3>
        <p>{t('workExperience.job2_date')}</p>
        <p>{t('workExperience.job2_subtitle')}</p>
        <ul>
          {t('workExperience.job2_desc', { returnObjects: true }).map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3>{t('workExperience.job3_title')}</h3>
        <p>{t('workExperience.job3_date')}</p>
        <p>{t('workExperience.job3_subtitle')}</p>
        <ul>
          {t('workExperience.job3_desc', { returnObjects: true }).map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default WorkExperience;
