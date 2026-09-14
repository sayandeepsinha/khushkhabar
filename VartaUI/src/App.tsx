import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { ArticleDetailPage } from './pages/ArticleDetailPage';
import { SettingsPage } from './pages/SettingsPage';
import { StandardsPage } from './pages/StandardsPage';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthModal } from './components/auth/AuthModal';
import './App.css';

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Main Home Dashboard */}
            <Route path="/" element={<HomePage />} />

            {/* Dedicated Article Detail Page */}
            <Route path="/article/:id" element={<ArticleDetailPage />} />

            {/* Authentication: Sign In & Register */}
            <Route path="/login" element={<LoginPage />} />

            {/* User Preferences & Account Hub */}
            <Route path="/preferences" element={<SettingsPage defaultTab="preferences" />} />
            <Route path="/settings" element={<SettingsPage defaultTab="preferences" />} />

            {/* Account Deletion / Danger Zone */}
            <Route path="/delete-account" element={<SettingsPage defaultTab="delete-account" />} />

            {/* Journalistic Standards & Editorial Guidelines */}
            <Route path="/standards" element={<StandardsPage />} />

            {/* Fallback Catch-all Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <AuthModal />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
