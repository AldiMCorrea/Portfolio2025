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
import scrumLogo from '../assets/icons/technologies/svn.svg'; // Using svn for scrum as a placeholder
import qtcreatorLogo from '../assets/icons/technologies/qtcreator.svg';
import aiLogo from '../assets/icons/technologies/ai.svg';

const getTechImage = (techName) => {
  switch (techName) {
    case 'QNX':
      return qnxLogo;
    case 'C':
      return cLogo;
    case 'C++':
      return cppLogo;
    case 'Python':
      return pythonLogo;
    case 'IoT':
      return iotLogo;
    case 'Git':
      return gitLogo;
    case 'Scrum':
      return scrumLogo; // Placeholder, consider a more appropriate icon
    case 'Embedded Systems':
    case 'Medical Devices':
    case 'Firmware Development':
    case 'Hardware Development':
    case 'RTOS':
      return qnxLogo; // Using QNX logo as a generic embedded systems icon
    case 'AI':
      return aiLogo;
    case 'Qt Creator':
      return qtcreatorLogo;
    default:
      return null; // Or a generic placeholder image
  }
};

const Technologies = () => {
  const { t } = useTranslation();

  return (
    <section id="technologies">
      <h2>{t('technologies.title')}</h2>
      <div className="technologies-grid">
        {t('technologies.list', { returnObjects: true }).map((tech, index) => (
          <div key={index} className="technology-item">
            {getTechImage(tech) && <img src={getTechImage(tech)} alt={tech} className="tech-icon" />}
            <span>{tech}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Technologies;
