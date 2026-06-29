import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './Admin.css';

const Admin = () => {
  const { t } = useTranslation();
  const [services, setServices] = useState([]);

  const fetchServices = async () => {
    try {
      const res = await fetch('http://localhost:5000/services-admin');
      const data = await res.json();
      setServices(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchServices(); }, []);

  const deleteService = async (id) => {
    if (window.confirm(t('admin.deleteConfirm'))) {
      try {
        await fetch(`http://localhost:5000/services/${id}`, { method: 'DELETE' });
        fetchServices();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="admin-container">
      <h2>{t('admin.title')}</h2>
      <p className="admin-subtitle">{t('admin.subtitle')}</p>
      <div className="admin-list-container">
        <h3>{t('admin.activeServices')} ({services.length})</h3>
        {services.length > 0 ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>{t('admin.colService')}</th>
                <th>{t('admin.colSalon')}</th>
                <th>{t('admin.colPrice')}</th>
                <th>{t('admin.colDuration')}</th>
                <th>{t('admin.colActions')}</th>
              </tr>
            </thead>
            <tbody>
              {services.map(s => (
                <tr key={s.id}>
                  <td><strong>{s.name}</strong></td>
                  <td>{s.salon_name || t('admin.noSalon')}</td>
                  <td>{s.price} RON</td>
                  <td>{s.duration} min</td>
                  <td>
                    <button onClick={() => deleteService(s.id)} className="delete-btn">{t('admin.delete')}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">{t('admin.empty')}</div>
        )}
      </div>
    </div>
  );
};

export default Admin;
