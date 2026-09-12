import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Trash2, ShieldAlert, Lock } from 'lucide-react';
import { deleteUserAccount } from '../../api/user';

export const DeleteAccountTab = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [reason, setReason] = useState('too_many_emails');
  const [otherReason, setOtherReason] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!password) {
      setError('Please enter your password to confirm account deletion.');
      return;
    }

    setIsDeleting(true);
    setError(null);
    try {
      const selectedReason = reason === 'other' ? otherReason : reason;
      await deleteUserAccount(password, selectedReason);
      setShowConfirmModal(false);
      alert('Your Varta account has been permanently deleted. We are sorry to see you go!');
      navigate('/');
      window.location.reload();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Deletion failed. Please verify your password.';
      setError(msg);
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Danger Zone Header */}
      <div>
        <div className="flex items-center space-x-2 text-rose-700 font-bold text-xs uppercase tracking-wider mb-1">
          <ShieldAlert className="w-4 h-4" />
          <span>Danger Zone • Irreversible Action</span>
        </div>
        <h3 className="font-serif-editorial text-2xl font-bold text-slate-900 mb-1">
          Delete Your Varta Account
        </h3>
        <p className="text-sm text-slate-500">
          Permanently remove your profile, saved positive news stories, custom bookmarks, and preferences.
        </p>
      </div>

      {/* Warning Box */}
      <div className="p-6 rounded-2xl bg-rose-50/80 border border-rose-200">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 mt-0.5 shrink-0" />
          <div>
            <h4 className="font-semibold text-rose-900 text-sm mb-1">
              Please take a moment to review what happens when you delete your account:
            </h4>
            <ul className="text-xs text-rose-800/90 space-y-1.5 list-disc list-inside mt-2">
              <li>Your saved bookmarks and read history will be wiped immediately.</li>
              <li>Your custom positivity threshold and topic filters will be reset.</li>
              <li>You will be unsubscribed from all daily morning positive newsletters.</li>
              <li>This action is immediate and cannot be reversed by customer support.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Survey & Password Form */}
      <div className="p-6 rounded-2xl bg-white border border-[#EAE4D9] shadow-xs space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-800 mb-1.5">
            Help us improve: Why are you leaving Varta?
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="too_many_emails">Too many email digests</option>
            <option value="not_enough_local_news">Looking for more regional/local good news</option>
            <option value="prefer_social_media">I get my positive news on social media</option>
            <option value="temporary_break">Taking a temporary digital hiatus</option>
            <option value="other">Other reason</option>
          </select>
        </div>

        {reason === 'other' && (
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Please specify (optional):
            </label>
            <input
              type="text"
              value={otherReason}
              onChange={(e) => setOtherReason(e.target.value)}
              placeholder="Tell us what we could do better..."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-slate-800 mb-1.5">
            Confirm your password to proceed
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type="password"
              placeholder="Enter your current password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError(null);
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
          </div>
          {error && <p className="text-xs text-rose-600 mt-1.5 font-medium">{error}</p>}
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Backend Endpoint: DELETE /api/user/account
          </span>
          <button
            type="button"
            onClick={() => {
              if (!password) {
                setError('Please enter your password first.');
                return;
              }
              setShowConfirmModal(true);
            }}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm transition-colors shadow-xs cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete My Account</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white max-w-md w-full rounded-2xl p-6 shadow-2xl border border-rose-200">
            <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 mb-4 mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h4 className="font-serif-editorial text-xl font-bold text-center text-slate-900 mb-2">
              Are you absolutely certain?
            </h4>

            <p className="text-xs text-slate-600 text-center mb-6 leading-relaxed">
              This action cannot be undone. All your saved bookmarks, positivity settings, and personal account data will be permanently wiped from the Varta database.
            </p>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-medium text-sm hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm transition-colors flex items-center justify-center space-x-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>{isDeleting ? 'Deleting...' : 'Yes, Delete Permanently'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
