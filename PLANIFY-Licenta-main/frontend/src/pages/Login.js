import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Login.css';

const Login = () => {
  const { t } = useTranslation();
  const [inputs, setInputs] = useState({ email: '', password: '' });
  const [eroare, setEroare] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setEroare('');
    try {
      const res = await fetch('https://planify-backend-z13v.onrender.com/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputs)
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
        if (data.user.role === 'admin') {
          window.location.href = '/admin';
        } else if (data.user.role === 'owner') {
          window.location.href = '/dashboard-owner';
        } else {
          window.location.href = '/';
        }
      } else {
        setEroare(data.eroare || t('auth.loginError'));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={onSubmit}>
        <h2>{t('auth.login')}</h2>
        {eroare && <div style={{color: 'red', marginBottom: '10px'}}>{eroare}</div>}
        <input type="email" placeholder={t('auth.email')} onChange={e => setInputs({...inputs, email: e.target.value})} required />
        <input type="password" placeholder={t('auth.password')} onChange={e => setInputs({...inputs, password: e.target.value})} required />
        <button type="submit" className="login-submit-btn">{t('auth.loginBtn')}</button>
        <div className="login-footer">
          <p>{t('auth.noAccount')} <Link to="/register">{t('auth.register')}</Link></p>
        </div>
      </form>
    </div>
  );
};

export default Login;
