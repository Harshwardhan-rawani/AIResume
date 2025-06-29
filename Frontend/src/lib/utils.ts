import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Authentication utilities
export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

export const isTokenValid = (): boolean => {
  const token = getAuthToken();
  if (!token) return false;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp > currentTime;
  } catch (error) {
    localStorage.removeItem('authToken');
    return false;
  }
};

export const logout = (): void => {
  // Clear all authentication data
  localStorage.removeItem('authToken');
  localStorage.removeItem('userName');
  localStorage.removeItem('selectedTemplateIndex');
  
  // Clear any other user-related data
  localStorage.removeItem('userProfile');
  localStorage.removeItem('userResumes');
  
  // Dispatch logout event for components to clean up their state
  window.dispatchEvent(new CustomEvent('userLogout'));
  
  // Don't use window.location.href as it causes page reloads
  // Components should handle navigation using React Router
};

// API call utility with authentication
export const apiCall = async (url: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    logout();
    throw new Error('Unauthorized');
  }

  return response;
};
