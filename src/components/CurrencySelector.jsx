import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Globe } from 'lucide-react';
import useAuthStore from '../store/authStore';
import { getAvailableCurrencies, getCurrencyName } from '../utils/currencyUtils';

const CurrencySelector = ({ className = '', showLabel = true }) => {
  const { currency, setCurrency } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  const currencies = getAvailableCurrencies();

  const handleCurrencyChange = (newCurrency) => {
    setCurrency(newCurrency);
    setIsOpen(false);
  };

  const currentCurrency = currencies.find(c => c.code === currency);

  return (
    <div className={`relative ${className}`}>
      {showLabel && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('common.currency')}
        </label>
      )}
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
      >
        <div className="flex items-center space-x-2">
          <Globe size={16} className="text-gray-500" />
          <span className="font-medium">{currentCurrency?.symbol}</span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {currentCurrency?.code}
          </span>
        </div>
        <ChevronDown 
          size={16} 
          className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {currencies.map((curr) => (
            <button
              key={curr.code}
              onClick={() => handleCurrencyChange(curr.code)}
              className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors ${
                currency === curr.code 
                  ? 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300' 
                  : 'text-gray-900 dark:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="font-medium">{curr.symbol}</span>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{curr.code}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {getCurrencyName(curr.code)}
                  </span>
                </div>
              </div>
              {currency === curr.code && (
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CurrencySelector;
