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
        return <UserCheck className="w-4 h-4 text-indigo-500" />;
      case 'IN_PROGRESS':
        return <Wrench className="w-4 h-4 text-sky-500" />;
      case 'RESOLVED':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'USER_VERIFIED':
      case 'CLOSED':
        return <ShieldCheck className="w-4 h-4 text-teal-500" />;
      case 'REOPENED':
        return <RotateCcw className="w-4 h-4 text-rose-500" />;
      default:
        return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-7 border border-slate-200/70 dark:border-slate-800/80 shadow-glass">
      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center justify-between">
        <span>Issue Lifecycle & Audit Trail</span>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-cyan-400 border border-indigo-500/20">
          Current: {currentStatus}
        </span>
      </h3>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-indigo-500 before:via-sky-500 before:to-emerald-500">
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
              <div className="absolute -left-6 top-1.5 w-5 h-5 rounded-full bg-white dark:bg-slate-900 border-2 border-indigo-500 flex items-center justify-center -translate-x-1/2 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
              </div>

              <div className="bg-slate-100/70 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/60">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                  <div className="flex items-center gap-2">
                    {getIcon(event.status)}
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
                      {event.status.replace('_', ' ')}
                    </span>
                    {event.changedBy && (
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        by {event.changedBy.name || 'System'}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {formattedTime}
                  </span>
                </div>

                {event.note && (
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 pl-6">
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
