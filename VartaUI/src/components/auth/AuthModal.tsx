import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, authModalPrompt, login, register } = useAuth();
  const { isDark } = useTheme();
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (isSignUp && !cleanName) {
      setError('Please enter your full name.');
      return;
    }

    if (!cleanEmail) {
      setError('Please enter your email address.');
      return;
    }

    if (!cleanPassword) {
      setError('Please enter your password.');
      return;
    }

    if (isSignUp && cleanPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        await register(cleanName, cleanEmail, cleanPassword, ['climate', 'science', 'community']);
      } else {
        await login(cleanEmail, cleanPassword);
      }
      closeAuthModal();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication failed. Please verify credentials.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
      {/* 2-Column Split Modal Card */}
      <div 
        className="relative w-full max-w-2xl bg-[#FFFDF9] dark:bg-[#16202B] rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 border border-[#EAE5DC] dark:border-[#2A3848] animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 z-20 p-1.5 rounded-full text-slate-500 dark:text-slate-400 md:text-white hover:bg-black/10 md:hover:bg-white/20 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Form Canvas */}
        <div className="p-8 sm:p-10 flex flex-col justify-between bg-[#FFFDF9] dark:bg-[#16202B]">
          <div>
            {/* Varta Brand Mark */}
            <div className="flex items-center space-x-2.5 mb-6">
              <img
                src={isDark ? '/varta-icon-dark.svg' : '/varta-icon-light.svg'}
                alt="Varta"
                className="w-6 h-6 object-contain rounded-xs shadow-2xs"
              />
              <span className="font-serif-editorial text-xl font-bold tracking-tight text-slate-900 dark:text-[#FDF9F2]">
                Varta
              </span>
            </div>

            {/* Headline */}
            <h2 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white leading-tight mb-1">
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 font-sans">
              {isSignUp ? 'Join readers cultivating hope and evidence.' : 'Sign in to pick up where you left off.'}
            </p>

            {/* Context Prompt if Triggered */}
            {authModalPrompt && (
              <div className="mb-4 p-2.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-700/60 text-xs text-amber-900 dark:text-amber-200 font-medium flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>{authModalPrompt}</span>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-700 text-xs text-rose-800 dark:text-rose-200">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 lowercase mb-1">
                    full name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Prince Sharma"
                    className="w-full px-3.5 py-2 bg-white dark:bg-[#1E293B] border border-[#E2DDD5] dark:border-[#2A3848] rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 lowercase mb-1">
                  email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="reader@varta.org"
                  className="w-full px-3.5 py-2 bg-white dark:bg-[#1E293B] border border-[#E2DDD5] dark:border-[#2A3848] rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 lowercase mb-1">
                  password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2 bg-white dark:bg-[#1E293B] border border-[#E2DDD5] dark:border-[#2A3848] rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {!isSignUp && (
                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center space-x-2 text-slate-600 dark:text-slate-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-[#E2DDD5] text-amber-600 focus:ring-0"
                    />
                    <span>remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => alert('Password reset link sent to your email.')}
                    className="font-bold text-[#1E3A5F] dark:text-amber-400 hover:underline cursor-pointer"
                  >
                    forgot password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-2.5 px-4 rounded-xl text-sm font-bold text-slate-900 bg-[#DF8235] hover:bg-[#C86F26] transition-colors shadow-xs cursor-pointer disabled:opacity-50 lowercase"
              >
                {loading ? 'signing in...' : isSignUp ? 'create account' : 'sign in'}
              </button>
            </form>
          </div>

          {/* Toggle Login/Register */}
          <div className="text-center text-xs text-slate-500 dark:text-slate-400 mt-6 pt-4 border-t border-[#EAE5DC] dark:border-[#2A3848]">
            {isSignUp ? (
              <p>
                already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(false);
                    setError(null);
                  }}
                  className="font-bold text-[#1E3A5F] dark:text-amber-400 hover:underline cursor-pointer"
                >
                  sign in
                </button>
              </p>
            ) : (
              <p>
                new to Varta?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(true);
                    setError(null);
                  }}
                  className="font-bold text-[#1E3A5F] dark:text-amber-400 hover:underline cursor-pointer"
                >
                  create one free
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Signature Twilight Atmospheric Card & Brand Crest Logo */}
        <div className="hidden md:flex flex-col justify-between p-8 sm:p-10 bg-varta-auth-twilight text-white relative">
          <div className="pt-6 flex items-center justify-center">
            <img
              src="/varta-logo-dark-transparent.svg"
              alt="Varta"
              className="w-48 max-w-full h-auto object-contain drop-shadow-md"
            />
          </div>
          <p className="font-serif-editorial text-lg italic text-white/95 leading-snug">
            "The news can be a record of what people are building."
          </p>
        </div>

      </div>
    </div>
  );
};
