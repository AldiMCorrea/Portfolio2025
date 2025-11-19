import React from 'react';
import './Technologies.css';
import { useTranslation } from 'react-i18next';

// Import specific technology logos
import qnxLogo from '../assets/icons/technologies/qnxrtos.svg';
import cLogo from '../assets/icons/technologies/c.svg';
import cppLogo from '../assets/icons/technologies/cpp.svg';
import pythonLogo from '../assets/icons/technologies/python.svg';
import iotLogo from '../assets/icons/technologies/iot.svg';
import gitLogo from '../assets/icons/technologies/Git.svg';
import svnLogo from '../assets/icons/technologies/svn.svg';
import qtLogo from '../assets/icons/technologies/qtcreator.svg';
import reactLogo from '../assets/icons/react.svg'; // Assuming react.svg is available
import nodejsLogo from '../assets/icons/technologies/logos/nodejs.svg';
import dockerLogo from '../assets/icons/technologies/logos/docker.svg';
import linuxLogo from '../assets/icons/technologies/logos/linux.svg';
import agileLogo from '../assets/icons/technologies/logos/agile.svg';
import scrumLogo from '../assets/icons/technologies/logos/scrum.svg';
import ciCdLogo from '../assets/icons/technologies/logos/cicd.svg';

const iconMap = {
  'QNX': qnxLogo,
  'C': cLogo,
  'C++': cppLogo,
  'Python': pythonLogo,
  'JavaScript': pythonLogo, // Using Python logo as a placeholder for JS
  'IoT': iotLogo,
  'Git': gitLogo,
  'SVN': svnLogo,
  'Qt': qtLogo,
  'React': reactLogo,
  'Node.js': nodejsLogo,
  'Docker': dockerLogo,
  'Linux': linuxLogo,
  'Agile': agileLogo,
  'Scrum': scrumLogo,
  'CI/CD': ciCdLogo,
  'GTest': cppLogo, // Using C++ logo as a placeholder for GTest
};

const Technologies = () => {
  const { t } = useTranslation();
  const categories = t('technologies.categories', { returnObjects: true });

  return (
    <section id="technologies">
      <h2>{t('technologies.title')}</h2>
      {Object.keys(categories).map((key) => (
        <div key={key} className="category-section">
          <h3>{categories[key].title}</h3>
          <div className="technologies-grid">
            {categories[key].list.map((tech, index) => (
              <div key={index} className="technology-card">
                {iconMap[tech] && <img src={iconMap[tech]} alt={tech} className="tech-icon" />}
                <span>{tech}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
};

export default Technologies;
