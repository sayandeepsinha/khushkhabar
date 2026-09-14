import { useState, useEffect } from 'react';
import { 
  Check, 
  Sparkles, 
  Sliders, 
  Mail, 
  LayoutGrid, 
  Save, 
  CheckCircle2,
  Sun,
  Moon,
  Laptop
} from 'lucide-react';
import type { UserPreferences, Category } from '../../api/types';
import { getUserPreferences, updateUserPreferences } from '../../api/user';
import { getCategories } from '../../api/news';
import { useTheme } from '../../context/ThemeContext';

export const PreferencesTab = () => {
  const { theme, setTheme } = useTheme();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [prefs, cats] = await Promise.all([
          getUserPreferences(),
          getCategories(),
        ]);
        setPreferences(prefs);
        setCategories(cats.filter((c) => c.slug !== 'all'));
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const toggleCategory = (slug: string) => {
    if (!preferences) return;
    const current = [...preferences.favoriteCategories];
    const exists = current.includes(slug);
    const updated = exists
      ? current.filter((s) => s !== slug)
      : [...current, slug];
    setPreferences({ ...preferences, favoriteCategories: updated });
  };

  const handleSave = async () => {
    if (!preferences) return;
    setSaving(true);
    setSaveSuccess(false);
    try {
      await updateUserPreferences(preferences);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch {
      alert('Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !preferences) {
    return (
      <div className="p-8 text-center text-slate-500 dark:text-slate-400">
        <Sparkles className="w-6 h-6 mx-auto mb-2 animate-spin text-amber-500" />
        <p>Loading your preferences...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Description */}
      <div>
        <h3 className="font-serif-editorial text-2xl font-bold text-slate-900 dark:text-white mb-1">
          Reading & Positivity Preferences
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Personalize the uplifting topics, joy threshold, and delivery format of your Varta experience.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 flex items-center space-x-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <p className="text-sm font-medium">Preferences successfully updated and saved to your profile.</p>
        </div>
      )}

      {/* Reading Theme */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#1A2634] border border-[#EAE4D9] dark:border-[#2A3848] shadow-xs">
        <div className="flex items-center space-x-2 text-slate-800 dark:text-slate-100 font-semibold text-base mb-1">
          <Sun className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span>Reading Theme & Appearance</span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Choose light mode, dark mode, or follow your system appearance.
        </p>

        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`p-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-2 cursor-pointer ${
              theme === 'light'
                ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 ring-1 ring-amber-500'
                : 'border-[#EAE5DC] dark:border-[#2A3848] bg-white dark:bg-[#16202B] text-slate-700 dark:text-slate-300 hover:border-slate-400'
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
                : 'border-[#EAE5DC] dark:border-[#2A3848] bg-white dark:bg-[#16202B] text-slate-700 dark:text-slate-300 hover:border-slate-400'
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
                : 'border-[#EAE5DC] dark:border-[#2A3848] bg-white dark:bg-[#16202B] text-slate-700 dark:text-slate-300 hover:border-slate-400'
            }`}
          >
            <Laptop className="w-5 h-5 text-slate-500 dark:text-slate-400" />
            <span>System</span>
          </button>
        </div>
      </div>

      {/* 1. Favorite Categories */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#1A2634] border border-[#EAE4D9] dark:border-[#2A3848] shadow-xs">
        <div className="flex items-center space-x-2 text-slate-800 dark:text-slate-100 font-semibold text-base mb-1">
          <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span>Curated Topics of Interest</span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Select which uplifting beats should take priority on your home feed.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {categories.map((cat) => {
            const isChecked = preferences.favoriteCategories.includes(cat.slug);
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => toggleCategory(cat.slug)}
                className={`flex items-center justify-between p-3 rounded-xl border text-left text-sm transition-all cursor-pointer ${
                  isChecked
                    ? 'bg-amber-50/80 dark:bg-amber-950/50 border-amber-300 dark:border-amber-600 text-amber-950 dark:text-amber-200 font-medium'
                    : 'bg-white dark:bg-[#16202B] border-slate-200 dark:border-[#2A3848] text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#1E293B]'
                }`}
              >
                <span>{cat.name}</span>
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                    isChecked
                      ? 'bg-amber-500 border-amber-600 text-white dark:text-slate-950'
                      : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                  }`}
                >
                  {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Positivity Threshold */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#1A2634] border border-[#EAE4D9] dark:border-[#2A3848] shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2 text-slate-800 dark:text-slate-100 font-semibold text-base">
            <Sliders className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Minimum Positivity Score: {preferences.positivityThreshold}%</span>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/60">
            {preferences.positivityThreshold >= 90 ? 'Ultra Inspiring Only' : 'Broad Positive News'}
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Filter out borderline or bittersweet stories. Every article above this score is independently verified as high-uplift.
        </p>
        <div className="space-y-2">
          <input
            type="range"
            min="60"
            max="95"
            step="5"
            value={preferences.positivityThreshold}
            onChange={(e) =>
              setPreferences({
                ...preferences,
                positivityThreshold: Number(e.target.value),
              })
            }
            className="w-full accent-amber-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
          />
          <div className="flex justify-between text-[11px] text-slate-400 dark:text-slate-500 font-mono">
            <span>60% (All Good News)</span>
            <span>75% (Encouraging)</span>
            <span>90%+ (Historic Triumphs)</span>
          </div>
        </div>
      </div>

      {/* 3. Delivery & Digest Frequency */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#1A2634] border border-[#EAE4D9] dark:border-[#2A3848] shadow-xs">
        <div className="flex items-center space-x-2 text-slate-800 dark:text-slate-100 font-semibold text-base mb-1">
          <Mail className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span>Email Delivery & Morning Digest</span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Never miss a reason to smile before starting work.
        </p>

        <div className="space-y-4">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Daily Morning Varta Digest</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">A 3-minute cheerful summary sent at 7:30 AM every morning.</p>
            </div>
            <input
              type="checkbox"
              checked={preferences.dailyDigestEmail}
              onChange={(e) =>
                setPreferences({
                  ...preferences,
                  dailyDigestEmail: e.target.checked,
                })
              }
              className="w-5 h-5 accent-amber-600 rounded cursor-pointer"
            />
          </label>

          <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Daily Wisdom & Quote of the Day</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Include a reflective, uplifting quote in the app banner.</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.quoteOfTheDay}
                onChange={(e) =>
                  setPreferences({
                    ...preferences,
                    quoteOfTheDay: e.target.checked,
                  })
                }
                className="w-5 h-5 accent-amber-600 rounded cursor-pointer"
              />
            </label>
          </div>
        </div>
      </div>

      {/* 4. Reading Layout */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#1A2634] border border-[#EAE4D9] dark:border-[#2A3848] shadow-xs">
        <div className="flex items-center space-x-2 text-slate-800 dark:text-slate-100 font-semibold text-base mb-1">
          <LayoutGrid className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span>Reading Display Mode</span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Choose between rich magazine cards or high-density newspaper layout.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setPreferences({ ...preferences, readingLayout: 'comfortable' })}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
              preferences.readingLayout === 'comfortable'
                ? 'bg-amber-50/80 dark:bg-amber-950/50 border-amber-400 ring-2 ring-amber-400/20'
                : 'bg-white dark:bg-[#16202B] border-slate-200 dark:border-[#2A3848] hover:bg-slate-50 dark:hover:bg-[#1E293B]'
            }`}
          >
            <p className="font-semibold text-sm text-slate-900 dark:text-white">Comfortable Magazine</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Large photography, full excerpts, and prominent joy badges.</p>
          </button>

          <button
            type="button"
            onClick={() => setPreferences({ ...preferences, readingLayout: 'compact' })}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
              preferences.readingLayout === 'compact'
                ? 'bg-amber-50/80 dark:bg-amber-950/50 border-amber-400 ring-2 ring-amber-400/20'
                : 'bg-white dark:bg-[#16202B] border-slate-200 dark:border-[#2A3848] hover:bg-slate-50 dark:hover:bg-[#1E293B]'
            }`}
          >
            <p className="font-semibold text-sm text-slate-900 dark:text-white">Compact Streamline</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">High density, condensed headlines, best for quick skimmers.</p>
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-slate-900 dark:bg-amber-500 hover:bg-amber-700 dark:hover:bg-amber-400 text-white dark:text-slate-950 font-medium text-sm transition-colors shadow-md disabled:opacity-60 cursor-pointer"
        >
          {saving ? (
            <Sparkles className="w-4 h-4 animate-spin text-amber-400 dark:text-slate-950" />
          ) : (
            <Save className="w-4 h-4 text-amber-400 dark:text-slate-950" />
          )}
          <span>{saving ? 'Saving...' : 'Save Preferences'}</span>
        </button>
      </div>
    </div>
  );
};
