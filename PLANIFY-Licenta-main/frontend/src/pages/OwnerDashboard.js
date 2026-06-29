import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './OwnerDashboard.css';

const OwnerDashboard = () => {
  const { t } = useTranslation();
  const user = JSON.parse(localStorage.getItem('user'));
  const [salon, setSalon] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [serviceForm, setServiceForm] = useState({ name: '', price: '', duration: '', category: 'frizerie' });
  const [salonForm, setSalonForm] = useState({ name: '', address: '', category: 'frizerie' });

  const fetchData = async () => {
    try {
      const resSalon = await fetch(`http://localhost:5000/my-salon/${user.id}`);
      const salonData = await resSalon.json();
      setSalon(salonData);
      if (salonData) {
        const resApp = await fetch(`http://localhost:5000/salon-appointments/${user.id}`);
        const appData = await resApp.json();
        setAppointments(appData);
      }
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchData(); }, [user.id]);

  const updateStatus = async (id, newStatus) => {
    await fetch(`http://localhost:5000/appointments/status/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    fetchData();
  };

  const createSalon = async (e) => {
    e.preventDefault();
    await fetch('http://localhost:5000/salons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...salonForm, ownerId: user.id })
    });
    fetchData();
  };

  if (!salon) return (
    <div className="create-salon-container">
      <div className="create-salon-card">
        <h2>{t('dashboard.createSalon')}</h2>
        <form onSubmit={createSalon}>
          <input type="text" placeholder={t('dashboard.salonName')} onChange={e => setSalonForm({...salonForm, name: e.target.value})} required />
          <input type="text" placeholder={t('dashboard.salonAddress')} onChange={e => setSalonForm({...salonForm, address: e.target.value})} required />
          <select onChange={e => setSalonForm({...salonForm, category: e.target.value})}>
            <option value="frizerie">{t('dashboard.catFrizerie')}</option>
            <option value="coafor">{t('dashboard.catCoafor')}</option>
            <option value="unghii">{t('dashboard.catUnghii')}</option>
            <option value="cosmetica">{t('dashboard.catCosmetica')}</option>
            <option value="masaj">{t('dashboard.catMasaj')}</option>
          </select>
          <button type="submit">{t('dashboard.createSalonBtn')}</button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="dashboard-container-full">
      <div className="owner-sidebar">
        <h2>{salon.name}</h2>
        <p>📍 {salon.address}</p>
        <hr />
        <h3>{t('dashboard.addService')}</h3>
        <form className="mini-form" onSubmit={async (e) => {
          e.preventDefault();
          await fetch('http://localhost:5000/services', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...serviceForm, salonId: salon.id })
          });
          alert(t('dashboard.serviceAdded'));
          window.location.reload();
        }}>
          <input type="text" placeholder={t('dashboard.serviceName')} onChange={e => setServiceForm({...serviceForm, name: e.target.value})} required />
          <input type="number" placeholder={t('dashboard.servicePrice')} onChange={e => setServiceForm({...serviceForm, price: e.target.value})} required />
          <button type="submit">{t('dashboard.addService')}</button>
        </form>
      </div>

      <div className="owner-main-content">
        <h2>🗓️ {t('dashboard.received')}</h2>
        <div className="appointments-grid-owner">
          {appointments.map(app => (
            <div key={app.id} className={`owner-app-card ${app.status}`}>
              <div className="app-time">
                {new Date(app.appointment_date).toLocaleDateString('ro-RO')}<br/>
                <strong>{new Date(app.appointment_date).toLocaleTimeString('ro-RO', {hour:'2-digit', minute:'2-digit'})}</strong>
              </div>
              <div className="app-user-info">
                <h4>{app.client_name}</h4>
                <p>📞 {app.client_phone}</p>
                <span className="service-tag">{app.service_name}</span>
              </div>
              <div className="app-actions-owner">
                {app.status === 'activa' ? (
                  <>
                    <button className="btn-approve" onClick={() => updateStatus(app.id, 'confirmata')}>{t('dashboard.accept')}</button>
                    <button className="btn-reject" onClick={() => updateStatus(app.id, 'refuzata')}>{t('dashboard.refuse')}</button>
                  </>
                ) : (
                  <span className={`final-status ${app.status}`}>{app.status.toUpperCase()}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
