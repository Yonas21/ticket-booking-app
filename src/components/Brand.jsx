import React from 'react';
import { Link } from 'react-router-dom';
import logoUrl from '../assets/logo.svg';
import { useTranslation } from 'react-i18next';

const Brand = () => {
  const { t } = useTranslation();

  return (
    <Link to="/" className="navbar-brand d-flex align-items-center" aria-label={t('common.busTicketBookingHome')}>
      <img src={logoUrl} alt={t('common.busTicketLogo')} width="100" height="30" />
    </Link>
  );
};

export default Brand;
