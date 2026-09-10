import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Flame,
  PlusCircle,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  RefreshCw,
  Radio,
  CheckCircle2,
} from 'lucide-react';
import api from '../services/api';
import { IssueCard } from '../components/feed/IssueCard';
import { IssueFilterBar } from '../components/feed/IssueFilterBar';

export const HomeFeedPage = () => {
  const [searchParams] = useSearchParams();
  const urlCategory = searchParams.get('category');

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  // Filters state
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(urlCategory || 'All');
  const [block, setBlock] = useState('All');
  const [status, setStatus] = useState('All');
  const [sortBy, setSortBy] = useState('priority');

  useEffect(() => {
    if (urlCategory) {
      setCategory(urlCategory);
    }
  }, [urlCategory]);

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Streamlined Live Feed Header */}
      <div className="relative rounded-3xl overflow-hidden glass-panel p-6 sm:p-8 border border-slate-200/70 dark:border-slate-800/80 shadow-glass flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        {/* Subtle background emblem watermark */}
        <div className="absolute -right-10 -bottom-10 w-48 h-48 opacity-5 dark:opacity-10 pointer-events-none select-none">
          <img src="/campusfixWithoutNamelogo.png" alt="" className="w-full h-full object-contain" />
        </div>

        <div className="flex items-start gap-4 max-w-2xl">
          <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 hidden sm:block drop-shadow-md">
            <img src="/campusfixWithoutNamelogo.png" alt="CampusFix" className="w-full h-full object-contain" />
          </div>
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/15 text-indigo-600 dark:text-cyan-400 border border-indigo-500/30">
              <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>Campus Live Maintenance Feed</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100">
              Active Campus Issues Queue
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Real-time public operations board. Upvote issues affecting your block to increase priority, or click any ticket to inspect before/after verification proof.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/report"
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 hover:opacity-95 shadow-glowBrand hover:scale-[1.02] transition-all"
          >
            <PlusCircle className="w-4 h-4" /> Report Problem
          </Link>

          <button
            onClick={fetchIssues}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-semibold glass-card text-slate-700 dark:text-slate-200 hover:border-indigo-500/40 transition-all"
            title="Refresh Feed"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
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
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-500" />
            <span>Public Campus Maintenance Feed</span>
            <span className="text-xs font-normal text-slate-400">({total} tickets)</span>
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="h-72 rounded-3xl glass-card animate-pulse bg-slate-200/50 dark:bg-slate-800/40"
              />
            ))}
          </div>
        ) : issues.length === 0 ? (
          <div className="text-center py-16 px-4 glass-panel rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 space-y-4 max-w-2xl mx-auto">
            <div className="w-24 h-24 mx-auto drop-shadow-md">
              <img src="/campusfixWithoutNamelogo.png" alt="CampusFix" className="w-full h-full object-contain" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                No Campus Issues Found
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                No complaints match your active filter criteria or no issues have been filed yet.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <button
                onClick={() => {
                  setSearch('');
                  setCategory('All');
                  setBlock('All');
                  setStatus('All');
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-indigo-600 dark:text-cyan-400 glass-card hover:border-indigo-500"
              >
                Reset Filters
              </button>
              <Link
                to="/report"
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-cyan-500 shadow-glowBrand hover:opacity-95"
              >
                Report New Issue
              </Link>
            </div>
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
