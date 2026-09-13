import { Link } from 'react-router-dom';
import { Sun, Send, Sparkles, ArrowUp, Globe, CheckCircle } from 'lucide-react';

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0F172A] text-slate-300 pt-14 pb-10 mt-20 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Morning Briefing Card */}
        <div className="bg-slate-900/90 border border-amber-400/30 rounded-2xl p-6 sm:p-8 mb-14 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="max-w-xl">
            <div className="flex items-center space-x-2 text-amber-400 text-[10px] font-bold uppercase tracking-widest mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Varta Morning Dispatch</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-serif-editorial font-bold text-white mb-1.5 leading-snug">
              Start your mornings grounded in real solutions.
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Join 80,000+ informed readers receiving a curated 3-minute morning roundup of humanity's finest achievements.
            </p>
          </div>
          <form 
            onSubmit={(e) => { 
              e.preventDefault(); 
              alert("Subscribed to the Varta Morning Dispatch!"); 
            }} 
            className="w-full md:w-auto flex flex-col sm:flex-row gap-2"
          >
            <input
              type="email"
              placeholder="Enter your email"
              required
              className="px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[260px]"
            />
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-colors flex items-center justify-center space-x-2 shadow-xs cursor-pointer"
            >
              <span>Subscribe</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-800 border border-amber-400/50 flex items-center justify-center text-amber-400">
                <Sun className="w-4 h-4 fill-amber-400/80" />
              </div>
              <span className="font-serif-editorial text-2xl font-extrabold text-white">
                Varta
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-sans-body">
              An independent news journal dedicated to constructive journalism, evidence-based progress, and human courage worldwide.
            </p>
            <div className="flex items-center space-x-1.5 text-xs text-emerald-400 font-medium">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Verified Facts • Constructive Focus</span>
            </div>
          </div>

          {/* Topics / Departments */}
          <div>
            <h4 className="text-[11px] font-bold text-slate-200 uppercase tracking-widest mb-3">
              Departments
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#planet" className="hover:text-amber-400 transition-colors">Planet & Climate Recovery</a></li>
              <li><a href="#science" className="hover:text-amber-400 transition-colors">Medicine & Scientific Leaps</a></li>
              <li><a href="#kindness" className="hover:text-amber-400 transition-colors">Everyday Human Kindness</a></li>
              <li><a href="#health" className="hover:text-amber-400 transition-colors">Health & Longevity</a></li>
              <li><a href="#innovation" className="hover:text-amber-400 transition-colors">Constructive Technology</a></li>
            </ul>
          </div>

          {/* Standards & Integrity */}
          <div>
            <h4 className="text-[11px] font-bold text-slate-200 uppercase tracking-widest mb-3">
              Journalistic Standards
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><span className="hover:text-amber-400 transition-colors cursor-pointer">Positivity Scoring Heuristics</span></li>
              <li><span className="hover:text-amber-400 transition-colors cursor-pointer">Verified Source Attribution</span></li>
              <li><span className="hover:text-amber-400 transition-colors cursor-pointer">Editorial Review Guidelines</span></li>
              <li><span className="hover:text-amber-400 transition-colors cursor-pointer">Privacy & Data Governance</span></li>
            </ul>
          </div>

          {/* Reader Services */}
          <div>
            <h4 className="text-[11px] font-bold text-slate-200 uppercase tracking-widest mb-3">
              Reader Services
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/preferences" className="hover:text-amber-400 transition-colors">Content Preferences</Link></li>
              <li><Link to="/delete-account" className="hover:text-amber-400 transition-colors">Account & Privacy</Link></li>
              <li><span onClick={scrollToTop} className="hover:text-amber-400 transition-colors cursor-pointer">Back to Top ↑</span></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} Varta News Journal. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <span className="flex items-center space-x-1 text-slate-400">
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              <span>Global Constructive Edition</span>
            </span>
            <button
              onClick={scrollToTop}
              className="flex items-center space-x-1 text-amber-400 hover:text-amber-300 font-bold transition-colors cursor-pointer"
            >
              <span>Top</span>
              <ArrowUp className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
