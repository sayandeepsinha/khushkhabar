import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { SettingsPage } from './pages/SettingsPage';
import { AuthProvider } from './context/AuthContext';
import { AuthModal } from './components/auth/AuthModal';
import './App.css';

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Main Home Dashboard */}
          <Route path="/" element={<HomePage />} />

          {/* Authentication: Sign In & Register */}
          <Route path="/login" element={<LoginPage />} />

          {/* User Preferences & Account Hub */}
          <Route path="/preferences" element={<SettingsPage defaultTab="preferences" />} />
          <Route path="/settings" element={<SettingsPage defaultTab="preferences" />} />

          {/* Account Deletion / Danger Zone */}
          <Route path="/delete-account" element={<SettingsPage defaultTab="delete-account" />} />

          {/* Fallback Catch-all Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <AuthModal />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
