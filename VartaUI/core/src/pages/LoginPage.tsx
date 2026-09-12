import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sun, Sparkles, Lock, Mail, User, ArrowRight, ShieldCheck } from 'lucide-react';
import { login, register } from '../api/auth';

export const LoginPage = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('reader@varta.news');
  const [password, setPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        await register(name, email, password);
      } else {
        await login(email, password);
      }
      navigate('/');
      window.location.reload();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestAccess = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] flex flex-col justify-between">
      {/* Simple Header */}
      <header className="p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white shadow-xs">
              <Sun className="w-5 h-5" />
            </div>
            <span className="font-serif-editorial text-2xl font-bold text-slate-900">
              Varta
            </span>
          </Link>

          <Link
            to="/"
            className="text-xs font-semibold text-slate-600 hover:text-amber-700 transition-colors"
          >
            ← Back to Stories
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto px-4 w-full py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 rounded-3xl overflow-hidden border border-[#EAE4D9] bg-white shadow-xl">
          
          {/* Left Editorial Promo Banner */}
          <div className="md:col-span-5 bg-gradient-to-br from-[#1E293B] to-[#0F172A] text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-400/20 text-amber-300 border border-amber-400/30 mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Mindful Journalism</span>
              </div>

              <h2 className="font-serif-editorial text-2xl sm:text-3xl font-bold leading-tight mb-4 text-white">
                A daily dose of genuine hope and human achievement.
              </h2>

              <p className="text-sm text-slate-300 leading-relaxed font-sans">
                Join a global community reading news that builds resilience, celebrates courage, and tracks positive planetary solutions.
              </p>
            </div>

            <div className="relative z-10 pt-10 border-t border-slate-700/80">
              <div className="flex items-center space-x-3 text-xs text-slate-300">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>Zero algorithmic rage. 100% positive verification.</span>
              </div>
            </div>

            {/* Subtle background glow */}
            <div className="absolute -bottom-16 -right-16 w-48 h-48 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
          </div>

          {/* Right Form Card */}
          <div className="md:col-span-7 p-8 sm:p-10 bg-white">
            <div className="mb-6">
              {/* Tab Switcher */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(false);
                    setError(null);
                  }}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                    !isSignUp
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(true);
                    setError(null);
                  }}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                    isSignUp
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Create Account
                </button>
              </div>

              <h3 className="font-serif-editorial text-2xl font-bold text-slate-900 mb-1">
                {isSignUp ? 'Begin your journey' : 'Welcome back, reader'}
              </h3>
              <p className="text-xs text-slate-500">
                {isSignUp
                  ? 'Set up your reading preferences and unlock unlimited uplifting news.'
                  : 'Enter your credentials to access your saved stories and custom feeds.'}
              </p>
            </div>

            {error && (
              <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Suman Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Password
                  </label>
                  {!isSignUp && (
                    <span className="text-xs text-amber-700 hover:underline cursor-pointer">
                      Forgot?
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 accent-amber-600 rounded"
                  />
                  <span className="text-xs text-slate-600">Remember on this device</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-amber-700 text-white font-medium text-sm transition-colors flex items-center justify-center space-x-2 shadow-md shadow-slate-900/10 cursor-pointer disabled:opacity-60"
              >
                <span>{loading ? 'Please wait...' : isSignUp ? 'Create My Account' : 'Sign In'}</span>
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>

              <div className="relative my-4 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <span className="relative px-3 bg-white text-xs text-slate-400">or</span>
              </div>

              <button
                type="button"
                onClick={handleGuestAccess}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors"
              >
                Continue as Guest Reader
              </button>
            </form>

            <p className="text-[11px] text-slate-400 text-center mt-6">
              Go Backend Ready: <code className="font-mono text-slate-600">{isSignUp ? 'POST /api/auth/register' : 'POST /api/auth/login'}</code>
            </p>
          </div>

        </div>
      </div>

      {/* Simple Footer */}
      <footer className="p-6 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} Varta Media • Uplifting Journalism
      </footer>
    </div>
  );
};
