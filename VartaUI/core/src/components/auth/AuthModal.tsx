import React, { useState } from 'react';
import { 
  Sun, 
  X, 
  Mail, 
  Lock, 
  User, 
  AlertCircle, 
  ArrowRight, 
  Sparkles, 
  Check, 
  TreePine, 
  HeartHandshake, 
  Lightbulb, 
  Smile, 
  Cpu, 
  Palette 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, authModalPrompt, login, register } = useAuth();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  
  // Register multi-step state
  const [registerStep, setRegisterStep] = useState<1 | 2>(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Selected positive topics for onboarding step 2
  const [selectedTopics, setSelectedTopics] = useState<string[]>([
    'climate',
    'science',
    'kindness',
  ]);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const availableTopics = [
    { id: 'climate', name: 'Planet & Climate Healing', icon: TreePine, desc: 'Reforestation, biodiversity & clean energy' },
    { id: 'science', name: 'Science & Medical Breakthroughs', icon: Lightbulb, desc: 'Vaccine progress, surgery triumphs & discovery' },
    { id: 'kindness', name: 'Human Kindness & Community Aid', icon: HeartHandshake, desc: 'Everyday heroism & selfless assistance' },
    { id: 'animals', name: 'Wildlife & Animal Welfare', icon: Smile, desc: 'Species recovery & heartwarming rescues' },
    { id: 'tech', name: 'Constructive Technology', icon: Cpu, desc: 'Open knowledge & ethical innovations' },
    { id: 'arts', name: 'Arts, Culture & Heritage', icon: Palette, desc: 'Inspiring architecture & cultural revivals' },
  ];

  const toggleTopic = (id: string) => {
    setSelectedTopics((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (tab === 'login') {
      setLoading(true);
      try {
        await login(email, password);
        setName('');
        setEmail('');
        setPassword('');
      } catch (err: any) {
        setError(err?.message || 'Authentication failed. Please verify your credentials.');
      } finally {
        setLoading(false);
      }
      return;
    }

    // Tab is register
    if (registerStep === 1) {
      if (!name.trim()) {
        setError('Please enter your full name.');
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        setError('Please enter a valid email address.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
      // Advance to Step 2: Choose your topics
      setRegisterStep(2);
      return;
    }

    // Step 2 Finalization
    setLoading(true);
    try {
      await register(name, email, password, selectedTopics);
      setName('');
      setEmail('');
      setPassword('');
      setRegisterStep(1);
    } catch (err: any) {
      setError(err?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    closeAuthModal();
    setRegisterStep(1);
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Masthead Header in Deep Slate with Gold & Sun Monogram */}
        <div className="bg-[#0F172A] px-6 py-5 text-white flex items-center justify-between border-b border-amber-400/30">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-white/10 border border-amber-400/50 flex items-center justify-center text-amber-400 shadow-inner">
              <Sun className="w-5 h-5 fill-amber-400/80" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif-editorial text-2xl font-bold leading-tight tracking-tight">Varta</h2>
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 bg-amber-400/15 border border-amber-400/30 px-1.5 py-0.5 rounded">
                  Reader
                </span>
              </div>
              <p className="text-slate-400 text-xs font-sans">The Uplifting News Journal</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Contextual prompt */}
          {authModalPrompt && (
            <div className="mb-4 p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
              <span>{authModalPrompt}</span>
            </div>
          )}

          {/* Tab Switcher */}
          {registerStep === 1 && (
            <div className="flex rounded-lg bg-stone-100 p-1 mb-5">
              <button
                type="button"
                onClick={() => {
                  setTab('login');
                  setError(null);
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-md transition-all cursor-pointer ${
                  tab === 'login'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
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
                className={`flex-1 py-2 text-xs font-bold rounded-md transition-all cursor-pointer ${
                  tab === 'register'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Create Account
              </button>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 flex items-start space-x-2 text-xs text-rose-800">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* STEP 1: LOGIN OR BASIC REGISTRATION CREDENTIALS */}
            {registerStep === 1 ? (
              <>
                {tab === 'register' && (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Maya Lin"
                        className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@domain.com"
                      className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-2.5 px-4 rounded-lg text-sm font-bold text-white bg-slate-900 hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>{tab === 'login' ? 'Sign In to Varta' : 'Continue to Topics'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </>
            ) : (
              /* STEP 2: ONBOARDING TOPIC CURATION */
              <div className="space-y-3 animate-in fade-in duration-150">
                <div className="text-center mb-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300/50 mb-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    Step 2: Personalize Your Feed
                  </span>
                  <h3 className="font-serif-editorial text-lg font-bold text-slate-900">
                    Select Your Preferred Topics
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Customize the stories prioritized in your daily Varta edition.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto pr-1">
                  {availableTopics.map((topic) => {
                    const isSelected = selectedTopics.includes(topic.id);
                    const Icon = topic.icon;
                    return (
                      <div
                        key={topic.id}
                        onClick={() => toggleTopic(topic.id)}
                        className={`p-2.5 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-blue-50/90 border-blue-500 text-blue-950 shadow-2xs'
                            : 'bg-white hover:bg-stone-50 border-stone-200 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <Icon className={`w-4 h-4 ${isSelected ? 'text-blue-700' : 'text-slate-400'}`} />
                          <div>
                            <p className="text-xs font-bold text-slate-900">{topic.name}</p>
                            <p className="text-[10px] text-slate-500">{topic.desc}</p>
                          </div>
                        </div>
                        <div className={`w-4 h-4 rounded flex items-center justify-center border ${isSelected ? 'bg-blue-700 border-blue-700 text-white' : 'border-stone-300'}`}>
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setRegisterStep(1)}
                    className="px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-stone-100 cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-2.5 px-4 rounded-lg text-sm font-bold text-white bg-slate-900 hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Finish & Read Varta</span>
                        <Sparkles className="w-4 h-4 text-amber-300" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Footer info note */}
        <div className="bg-stone-50 px-6 py-3 border-t border-stone-100 text-center text-[11px] text-slate-400">
          Independent, constructive journalism. No clickbait or tracking.
        </div>
      </div>
    </div>
  );
};
