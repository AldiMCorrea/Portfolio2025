import React from 'react';
import './Technologies.css';
import { useTranslation } from 'react-i18next';

// Import specific technology logos
import qnxLogo from '../assets/icons/technologies/qnxrtos.svg';
import cLogo from '../assets/icons/technologies/c.svg';
import cppLogo from '../assets/icons/technologies/cpp.svg';
import pythonLogo from '../assets/icons/technologies/python.svg';
import jsLogo from '../assets/icons/technologies/JS.png';
import qtLogo from '../assets/icons/technologies/qtcreator.svg';
import stlLogo from '../assets/icons/technologies/stl.svg';
import boostLogo from '../assets/icons/technologies/boost.svg';
import gtestLogo from '../assets/icons/technologies/GTest.png';
import reactLogo from '../assets/icons/react.svg';
import cmakeLogo from '../assets/icons/technologies/cmake.svg';
import gitLogo from '../assets/icons/technologies/Git.svg';
import gdbLogo from '../assets/icons/technologies/gdb.svg';
import dockerLogo from '../assets/icons/technologies/Docker.png';
import linuxLogo from '../assets/icons/technologies/Linux.png';
import agileLogo from '../assets/icons/technologies/Agile.png';
import scrumLogo from '../assets/icons/technologies/Scrum.png';
import ciCdLogo from '../assets/icons/technologies/CDCI.png';

const iconMap = {
  'C++': cppLogo,
  'C': cLogo,
  'Python': pythonLogo,
  'JavaScript': jsLogo,
  'Qt/QML': qtLogo,
  'STL': stlLogo,
  'Boost': boostLogo,
  'GoogleTest': gtestLogo,
  'React': reactLogo,
  'CMake': cmakeLogo,
  'Git': gitLogo,
  'GDB': gdbLogo,
  'Docker': dockerLogo,
  'QNX': qnxLogo,
  'Linux': linuxLogo,
  'Agile': agileLogo,
  'Scrum': scrumLogo,
  'CI/CD': ciCdLogo,
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
