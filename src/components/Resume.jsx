import React from 'react';
import './Resume.css';
import { useTranslation } from 'react-i18next';
import WorkExperience from './WorkExperience';
import Skills from './Skills';
import Education from './Education';

const Resume = () => {
  const { t, i18n } = useTranslation();
  const resumePath = i18n.language === 'en' ? '/mainresume/mainresume.pdf' : '/mainresume/mainresume_es.pdf';

  return (
    <section id="resume">
      <div className="resume-header">
        <div>
          <h2>{t('resume.title')}</h2>
          <p className="resume-intro">{t('resume.intro')}</p>
        </div>
        <a href={resumePath} download className="download-button">
          {t('resume.downloadButton')}
        </a>
      </div>

      <div className="resume-block">
        <WorkExperience />
      </div>
      <div className="resume-block">
        <Skills />
      </div>
      <div className="resume-block">
        <Education />
      </div>
    </section>
  );
};

export default Resume;
