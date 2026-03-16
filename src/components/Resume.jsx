import React from 'react';
import './Resume.css';
import { useTranslation } from 'react-i18next';
import Education from './Education';
import WorkExperience from './WorkExperience';
import Skills from './Skills';

const Resume = () => {
  const { t, i18n } = useTranslation();
  const resumePath = i18n.language === 'en' ? '/mainresume/mainresume.pdf' : '/mainresume/mainresume_es.pdf';

  return (
    <section id="resume">
      <h2>{t('resume.title')}</h2>
      <p>{t('resume.intro')}</p>
      <a href={resumePath} download className="download-button">
        {t('resume.downloadButton')}
      </a>
      <WorkExperience />
      <Education />
      <Skills />
    </section>
  );
};

export default Resume;
