import React, { useState } from 'react';
import { Star, CheckCircle, RotateCcw, X, AlertTriangle, Send } from 'lucide-react';
import confetti from 'canvas-confetti';
import api from '../../services/api';

export const VerificationModal = ({ issue, isOpen, onClose, onSuccess }) => {
  const [decision, setDecision] = useState(null); // 'accept' or 'reopen'
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');
  const [reopenReason, setReopenReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !issue) return null;

  const handleAccept = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const res = await api.post(`/issues/${issue._id}/verify`, {
        isSatisfied: true,
        rating,
        review,
      });

      if (res.data.success) {
        // Trigger celebratory confetti!
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#4F46E5', '#06B6D4', '#10B981'],
        });

        if (onSuccess) onSuccess(res.data.issue);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Verification submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReopen = async (e) => {
    e.preventDefault();
    if (!reopenReason.trim()) {
      setError('Please provide a reason why the problem is not fixed.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await api.post(`/issues/${issue._id}/verify`, {
        isSatisfied: false,
        reopenReason,
      });

      if (res.data.success) {
        if (onSuccess) onSuccess(res.data.issue);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reopen issue');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="glass-panel rounded-3xl max-w-lg w-full p-6 sm:p-7 relative border border-slate-200/70 dark:border-slate-800/80 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mb-5 flex items-start gap-3.5">
          <div className="w-14 h-14 shrink-0 drop-shadow-md">
            <img src="/campusfixWithoutNamelogo.png" alt="CampusFix" className="w-full h-full object-contain" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              Official Quality Verification
            </span>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-1">
              Was the problem actually resolved?
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              "{issue.title}" has been marked as resolved by the maintenance staff. Your evaluation ensures quality and accountability.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Initial Choice: Yes / No */}
        {!decision && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => setDecision('accept')}
              className="flex flex-col items-center justify-center gap-2 p-5 rounded-2xl glass-card border border-emerald-500/30 hover:border-emerald-500 hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 transition-all group cursor-pointer"
            >
              <div className="p-3 rounded-2xl bg-emerald-500/20 group-hover:scale-110 transition-transform">
                <CheckCircle className="w-6 h-6 text-emerald-500" />
              </div>
              <span className="font-bold text-sm">Yes, Problem is Fixed</span>
              <span className="text-[11px] text-slate-400 text-center">
                Close complaint & rate worker
              </span>
            </button>

            <button
              onClick={() => setDecision('reopen')}
              className="flex flex-col items-center justify-center gap-2 p-5 rounded-2xl glass-card border border-rose-500/30 hover:border-rose-500 hover:bg-rose-500/10 text-rose-600 dark:text-rose-400 transition-all group cursor-pointer"
            >
              <div className="p-3 rounded-2xl bg-rose-500/20 group-hover:scale-110 transition-transform">
                <RotateCcw className="w-6 h-6 text-rose-500" />
              </div>
              <span className="font-bold text-sm">No, Still Broken</span>
              <span className="text-[11px] text-slate-400 text-center">
                Reopen & escalate to Admin
              </span>
            </button>
          </div>
        )}

        {/* Path A: User Confirms & Rates */}
        {decision === 'accept' && (
          <form onSubmit={handleAccept} className="space-y-4 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 text-center">
                How satisfied are you with the resolution?
              </label>
              <div className="flex items-center justify-center gap-2 py-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 transition-transform hover:scale-125 focus:outline-none cursor-pointer"
                  >
                    <Star
                      className={`w-7 h-7 transition-colors ${
                        (hoverRating || rating) >= star
                          ? 'text-amber-400 fill-amber-400 drop-shadow-sm'
                          : 'text-slate-300 dark:text-slate-700'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-center text-xs text-amber-500 font-bold mt-1">
                {rating === 5 && 'Outstanding Fix! ⭐⭐⭐⭐⭐'}
                {rating === 4 && 'Very Good Service! ⭐⭐⭐⭐'}
                {rating === 3 && 'Acceptable Fix ⭐⭐⭐'}
                {rating === 2 && 'Needs Improvement ⭐⭐'}
                {rating === 1 && 'Poor Quality ⭐'}
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Written Review / Feedback (Optional)
              </label>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                rows={3}
                placeholder="e.g., Technician arrived on time and repaired the water tap thoroughly."
                className="w-full p-3 rounded-xl text-xs glass-input focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDecision(null)}
                className="flex-1 py-2 rounded-xl text-xs font-semibold glass-card text-slate-500 hover:text-slate-700 cursor-pointer"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-2 py-2 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-95 shadow-glowEmerald flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <CheckCircle className="w-4 h-4" />
                {submitting ? 'Submitting...' : 'Confirm & Close Issue'}
              </button>
            </div>
          </form>
        )}

        {/* Path B: User Reopens */}
        {decision === 'reopen' && (
          <form onSubmit={handleReopen} className="space-y-4 pt-1">
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs">
              <p className="font-semibold">Reopening will immediately flag this issue to Campus Admin.</p>
              <p className="text-[11px] mt-0.5 opacity-80">
                The priority score will be increased automatically to ensure prompt escalation.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Why is the problem still not fixed? <span className="text-rose-500">*</span>
              </label>
              <textarea
                value={reopenReason}
                onChange={(e) => setReopenReason(e.target.value)}
                rows={3}
                required
                placeholder="e.g. The leak resumed 2 hours later, or the switch is still sparking..."
                className="w-full p-3 rounded-xl text-xs glass-input focus:ring-2 focus:ring-rose-500/20"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDecision(null)}
                className="flex-1 py-2 rounded-xl text-xs font-semibold glass-card text-slate-500 hover:text-slate-700 cursor-pointer"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-2 py-2 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-500 to-red-600 hover:opacity-95 shadow-glowRose flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                {submitting ? 'Submitting...' : 'Confirm Reopen'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
