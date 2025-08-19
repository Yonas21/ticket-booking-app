import React from 'react';
import { useTranslation } from 'react-i18next';

const AboutPage = () => {
  const { t } = useTranslation();

  return (
    <div className="container slick-design py-5">
      <h2 className="mb-4">{t('common.aboutUs')}</h2>
      <p>
        {t('common.aboutUsContent1')}
      </p>
      <p>
        {t('common.aboutUsContent2')}
      </p>
      <p>
        {t('common.aboutUsContent3')}
      </p>
      <p>
        {t('common.sincerely')},
      </p>
      <p>
        {t('common.theBusTicketTeam')}
      </p>
    </div>
  );
};

export default AboutPage;