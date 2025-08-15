import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import logoUrl from '../assets/logo.svg';
import { useTranslation } from 'react-i18next';

const Header = () => {
  const { user, logout, currency, setCurrency } = useAuthStore();
  const { i18n, t } = useTranslation();

  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value);
  };

  const handleLanguageChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <header className="p-3 mb-3 border-bottom">
      <nav className="navbar navbar-expand-lg navbar-light bg-transparent">
        <div className="container">
          <Link to="/" className="navbar-brand d-flex align-items-center" aria-label={t('common.busTicketBookingHome')}>
            <img src={logoUrl} alt={t('common.busTicketLogo')} width="100" height="30" />
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label={t('common.toggleNavigation')}>
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink to="/" className="nav-link text-dark" aria-current="page">{t('common.home')}</NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/about" className="nav-link text-dark">{t('common.about')}</NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/contact" className="nav-link text-dark">{t('common.contact')}</NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/support" className="nav-link text-dark">{t('common.support')}</NavLink>
              </li>
            </ul>

            <div className="d-flex flex-column flex-lg-row align-items-stretch align-items-lg-center gap-2 ms-lg-auto">
              {/* Language Selector */}
              <select
                className="form-select form-select-sm w-100 w-lg-auto"
                value={i18n.language}
                onChange={handleLanguageChange}
                aria-label={t('common.selectLanguage')}
              >
                <option value="en">English</option>
                <option value="am">አማርኛ</option>
              </select>

              {/* Currency Selector */}
              <select
                className="form-select form-select-sm w-100 w-lg-auto"
                value={currency}
                onChange={handleCurrencyChange}
                aria-label={t('common.selectCurrency')}
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>

              {/* Auth Buttons */}
              {user ? (
                <div className="d-flex flex-column flex-lg-row align-items-stretch align-items-lg-center gap-2">
                  <span className="text-dark text-center text-lg-start">
                    {t('common.welcomeUser', { name: user.name })}
                  </span>
                  <button
                    type="button"
                    className="btn btn-outline-primary w-100 w-lg-auto"
                    onClick={logout}
                  >
                    {t('common.logout')}
                  </button>
                </div>
              ) : (
                <div className="d-flex flex-column flex-lg-row gap-2 w-100 w-lg-auto">
                  <Link
                    to="/login"
                    className="btn btn-outline-primary w-100 w-lg-auto"
                    aria-label={t('common.loginToYourAccount')}
                  >
                    {t('common.login')}
                  </Link>
                  <Link
                    to="/signup"
                    className="btn btn-primary w-100 w-lg-auto"
                    aria-label={t('common.signUpForNewAccount')}
                  >
                    {t('common.signup')}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
