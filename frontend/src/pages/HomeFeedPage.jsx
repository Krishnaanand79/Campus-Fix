import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Flame,
  PlusCircle,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import api from '../services/api';
import { IssueCard } from '../components/feed/IssueCard';
import { IssueFilterBar } from '../components/feed/IssueFilterBar';

export const HomeFeedPage = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  // Filters state
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [block, setBlock] = useState('All');
  const [status, setStatus] = useState('All');
  const [sortBy, setSortBy] = useState('priority');

  const fetchIssues = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        search: search || undefined,
        category: category !== 'All' ? category : undefined,
        block: block !== 'All' ? block : undefined,
        status: status !== 'All' ? status : undefined,
        sortBy,
        limit: 24,
      };

      const res = await api.get('/issues', { params });
      if (res.data.success) {
        setIssues(res.data.issues || []);
        setTotal(res.data.total || 0);
      }
    } catch (err) {
      console.error('Failed to load issues', err);
    } finally {
      setLoading(false);
    }
  }, [search, category, block, status, sortBy]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchIssues();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchIssues]);

  const handleUpvoteChange = (issueId, newCount, hasUpvoted) => {
    setIssues((prev) =>
      prev.map((item) =>
        item._id === issueId ? { ...item, upvotesCount: newCount } : item
      )
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Banner with Warm Glassmorphism & Micro-Interactions */}
      <div className="relative rounded-3xl overflow-hidden glass-panel p-6 sm:p-10 border border-stone-200/70 dark:border-stone-800/80 shadow-glass">
        {/* Glow ambient accent */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-radial from-amber-500/20 to-transparent blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Community-Powered Campus Infrastructure</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-stone-900 dark:text-stone-100 leading-tight">
            Fixing Campus Problems,{' '}
            <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 bg-clip-text text-transparent">
              Together.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 leading-relaxed max-w-2xl">
            Spot a broken tap, burnt light, or faulty lab AC? Report it in seconds or{' '}
            <strong className="text-amber-500">+1 existing issues</strong> to elevate their smart priority score. Track every repair with verified before/after proof.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to="/report"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:opacity-95 shadow-glowAmber hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <PlusCircle className="w-4 h-4" /> Report Campus Issue
            </Link>

            <button
              onClick={fetchIssues}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold glass-card text-stone-700 dark:text-stone-200 hover:border-amber-500/40 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh Feed
            </button>
          </div>
        </div>

        {/* Live Mini Highlights Counter */}
        <div className="hidden lg:grid grid-cols-3 gap-4 absolute right-8 bottom-8 max-w-sm w-full">
          <div className="p-3.5 rounded-2xl glass-card border border-stone-200/50 dark:border-stone-800/60 text-center">
            <p className="text-xl font-extrabold text-amber-500">{total}</p>
            <p className="text-[10px] uppercase font-bold text-stone-400">Total Tracked</p>
          </div>
          <div className="p-3.5 rounded-2xl glass-card border border-stone-200/50 dark:border-stone-800/60 text-center">
            <p className="text-xl font-extrabold text-emerald-500">100%</p>
            <p className="text-[10px] uppercase font-bold text-stone-400">Proof Required</p>
          </div>
          <div className="p-3.5 rounded-2xl glass-card border border-stone-200/50 dark:border-stone-800/60 text-center">
            <p className="text-xl font-extrabold text-orange-500">+1</p>
            <p className="text-[10px] uppercase font-bold text-stone-400">Community Votes</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <IssueFilterBar
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        block={block}
        setBlock={setBlock}
        status={status}
        setStatus={setStatus}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {/* Issues Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-amber-500" />
            <span>Public Campus Maintenance Feed</span>
            <span className="text-xs font-normal text-stone-400">({total} complaints)</span>
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="h-72 rounded-2xl glass-card animate-pulse bg-stone-200/40 dark:bg-stone-800/40"
              />
            ))}
          </div>
        ) : issues.length === 0 ? (
          <div className="text-center py-16 glass-panel rounded-3xl border border-dashed border-stone-300 dark:border-stone-700">
            <AlertCircle className="w-10 h-10 text-stone-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
              No Campus Issues Found
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-sm mx-auto">
              No complaints matched your current filter criteria. Try clearing search keywords or selecting another category.
            </p>
            <button
              onClick={() => {
                setSearch('');
                setCategory('All');
                setBlock('All');
                setStatus('All');
              }}
              className="mt-4 px-4 py-2 rounded-xl text-xs font-bold text-amber-600 dark:text-amber-400 glass-card"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {issues.map((issue) => (
              <IssueCard
                key={issue._id}
                issue={issue}
                onUpvoteChange={handleUpvoteChange}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
