import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ContactPage = () => {
  const { t } = useTranslation();

  return (
    <div className="container slick-design py-5">
      <h2 className="mb-4 text-center">{t('common.contact')}</h2>
      <p className="text-center">
        {t('common.contactUsContent')}
      </p>

      <div className="row justify-content-center">
        <div className="col-md-6 mb-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">{t('common.emailSupport')}</h5>
              <p className="card-text">{t('common.emailSupportText')}</p>
              <p className="card-text"><strong>support@busticket.com</strong></p>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">{t('common.phoneSupport')}</h5>
              <p className="card-text">{t('common.phoneSupportText')}</p>
              <p className="card-text"><strong>+1 (800) 123-4567</strong></p>
              <p className="card-text"><small className="text-muted">{t('common.phoneSupportHours')}</small></p>
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-4 shadow-sm">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">{t('common.ourOffice')}</h5>
        </div>
        <div className="card-body">
          <p className="card-text">{t('common.ourOfficeText')}</p>
          <p className="card-text">
            123 Bus Lane<br/>
            Travel City, TC 98765<br/>
            Country
          </p>
        </div>
      </div>

      <p className="mt-4 text-center">
        {t('common.lookForwardToHearing')}
      </p>
    </div>
  );
};

export default ContactPage;