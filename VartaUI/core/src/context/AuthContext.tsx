import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../api/types';
import { getCurrentUser, login as apiLogin, register as apiRegister, logout as apiLogout } from '../api/auth';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthModalOpen: boolean;
  authModalPrompt: string;
  openAuthModal: (prompt?: string) => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => getCurrentUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalPrompt, setAuthModalPrompt] = useState('');

  useEffect(() => {
    setCurrentUser(getCurrentUser());
  }, []);

  const login = async (email: string, password: string) => {
    const res = await apiLogin(email, password);
    setCurrentUser(res.user);
    setIsAuthModalOpen(false);
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await apiRegister(name, email, password);
    setCurrentUser(res.user);
    setIsAuthModalOpen(false);
  };

  const logout = async () => {
    await apiLogout();
    setCurrentUser(null);
  };

  const openAuthModal = (prompt?: string) => {
    setAuthModalPrompt(prompt || '');
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setAuthModalPrompt('');
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        login,
        register,
        logout,
        isAuthModalOpen,
        authModalPrompt,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

