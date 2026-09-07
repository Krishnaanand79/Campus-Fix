import React from 'react';
import { AlertCircle, ThumbsUp, PlusCircle, X, MapPin } from 'lucide-react';
import { StatusBadge, PriorityBadge } from '../common/Badge';

export const DuplicateWarningModal = ({
  isOpen,
  duplicates = [],
  onUpvoteExisting,
  onProceedAnyway,
  onClose,
}) => {
  if (!isOpen || duplicates.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="glass-panel rounded-3xl max-w-xl w-full p-6 sm:p-7 relative border border-amber-500/40 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-stone-800/50"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5 text-amber-600 dark:text-amber-400 mb-2">
          <div className="p-2 rounded-xl bg-amber-500/20">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
              Similar Issue Already Reported!
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Our duplicate detection engine spotted active campus complaints matching your details.
            </p>
          </div>
        </div>

        <p className="text-xs text-stone-600 dark:text-stone-400 my-3 leading-relaxed">
          Instead of creating a duplicate complaint (which splits campus attention), you can <strong>+1 an existing issue</strong> to increase its smart priority score and speed up technician dispatch.
        </p>

        {/* List of Duplicate Candidates */}
        <div className="space-y-3 max-h-72 overflow-y-auto pr-1 my-4">
          {duplicates.map((item, idx) => {
            const issue = item.issue;
            return (
              <div
                key={issue._id || idx}
                className="p-4 rounded-2xl glass-card border border-stone-200/60 dark:border-stone-800/80 hover:border-amber-500/40 transition-all"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <StatusBadge status={issue.status} />
                    <PriorityBadge priority={issue.priority} />
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400">
                      {item.confidence}% Match
                    </span>
                  </div>
                  <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
                    👍 {issue.upvotesCount} affected
                  </span>
                </div>

                <h4 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100 line-clamp-1">
                  {issue.title}
                </h4>

                <p className="text-[11px] text-stone-500 dark:text-stone-400 flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3 text-amber-500" />
                  {issue.location?.block} • {issue.location?.area}
                </p>

                <div className="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-stone-200/40 dark:border-stone-800/50">
                  <div className="flex gap-1 flex-wrap">
                    {item.reasons.map((r, i) => (
                      <span
                        key={i}
                        className="text-[9px] px-2 py-0.5 rounded-md bg-stone-200/60 dark:bg-stone-800/80 text-stone-500 dark:text-stone-400"
                      >
                        {r}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => onUpvoteExisting(issue._id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 shadow-glowAmber transition-all"
                  >
                    <ThumbsUp className="w-3 h-3" /> +1 This Issue
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-stone-200/50 dark:border-stone-800/60">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold glass-card text-stone-600 dark:text-stone-300 hover:text-stone-900"
          >
            Review My Complaint
          </button>
          <button
            onClick={onProceedAnyway}
            className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold text-stone-700 dark:text-stone-200 bg-stone-200/70 dark:bg-stone-800/70 hover:bg-stone-300 dark:hover:bg-stone-700 transition-all flex items-center justify-center gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Submit As New Issue Anyway
          </button>
        </div>
      </div>
    </div>
  );
};
