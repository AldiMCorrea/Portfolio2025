import React from 'react';
import './Projects.css';
import { useTranslation } from 'react-i18next';
import { FaGithub } from 'react-icons/fa';
import SmartPlugImage from '../assets/projects-images/IOT-SmartPlug.png';
import PowerMonitorImage from '../assets/projects-images/Remote-PowerMonitoringSystem.png';
import IotPlatformImage from '../assets/projects-images/IoT-DataAcquisitionPlatform.png';
import AiBirdFeederImage from '../assets/projects-images/AI-PoweredBirdFeeder.png';
import WeatherStationImage from '../assets/projects-images/InteractiveWatherStation.png';
import SmartAgricultureImage from '../assets/projects-images/Smart-Agriculture.png';

const Projects = () => {
  const { t } = useTranslation();

  return (
    <section id="projects">
      <h2>{t('projects.title')}</h2>

      <div className="project">
        <img src={SmartPlugImage} alt="Smart Plug Project" />
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
        <img src={PowerMonitorImage} alt="Power Monitor Project" />
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
        <img src={IotPlatformImage} alt="IoT Platform Project" />
        <div className="project-info">
          <h3>{t('projects.project4.title')}</h3>
          <p>{t('projects.project4.description')}</p>
          <a href="https://github.com/AldiMCorrea" target="_blank" rel="noopener noreferrer">
            <FaGithub />
            {t('projects.project4.link')}
          </a>
        </div>
      </div>

      <div className="project">
        <img src={AiBirdFeederImage} alt="AI Bird Feeder Project" />
        <div className="project-info">
          <h3>{t('projects.project5.title')}</h3>
          <p>{t('projects.project5.description')}</p>
          <a href="https://github.com/AldiMCorrea" target="_blank" rel="noopener noreferrer">
            <FaGithub />
            {t('projects.project5.link')}
          </a>
        </div>
      </div>

      <div className="project">
        <img src={WeatherStationImage} alt="Weather Station Project" />
        <div className="project-info">
          <h3>{t('projects.project6.title')}</h3>
          <p>{t('projects.project6.description')}</p>
          <a href="https://github.com/AldiMCorrea" target="_blank" rel="noopener noreferrer">
            <FaGithub />
            {t('projects.project6.link')}
          </a>
        </div>
      </div>

      <div className="project">
        <img src={SmartAgricultureImage} alt="Smart Agriculture Project" />
        <div className="project-info">
          <h3>{t('projects.project7.title')}</h3>
          <p>{t('projects.project7.description')}</p>
          <a href="https://github.com/AldiMCorrea" target="_blank" rel="noopener noreferrer">
            <FaGithub />
            {t('projects.project7.link')}
          </a>
        </div>
      </div>
    </section>
  );
};

export default Projects;
