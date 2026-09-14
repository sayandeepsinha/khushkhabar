import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Send, Sparkles, ArrowUp, Globe, CheckCircle, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
      setSubscribed(false);
    }, 4000);
  };

  return (
    <footer className="bg-[#0A1017] text-slate-300 pt-14 pb-12 mt-20 border-t border-[#1E2C3D]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Morning Briefing Banner */}
        <div className="bg-gradient-to-r from-[#111A24] via-[#162332] to-[#111A24] border border-amber-400/25 rounded-2xl p-6 sm:p-8 mb-14 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xl shadow-black/30">
          <div className="max-w-xl text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 text-amber-400 text-[10px] font-bold uppercase tracking-widest mb-2 px-2.5 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/20">
              <Sparkles className="w-3 h-3" />
              <span>Varta Morning Dispatch</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-serif-editorial font-bold text-white mb-2 leading-snug">
              Start your mornings grounded in real solutions.
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans-body">
              Join 80,000+ informed readers receiving a curated 3-minute morning digest of humanity's constructive progress and verified breakthroughs.
            </p>
          </div>

          <form 
            onSubmit={handleSubscribe}
            className="w-full lg:w-auto flex flex-col sm:flex-row items-center gap-2 max-w-md"
          >
            {subscribed ? (
              <div className="w-full py-2.5 px-4 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold text-center flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Subscribed! Welcome to the Morning Dispatch.</span>
              </div>
            ) : (
              <div className="flex w-full sm:w-auto items-center bg-[#070C12] border border-slate-700/80 rounded-xl p-1.5 focus-within:border-amber-400 focus-within:ring-1 focus-within:ring-amber-400/40 transition-all shadow-inner">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  required
                  className="px-3 py-1.5 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none w-full sm:w-64"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center space-x-1.5 shrink-0 shadow-xs cursor-pointer"
                >
                  <span>Subscribe</span>
                  <Send className="w-3 h-3" />
                </button>
              </div>
            )}
          </form>
        </div>

        {/* 4-Column Broadsheet Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 pb-12 border-b border-[#1A2636]">
          
          {/* Column 1: Brand Info with High-Contrast Dark Logo */}
          <div className="space-y-4">
            <Link to="/" className="inline-block group" title="Varta - Good News, Verified">
              <img
                src="/varta-logo-dark-transparent.svg"
                alt="Varta - Good News, Verified"
                className="w-52 sm:w-60 max-w-full h-auto object-contain -ml-1 hover:opacity-90 transition-opacity drop-shadow-md"
              />
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed font-sans-body">
              An independent news journal dedicated to constructive journalism, evidence-based progress, and human courage worldwide.
            </p>
            <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-500/25 text-[11px] font-medium text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Verified Facts • Strict Heuristics</span>
            </div>
          </div>

          {/* Column 2: Departments */}
          <div>
            <h4 className="text-[11px] font-bold text-slate-200 uppercase tracking-widest mb-4 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              <span>Departments</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/?category=planet" className="hover:text-amber-400 hover:underline transition-colors block">
                  Planet & Climate Recovery
                </Link>
              </li>
              <li>
                <Link to="/?category=science" className="hover:text-amber-400 hover:underline transition-colors block">
                  Medicine & Scientific Leaps
                </Link>
              </li>
              <li>
                <Link to="/?category=kindness" className="hover:text-amber-400 hover:underline transition-colors block">
                  Everyday Human Kindness
                </Link>
              </li>
              <li>
                <Link to="/?category=health" className="hover:text-amber-400 hover:underline transition-colors block">
                  Health & Longevity
                </Link>
              </li>
              <li>
                <Link to="/?category=innovation" className="hover:text-amber-400 hover:underline transition-colors block">
                  Constructive Technology
                </Link>
              </li>
              <li>
                <Link to="/?category=culture" className="hover:text-amber-400 hover:underline transition-colors block">
                  Culture & Community
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Journalistic Standards */}
          <div>
            <h4 className="text-[11px] font-bold text-slate-200 uppercase tracking-widest mb-4 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              <span>Standards & Ethics</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/standards#heuristics" className="hover:text-amber-400 hover:underline transition-colors block">
                  Positivity Scoring Heuristics
                </Link>
              </li>
              <li>
                <Link to="/standards#sources" className="hover:text-amber-400 hover:underline transition-colors block">
                  Verified Source Attribution
                </Link>
              </li>
              <li>
                <Link to="/standards#editorial" className="hover:text-amber-400 hover:underline transition-colors block">
                  Editorial Review Guidelines
                </Link>
              </li>
              <li>
                <Link to="/standards#privacy" className="hover:text-amber-400 hover:underline transition-colors block">
                  Privacy & Data Governance
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Reader Services */}
          <div>
            <h4 className="text-[11px] font-bold text-slate-200 uppercase tracking-widest mb-4 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              <span>Reader Services</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/preferences" className="hover:text-amber-400 hover:underline transition-colors block">
                  Content Preferences
                </Link>
              </li>
              <li>
                <Link to="/settings" className="hover:text-amber-400 hover:underline transition-colors block">
                  Account & Profile Settings
                </Link>
              </li>
              <li>
                <Link to="/delete-account" className="hover:text-amber-400 hover:underline transition-colors block">
                  Account Deletion & Data Wipe
                </Link>
              </li>
              <li>
                <button 
                  onClick={scrollToTop} 
                  className="hover:text-amber-400 hover:underline transition-colors cursor-pointer text-left block"
                >
                  Back to Top ↑
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Metadata Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Varta Publishing Ltd. Good News, Verified. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <Link to="/standards" className="flex items-center space-x-1.5 text-slate-400 hover:text-white transition-colors">
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>Global Constructive Edition</span>
            </Link>
            <button
              onClick={scrollToTop}
              className="flex items-center space-x-1 text-amber-400 hover:text-amber-300 font-bold transition-colors cursor-pointer"
            >
              <span>Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
