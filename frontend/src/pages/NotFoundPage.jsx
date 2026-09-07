import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="glass-panel rounded-3xl p-8 max-w-md w-full border border-stone-200/70 dark:border-stone-800/80 shadow-glass space-y-4">
        <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500 w-14 h-14 mx-auto flex items-center justify-center">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-stone-900 dark:text-stone-100">404</h1>
        <p className="text-sm font-semibold text-stone-700 dark:text-stone-300">
          Page Not Found
        </p>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          The campus maintenance resource or page you are looking for does not exist or has been relocated.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:opacity-95 shadow-glowAmber transition-all"
        >
          <Home className="w-4 h-4" /> Return to Campus Feed
        </Link>
      </div>
    </div>
  );
};
