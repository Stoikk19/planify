import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './CategoryPage.css'; // Refolosim design-ul de carduri

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query') || '';
  const city = searchParams.get('city') || '';
  
  const [saloane, setSaloane] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Cerem rezultatele de la server
    fetch(`https://planify-backend-z13v.onrender.com/search?query=${query}&city=${city}`)
      .then(res => res.json())
      .then(data => setSaloane(data))
      .catch(err => console.error(err));
  }, [query, city]);

  return (
    <div className="category-page-container">
      <div className="breadcrumb">
        <span>Acasă</span> » <span className="current">Rezultate Căutare</span>
      </div>
      
      <h1>Rezultate pentru: {query} {city ? `(în zona ${city})` : ''}</h1>

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
                  ⭐ <strong>5.00</strong> <span className="reviews">(Nou)</span>
                </div>
                <p className="salon-address">{salon.address}</p>
              </div>
            </div>
          ))
        ) : (
          <p style={{ fontSize: '1.2rem', color: '#64748b' }}>
            Nu am găsit niciun salon care să se potrivească căutării tale. Încearcă alt cuvânt sau alt oraș!
          </p>
        )}
      </div>
    </div>
  );
};

export default SearchResults;