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
import reactLogo from '../assets/icons/react.svg';
import nodejsLogo from '../assets/icons/technologies/nodeJS.png';
import dockerLogo from '../assets/icons/technologies/Docker.png';
import linuxLogo from '../assets/icons/technologies/Linux.png';
import agileLogo from '../assets/icons/technologies/Agile.png';
import scrumLogo from '../assets/icons/technologies/Scrum.png';
import ciCdLogo from '../assets/icons/technologies/CDCI.png';
import jsLogo from '../assets/icons/technologies/JS.png';
import gtestLogo from '../assets/icons/technologies/GTest.png';

const iconMap = {
  'QNX': qnxLogo,
  'C': cLogo,
  'C++': cppLogo,
  'Python': pythonLogo,
  'JavaScript': jsLogo,
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
  'GTest': gtestLogo,
};

const Technologies = () => {
  const { t } = useTranslation();
  const categories = t('technologies.categories', { returnObjects: true });

  return (
    <section id="technologies">
      <h2>{t('technologies.title')}</h2>
      {Object.keys(categories).map((key) => (
        <div key={key} className={`category-section ${key}`}>
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
