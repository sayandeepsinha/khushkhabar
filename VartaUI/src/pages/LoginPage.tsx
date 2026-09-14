import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login, register } from '../api/auth';
import { useTheme } from '../context/ThemeContext';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim();
    const cleanPassword = password.trim();
    const cleanName = name.trim();

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
        await register(cleanName, cleanEmail, cleanPassword);
      } else {
        await login(cleanEmail, cleanPassword);
      }
      navigate('/');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication failed. Please verify credentials.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#0B131D] flex items-center justify-center p-4 sm:p-8 transition-colors duration-200">
      {/* 2-Column Split Card */}
      <div className="w-full max-w-3xl bg-[#FFFDF9] dark:bg-[#16202B] rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2 border border-[#EAE5DC] dark:border-[#2A3848]">
        
        {/* Left Column: Form */}
        <div className="p-8 sm:p-12 flex flex-col justify-between">
          <div>
            {/* Varta Brand Link */}
            <Link to="/" className="inline-flex items-center space-x-2.5 mb-8 text-decoration-none group">
              <img
                src={isDark ? '/varta-icon-dark.svg' : '/varta-icon-light.svg'}
                alt="Varta"
                className="w-7 h-7 object-contain rounded-xs shadow-2xs transition-transform group-hover:scale-105"
              />
              <span className="font-serif-editorial text-2xl font-bold tracking-tight text-slate-900 dark:text-[#FDF9F2]">
                Varta
              </span>
            </Link>

            <h1 className="font-serif-editorial text-3xl font-bold text-slate-900 dark:text-white leading-tight mb-1.5">
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 font-sans">
              {isSignUp ? 'Join readers cultivating hope and evidence.' : 'Sign in to pick up where you left off.'}
            </p>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-700 text-xs text-rose-800 dark:text-rose-200">
                {error}
              </div>
            )}

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
                    placeholder="Jane Doe"
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-[#1E293B] border border-[#E2DDD5] dark:border-[#2A3848] rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
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
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-[#1E293B] border border-[#E2DDD5] dark:border-[#2A3848] rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
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
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-[#1E293B] border border-[#E2DDD5] dark:border-[#2A3848] rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
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
                className="w-full mt-2 py-3 px-4 rounded-xl text-sm font-bold text-slate-900 bg-[#DF8235] hover:bg-[#C86F26] transition-colors shadow-xs cursor-pointer disabled:opacity-50 lowercase"
              >
                {loading ? 'signing in...' : isSignUp ? 'create account' : 'sign in'}
              </button>
            </form>
          </div>

          <div className="text-center text-xs text-slate-500 dark:text-slate-400 mt-8 pt-4 border-t border-[#EAE5DC] dark:border-[#2A3848]">
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

        {/* Right Column: Signature Twilight Banner & Brand Crest Logo */}
        <div className="hidden md:flex flex-col justify-between p-8 sm:p-12 bg-varta-auth-twilight text-white relative">
          <div className="pt-8 flex items-center justify-center">
            <img
              src="/varta-logo-dark-transparent.svg"
              alt="Varta"
              className="w-56 max-w-full h-auto object-contain drop-shadow-md"
            />
          </div>
          <p className="font-serif-editorial text-xl italic text-white/95 leading-snug">
            "The news can be a record of what people are building."
          </p>
        </div>

      </div>
    </div>
  );
};
