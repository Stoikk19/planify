import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Hero.css';

const Hero = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [city, setCity] = useState('');
  const navigate = useNavigate();
  const { t } = useTranslation();

  const judete = [
    "Alba", "Arad", "Argeș", "Bacău", "Bihor", "Bistrița-Năsăud", "Botoșani", 
    "Brașov", "Brăila", "București", "Buzău", "Caraș-Severin", "Călărași", 
    "Cluj", "Constanța", "Covasna", "Dâmbovița", "Dolj", "Galați", "Giurgiu", 
    "Gorj", "Harghita", "Hunedoara", "Ialomița", "Iași", "Ilfov", "Maramureș", 
    "Mehedinți", "Mureș", "Neamț", "Olt", "Prahova", "Satu Mare", "Sălaj", 
    "Sibiu", "Suceava", "Teleorman", "Timiș", "Tulcea", "Vaslui", "Vâlcea", "Vrancea"
  ];

  const handleSearch = () => {
    if (!searchTerm && !city) return;
    navigate(`/search?query=${searchTerm}&city=${city}`);
  };

  return (
    <div className="hero-container">
      <div className="hero-content">
        <h1>{t('hero.title')}</h1>
        
        <div className="search-box-mero">
          <div className="search-input-group">
            <span className="icon">🔍</span>
            <input 
              type="text" 
              placeholder={t('hero.searchService')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="divider"></div>
          
          <div className="search-input-group">
            <span className="icon">📍</span>
            <select className="judet-select" value={city} onChange={(e) => setCity(e.target.value)}>
              <option value="">{t('hero.chooseCounty')}</option>
              {judete.map((judet, index) => (
                <option key={index} value={judet}>{judet}</option>
              ))}
            </select>
          </div>
        </div>
        
        <button className="search-btn-mero" onClick={handleSearch}>{t('hero.searchBtn')} ❯</button>
      </div>
      
      <div className="hero-image">
        <img src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80" alt="Fata zambind" />
      </div>
    </div>
  );
};

export default Hero;