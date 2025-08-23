/**
 * Date formatting utilities for the ticket booking app
 */

/**
 * Format a date string to a readable format
 * @param {string} dateString - Date string from API or database
 * @param {string} format - Format type: 'full', 'short', 'day', 'time', 'datetime'
 * @param {string} locale - Locale for formatting (default: 'en-US')
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString, format = 'full', locale = 'en-US') => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.warn('Invalid date string:', dateString);
      return dateString;
    }

    switch (format) {
      case 'full':
        return date.toLocaleDateString(locale, {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      
      case 'short':
        return date.toLocaleDateString(locale, {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      
      case 'day':
        return date.toLocaleDateString(locale, {
          weekday: 'long',
          month: 'long',
          day: 'numeric'
        });
      
      case 'date':
        return date.toLocaleDateString(locale, {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        });
      
      case 'time':
        return date.toLocaleTimeString(locale, {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
      
      case 'datetime':
        return date.toLocaleString(locale, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
      
      default:
        return date.toLocaleDateString(locale);
    }
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

/**
 * Format time string from API (HH:MM:SS) to readable format
 * @param {string} timeString - Time string from API (e.g., "08:00:00")
 * @param {string} locale - Locale for formatting (default: 'en-US')
 * @returns {string} Formatted time string
 */
export const formatTime = (timeString, locale = 'en-US') => {
  if (!timeString) return '';
  
  try {
    // Handle different time formats
    let time;
    if (timeString.includes('T')) {
      // ISO format like "0000-01-01T08:00:00Z"
      time = new Date(`2000-01-01T${timeString.split('T')[1]}`);
    } else if (timeString.includes(':')) {
      // Simple time format like "08:00:00" or "08:00"
      const [hours, minutes] = timeString.split(':');
      time = new Date(2000, 0, 1, parseInt(hours), parseInt(minutes));
    } else {
      return timeString;
    }
    
    return time.toLocaleTimeString(locale, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch (error) {
    console.error('Error formatting time:', error);
    return timeString;
  }
};

/**
 * Format date and time together
 * @param {string} dateString - Date string from API
 * @param {string} timeString - Time string from API
 * @param {string} locale - Locale for formatting (default: 'en-US')
 * @returns {string} Formatted date and time string
 */
export const formatDateTime = (dateString, timeString, locale = 'en-US') => {
  const formattedDate = formatDate(dateString, 'day', locale);
  const formattedTime = formatTime(timeString, locale);
  return `${formattedDate} at ${formattedTime}`;
};

/**
 * Check if a date is today
 * @param {string} dateString - Date string to check
 * @returns {boolean} True if date is today
 */
export const isToday = (dateString) => {
  if (!dateString) return false;
  
  try {
    const date = new Date(dateString);
    const today = new Date();
    return date.toDateString() === today.toDateString();
  } catch (error) {
    return false;
  }
};

/**
 * Check if a date is in the future
 * @param {string} dateString - Date string to check
 * @returns {boolean} True if date is in the future
 */
export const isFuture = (dateString) => {
  if (!dateString) return false;
  
  try {
    const date = new Date(dateString);
    const today = new Date();
    return date > today;
  } catch (error) {
    return false;
  }
};

/**
 * Get relative time string (e.g., "2 days ago", "in 3 hours")
 * @param {string} dateString - Date string to format
 * @param {string} locale - Locale for formatting (default: 'en-US')
 * @returns {string} Relative time string
 */
export const getRelativeTime = (dateString, locale = 'en-US') => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = date.getTime() - now.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    
    if (diffInDays > 0) {
      return diffInDays === 1 ? 'tomorrow' : `in ${diffInDays} days`;
    } else if (diffInDays < 0) {
      return Math.abs(diffInDays) === 1 ? 'yesterday' : `${Math.abs(diffInDays)} days ago`;
    } else if (diffInHours > 0) {
      return diffInHours === 1 ? 'in 1 hour' : `in ${diffInHours} hours`;
    } else if (diffInHours < 0) {
      return Math.abs(diffInHours) === 1 ? '1 hour ago' : `${Math.abs(diffInHours)} hours ago`;
    } else {
      return 'today';
    }
  } catch (error) {
    console.error('Error getting relative time:', error);
    return '';
  }
};

/**
 * Format trip date for display in search results
 * @param {string} dateString - Date string from API
 * @param {string} locale - Locale for formatting (default: 'en-US')
 * @returns {string} Formatted trip date
 */
export const formatTripDate = (dateString, locale = 'en-US') => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return formatDate(dateString, 'day', locale);
    }
  } catch (error) {
    console.error('Error formatting trip date:', error);
    return formatDate(dateString, 'short', locale);
  }
};

/**
 * Format booking date for profile page
 * @param {string} dateString - Date string from API
 * @param {string} locale - Locale for formatting (default: 'en-US')
 * @returns {string} Formatted booking date
 */
export const formatBookingDate = (dateString, locale = 'en-US') => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    const today = new Date();
    const diffInDays = Math.floor((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return 'Today';
    } else if (diffInDays === 1) {
      return 'Tomorrow';
    } else if (diffInDays > 1 && diffInDays <= 7) {
      return formatDate(dateString, 'day', locale);
    } else {
      return formatDate(dateString, 'short', locale);
    }
  } catch (error) {
    console.error('Error formatting booking date:', error);
    return formatDate(dateString, 'short', locale);
  }
};
