import React from 'react';
import './Resume.css';
import { useTranslation } from 'react-i18next';
import Education from './Education';
import WorkExperience from './WorkExperience';
import Skills from './Skills';

const Resume = () => {
  const { t } = useTranslation();

  return (
    <section id="resume">
      <h2>{t('resume.title')}</h2>
      <p>{t('resume.intro')}</p>
      <a href="/mainresume/mainresume.pdf" download className="download-button">
        {t('resume.downloadButton')}
      </a>
      <WorkExperience />
      <Education />
      <Skills />
    </section>
  );
};

export default Resume;
