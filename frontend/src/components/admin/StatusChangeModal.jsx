import React, { useState } from 'react';
import { Sliders, X, AlertCircle } from 'lucide-react';
import api from '../../services/api';

const STATUSES = [
  'REPORTED',
  'UNDER_REVIEW',
  'APPROVED',
  'ASSIGNED',
  'IN_PROGRESS',
  'RESOLVED',
  'CLOSED',
  'REJECTED',
];

export const StatusChangeModal = ({ issue, isOpen, onClose, onSuccess }) => {
  const [status, setStatus] = useState(issue?.status || 'UNDER_REVIEW');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !issue) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const res = await api.put(`/admin/issues/${issue._id}/status`, {
        status,
        note,
      });

      if (res.data.success) {
        if (onSuccess) onSuccess(res.data.issue);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="glass-panel rounded-3xl max-w-md w-full p-6 relative border border-slate-200/70 dark:border-slate-800/80 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5 text-indigo-600 dark:text-cyan-400 mb-2">
          <div className="p-2 rounded-xl bg-indigo-500/20">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Update Issue Status
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Calibrate complaint lifecycle state
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 my-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Select New Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-2.5 rounded-xl text-xs glass-input cursor-pointer text-slate-700 dark:text-slate-200"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Admin Audit Note (Optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="e.g. Verified by campus engineering inspector"
              className="w-full p-2.5 rounded-xl text-xs glass-input"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200/50 dark:border-slate-800/60">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold glass-card text-slate-600 dark:text-slate-300 hover:text-slate-900 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-cyan-500 hover:opacity-95 shadow-glowBrand cursor-pointer"
            >
              {submitting ? 'Saving...' : 'Update Status'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
