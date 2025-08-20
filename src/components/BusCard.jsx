import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Clock, Users, Star, ArrowRight, Wifi, Snowflake } from 'lucide-react';
import useAuthStore from '../store/authStore';
import { useTranslation } from 'react-i18next';

const BusCard = ({ trip }) => {
  const { currency } = useAuthStore();
  const { t } = useTranslation();

  const getCurrencySymbol = (currencyCode) => {
    switch (currencyCode) {
      case 'USD': return '$';
      case 'EUR': return '€';
      case 'GBP': return '£';
      case 'ETB': return t('common.currencySymbolETB');
      default: return '$';
    }
  };

  const getAmenityIcon = (amenity) => {
    switch (amenity.toLowerCase()) {
      case 'wifi':
        return <Wifi className="w-4 h-4" />;
      case 'ac':
        return <Snowflake className="w-4 h-4" />;
      default:
        return <Star className="w-4 h-4" />;
    }
  };

  return (
    <motion.div
      className="card-modern overflow-hidden group"
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header with operator info */}
      <div className="p-6 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Users className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{trip.busOperator}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('common.busService')}</p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            {trip.reviews && trip.reviews.length > 0 && (
              <>
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {trip.reviews[0]?.rating || 4.5}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Route and timing */}
        <div className="flex items-center justify-between">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900 dark:text-white">{trip.departureTime}</div>
            <div className="flex items-center justify-center space-x-1 text-sm text-gray-600 dark:text-gray-300">
              <MapPin className="w-3 h-3" />
              <span>{trip.from}</span>
            </div>
          </div>
          
          <div className="flex flex-col items-center space-y-1">
            <div className="w-16 h-0.5 bg-gradient-to-r from-primary-400 to-primary-600"></div>
            <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
              <Clock className="w-3 h-3" />
              <span>{trip.duration}</span>
            </div>
            {trip.intermediateStops && trip.intermediateStops.length > 0 && (
              <div className="text-xs text-gray-400 dark:text-gray-500">
                {trip.intermediateStops.length} {t('common.stops')}
              </div>
            )}
          </div>
          
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900 dark:text-white">{trip.arrivalTime}</div>
            <div className="flex items-center justify-center space-x-1 text-sm text-gray-600 dark:text-gray-300">
              <MapPin className="w-3 h-3" />
              <span>{trip.to}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Amenities */}
      {trip.amenities && trip.amenities.length > 0 && (
        <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center space-x-4">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              {t('common.amenities')}
            </span>
            <div className="flex items-center space-x-2">
              {trip.amenities.slice(0, 3).map((amenity, index) => (
                <div key={index} className="flex items-center space-x-1 text-xs text-gray-600 dark:text-gray-300">
                  {getAmenityIcon(amenity)}
                  <span>{amenity}</span>
                </div>
              ))}
              {trip.amenities.length > 3 && (
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  +{trip.amenities.length - 3} {t('common.more')}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer with price and booking */}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-2xl font-bold text-primary-600">
              {getCurrencySymbol(currency)}{trip.price}
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
              <Users className="w-4 h-4" />
              <span>{trip.seatsAvailable} {t('common.seatsAvailable')}</span>
            </div>
          </div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              to={`/booking/${trip.id}`} 
              className="btn-primary-modern flex items-center space-x-2 group-hover:shadow-lg"
              aria-label={t('common.bookNowForTrip', { from: trip.from, to: trip.to, time: trip.departureTime})}
            >
              <span>{t('common.bookNow')}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-secondary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </motion.div>
  );
};

export default BusCard;
