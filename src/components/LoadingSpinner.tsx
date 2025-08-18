import React from 'react';
import { useTranslation } from 'react-i18next';

const LoadingSpinner = ({ message }) => {
  const { t } = useTranslation();
  return (
    <div className="custom-loader">
      <div className="spinner"></div>
      <p>{t(message) || t('common.loading')}</p>
    </div>
  );
};

export default LoadingSpinner;
