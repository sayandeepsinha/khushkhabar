import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Sun, 
  Search, 
  Sliders, 
  User, 
  LogOut, 
  Sparkles,
  Menu,
  X,
  Bookmark
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onToggleBookmarksFilter?: () => void;
  showingBookmarksOnly?: boolean;
}

export const Navbar = ({ 
  searchQuery = '', 
  onSearchChange,
  onToggleBookmarksFilter,
  showingBookmarksOnly = false
}: NavbarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { currentUser, logout, openAuthModal, positivityStreak } = useAuth();

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const isCurrent = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 glass-editorial-header">
      
      {/* Editorial Top Wire */}
      <div className="bg-[#0F172A] text-slate-300 text-[11px] py-1.5 px-4 tracking-wider">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-amber-400 uppercase text-[10px] tracking-widest">
              Varta Daily Wire
            </span>
            <span className="text-slate-400 hidden sm:inline">
              Global scientific leaps, climate recoveries & human ingenuity • Verified Constructive Journalism
            </span>
          </div>
          <div className="flex items-center space-x-3 text-slate-300">
            <span className="hidden md:inline font-mono text-[10px] text-amber-300">EST. 2026</span>
            <span className="text-slate-600">|</span>
            <span className="text-emerald-400 font-semibold text-[10px]">
              0% DOOMSCROLL • 100% EVIDENCE
            </span>
          </div>
        </div>
      </div>

      {/* Main Masthead Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Varta Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group text-decoration-none">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-amber-400/50 p-1 flex items-center justify-center shadow-xs group-hover:border-amber-400 transition-colors">
              <Sun className="w-5 h-5 text-amber-400 fill-amber-400/80 stroke-[2]" />
            </div>
            <div>
              <div className="flex items-baseline space-x-2">
                <span className="font-serif-editorial text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 group-hover:text-amber-800 transition-colors">
                  Varta
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-800 bg-amber-100/80 border border-amber-300/80 px-2 py-0.5 rounded-md">
                  Journal
                </span>
              </div>
              <p className="text-[10px] font-semibold tracking-widest text-slate-500 uppercase">
                The Uplifting News Publication
              </p>
            </div>
          </Link>

          {/* Minimalist Editorial Search */}
          <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Search breakthroughs, medicine, climate..."
                value={searchQuery}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="w-full pl-10 pr-12 py-2 bg-white/90 border border-stone-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all shadow-2xs"
              />
              {searchQuery ? (
                <button 
                  onClick={() => onSearchChange?.('')}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-xs text-slate-400 hover:text-slate-600 font-medium cursor-pointer"
                >
                  Clear
                </button>
              ) : (
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                  <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-stone-100 border border-stone-200 rounded">
                    /
                  </kbd>
                </div>
              )}
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-2">
            <Link
              to="/"
              className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                isCurrent('/') && !showingBookmarksOnly
                  ? 'text-blue-700 bg-blue-50/90 font-bold border border-blue-200/80' 
                  : 'text-slate-700 hover:text-slate-900 hover:bg-black/5'
              }`}
            >
              Latest Edition
            </Link>

            {/* Bookmarks Toggle Filter */}
            {onToggleBookmarksFilter && (
              <button
                onClick={onToggleBookmarksFilter}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all flex items-center space-x-1.5 cursor-pointer ${
                  showingBookmarksOnly
                    ? 'text-amber-900 bg-amber-100/90 border border-amber-300 font-bold'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-black/5'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${showingBookmarksOnly ? 'fill-amber-600 text-amber-600' : 'text-slate-400'}`} />
                <span>Reading List</span>
              </button>
            )}

            <a
              href="#best-news"
              className="px-3.5 py-1.5 rounded-lg text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-black/5 transition-all flex items-center space-x-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Curated Best</span>
            </a>

            <Link
              to="/preferences"
              className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all flex items-center space-x-1.5 ${
                isCurrent('/preferences') || isCurrent('/settings')
                  ? 'text-blue-700 bg-blue-50/90 font-bold border border-blue-200/80'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-black/5'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-slate-400" />
              <span>Preferences</span>
            </Link>

            {/* Streak Badge with Subtle Gold Accent */}
            <div className="hidden lg:flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-300 text-xs font-bold text-amber-900">
              <span>🔥</span>
              <span>{positivityStreak}d Habit</span>
            </div>

            {/* Auth / Account Profile */}
            {currentUser ? (
              <div className="relative ml-2">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 p-1 rounded-full hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer"
                  aria-label="User profile menu"
                >
                  <img
                    src={currentUser.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover border border-amber-400/80"
                  />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-stone-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2.5 border-b border-stone-100 bg-stone-50/60">
                      <p className="text-sm font-bold text-slate-900 truncate">{currentUser.name}</p>
                      <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                      <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        <span>✨ Positive Contributor</span>
                      </div>
                    </div>
                    <Link
                      to="/preferences"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-900 transition-colors"
                    >
                      <Sliders className="w-4 h-4 mr-2.5 text-blue-600" />
                      Topic & Scoring Controls
                    </Link>
                    <Link
                      to="/delete-account"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <User className="w-4 h-4 mr-2.5 text-rose-500" />
                      Account & Privacy
                    </Link>
                    <div className="border-t border-stone-100 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 mr-2.5 text-slate-400" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => openAuthModal()}
                className="ml-2 inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-bold text-white bg-slate-900 hover:bg-blue-700 transition-colors shadow-xs cursor-pointer"
              >
                Sign In
              </button>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-black/5 focus:outline-none cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-stone-200 px-4 pt-3 pb-6 space-y-2.5 shadow-lg">
          <div className="relative mb-3">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search Varta stories..."
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-stone-50 rounded-lg border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg font-semibold text-slate-800 hover:bg-blue-50"
          >
            All Stories
          </Link>

          {onToggleBookmarksFilter && (
            <button
              onClick={() => {
                onToggleBookmarksFilter();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg font-semibold text-slate-800 hover:bg-amber-50 flex items-center gap-2 cursor-pointer"
            >
              <Bookmark className="w-4 h-4 text-amber-600" />
              <span>{showingBookmarksOnly ? 'Show All Stories' : 'Reading List'}</span>
            </button>
          )}

          <Link
            to="/preferences"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg font-semibold text-slate-800 hover:bg-blue-50"
          >
            Preferences
          </Link>

          {currentUser ? (
            <button
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out ({currentUser.name})</span>
            </button>
          ) : (
            <button
              onClick={() => {
                openAuthModal();
                setMobileMenuOpen(false);
              }}
              className="w-full mt-2 py-2.5 rounded-lg font-bold text-white bg-slate-900 hover:bg-blue-700 text-center cursor-pointer"
            >
              Sign In
            </button>
          )}
        </div>
      )}

    </header>
  );
};
