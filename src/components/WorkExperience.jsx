import React from 'react';
import './WorkExperience.css';
import { useTranslation } from 'react-i18next';

const jobs = ['job1', 'job2', 'job3'];

const WorkExperience = () => {
  const { t } = useTranslation();

  return (
    <div className="work-experience" id="work-experience">
      <h3 className="resume-subtitle">{t('workExperience.title')}</h3>
      <div className="timeline">
        {jobs.map((job, index) => {
          const subtitle = t(`workExperience.${job}_subtitle`, { defaultValue: '' });
          const isCurrent = index === 0;
          return (
            <div className={`job-card ${isCurrent ? 'is-current' : ''}`} key={job}>
              <div className="job-card-marker" aria-hidden="true" />
              <div className="job-card-body">
                <div className="job-card-head">
                  <h4>{t(`workExperience.${job}_title`)}</h4>
                  {isCurrent && <span className="job-badge">{t('workExperience.current')}</span>}
                </div>
                <p className="job-card-date">{t(`workExperience.${job}_date`)}</p>
                {subtitle && <p className="job-card-subtitle">{subtitle}</p>}
                <ul>
                  {t(`workExperience.${job}_desc`, { returnObjects: true }).map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WorkExperience;
