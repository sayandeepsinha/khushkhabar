import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon, Laptop } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface SettingsPageProps {
  defaultTab?: 'preferences' | 'account' | 'delete-account';
}

export const SettingsPage = ({ defaultTab = 'preferences' }: SettingsPageProps) => {
  const navigate = useNavigate();
  const { currentUser, logout, openAuthModal } = useAuth();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'preferences' | 'account' | 'delete-account'>(defaultTab);

  // Selected topics state
  const [selectedTopics, setSelectedTopics] = useState<string[]>(['climate', 'community']);
  
  // Sunday digest toggle
  const [sundayDigest, setSundayDigest] = useState(true);

  const toggleTopic = (id: string) => {
    setSelectedTopics((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const handleDeleteAccount = async () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      await logout();
      alert('Your account has been deleted.');
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#0B131D] p-4 sm:p-8 lg:p-12 flex items-center justify-center transition-colors duration-200">
      {/* Inner Card Canvas */}
      <div className="w-full max-w-4xl bg-[#FFFDF9] dark:bg-[#16202B] rounded-2xl sm:rounded-3xl shadow-lg p-8 sm:p-12 border border-[#EAE5DC] dark:border-[#2A3848]">
        
        {/* Back Link */}
        <button
          onClick={() => navigate('/')}
          className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors mb-6 cursor-pointer inline-block"
        >
          ← back
        </button>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="font-serif-editorial text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white leading-tight">
            Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-sans mt-1">
            {currentUser ? (
              <span>Signed in as <strong className="text-slate-800 dark:text-slate-200">{currentUser.name}</strong> ({currentUser.email})</span>
            ) : (
              <span>
                Not signed in ·{' '}
                <button
                  type="button"
                  onClick={() => openAuthModal()}
                  className="text-amber-700 dark:text-amber-400 font-bold hover:underline cursor-pointer"
                >
                  Sign in
                </button>
              </span>
            )}
          </p>
        </div>

        {/* 2-Column Content Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Left Sidebar Navigation */}
          <div className="md:col-span-4 flex flex-col space-y-2">
            <button
              onClick={() => setActiveTab('preferences')}
              className={`text-left px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'preferences'
                  ? 'bg-[#1E242B] dark:bg-amber-500 text-white dark:text-slate-950 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              preferences
            </button>

            <button
              onClick={() => setActiveTab('account')}
              className={`text-left px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'account'
                  ? 'bg-[#1E242B] dark:bg-amber-500 text-white dark:text-slate-950 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              account
            </button>

            <button
              onClick={() => setActiveTab('delete-account')}
              className={`text-left px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'delete-account'
                  ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200'
                  : 'text-[#DC2626] dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/30'
              }`}
            >
              delete account
            </button>
          </div>

          {/* Right Pane: Settings Content */}
          <div className="md:col-span-8">
            {activeTab === 'preferences' && (
              <div className="space-y-8 animate-in fade-in duration-150">
                
                {/* Reading Theme / Appearance Section */}
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    reading theme
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 mb-3 font-sans">
                    choose your preferred reading experience
                  </p>

                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setTheme('light')}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-2 cursor-pointer ${
                        theme === 'light'
                          ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 ring-1 ring-amber-500'
                          : 'border-[#EAE5DC] dark:border-[#2A3848] bg-white dark:bg-[#1A2634] text-slate-700 dark:text-slate-300 hover:border-slate-400'
                      }`}
                    >
                      <Sun className="w-5 h-5 text-amber-500" />
                      <span>Light</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTheme('dark')}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-2 cursor-pointer ${
                        theme === 'dark'
                          ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 ring-1 ring-amber-500'
                          : 'border-[#EAE5DC] dark:border-[#2A3848] bg-white dark:bg-[#1A2634] text-slate-700 dark:text-slate-300 hover:border-slate-400'
                      }`}
                    >
                      <Moon className="w-5 h-5 text-amber-400" />
                      <span>Dark</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTheme('system')}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-2 cursor-pointer ${
                        theme === 'system'
                          ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 ring-1 ring-amber-500'
                          : 'border-[#EAE5DC] dark:border-[#2A3848] bg-white dark:bg-[#1A2634] text-slate-700 dark:text-slate-300 hover:border-slate-400'
                      }`}
                    >
                      <Laptop className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                      <span>System</span>
                    </button>
                  </div>
                </div>

                {/* Topics Selection */}
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    topics you care about
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 mb-4 font-sans">
                    we'll prioritize these on your homepage
                  </p>

                  {/* Pastel Topic Chips */}
                  <div className="flex flex-wrap gap-2.5">
                    {/* Climate */}
                    <button
                      type="button"
                      onClick={() => toggleTopic('climate')}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        selectedTopics.includes('climate')
                          ? 'topic-pill-climate shadow-2xs'
                          : 'bg-white dark:bg-[#1A2634] border border-[#E2DDD5] dark:border-[#2A3848] text-slate-600 dark:text-slate-300 hover:border-slate-400'
                      }`}
                    >
                      climate
                    </button>

                    {/* Health */}
                    <button
                      type="button"
                      onClick={() => toggleTopic('health')}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        selectedTopics.includes('health')
                          ? 'topic-pill-health shadow-2xs'
                          : 'bg-white dark:bg-[#1A2634] border border-[#E2DDD5] dark:border-[#2A3848] text-slate-600 dark:text-slate-300 hover:border-slate-400'
                      }`}
                    >
                      health
                    </button>

                    {/* Community */}
                    <button
                      type="button"
                      onClick={() => toggleTopic('community')}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        selectedTopics.includes('community')
                          ? 'topic-pill-community shadow-2xs'
                          : 'bg-white dark:bg-[#1A2634] border border-[#E2DDD5] dark:border-[#2A3848] text-slate-600 dark:text-slate-300 hover:border-slate-400'
                      }`}
                    >
                      community
                    </button>

                    {/* Culture */}
                    <button
                      type="button"
                      onClick={() => toggleTopic('culture')}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        selectedTopics.includes('culture')
                          ? 'topic-pill-culture shadow-2xs'
                          : 'bg-white dark:bg-[#1A2634] border border-[#E2DDD5] dark:border-[#2A3848] text-slate-600 dark:text-slate-300 hover:border-slate-400'
                      }`}
                    >
                      culture
                    </button>
                  </div>
                </div>

                {/* Sunday Digest Card with Toggle Switch */}
                <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#121A23] border border-[#EAE5DC] dark:border-[#2A3848] flex items-center justify-between shadow-2xs">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                      Sunday digest
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-sans">
                      weekly roundup every Sunday morning
                    </p>
                  </div>

                  {/* Gradient Switch Toggle */}
                  <button
                    type="button"
                    role="switch"
                    aria-checked={sundayDigest}
                    onClick={() => setSundayDigest(!sundayDigest)}
                    className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer focus:outline-none p-0.5 ${
                      sundayDigest ? 'varta-toggle-active' : 'bg-slate-200 dark:bg-slate-700'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                        sundayDigest ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

              </div>
            )}

            {activeTab === 'account' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="p-6 rounded-2xl bg-white dark:bg-[#121A23] border border-[#EAE5DC] dark:border-[#2A3848] shadow-2xs">
                  <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                    account details
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 font-sans">
                    manage your account information
                  </p>

                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="font-bold text-slate-700 dark:text-slate-300">Name:</span>{' '}
                      <span className="text-slate-900 dark:text-slate-100 font-medium">{currentUser?.name || 'Reader'}</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-700 dark:text-slate-300">Email:</span>{' '}
                      <span className="text-slate-900 dark:text-slate-100 font-medium">{currentUser?.email || 'reader@varta.news'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'delete-account' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="p-6 rounded-2xl bg-white dark:bg-[#121A23] border border-rose-200 dark:border-rose-900/60 shadow-2xs">
                  <h2 className="text-base font-bold text-rose-900 dark:text-rose-400 mb-1">
                    delete account
                  </h2>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 leading-relaxed font-sans">
                    Permanently delete your profile, saved reading list, and habit streaks. This action cannot be reversed.
                  </p>
                  <button
                    onClick={handleDeleteAccount}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-xs cursor-pointer"
                  >
                    Permanently Delete Account
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
