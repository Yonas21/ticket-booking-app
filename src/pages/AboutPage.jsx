import React from 'react';
import { useTranslation } from 'react-i18next';

const AboutPage = () => {
  const { t } = useTranslation();

  return (
    <div className="container slick-design py-5">
      <h2 className="mb-4 mt-16 text-gray-900 dark:text-white">{t('common.aboutUs')}</h2>
      <p className="text-gray-700 dark:text-gray-300">
        {t('common.aboutUsContent1')}
      </p>
      <p className="text-gray-700 dark:text-gray-300">
        {t('common.aboutUsContent2')}
      </p>
      <p className="text-gray-700 dark:text-gray-300">
        {t('common.aboutUsContent3')}
      </p>
      <p className="text-gray-700 dark:text-gray-300">
        {t('common.sincerely')},
      </p>
      <p className="text-gray-700 dark:text-gray-300">
        {t('common.theBusTicketTeam')}
      </p>
    </div>
  );
};

export default AboutPage;