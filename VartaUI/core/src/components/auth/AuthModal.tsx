import React, { useState } from 'react';
import { Sun, X, Mail, Lock, User, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, authModalPrompt, login, register } = useAuth();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (tab === 'login') {
        await login(email, password);
      } else {
        if (!name.trim()) {
          setError('Please provide your name');
          setLoading(false);
          return;
        }
        await register(name, email, password);
      }
      // Reset fields upon success
      setName('');
      setEmail('');
      setPassword('');
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#E7E0D3] overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header decoration */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white backdrop-blur-xs">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif-editorial text-xl font-bold leading-tight">Varta</h2>
              <p className="text-amber-100 text-xs font-sans">Positive News for Human Flourishing</p>
            </div>
          </div>
          <button
            onClick={closeAuthModal}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Contextual prompt if triggered by user action (e.g. bookmark) */}
          {authModalPrompt && (
            <div className="mb-5 p-3 rounded-xl bg-amber-50/80 border border-amber-200/80 flex items-start space-x-2.5 text-xs text-amber-900">
              <Sun className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>{authModalPrompt}</span>
            </div>
          )}

          {/* Tab Switcher */}
          <div className="flex rounded-xl bg-slate-100 p-1 mb-5">
            <button
              type="button"
              onClick={() => {
                setTab('login');
                setError(null);
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                tab === 'login'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setTab('register');
                setError(null);
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                tab === 'register'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Create Account
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === 'register' && (
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    required
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="email"
                  required
                  placeholder="reader@varta.news"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-amber-600 text-white text-xs font-semibold transition-colors flex items-center justify-center space-x-2 shadow-xs disabled:opacity-50"
            >
              <span>{loading ? 'Processing...' : tab === 'login' ? 'Sign In' : 'Join Varta'}</span>
              {!loading && <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={closeAuthModal}
              className="text-xs text-slate-500 hover:text-slate-800 transition-colors underline"
            >
              Continue reading as guest
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

