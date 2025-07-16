/**
 * Local storage utilities for the Developer Workflow Dashboard
 */

export const getStorageItem = (key, defaultValue = null) => {
  try {
    if (typeof window === 'undefined') return defaultValue;

    const item = window.localStorage.getItem(key);
    if (item === null) return defaultValue;

    try {
      return JSON.parse(item);
    } catch {
      return item;
    }
  } catch (error) {
    console.error(`Error getting storage item "${key}":`, error);
    return defaultValue;
  }
};

export const setStorageItem = (key, value) => {
  try {
    if (typeof window === 'undefined') return false;

    const serializedValue = typeof value === 'string' ? value : JSON.stringify(value);
    window.localStorage.setItem(key, serializedValue);
    return true;
  } catch (error) {
    console.error(`Error setting storage item "${key}":`, error);
    return false;
  }
};

export const removeStorageItem = (key) => {
  try {
    if (typeof window === 'undefined') return false;

    window.localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing storage item "${key}":`, error);
    return false;
  }
};

export const clearStorage = () => {
  try {
    if (typeof window === 'undefined') return false;

    window.localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing storage:', error);
    return false;
  }
};

export const isStorageAvailable = () => {
  try {
    if (typeof window === 'undefined') return false;

    const test = '__storage_test__';
    window.localStorage.setItem(test, 'test');
    window.localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};

export const getStorageSize = () => {
  try {
    if (typeof window === 'undefined') return 0;

    let total = 0;
    for (let key in window.localStorage) {
      if (window.localStorage.hasOwnProperty(key)) {
        total += window.localStorage[key].length + key.length;
      }
    }
    return total;
  } catch (error) {
    console.error('Error calculating storage size:', error);
    return 0;
  }
};

export const getStorageKeys = () => {
  try {
    if (typeof window === 'undefined') return [];

    return Object.keys(window.localStorage);
  } catch (error) {
    console.error('Error getting storage keys:', error);
    return [];
  }
};

export const hasStorageItem = (key) => {
  try {
    if (typeof window === 'undefined') return false;

    return window.localStorage.getItem(key) !== null;
  } catch (error) {
    console.error(`Error checking storage item "${key}":`, error);
    return false;
  }
};

export const setStorageItemWithExpiry = (key, value, ttl) => {
  try {
    const now = new Date().getTime();
    const item = {
      value,
      expiry: now + ttl
    };
    return setStorageItem(key, item);
  } catch (error) {
    console.error(`Error setting storage item with expiry "${key}":`, error);
    return false;
  }
};

export const getStorageItemWithExpiry = (key, defaultValue = null) => {
  try {
    const item = getStorageItem(key);
    if (!item) return defaultValue;

    const now = new Date().getTime();
    if (now > item.expiry) {
      removeStorageItem(key);
      return defaultValue;
    }

    return item.value;
  } catch (error) {
    console.error(`Error getting storage item with expiry "${key}":`, error);
    return defaultValue;
  }
};

export const batchStorageOperations = {
  setItems: (items) => {
    try {
      Object.entries(items).forEach(([key, value]) => {
        setStorageItem(key, value);
      });
      return true;
    } catch (error) {
      console.error('Error in batch set operations:', error);
      return false;
    }
  },

  getItems: (keys) => {
    try {
      const result = {};
      keys.forEach(key => {
        result[key] = getStorageItem(key);
      });
      return result;
    } catch (error) {
      console.error('Error in batch get operations:', error);
      return {};
    }
  },

  removeItems: (keys) => {
    try {
      keys.forEach(key => {
        removeStorageItem(key);
      });
      return true;
    } catch (error) {
      console.error('Error in batch remove operations:', error);
      return false;
    }
  }
};

// ✅ Grouped export for compatibility with `import { storage } from ...`
export const storage = {
  get: getStorageItem,
  set: setStorageItem,
  remove: removeStorageItem,
  clear: clearStorage,
  has: hasStorageItem,
  getWithExpiry: getStorageItemWithExpiry,
  setWithExpiry: setStorageItemWithExpiry,
  isAvailable: isStorageAvailable,
  getSize: getStorageSize,
  getKeys: getStorageKeys,
  batch: batchStorageOperations,
};
