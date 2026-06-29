import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Login.css';

const Register = () => {
  const { t } = useTranslation();
  const [inputs, setInputs] = useState({ fullName: '', phone: '', email: '', password: '', role: 'client' });
  const navigate = useNavigate();

  const onChange = (e) => setInputs({ ...inputs, [e.target.name]: e.target.value });

  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('https://planify-backend-z13v.onrender.com/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputs)
      });
      if (res.ok) navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={onSubmitForm}>
        <h2>{t('auth.register')}</h2>
        <input type="text" name="fullName" placeholder={t('auth.fullName')} onChange={onChange} required />
        <input type="email" name="email" placeholder={t('auth.email')} onChange={onChange} required />
        <input type="password" name="password" placeholder={t('auth.password')} onChange={onChange} required />
        <select name="role" onChange={onChange}>
          <option value="client">{t('auth.roleClient')}</option>
          <option value="owner">{t('auth.roleOwner')}</option>
        </select>
        <button type="submit" className="login-submit-btn">{t('auth.registerBtn')}</button>
        <div className="login-footer">
          <p>{t('auth.hasAccount')} <Link to="/login">{t('auth.login')}</Link></p>
        </div>
      </form>
    </div>
  );
};

export default Register;
