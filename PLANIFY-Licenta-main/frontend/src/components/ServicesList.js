import React, { useState, useEffect } from 'react';
import './ServicesList.css';

const ServicesList = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/services')
      .then(res => res.json())
      .then(data => setServices(data));
  }, []);

  return (
    <section id="services" className="services-section">
      <h2>Serviciile Noastre</h2>
      <div className="services-grid">
        {services.length > 0 ? (
          services.map(s => (
            <div key={s.id} className="service-card">
              <h3>{s.name}</h3>
              <p>{s.duration} minute</p>
              <div className="price">{s.price} RON</div>
              <button className="book-btn">Programează-te</button>
            </div>
          ))
        ) : (
          <p>Nu există servicii configurate.</p>
        )}
      </div>
    </section>
  );
};

export default ServicesList;