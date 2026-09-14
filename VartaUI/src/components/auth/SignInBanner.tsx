import React, { useState, useEffect } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const BANNER_DISMISSED_KEY = 'varta_banner_dismissed';

export const SignInBanner: React.FC = () => {
  const { currentUser, openAuthModal } = useAuth();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Never show if the user is already signed in
    if (currentUser) {
      return;
    }

    // Check if dismissed during this page load session
    const isDismissed = sessionStorage.getItem(BANNER_DISMISSED_KEY);
    if (!isDismissed) {
      // Gentle delayed slide-up so user isn't immediately startled
      const timer = setTimeout(() => {
        setVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [currentUser]);

  const handleDismiss = () => {
    setVisible(false);
    sessionStorage.setItem(BANNER_DISMISSED_KEY, 'true');
  };

  const handleSignInClick = () => {
    openAuthModal('Sign in to access your personal reading list, custom topic filters, and reading habits.');
  };

  if (!visible || currentUser) return null;

  return (
    <aside
      aria-label="Sign in banner"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-sm z-40 bg-[#0F172A] text-white rounded-xl shadow-2xl border border-amber-400/30 p-4 animate-in slide-in-from-bottom-4 duration-200"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 mt-0.5 shadow-xs">
            <img
              src="/varta-icon-dark.svg"
              alt="Varta"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              Experience the Full Varta Journal
            </h3>
            <p className="text-xs text-slate-300 mt-0.5 leading-relaxed font-sans-body">
              Save stories to your reading list and receive personalized constructive briefings.
            </p>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="p-1 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
          aria-label="Dismiss banner"
          title="Dismiss until next session"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between gap-2">
        <button
          onClick={handleDismiss}
          className="text-xs text-slate-400 hover:text-slate-200 transition-colors px-1 cursor-pointer"
        >
          Browse as guest
        </button>
        <button
          onClick={handleSignInClick}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-xs transition-colors cursor-pointer"
        >
          <span>Sign In</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </aside>
  );
};
