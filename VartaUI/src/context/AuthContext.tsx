import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../api/types';
import { getCurrentUser, login as apiLogin, register as apiRegister, logout as apiLogout } from '../api/auth';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, chosenTopics?: string[]) => Promise<void>;
  logout: () => Promise<void>;
  isAuthModalOpen: boolean;
  authModalPrompt: string;
  openAuthModal: (prompt?: string) => void;
  closeAuthModal: () => void;
  positivityStreak: number;
  chosenTopics: string[];
  setChosenTopics: (topics: string[]) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => getCurrentUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalPrompt, setAuthModalPrompt] = useState('');
  
  // Streak tracking
  const [positivityStreak, setPositivityStreak] = useState<number>(() => {
    const saved = localStorage.getItem('khushkhabar_streak');
    return saved ? parseInt(saved, 10) : 3; // default encouraging 3-day streak
  });

  // User's chosen positive topics
  const [chosenTopics, setChosenTopicsState] = useState<string[]>(() => {
    const saved = localStorage.getItem('khushkhabar_topics');
    return saved ? JSON.parse(saved) : ['climate', 'science', 'kindness'];
  });

  useEffect(() => {
    setCurrentUser(getCurrentUser());
  }, []);

  const setChosenTopics = (topics: string[]) => {
    setChosenTopicsState(topics);
    localStorage.setItem('khushkhabar_topics', JSON.stringify(topics));
  };

  const login = async (email: string, password: string) => {
    const res = await apiLogin(email, password);
    setCurrentUser(res.user);
    setIsAuthModalOpen(false);
    // Increment streak on active login
    setPositivityStreak((prev) => {
      const next = prev + 1;
      localStorage.setItem('khushkhabar_streak', next.toString());
      return next;
    });
  };

  const register = async (name: string, email: string, password: string, topics?: string[]) => {
    const res = await apiRegister(name, email, password);
    setCurrentUser(res.user);
    if (topics && topics.length > 0) {
      setChosenTopics(topics);
    }
    setIsAuthModalOpen(false);
    // Award first streak day
    setPositivityStreak(1);
    localStorage.setItem('khushkhabar_streak', '1');
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
        positivityStreak,
        chosenTopics,
        setChosenTopics,
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
