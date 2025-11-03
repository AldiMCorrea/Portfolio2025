import React from 'react';
import './Projects.css';
import { useTranslation } from 'react-i18next';
import { FaGithub } from 'react-icons/fa';

const Projects = () => {
  const { t } = useTranslation();

  return (
    <section id="projects">
      <h2>{t('projects.title')}</h2>

      <div className="project">
        <img src="https://img.freepik.com/free-photo/smart-plug-with-smart-home-system_1340-29000.jpg" alt="Smart Plug Project" />
        <div className="project-info">
          <h3>{t('projects.project2.title')}</h3>
          <p>{t('projects.project2.description')}</p>
          <a href="https://github.com/AldiMCorrea" target="_blank" rel="noopener noreferrer">
            <FaGithub />
            {t('projects.project2.link')}
          </a>
        </div>
      </div>
      <div className="project">
        <img src="https://img.freepik.com/free-photo/smart-home-system-with-energy-efficiency_1340-39400.jpg" alt="Power Monitor Project" />
        <div className="project-info">
          <h3>{t('projects.project3.title')}</h3>
          <p>{t('projects.project3.description')}</p>
          <a href="https://github.com/AldiMCorrea" target="_blank" rel="noopener noreferrer">
            <FaGithub />
            {t('projects.project3.link')}
          </a>
        </div>
      </div>
      <div className="project">
        <img src="https://img.freepik.com/free-photo/iot-platform-with-cloud-security_1340-39400.jpg" alt="IoT Platform Project" />
        <div className="project-info">
          <h3>{t('projects.project4.title')}</h3>
          <p>{t('projects.project4.description')}</p>
          <a href="https://github.com/AldiMCorrea" target="_blank" rel="noopener noreferrer">
            <FaGithub />
            {t('projects.project4.link')}
          </a>
        </div>
      </div>
    </section>
  );
};

export default Projects;
