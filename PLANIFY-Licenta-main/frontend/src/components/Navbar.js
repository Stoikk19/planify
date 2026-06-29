import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const { t, i18n } = useTranslation();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
    window.location.reload();
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ro' ? 'en' : 'ro';
    i18n.changeLanguage(newLang);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/" className="logo-link"><h1>PLANIFY</h1></Link>
      </div>

      <ul className="navbar-links">
        <li><a href="/#about" className="nav-item">{t('nav.about')}</a></li>

        {user ? (
          <div className="user-menu">
            {user.role === 'client' && (
              <Link to="/dashboard-client" className="nav-appointments">
                📅 {t('nav.appointments')}
              </Link>
            )}
            <span className="user-name">👤 {user.name}</span>
            <button onClick={handleLogout} className="logout-btn">{t('nav.logout')}</button>
          </div>
        ) : (
          <li><Link to="/login" className="login-btn-nav">{t('nav.myAccount')}</Link></li>
        )}

        <li>
          <button onClick={toggleLanguage} className="lang-btn">
            {i18n.language === 'ro' ? '🇬🇧 EN' : '🇷🇴 RO'}
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;