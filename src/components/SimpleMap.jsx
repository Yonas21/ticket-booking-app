import React from 'react';
import { useTranslation } from 'react-i18next';

const SimpleMap = ({ from, to, className = "h-64 w-full" }) => {
  const { t } = useTranslation();

  // Ethiopian cities coordinates (mock data)
  const cityCoordinates = {
    'Addis Ababa': [9.145, 40.4897],
    'Bahir Dar': [11.5897, 37.3907],
    'Gondar': [12.6, 37.4667],
    'Mekelle': [13.4969, 39.4769],
    'Dire Dawa': [9.6, 41.8667],
    'Adama': [8.55, 39.27],
    'Hawassa': [7.05, 38.47],
    'Jimma': [7.6667, 36.8333],
    'Dessie': [11.1333, 39.6333],
    'Jijiga': [9.35, 42.8],
    'Shashamane': [7.2, 38.6],
    'Bishoftu': [8.75, 38.9833],
    'Arba Minch': [6.0333, 37.55],
    'Hosaena': [7.55, 37.85],
    'Harar': [9.3167, 42.1167],
    'Dilla': [6.4167, 38.3167],
    'Nekemte': [9.0833, 36.55],
    'Debre Birhan': [9.6833, 39.5333],
    'Asella': [7.95, 39.1167],
    'Debre Markos': [10.3333, 37.7333],
    'Debre Tabor': [11.85, 38.0167],
    'Kombolcha': [11.0833, 39.7333],
    'Adigrat': [14.2833, 39.4667],
    'Wolaita Sodo': [6.85, 37.7667],
    'Bale Robe': [7.1333, 40.0],
    'Goba': [7.0167, 39.9833],
    'Yirgalem': [6.75, 38.4167],
    'Mizan Teferi': [6.9833, 35.55],
    'Gambella': [8.25, 34.5833],
    'Jinka': [5.7833, 36.5667],
    'Kebri Dehar': [6.7333, 44.2667],
    'Gode': [5.95, 43.45],
    'Dolo Bay': [4.1833, 42.0833],
    'Semera': [11.7833, 41.0167],
    'Logiya': [11.9667, 41.7833],
    'Abala': [13.5167, 39.9833],
    'Shire': [14.1, 38.2833],
    'Axum': [14.1167, 38.7167],
    'Lalibela': [12.0333, 39.05],
    'Sekota': [12.9667, 39.2333],
    'Debark': [13.1333, 37.9],
  };

  const fromCoords = cityCoordinates[from] || [9.145, 40.4897];
  const toCoords = cityCoordinates[to] || [11.5897, 37.3907];

  return (
    <div className={`${className} rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800`}>
      <div className="p-4">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {t('common.routeMap')}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {from} → {to}
          </p>
        </div>
        
        <div className="flex items-center justify-center space-x-8 mb-4">
          <div className="text-center">
            <div className="w-4 h-4 bg-green-500 rounded-full mb-2"></div>
            <p className="text-xs text-gray-600 dark:text-gray-300">{t('common.departure')}</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">{from}</p>
          </div>
          
          <div className="flex-1 h-0.5 bg-blue-500 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600"></div>
          </div>
          
          <div className="text-center">
            <div className="w-4 h-4 bg-red-500 rounded-full mb-2"></div>
            <p className="text-xs text-gray-600 dark:text-gray-300">{t('common.arrival')}</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">{to}</p>
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {t('common.mapNotAvailable')} - {t('common.pleaseTryAgain')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SimpleMap;
