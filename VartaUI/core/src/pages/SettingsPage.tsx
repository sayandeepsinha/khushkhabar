import { useLocation, useNavigate } from 'react-router-dom';
import { Sliders, ShieldAlert, ArrowLeft, UserCheck } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { PreferencesTab } from '../components/settings/PreferencesTab';
import { DeleteAccountTab } from '../components/settings/DeleteAccountTab';
import { getCurrentUser } from '../api/auth';

interface SettingsPageProps {
  defaultTab?: 'preferences' | 'delete-account';
}

export const SettingsPage = ({ defaultTab = 'preferences' }: SettingsPageProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const isDeleteAccount = location.pathname.includes('delete-account') || defaultTab === 'delete-account';
  const activeTab = isDeleteAccount ? 'delete-account' : 'preferences';

  const handleTabChange = (tab: 'preferences' | 'delete-account') => {
    if (tab === 'preferences') {
      navigate('/preferences');
    } else {
      navigate('/delete-account');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5]">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 w-full">
        
        {/* Back navigation */}
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-amber-700 transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Good News Feed</span>
        </button>

        {/* User Greeting Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-[#EAE4D9] shadow-xs mb-8">
          <div className="flex items-center space-x-4">
            <img
              src={currentUser?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
              alt="User Avatar"
              className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-300 shadow-sm"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-serif-editorial text-2xl font-bold text-slate-900">
                  {currentUser?.name || 'Reader'}
                </h1>
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                  <UserCheck className="w-3 h-3 text-amber-600" />
                  <span>Verified Mindful Reader</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                {currentUser?.email || 'reader@varta.news'}
              </p>
            </div>
          </div>

          <div className="text-xs text-slate-500 bg-amber-50/60 border border-amber-200/60 px-4 py-2 rounded-xl self-start sm:self-auto">
            <span className="font-semibold text-amber-900">Varta Member</span>
            <p className="text-[11px] text-amber-800">Reading positive news since 2025</p>
          </div>
        </div>

        {/* Settings Navigation Tabs */}
        <div className="flex border-b border-[#E3DBD0] mb-8 space-x-4">
          <button
            onClick={() => handleTabChange('preferences')}
            className={`flex items-center space-x-2 pb-3.5 px-2 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'preferences'
                ? 'border-amber-600 text-amber-900'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Reading Preferences</span>
          </button>

          <button
            onClick={() => handleTabChange('delete-account')}
            className={`flex items-center space-x-2 pb-3.5 px-2 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'delete-account'
                ? 'border-rose-600 text-rose-700'
                : 'border-transparent text-slate-500 hover:text-rose-600'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Danger Zone (Delete Account)</span>
          </button>
        </div>

        {/* Tab Content Container */}
        <div>
          {activeTab === 'preferences' ? (
            <PreferencesTab />
          ) : (
            <DeleteAccountTab />
          )}
        </div>

      </main>

      <Footer />
    </div>
  );
};
