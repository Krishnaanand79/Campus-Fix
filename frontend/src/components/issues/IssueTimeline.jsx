import React from 'react';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Wrench,
  UserCheck,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';

export const IssueTimeline = ({ timeline = [], currentStatus }) => {
  const getIcon = (status) => {
    switch (status) {
      case 'REPORTED':
        return <AlertCircle className="w-4 h-4 text-amber-500" />;
      case 'UNDER_REVIEW':
      case 'APPROVED':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'ASSIGNED':
      case 'ACKNOWLEDGED':
        return <UserCheck className="w-4 h-4 text-purple-500" />;
      case 'IN_PROGRESS':
        return <Wrench className="w-4 h-4 text-orange-500" />;
      case 'RESOLVED':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'USER_VERIFIED':
      case 'CLOSED':
        return <ShieldCheck className="w-4 h-4 text-teal-500" />;
      case 'REOPENED':
        return <RotateCcw className="w-4 h-4 text-rose-500" />;
      default:
        return <Clock className="w-4 h-4 text-stone-400" />;
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-stone-200/60 dark:border-stone-800/80">
      <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 mb-6 flex items-center justify-between">
        <span>Issue Lifecycle & Audit Timeline</span>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
          Current: {currentStatus}
        </span>
      </h3>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-amber-500 before:via-orange-500 before:to-emerald-500">
        {timeline.map((event, index) => {
          const isLatest = index === timeline.length - 1;
          const formattedTime = new Date(event.timestamp).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });

          return (
            <div key={event._id || index} className="relative group">
              {/* Dot Icon */}
              <div className="absolute -left-6 top-1.5 w-5 h-5 rounded-full bg-white dark:bg-stone-900 border-2 border-amber-500 flex items-center justify-center -translate-x-1/2 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              </div>

              <div className="bg-stone-100/60 dark:bg-stone-900/40 p-3.5 rounded-xl border border-stone-200/40 dark:border-stone-800/60">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                  <div className="flex items-center gap-2">
                    {getIcon(event.status)}
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-stone-200">
                      {event.status.replace('_', ' ')}
                    </span>
                    {event.changedBy && (
                      <span className="text-[11px] text-stone-500 dark:text-stone-400">
                        by {event.changedBy.name || 'System'}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-stone-400 font-mono">
                    {formattedTime}
                  </span>
                </div>

                {event.note && (
                  <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 pl-6">
                    "{event.note}"
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
