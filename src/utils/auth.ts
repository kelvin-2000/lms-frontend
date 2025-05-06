/**
 * Authentication utilities for working with tokens, cookies, and localStorage
 */

// Check if we're in a browser environment
const isBrowser = (): boolean => {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
};

// Get token from localStorage or cookies
export const getAuthToken = (): string | null => {
  if (!isBrowser()) {
    console.debug(
      'getAuthToken: Running in server context, no token available',
    );
    return null;
  }

  try {
    // First try localStorage
    const localToken = localStorage.getItem('token');
    if (localToken) {
      console.debug('getAuthToken: Found token in localStorage');
      return localToken;
    }

    // If not in localStorage, try cookies
    const cookieToken = getCookie('token');
    console.debug('getAuthToken: Cookie token value:', cookieToken);
    return cookieToken;
  } catch (error) {
    console.error('Error accessing auth token:', error);
    return null;
  }
};

// Get user role from localStorage or cookies
export const getUserRole = (): string | null => {
  if (!isBrowser()) {
    return null;
  }

  try {
    // First try localStorage
    const localRole = localStorage.getItem('userRole');
    if (localRole) return localRole;

    // If not in localStorage, try cookies
    return getCookie('userRole');
  } catch (error) {
    console.error('Error accessing user role:', error);
    return null;
  }
};

// Set token in both localStorage and cookies
export const setAuthToken = (token: string): void => {
  if (!isBrowser()) return;

  try {
    localStorage.setItem('token', token);
    setCookie('token', token);
  } catch (error) {
    console.error('Error setting auth token:', error);
  }
};

// Set user role in both localStorage and cookies
export const setUserRole = (role: string): void => {
  if (!isBrowser()) return;

  try {
    localStorage.setItem('userRole', role);
    setCookie('userRole', role);
  } catch (error) {
    console.error('Error setting user role:', error);
  }
};

// Clear auth data from both localStorage and cookies
export const clearAuth = (): void => {
  if (!isBrowser()) return;

  try {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('user');

    // Clear cookies
    deleteCookie('token');
    deleteCookie('userRole');
  } catch (error) {
    console.error('Error clearing auth data:', error);
  }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

// Check if user is admin
export const isAdmin = (): boolean => {
  const role = getUserRole();
  return role === 'admin';
};

// Helper function to get a cookie value
export const getCookie = (name: string): string | null => {
  if (typeof window === 'undefined') return null;

  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
};

// Helper function to set a cookie
export const setCookie = (name: string, value: string, days = 7): void => {
  if (typeof window === 'undefined') return;

  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
};

// Helper function to delete a cookie
export const deleteCookie = (name: string): void => {
  if (typeof window === 'undefined') return;

  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
};
