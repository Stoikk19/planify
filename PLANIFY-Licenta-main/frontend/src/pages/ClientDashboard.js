import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './ClientDashboard.css';

const ClientDashboard = () => {
  const { t } = useTranslation();
  const user = JSON.parse(localStorage.getItem('user'));
  const [activeTab, setActiveTab] = useState('istoric');
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    if (user) {
      fetch(`https://planify-backend-z13v.onrender.com/appointments/client/${user.id}`)
        .then(res => res.json())
        .then(data => setAppointments(data));
    }
  }, []);

  const handleCancel = async (id) => {
    if (window.confirm(t('dashboard.cancelConfirm'))) {
      await fetch(`https://planify-backend-z13v.onrender.com/appointments/cancel/${id}`, { method: 'PUT' });
      window.location.reload();
    }
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-sidebar">
        <div className="profile-info-mini">
          <div className="avatar-circle">{user?.name?.charAt(0)}</div>
          <h4>{user?.name}</h4>
        </div>
        <nav className="sidebar-nav">
          <button className={activeTab === 'detalii' ? 'active' : ''} onClick={() => setActiveTab('detalii')}>
            👤 {t('dashboard.accountDetails')}
          </button>
          <button className={activeTab === 'istoric' ? 'active' : ''} onClick={() => setActiveTab('istoric')}>
            📅 {t('dashboard.history')}
          </button>
        </nav>
      </div>

      <div className="dashboard-content">
        {activeTab === 'detalii' ? (
          <div className="tab-content">
            <h2>{t('dashboard.accountDetails')}</h2>
            <div className="info-card">
              <p><strong>{t('dashboard.name')}:</strong> {user.name}</p>
              <p><strong>{t('dashboard.email')}:</strong> {user.email}</p>
              <p><strong>{t('dashboard.phone')}:</strong> {user.phone || t('dashboard.phoneEmpty')}</p>
            </div>
          </div>
        ) : (
          <div className="tab-content">
            <h2>{t('dashboard.history')}</h2>
            <div className="appointments-grid">
              {appointments.length > 0 ? (
                appointments.map(app => (
                  <div key={app.id} className={`app-card-new ${app.status}`}>
                    <div className="app-details">
                      <h4>{app.service_name}</h4>
                      <p className="salon-name">📍 {app.salon_name}</p>
                      <p className="app-date">⏰ {new Date(app.appointment_date).toLocaleString('ro-RO')}</p>
                    </div>
                    <div className="app-status-zone">
                      <span className={`badge ${app.status}`}>{app.status}</span>
                      {app.status === 'activa' && (
                        <button onClick={() => handleCancel(app.id)} className="btn-cancel-small">{t('dashboard.cancel')}</button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p>{t('dashboard.noAppointments')}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDashboard;
