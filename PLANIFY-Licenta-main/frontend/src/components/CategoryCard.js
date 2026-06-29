import React from 'react';
import './CategoryCard.css';

// Această componentă primește 'props' (date exterioare): iconiță, nume și descriere
const CategoryCard = ({ icon, name, description }) => {
  return (
    <div className="category-card">
      <div className="category-icon">{icon}</div>
      <h3>{name}</h3>
      <p>{description}</p>
      <button className="category-btn">Vezi saloane</button>
    </div>
  );
};

export default CategoryCard;