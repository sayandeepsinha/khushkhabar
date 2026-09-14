import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, 
  Sliders, 
  LogOut, 
  Menu, 
  X,
  Sun,
  Moon
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

interface NavbarProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onSelectCategory?: (slug: string) => void;
  selectedCategory?: string;
}

export const Navbar = ({ 
  searchQuery = '', 
  onSearchChange,
  onSelectCategory,
  selectedCategory = 'all',
}: NavbarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { currentUser, logout, openAuthModal } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const isCurrent = (path: string) => location.pathname === path;
  const isTopicsActive = isCurrent('/') && selectedCategory && selectedCategory !== 'all';
  const isTodayActive = isCurrent('/') && (!selectedCategory || selectedCategory === 'all') && !searchQuery;

  const handleNavToday = () => {
    onSearchChange?.('');
    onSelectCategory?.('all');
    if (location.pathname !== '/') {
      navigate('/');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavBestOfWeek = () => {
    onSearchChange?.('');
    onSelectCategory?.('all');
    if (location.pathname !== '/') {
      navigate('/');
    }
    setTimeout(() => {
      const el = document.getElementById('best-of-week');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('ring-2', 'ring-amber-400', 'ring-offset-4', 'transition-all');
        setTimeout(() => {
          el.classList.remove('ring-2', 'ring-amber-400', 'ring-offset-4');
        }, 1200);
      }
    }, 150);
  };

  const handleNavTopics = () => {
    if (location.pathname !== '/') {
      navigate('/');
    }
    setTimeout(() => {
      document.getElementById('topics-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  };

  return (
    <header className="w-full bg-[#FFFDF9] dark:bg-[#16202B] border-b border-[#EAE5DC] dark:border-[#2A3848] sticky top-0 z-40 transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        
        {/* Left: Brand Logo with Adaptive Mark & Nav Links */}
        <div className="flex items-center space-x-8">
          <Link to="/" className="flex items-center text-decoration-none group" title="Varta - Good News, Verified" aria-label="Varta Home">
            {/* Adaptive Brand Icon Logo */}
            <img
              src={isDark ? '/varta-icon-dark.svg' : '/varta-icon-light.svg'}
              alt="Varta"
              className="w-9 h-9 sm:w-10 sm:h-10 object-contain rounded-xl shadow-2xs transition-all duration-200 group-hover:scale-105 group-hover:shadow-xs"
            />
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center space-x-2 text-sm">
            <button
              onClick={handleNavToday}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-500 ${
                isTodayActive
                  ? 'text-slate-900 dark:text-white bg-stone-200/60 dark:bg-slate-800 font-bold shadow-2xs' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium'
              }`}
            >
              today
            </button>
            <button
              onClick={handleNavBestOfWeek}
              className="px-3 py-1 rounded-md text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium transition-all cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-500"
            >
              best of week
            </button>
            <button
              onClick={handleNavTopics}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-500 ${
                isTopicsActive
                  ? 'text-slate-900 dark:text-white bg-stone-200/60 dark:bg-slate-800 font-bold shadow-2xs' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium'
              }`}
            >
              topics
            </button>
          </nav>
        </div>

        {/* Right: Search Pill, Theme Toggle & User Avatar */}
        <div className="flex items-center space-x-3">
          
          {/* Pill Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="search good news"
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-44 sm:w-56 pl-4 pr-7 py-1.5 bg-[#EFECE6] dark:bg-[#223041] border-none rounded-full text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 dark:focus:ring-amber-500/50 transition-all"
            />
            {searchQuery ? (
              <button 
                onClick={() => onSearchChange?.('')}
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-medium cursor-pointer"
              >
                ×
              </button>
            ) : (
              <Search className="w-3.5 h-3.5 absolute right-3 top-2 text-slate-400 pointer-events-none" />
            )}
          </div>

          {/* Theme Toggle (Light / Dark) */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-stone-200/60 dark:hover:bg-slate-800 transition-all cursor-pointer"
            title={isDark ? 'Switch to Light mode' : 'Switch to Dark mode'}
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>

          {/* User Profile / Gradient Avatar */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="w-8 h-8 rounded-full p-[1.5px] bg-gradient-to-tr from-amber-500 via-yellow-400 to-teal-700 shadow-xs cursor-pointer focus:outline-none"
                aria-label="User profile menu"
              >
                <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-white text-xs font-bold">
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'V'}
                </div>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-[#1A2634] rounded-xl shadow-xl border border-stone-200 dark:border-[#2A3848] py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-4 py-2 border-b border-stone-100 dark:border-[#2A3848] bg-stone-50/60 dark:bg-[#141E2A]">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{currentUser.email}</p>
                  </div>
                  <Link
                    to="/settings"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-stone-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Sliders className="w-3.5 h-3.5 mr-2 text-slate-400" />
                    Settings
                  </Link>
                  <div className="border-t border-stone-100 dark:border-[#2A3848] my-1"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center px-4 py-2 text-xs text-slate-600 dark:text-slate-300 hover:bg-stone-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5 mr-2 text-slate-400" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => openAuthModal()}
              className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 via-amber-400 to-teal-700 shadow-xs cursor-pointer hover:opacity-90 transition-opacity"
              title="Sign In"
              aria-label="Sign In"
            />
          )}

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white focus:outline-none"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pb-4 pt-2 border-t border-stone-200 dark:border-[#2A3848] bg-[#FFFDF9] dark:bg-[#16202B] space-y-2">
          <button
            onClick={() => {
              handleNavToday();
              setMobileMenuOpen(false);
            }}
            className={`block w-full text-left px-2.5 py-1.5 text-sm rounded-lg transition-colors ${
              isTodayActive
                ? 'font-bold text-slate-900 dark:text-white bg-stone-100 dark:bg-slate-800'
                : 'text-slate-600 dark:text-slate-400 font-medium'
            }`}
          >
            today
          </button>
          <button
            onClick={() => {
              handleNavBestOfWeek();
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left px-2.5 py-1.5 text-sm text-slate-600 dark:text-slate-400 font-medium"
          >
            best of week
          </button>
          <button
            onClick={() => {
              handleNavTopics();
              setMobileMenuOpen(false);
            }}
            className={`block w-full text-left px-2.5 py-1.5 text-sm rounded-lg transition-colors ${
              isTopicsActive
                ? 'font-bold text-slate-900 dark:text-white bg-stone-100 dark:bg-slate-800'
                : 'text-slate-600 dark:text-slate-400 font-medium'
            }`}
          >
            topics
          </button>
          <Link
            to="/settings"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-2 py-1.5 text-sm text-slate-600 dark:text-slate-400 font-medium"
          >
            settings
          </Link>
          <div className="pt-2 border-t border-stone-200 dark:border-[#2A3848] flex items-center justify-between px-2">
            <span className="text-xs text-slate-500 dark:text-slate-400">Theme</span>
            <button
              onClick={toggleTheme}
              className="flex items-center space-x-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 py-1 px-2.5 rounded-lg bg-stone-100 dark:bg-slate-800"
            >
              {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-600" />}
              <span>{isDark ? 'Light mode' : 'Dark mode'}</span>
            </button>
          </div>
          {!currentUser && (
            <button
              onClick={() => {
                openAuthModal();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-2 py-1.5 text-sm font-bold text-amber-700 dark:text-amber-400"
            >
              sign in
            </button>
          )}
        </div>
      )}
    </header>
  );
};
