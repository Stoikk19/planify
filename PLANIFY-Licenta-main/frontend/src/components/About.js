import React from 'react';
import { useTranslation } from 'react-i18next';
import './About.css';

const About = () => {
  const { t } = useTranslation();

  return (
    <section id="about" className="about-section">
      <div className="about-container">
        <h2>{t('about.title')}</h2>
        
        <p className="about-description">
          {t('about.description')}
        </p>
        
        <div className="about-features">
          <div className="feature-card">
            <h3>{t('about.forClients')} 💆‍♀️</h3>
            <p>{t('about.forClientsDesc')}</p>
          </div>
          
          <div className="feature-card">
            <h3>{t('about.forSalons')} 🏪</h3>
            <p>{t('about.forSalonsDesc')}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;