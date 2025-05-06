'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getAuthToken,
  setAuthToken,
  setUserRole,
  clearAuth as clearAuthUtils,
} from '@/utils/auth';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  // eslint-disable-next-line no-unused-vars
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing auth data
    const storedUser = localStorage.getItem('user');
    const storedToken = getAuthToken();

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, []);

  const setAuth = (userData: User, authToken: string) => {
    setUser(userData);
    setToken(authToken);

    // Store user data in localStorage
    localStorage.setItem('user', JSON.stringify(userData));

    // Use utility functions to set token and role in both localStorage and cookies
    setAuthToken(authToken);
    setUserRole(userData.role);
  };

  const clearAuth = () => {
    setUser(null);
    setToken(null);

    // Use utility function to clear auth data
    clearAuthUtils();
  };

  return (
    <AuthContext.Provider value={{ user, token, setAuth, clearAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
