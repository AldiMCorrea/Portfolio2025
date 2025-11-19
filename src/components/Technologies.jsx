import React from 'react';
import './Technologies.css';
import { useTranslation } from 'react-i18next';
import Card from './Card';

const Technologies = () => {
  const { t } = useTranslation();
  const categories = t('technologies.categories', { returnObjects: true });

  return (
    <section id="technologies">
      <h2>{t('technologies.title')}</h2>
      <div className="technologies-grid">
        {Object.keys(categories).map((key) => (
          <Card key={key} title={categories[key].title} items={categories[key].list} />
        ))}
      </div>
    </section>
  );
};

export default Technologies;
