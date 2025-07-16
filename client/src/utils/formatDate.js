/**
 * Date formatting utilities for the Developer Workflow Dashboard
 */

/**
 * Formats a date to a human-readable string
 * @param {Date|string} date - The date to format
 * @param {string} format - The format type ('short', 'long', 'time', 'relative')
 * @returns {string} Formatted date string
 */
export const formatDate = (date, format = 'short') => {
  if (!date) return 'N/A';
  
  const dateObj = new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date';
  }
  
  const now = new Date();
  const diff = now - dateObj;
  
  switch (format) {
    case 'short':
      return dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    
    case 'long':
      return dateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    
    case 'time':
      return dateObj.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    
    case 'datetime':
      return dateObj.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    
    case 'relative':
      return getRelativeTime(diff);
    
    case 'iso':
      return dateObj.toISOString();
    
    default:
      return dateObj.toLocaleDateString();
  }
};

/**
 * Returns relative time string (e.g., "2 hours ago", "in 3 days")
 */
const getRelativeTime = (diff) => {
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);
  
  if (Math.abs(years) >= 1) {
    return years === 1 ? '1 year ago' : `${years} years ago`;
  } else if (Math.abs(months) >= 1) {
    return months === 1 ? '1 month ago' : `${months} months ago`;
  } else if (Math.abs(weeks) >= 1) {
    return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
  } else if (Math.abs(days) >= 1) {
    return days === 1 ? '1 day ago' : `${days} days ago`;
  } else if (Math.abs(hours) >= 1) {
    return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
  } else if (Math.abs(minutes) >= 1) {
    return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
  } else {
    return 'Just now';
  }
};

/**
 * Checks if a date is today
 */
export const isToday = (date) => {
  const today = new Date();
  const checkDate = new Date(date);
  return checkDate.toDateString() === today.toDateString();
};

/**
 * Checks if a date is this week
 */
export const isThisWeek = (date) => {
  const today = new Date();
  const checkDate = new Date(date);
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  return checkDate >= weekAgo && checkDate <= today;
};

/**
 * Gets the start and end of the current week
 */
export const getCurrentWeekRange = () => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const startOfWeek = new Date(today.getTime() - dayOfWeek * 24 * 60 * 60 * 1000);
  const endOfWeek = new Date(startOfWeek.getTime() + 6 * 24 * 60 * 60 * 1000);
  
  return { startOfWeek, endOfWeek };
};