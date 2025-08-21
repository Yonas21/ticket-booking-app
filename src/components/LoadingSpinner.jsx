import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, Bus, MapPin, Calendar, CreditCard } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const LoadingSpinner = ({ 
  size = 'md', 
  type = 'spinner', 
  text, 
  showIcon = false,
  fullScreen = false 
}) => {
  const { t } = useTranslation();

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const iconSize = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-10 h-10'
  };

  const getLoadingText = () => {
    if (text) return text;
    
    switch (type) {
      case 'search':
        return t('common.searchingForTrips');
      case 'booking':
        return t('common.processingBooking');
      case 'payment':
        return t('common.processingPayment');
      case 'map':
        return t('common.loadingMap');
      default:
        return t('common.loading');
    }
  };

  const getLoadingIcon = () => {
    if (!showIcon) return null;
    
    switch (type) {
      case 'search':
        return <Bus className={`${iconSize[size]} text-primary-600 dark:text-primary-400`} />;
      case 'booking':
        return <Calendar className={`${iconSize[size]} text-primary-600 dark:text-primary-400`} />;
      case 'payment':
        return <CreditCard className={`${iconSize[size]} text-primary-600 dark:text-primary-400`} />;
      case 'map':
        return <MapPin className={`${iconSize[size]} text-primary-600 dark:text-primary-400`} />;
      default:
        return <Bus className={`${iconSize[size]} text-primary-600 dark:text-primary-400`} />;
    }
  };

  const SpinnerComponent = () => (
    <div className="flex flex-col items-center justify-center space-y-4">
      {getLoadingIcon()}
      
      <div className="relative">
        <motion.div
          className={`${sizeClasses[size]} border-4 border-primary-200 border-t-primary-600 rounded-full`}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          role="status"
          aria-label={t('common.loading')}
        />
        <span className="sr-only">{t('common.loading')}</span>
      </div>
      
      {getLoadingText() && (
        <motion.p
          className="text-sm text-gray-600 dark:text-gray-300 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {getLoadingText()}
        </motion.p>
      )}
    </div>
  );

  const PulseComponent = () => (
    <div className="flex flex-col items-center justify-center space-y-4">
      {getLoadingIcon()}
      
      <div className="flex space-x-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={`${size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : 'w-4 h-4'} bg-primary-600 rounded-full`}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2
            }}
          />
        ))}
      </div>
      
      {getLoadingText() && (
        <motion.p
          className="text-sm text-gray-600 dark:text-gray-300 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {getLoadingText()}
        </motion.p>
      )}
    </div>
  );

  const SkeletonComponent = () => (
    <div className="animate-pulse space-y-4">
      <div className="flex items-center space-x-4">
        <div className={`${sizeClasses[size]} bg-gray-300 dark:bg-gray-600 rounded-full`}></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
          <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );

  const renderComponent = () => {
    switch (type) {
      case 'pulse':
        return <PulseComponent />;
      case 'skeleton':
        return <SkeletonComponent />;
      default:
        return <SpinnerComponent />;
    }
  };

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-gray-900 bg-opacity-90 dark:bg-opacity-90 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="card-modern p-8">
          {renderComponent()}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-4">
      {renderComponent()}
    </div>
  );
};

// Specific loading components for different use cases
export const SearchLoading = ({ size = 'md' }) => (
  <LoadingSpinner size={size} type="search" showIcon text={null} />
);

export const BookingLoading = ({ size = 'md' }) => (
  <LoadingSpinner size={size} type="booking" showIcon text={null} />
);

export const PaymentLoading = ({ size = 'md' }) => (
  <LoadingSpinner size={size} type="payment" showIcon text={null} />
);

export const MapLoading = ({ size = 'md' }) => (
  <LoadingSpinner size={size} type="map" showIcon text={null} />
);

export const FullScreenLoading = ({ type = 'spinner', text }) => (
  <LoadingSpinner type={type} text={text} fullScreen />
);

export default LoadingSpinner;
