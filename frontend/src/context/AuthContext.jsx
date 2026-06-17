import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const register = async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      await api.post('/api/auth/register', { name, email, password });
      setLoading(false);
      return true;
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data || 'Registration failed';
      setError(typeof msg === 'object' ? Object.values(msg).join(', ') : msg);
      setLoading(false);
      throw err;
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/api/auth/login', { email, password });
      const userData = response.data;
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setLoading(false);
      return userData;
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data || 'Invalid credentials';
      setError(typeof msg === 'object' ? Object.values(msg).join(', ') : msg);
      setLoading(false);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const isAdmin = user && user.role === 'ADMIN';

  return (
    <AuthContext.Provider value={{ user, loading, error, register, login, logout, isAdmin, setError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
