import React, { createContext, useContext } from 'react';
import axios from 'axios';
import { useUserStore } from '../store/userStore';
import { API_URL } from '../config/api';

interface AuthContextType {
  login: (email: string, password?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  login: async () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { setUser } = useUserStore();

  const login = async (email: string, password?: string) => {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    setUser(response.data);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
