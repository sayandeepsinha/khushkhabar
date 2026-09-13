import React, { useState, useEffect } from 'react';
import { Sparkles, X, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const BANNER_DISMISSED_KEY = 'varta_banner_dismissed';

export const SignInBanner: React.FC = () => {
  const { currentUser, openAuthModal } = useAuth();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Never show if the user is already signed in
    if (currentUser) {
      setVisible(false);
      return;
    }

    // Check if dismissed during this page load session
    const isDismissed = sessionStorage.getItem(BANNER_DISMISSED_KEY);
    if (!isDismissed) {
      // Gentle delayed slide-up so user isn't immediately startled
      const timer = setTimeout(() => {
        setVisible(true);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [currentUser]);

  const handleDismiss = () => {
    setVisible(false);
    sessionStorage.setItem(BANNER_DISMISSED_KEY, 'true');
  };

  const handleSignInClick = () => {
    openAuthModal();
  };

  if (!visible || currentUser) return null;

  return (
    <aside
      aria-label="Sign in banner"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-40 bg-[#1E293B] text-white rounded-2xl shadow-2xl border border-slate-700/60 p-4 animate-in slide-in-from-bottom-6 duration-300 backdrop-blur-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              Experience the Full Varta
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Sign in to save bookmarks, tune your positivity threshold, and receive personalized uplifting breakthroughs.
            </p>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors shrink-0"
          aria-label="Dismiss banner"
          title="Don't show again until next refresh"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-3.5 pt-3 border-t border-slate-700/60 flex items-center justify-between gap-2">
        <button
          onClick={handleDismiss}
          className="text-xs text-slate-400 hover:text-slate-200 transition-colors px-2 py-1.5"
        >
          Continue as guest
        </button>
        <button
          onClick={handleSignInClick}
          className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold shadow-xs transition-colors"
        >
          <span>Sign In</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};

