/**
 * Currency utilities for the ticket booking app
 */

// Exchange rates (USD as base currency)
// These rates should ideally come from a real-time API in production
const EXCHANGE_RATES = {
  'USD': 1.00,
  'EUR': 0.92,
  'GBP': 0.79,
  'ETB': 140.50,
  'NGN': 1500.00, // Nigerian Naira
  'KES': 150.00,  // Kenyan Shilling
  'GHS': 12.50,   // Ghanaian Cedi
  'ZAR': 18.50,   // South African Rand
  'EGP': 31.00,   // Egyptian Pound
  'MAD': 10.20,   // Moroccan Dirham
  'TND': 3.15,    // Tunisian Dinar
  'DZD': 135.00,  // Algerian Dinar
  'LYD': 4.85,    // Libyan Dinar
  'SDG': 600.00,  // Sudanese Pound
  'SOS': 570.00,  // Somali Shilling
  'DJF': 177.00,  // Djiboutian Franc
  'ERN': 15.00,   // Eritrean Nakfa
  'SLL': 22000.00, // Sierra Leonean Leone
  'GMD': 65.00,   // Gambian Dalasi
  'GNF': 8600.00, // Guinean Franc
};

// Currency symbols and formatting options
const CURRENCY_CONFIG = {
  'USD': {
    symbol: '$',
    position: 'before',
    decimalPlaces: 2,
    thousandsSeparator: ',',
    decimalSeparator: '.',
    name: 'US Dollar'
  },
  'EUR': {
    symbol: '€',
    position: 'before',
    decimalPlaces: 2,
    thousandsSeparator: '.',
    decimalSeparator: ',',
    name: 'Euro'
  },
  'GBP': {
    symbol: '£',
    position: 'before',
    decimalPlaces: 2,
    thousandsSeparator: ',',
    decimalSeparator: '.',
    name: 'British Pound'
  },
  'ETB': {
    symbol: 'ብር',
    position: 'after',
    decimalPlaces: 2,
    thousandsSeparator: ',',
    decimalSeparator: '.',
    name: 'Ethiopian Birr'
  },
  'NGN': {
    symbol: '₦',
    position: 'before',
    decimalPlaces: 2,
    thousandsSeparator: ',',
    decimalSeparator: '.',
    name: 'Nigerian Naira'
  },
  'KES': {
    symbol: 'KSh',
    position: 'before',
    decimalPlaces: 2,
    thousandsSeparator: ',',
    decimalSeparator: '.',
    name: 'Kenyan Shilling'
  },
  'GHS': {
    symbol: '₵',
    position: 'before',
    decimalPlaces: 2,
    thousandsSeparator: ',',
    decimalSeparator: '.',
    name: 'Ghanaian Cedi'
  },
  'ZAR': {
    symbol: 'R',
    position: 'before',
    decimalPlaces: 2,
    thousandsSeparator: ' ',
    decimalSeparator: '.',
    name: 'South African Rand'
  },
  'EGP': {
    symbol: 'E£',
    position: 'before',
    decimalPlaces: 2,
    thousandsSeparator: ',',
    decimalSeparator: '.',
    name: 'Egyptian Pound'
  },
  'MAD': {
    symbol: 'MAD',
    position: 'after',
    decimalPlaces: 2,
    thousandsSeparator: ' ',
    decimalSeparator: '.',
    name: 'Moroccan Dirham'
  },
  'TND': {
    symbol: 'TND',
    position: 'after',
    decimalPlaces: 3,
    thousandsSeparator: ' ',
    decimalSeparator: '.',
    name: 'Tunisian Dinar'
  },
  'DZD': {
    symbol: 'DZD',
    position: 'after',
    decimalPlaces: 2,
    thousandsSeparator: ' ',
    decimalSeparator: '.',
    name: 'Algerian Dinar'
  },
  'LYD': {
    symbol: 'LYD',
    position: 'after',
    decimalPlaces: 3,
    thousandsSeparator: ' ',
    decimalSeparator: '.',
    name: 'Libyan Dinar'
  },
  'SDG': {
    symbol: 'SDG',
    position: 'after',
    decimalPlaces: 2,
    thousandsSeparator: ' ',
    decimalSeparator: '.',
    name: 'Sudanese Pound'
  },
  'SOS': {
    symbol: 'SOS',
    position: 'after',
    decimalPlaces: 2,
    thousandsSeparator: ' ',
    decimalSeparator: '.',
    name: 'Somali Shilling'
  },
  'DJF': {
    symbol: 'DJF',
    position: 'after',
    decimalPlaces: 0,
    thousandsSeparator: ' ',
    decimalSeparator: '.',
    name: 'Djiboutian Franc'
  },
  'ERN': {
    symbol: 'ERN',
    position: 'after',
    decimalPlaces: 2,
    thousandsSeparator: ' ',
    decimalSeparator: '.',
    name: 'Eritrean Nakfa'
  },
  'SLL': {
    symbol: 'SLL',
    position: 'after',
    decimalPlaces: 2,
    thousandsSeparator: ' ',
    decimalSeparator: '.',
    name: 'Sierra Leonean Leone'
  },
  'GMD': {
    symbol: 'GMD',
    position: 'after',
    decimalPlaces: 2,
    thousandsSeparator: ' ',
    decimalSeparator: '.',
    name: 'Gambian Dalasi'
  },
  'GNF': {
    symbol: 'GNF',
    position: 'after',
    decimalPlaces: 0,
    thousandsSeparator: ' ',
    decimalSeparator: '.',
    name: 'Guinean Franc'
  }
};

/**
 * Get currency symbol for a given currency code
 * @param {string} currencyCode - Currency code (e.g., 'USD', 'EUR', 'ETB')
 * @returns {string} Currency symbol
 */
export const getCurrencySymbol = (currencyCode) => {
  const config = CURRENCY_CONFIG[currencyCode];
  return config ? config.symbol : currencyCode;
};

/**
 * Get currency configuration for a given currency code
 * @param {string} currencyCode - Currency code
 * @returns {object} Currency configuration object
 */
export const getCurrencyConfig = (currencyCode) => {
  return CURRENCY_CONFIG[currencyCode] || CURRENCY_CONFIG['USD'];
};

/**
 * Convert price from one currency to another
 * @param {number} amount - Amount to convert
 * @param {string} fromCurrency - Source currency code
 * @param {string} toCurrency - Target currency code
 * @returns {number} Converted amount
 */
export const convertCurrency = (amount, fromCurrency, toCurrency) => {
  if (!amount || isNaN(amount)) return 0;
  
  const fromRate = EXCHANGE_RATES[fromCurrency] || 1;
  const toRate = EXCHANGE_RATES[toCurrency] || 1;
  
  // Convert to USD first, then to target currency
  const usdAmount = amount / fromRate;
  return usdAmount * toRate;
};

/**
 * Format a number as currency
 * @param {number} amount - Amount to format
 * @param {string} currencyCode - Currency code
 * @param {object} options - Formatting options
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currencyCode = 'USD', options = {}) => {
  if (!amount || isNaN(amount)) return '0';
  
  const config = getCurrencyConfig(currencyCode);
  const {
    showSymbol = true,
    showCode = false,
    decimalPlaces = config.decimalPlaces,
    thousandsSeparator = config.thousandsSeparator,
    decimalSeparator = config.decimalSeparator
  } = options;

  // Format the number
  const formattedNumber = formatNumber(amount, {
    decimalPlaces,
    thousandsSeparator,
    decimalSeparator
  });

  // Add currency symbol/code
  let result = formattedNumber;
  
  if (showSymbol) {
    if (config.position === 'before') {
      result = `${config.symbol}${result}`;
    } else {
      result = `${result} ${config.symbol}`;
    }
  }
  
  if (showCode) {
    result = `${result} ${currencyCode}`;
  }

  return result;
};

/**
 * Format a number with custom separators
 * @param {number} number - Number to format
 * @param {object} options - Formatting options
 * @returns {string} Formatted number string
 */
const formatNumber = (number, options = {}) => {
  const {
    decimalPlaces = 2,
    thousandsSeparator = ',',
    decimalSeparator = '.'
  } = options;

  // Convert to string with fixed decimal places
  const numStr = number.toFixed(decimalPlaces);
  
  // Split into integer and decimal parts
  const [integerPart, decimalPart] = numStr.split('.');
  
  // Add thousands separators to integer part
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator);
  
  // Combine with decimal part if it exists
  if (decimalPart && decimalPlaces > 0) {
    return `${formattedInteger}${decimalSeparator}${decimalPart}`;
  }
  
  return formattedInteger;
};

/**
 * Get all available currencies
 * @returns {Array} Array of currency objects with code, name, and symbol
 */
export const getAvailableCurrencies = () => {
  return Object.entries(CURRENCY_CONFIG).map(([code, config]) => ({
    code,
    name: config.name,
    symbol: config.symbol,
    position: config.position
  }));
};

/**
 * Get exchange rate between two currencies
 * @param {string} fromCurrency - Source currency code
 * @param {string} toCurrency - Target currency code
 * @returns {number} Exchange rate
 */
export const getExchangeRate = (fromCurrency, toCurrency) => {
  if (fromCurrency === toCurrency) return 1;
  
  const fromRate = EXCHANGE_RATES[fromCurrency] || 1;
  const toRate = EXCHANGE_RATES[toCurrency] || 1;
  
  return toRate / fromRate;
};

/**
 * Calculate total price with currency conversion
 * @param {number} basePrice - Base price in USD
 * @param {string} targetCurrency - Target currency code
 * @param {number} quantity - Quantity (default: 1)
 * @param {number} discount - Discount amount (default: 0)
 * @returns {object} Object with converted price and formatted string
 */
export const calculateTotalPrice = (basePrice, targetCurrency, quantity = 1, discount = 0) => {
  const convertedPrice = convertCurrency(basePrice, 'USD', targetCurrency);
  const totalBeforeDiscount = convertedPrice * quantity;
  const totalAfterDiscount = Math.max(0, totalBeforeDiscount - discount);
  
  return {
    originalPrice: basePrice,
    convertedPrice,
    totalBeforeDiscount,
    totalAfterDiscount,
    discount,
    quantity,
    formattedPrice: formatCurrency(totalAfterDiscount, targetCurrency)
  };
};

/**
 * Parse currency string back to number
 * @param {string} currencyString - Formatted currency string
 * @param {string} currencyCode - Currency code
 * @returns {number} Parsed number
 */
export const parseCurrency = (currencyString, currencyCode = 'USD') => {
  if (!currencyString) return 0;
  
  const config = getCurrencyConfig(currencyCode);
  
  // Remove currency symbol and code
  let cleaned = currencyString.replace(config.symbol, '').replace(currencyCode, '').trim();
  
  // Replace thousands separator
  cleaned = cleaned.replace(new RegExp(`\\${config.thousandsSeparator}`, 'g'), '');
  
  // Replace decimal separator with standard decimal point
  cleaned = cleaned.replace(config.decimalSeparator, '.');
  
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Get currency display name
 * @param {string} currencyCode - Currency code
 * @returns {string} Currency display name
 */
export const getCurrencyName = (currencyCode) => {
  const config = CURRENCY_CONFIG[currencyCode];
  return config ? config.name : currencyCode;
};

/**
 * Validate currency code
 * @param {string} currencyCode - Currency code to validate
 * @returns {boolean} True if valid currency code
 */
export const isValidCurrency = (currencyCode) => {
  return currencyCode in CURRENCY_CONFIG;
};

/**
 * Get default currency for a region
 * @param {string} region - Region code (e.g., 'US', 'EU', 'ET')
 * @returns {string} Default currency code
 */
export const getDefaultCurrencyForRegion = (region) => {
  const regionCurrencies = {
    'US': 'USD',
    'EU': 'EUR',
    'GB': 'GBP',
    'ET': 'ETB',
    'NG': 'NGN',
    'KE': 'KES',
    'GH': 'GHS',
    'ZA': 'ZAR',
    'EG': 'EGP',
    'MA': 'MAD',
    'TN': 'TND',
    'DZ': 'DZD',
    'LY': 'LYD',
    'SD': 'SDG',
    'SO': 'SOS',
    'DJ': 'DJF',
    'ER': 'ERN',
    'SL': 'SLL',
    'GM': 'GMD',
    'GN': 'GNF'
  };
  
  return regionCurrencies[region] || 'USD';
};
