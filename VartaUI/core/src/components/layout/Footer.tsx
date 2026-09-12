import { Link } from 'react-router-dom';
import { Sun, Heart, Send, Sparkles, ArrowUp } from 'lucide-react';

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#192231] text-slate-300 pt-16 pb-12 mt-20 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Newsletter Card */}
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent border border-amber-500/20 rounded-2xl p-6 sm:p-8 mb-16 backdrop-blur-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="flex items-center space-x-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Free Daily Good News Digest</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-serif-editorial font-bold text-white mb-2">
              Start your mornings with hope, not dread.
            </h3>
            <p className="text-sm text-slate-400">
              Join 85,000+ mindful readers getting a hand-picked 3-minute morning roundup of humanity's finest achievements.
            </p>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); alert("Subscribed to Daily Varta!"); }} className="w-full md:w-auto flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              required
              className="px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 min-w-[260px]"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm transition-colors flex items-center justify-center space-x-2 shadow-md shadow-amber-500/20"
            >
              <span>Subscribe</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white">
                <Sun className="w-6 h-6" />
              </div>
              <span className="font-serif-editorial text-2xl font-bold text-white">
                Varta
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Dedicated to restoring faith in our shared human story. Reporting triumphs, scientific leaps, ecological recoveries, and everyday courage.
            </p>
            <div className="flex items-center space-x-2 text-xs text-amber-400/90 font-medium">
              <span>Made with optimism & purpose</span>
              <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Categories
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><Link to="/" className="hover:text-amber-300 transition-colors">Planet & Climate</Link></li>
              <li><Link to="/" className="hover:text-amber-300 transition-colors">Science & Discovery</Link></li>
              <li><Link to="/" className="hover:text-amber-300 transition-colors">Humanity & Kindness</Link></li>
              <li><Link to="/" className="hover:text-amber-300 transition-colors">Health & Wellness</Link></li>
              <li><Link to="/" className="hover:text-amber-300 transition-colors">Positive Tech</Link></li>
            </ul>
          </div>

          {/* Editorial & Values */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Editorial Standards
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><span className="hover:text-amber-300 transition-colors cursor-pointer">Verification Process</span></li>
              <li><span className="hover:text-amber-300 transition-colors cursor-pointer">Joy & Positivity Index</span></li>
              <li><span className="hover:text-amber-300 transition-colors cursor-pointer">Solution Journalism</span></li>
              <li><span className="hover:text-amber-300 transition-colors cursor-pointer">Submit Good News</span></li>
            </ul>
          </div>

          {/* Account & Policies */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Account & Legal
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><Link to="/preferences" className="hover:text-amber-300 transition-colors">My Preferences</Link></li>
              <li><Link to="/login" className="hover:text-amber-300 transition-colors">Sign In / Register</Link></li>
              <li><Link to="/delete-account" className="text-rose-400/90 hover:text-rose-300 transition-colors">Delete Account (Data Privacy)</Link></li>
              <li><span className="text-xs text-slate-500">Go Backend API Ready (v1.0)</span></li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Varta Media. All rights reserved.</p>
          <button
            onClick={scrollToTop}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
};
