import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './CategoryPage.css';

const CategoryPage = () => {
  const { categorie } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [saloane, setSaloane] = useState([]);

  useEffect(() => {
    fetch(`https://planify-backend-z13v.onrender.com/salons/categorie/${categorie}`)
      .then(res => res.json())
      .then(data => setSaloane(data))
      .catch(err => console.error(err));
  }, [categorie]);

  const titluCategorie = t(`category.${categorie}`);

  return (
    <div className="category-page-container">
      <div className="breadcrumb">
        <span>{t('category.home')}</span> » <span className="current">{titluCategorie}</span>
      </div>

      <h1>{titluCategorie}</h1>

      <div className="salons-grid">
        {saloane.length > 0 ? (
          saloane.map(salon => (
            <div key={salon.id} className="salon-card" onClick={() => navigate(`/salon/${salon.id}`)}>
              <div className="salon-image">
                <img src={salon.image_url || 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80'} alt={salon.name} />
                <button className="heart-btn">🤍</button>
              </div>
              <div className="salon-info">
                <h3>{salon.name}</h3>
                <div className="salon-rating">
                  ⭐ <strong>5.00</strong> <span className="reviews">{t('category.newOnPlanify')}</span>
                </div>
                <p className="salon-address">{salon.address}</p>
              </div>
            </div>
          ))
        ) : (
          <p>{t('category.noSalons')}</p>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
