import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './SalonProfile.css';

const SalonProfile = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const [salon, setSalon] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    fetch(`https://planify-backend-z13v.onrender.com/salons/${id}`)
      .then(res => res.json())
      .then(data => setSalon(data));
  }, [id]);

  const handleBooking = async () => {
    if (!user) return alert(t('booking.loginRequired') || "Trebuie să fii logat!");
    if (!selectedService || !selectedDate) return alert(t('booking.selectAll') || "Alege un serviciu și o oră!");

    const res = await fetch('https://planify-backend-z13v.onrender.com/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientId: user.id,
        salonId: id,
        serviceId: selectedService.id,
        date: selectedDate
      })
    });

    if (res.ok) {
      alert(t('booking.success'));
      navigate('/dashboard-client');
    }
  };

  if (!salon) return <div className="loading">Se încarcă...</div>;

  return (
    <div className="salon-profile-container">
      <div className="salon-header-hero">
        <h1>{salon.info.name}</h1>
        <p>📍 {salon.info.address}</p>
      </div>

      <div className="booking-section">
        <div className="services-selection">
          <h3>1. {t('booking.chooseService')}</h3>
          <div className="services-list-profile">
            {salon.services.map(s => (
              <div
                key={s.id}
                className={`service-item-pick ${selectedService?.id === s.id ? 'active' : ''}`}
                onClick={() => setSelectedService(s)}
              >
                <span>{s.name} ({s.duration} min)</span>
                <strong>{s.price} RON</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="datetime-selection">
          <h3>2. {t('booking.chooseDateTime')}</h3>
          <input
            type="datetime-local"
            className="date-picker-mero"
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          <button className="confirm-booking-btn" onClick={handleBooking}>
            {t('booking.confirm')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SalonProfile;
