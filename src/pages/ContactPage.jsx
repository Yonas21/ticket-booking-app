import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ContactPage = () => {
  const { t } = useTranslation();

  return (
    <div className="container slick-design py-5">
      <h2 className="mb-4 mt-24 text-center text-gray-900 dark:text-white">{t('common.contact')}</h2>
      <p className="text-center text-gray-700 dark:text-gray-300">
        {t('common.contactUsContent')}
      </p>

      <div className="row justify-content-center">
        <div className="col-md-6 mb-4">
          <div className="card h-100 shadow-sm bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <div className="card-body">
              <h5 className="card-title text-gray-900 dark:text-white">{t('common.emailSupport')}</h5>
              <p className="card-text text-gray-700 dark:text-gray-300">{t('common.emailSupportText')}</p>
              <p className="card-text text-gray-900 dark:text-white"><strong>support@busticket.com</strong></p>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="card h-100 shadow-sm bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <div className="card-body">
              <h5 className="card-title text-gray-900 dark:text-white">{t('common.phoneSupport')}</h5>
              <p className="card-text text-gray-700 dark:text-gray-300">{t('common.phoneSupportText')}</p>
              <p className="card-text text-gray-900 dark:text-white"><strong>+1 (800) 123-4567</strong></p>
              <p className="card-text"><small className="text-muted dark:text-gray-400">{t('common.phoneSupportHours')}</small></p>
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-4 shadow-sm bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">{t('common.ourOffice')}</h5>
        </div>
        <div className="card-body">
          <p className="card-text text-gray-700 dark:text-gray-300">{t('common.ourOfficeText')}</p>
          <p className="card-text text-gray-700 dark:text-gray-300">
            123 Bus Lane<br/>
            Travel City, TC 98765<br/>
            Country
          </p>
        </div>
      </div>

      <p className="mt-4 text-center text-gray-700 dark:text-gray-300">
        {t('common.lookForwardToHearing')}
      </p>
    </div>
  );
};

export default ContactPage;