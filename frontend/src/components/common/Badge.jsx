import React from 'react';

export const StatusBadge = ({ status }) => {
  const config = {
    REPORTED: {
      bg: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
      label: 'Reported',
      dot: 'bg-amber-500',
    },
    UNDER_REVIEW: {
      bg: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30',
      label: 'Under Review',
      dot: 'bg-blue-500',
    },
    APPROVED: {
      bg: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30',
      label: 'Approved',
      dot: 'bg-indigo-500',
    },
    ASSIGNED: {
      bg: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30',
      label: 'Assigned',
      dot: 'bg-purple-500',
    },
    ACKNOWLEDGED: {
      bg: 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30',
      label: 'Acknowledged',
      dot: 'bg-cyan-500',
    },
    IN_PROGRESS: {
      bg: 'bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30 animate-pulse-subtle',
      label: 'In Progress',
      dot: 'bg-orange-500',
    },
    RESOLVED: {
      bg: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
      label: 'Resolved (Verify)',
      dot: 'bg-emerald-500',
    },
    USER_VERIFIED: {
      bg: 'bg-teal-500/15 text-teal-600 dark:text-teal-400 border-teal-500/30',
      label: 'User Verified',
      dot: 'bg-teal-500',
    },
    CLOSED: {
      bg: 'bg-slate-500/15 text-slate-600 dark:text-slate-400 border-slate-500/30',
      label: 'Closed',
      dot: 'bg-slate-400',
    },
    REOPENED: {
      bg: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30',
      label: 'Reopened ⚠️',
      dot: 'bg-rose-500',
    },
    REJECTED: {
      bg: 'bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30',
      label: 'Rejected',
      dot: 'bg-red-500',
    },
  };

  const current = config[status] || {
    bg: 'bg-gray-500/15 text-gray-400 border-gray-500/30',
    label: status,
    dot: 'bg-gray-400',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border backdrop-blur-md ${current.bg}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot}`}></span>
      {current.label}
    </span>
  );
};

export const PriorityBadge = ({ priority, score }) => {
  const config = {
    CRITICAL: {
      bg: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30',
      label: 'Critical',
      icon: '🔴',
    },
    HIGH: {
      bg: 'bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30',
      label: 'High',
      icon: '🟠',
    },
    MEDIUM: {
      bg: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
      label: 'Medium',
      icon: '🟡',
    },
    LOW: {
      bg: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
      label: 'Low',
      icon: '🟢',
    },
  };

  const current = config[priority] || config.MEDIUM;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border backdrop-blur-md ${current.bg}`}
    >
      <span>{current.icon}</span>
      <span>{current.label}</span>
      {score !== undefined && (
        <span className="ml-1 opacity-75 font-mono text-[10px]">({score})</span>
      )}
    </span>
  );
};
