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
  X
} from 'lucide-react';
import { getCurrentUser, logout } from '../../api/auth';

interface NavbarProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export const Navbar = ({ searchQuery = '', onSearchChange }: NavbarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const currentUser = getCurrentUser();

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    navigate('/');
    window.location.reload();
  };

  const isCurrent = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-[#FBF9F5]/95 backdrop-blur-md border-b border-[#E7E0D3] shadow-xs">
      {/* Top Uplifting Ticker */}
      <div className="bg-[#1E293B] text-[#FEF3C7] text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center justify-center w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium tracking-wide">TODAY'S UPLIFT:</span>
            <span className="text-slate-300 hidden sm:inline">
              142 positive breakthroughs published worldwide • 0% doom, 100% human progress
            </span>
            <span className="text-slate-300 sm:hidden">
              142 positive stories today
            </span>
          </div>
          <div className="flex items-center space-x-4 text-xs text-amber-200">
            <span className="hidden md:inline font-mono">EDITION: GLOBAL ENGLISH</span>
            <span className="text-slate-400">|</span>
            <span className="font-medium text-amber-300">Varta Daily</span>
          </div>
        </div>
      </div>

      {/* Main Brand & Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group text-decoration-none">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform duration-200">
              <Sun className="w-7 h-7 text-white stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-serif-editorial text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 group-hover:text-amber-700 transition-colors">
                  Varta
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-300/60 uppercase tracking-wider">
                  Positive
                </span>
              </div>
              <p className="text-[11px] font-medium tracking-wide text-slate-500 uppercase">
                The Uplifting News Journal
              </p>
            </div>
          </Link>

          {/* Search Bar (Desktop) */}
          <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Search inspiring stories, science, kindness..."
                value={searchQuery}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/80 border border-[#E3DBD0] rounded-full text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all shadow-2xs"
              />
              {searchQuery && (
                <button 
                  onClick={() => onSearchChange?.('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-slate-600"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-1 sm:space-x-2">
            <Link
              to="/"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                isCurrent('/') 
                  ? 'text-amber-800 bg-amber-50/80 font-semibold' 
                  : 'text-slate-700 hover:text-slate-900 hover:bg-black/5'
              }`}
            >
              Stories
            </Link>
            
            <a
              href="#best-news"
              className="px-3.5 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-black/5 transition-colors flex items-center space-x-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Best News</span>
            </a>

            <Link
              to="/preferences"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                isCurrent('/preferences') || isCurrent('/settings')
                  ? 'text-amber-800 bg-amber-50/80 font-semibold'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-black/5'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-slate-500" />
              <span>Preferences</span>
            </Link>

            {/* Auth / Account Profile */}
            {currentUser ? (
              <div className="relative ml-3">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 p-1.5 rounded-full hover:ring-2 hover:ring-amber-400 transition-all"
                  aria-label="User profile menu"
                >
                  <img
                    src={currentUser.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
                    alt={currentUser.name}
                    className="w-9 h-9 rounded-full object-cover border border-amber-300"
                  />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-[#E7E0D3] py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-sm font-semibold text-slate-800 truncate">{currentUser.name}</p>
                      <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                    </div>
                    <Link
                      to="/preferences"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-amber-50 hover:text-amber-900"
                    >
                      <Sliders className="w-4 h-4 mr-2.5 text-slate-400" />
                      Content Preferences
                    </Link>
                    <Link
                      to="/delete-account"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center px-4 py-2 text-sm text-rose-600 hover:bg-rose-50"
                    >
                      <User className="w-4 h-4 mr-2.5 text-rose-500" />
                      Account & Data
                    </Link>
                    <div className="border-t border-slate-100 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    >
                      <LogOut className="w-4 h-4 mr-2.5 text-slate-400" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="ml-2 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-slate-900 hover:bg-amber-700 transition-colors shadow-xs"
              >
                Sign In
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-black/5"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Search & Menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#E7E0D3] space-y-3">
            <div className="relative w-full">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search positive stories..."
                value={searchQuery}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-[#E3DBD0] rounded-lg text-sm"
              />
            </div>
            <div className="flex flex-col space-y-1">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-md text-slate-800 font-medium hover:bg-amber-50"
              >
                All Stories
              </Link>
              <Link
                to="/preferences"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-md text-slate-800 font-medium hover:bg-amber-50"
              >
                Preferences
              </Link>
              <Link
                to="/delete-account"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-md text-rose-600 font-medium hover:bg-rose-50"
              >
                Delete Account
              </Link>
              {currentUser ? (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="text-left px-3 py-2 text-slate-600 font-medium hover:bg-slate-100"
                >
                  Sign Out ({currentUser.name})
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-amber-700 font-medium hover:bg-amber-50"
                >
                  Sign In / Register
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
