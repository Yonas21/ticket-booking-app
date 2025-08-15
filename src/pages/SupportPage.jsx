import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const SupportPage = () => {
  const { t } = useTranslation();

  return (
    <div className="container slick-design py-5">
      <h2 className="mb-4 text-center">{t('common.supportCenter')}</h2>

      <div className="card mb-4 shadow-sm">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">{t('common.faqs')}</h5>
        </div>
        <div className="card-body">
          <div className="accordion" id="faqAccordion">
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingOne">
                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                  {t('common.howToBook')}
                </button>
              </h2>
              <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#faqAccordion">
                <div className="accordion-body">
                  {t('common.howToBookAnswer')}
                </div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingTwo">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                  {t('common.canICancel')}
                </button>
              </h2>
              <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#faqAccordion">
                <div className="accordion-body">
                  {t('common.canICancelAnswer')}
                </div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingThree">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                  {t('common.amenitiesAvailable')}
                </button>
              </h2>
              <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#faqAccordion">
                <div className="accordion-body">
                  {t('common.amenitiesAvailableAnswer')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-4 shadow-sm">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">{t('common.contactInformation')}</h5>
        </div>
        <div className="card-body">
          <p>{t('common.contactInfoText')}</p>
          <p><strong>{t('common.email')}:</strong> support@busticket.com</p>
          <p><strong>{t('common.phoneSupport')}:</strong> +1 (800) 123-4567</p>
          <p className="text-muted"><small>{t('common.phoneSupportHours')}</small></p>
          <Link to="/contact" className="btn btn-primary mt-3">{t('common.goToContactPage')}</Link>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;