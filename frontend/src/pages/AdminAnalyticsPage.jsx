import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  BarChart3,
  PieChart,
  Users,
  Star,
  MapPin,
  CheckCircle,
  Clock,
  ShieldCheck,
  Building,
} from 'lucide-react';
import api from '../services/api';

export const AdminAnalyticsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await api.get('/analytics/dashboard');
      if (res.data.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Failed to load analytics', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center text-stone-400">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm">Calculating campus infrastructure metrics and worker scorecards...</p>
      </div>
    );
  }

  const { stats, categories, locations, workers } = data;
  const maxCategoryCount = Math.max(...categories.map((c) => c.count), 1);
  const maxLocationCount = Math.max(...locations.map((l) => l.count), 1);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30 mb-2">
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Campus Maintenance Intelligence</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100">
          Campus Analytics & Performance
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
          Historical breakdown of complaint hot-spots, category densities, and technician efficiency ratings.
        </p>
      </div>

      {/* KPI Top Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-stone-200/60 dark:border-stone-800/60">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Total Recorded
            </span>
            <TrendingUp className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-3xl font-extrabold text-stone-900 dark:text-stone-100 mt-2">
            {stats.total}
          </p>
          <p className="text-[11px] text-stone-500 mt-1">Across all colleges & blocks</p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-stone-200/60 dark:border-stone-800/60">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Avg Turnaround
            </span>
            <Clock className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-3xl font-extrabold text-emerald-500 mt-2">
            {stats.avgResolutionHours}h
          </p>
          <p className="text-[11px] text-stone-500 mt-1">Average time to fix</p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-stone-200/60 dark:border-stone-800/60">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Resolved & Closed
            </span>
            <ShieldCheck className="w-4 h-4 text-teal-500" />
          </div>
          <p className="text-3xl font-extrabold text-teal-500 mt-2">
            {stats.resolved + stats.closed}
          </p>
          <p className="text-[11px] text-stone-500 mt-1">Verified resolutions</p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-stone-200/60 dark:border-stone-800/60">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Active Workforce
            </span>
            <Users className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-3xl font-extrabold text-indigo-500 mt-2">
            {workers.length}
          </p>
          <p className="text-[11px] text-stone-500 mt-1">Certified staff members</p>
        </div>
      </div>

      {/* Breakdown Charts: Categories & Locations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="glass-panel rounded-3xl p-6 border border-stone-200/70 dark:border-stone-800/80 shadow-glass space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-amber-500" />
            <span>Complaints by Maintenance Category</span>
          </h3>

          <div className="space-y-3 pt-2">
            {categories.map((cat) => {
              const percent = Math.round((cat.count / stats.total) * 100) || 0;
              return (
                <div key={cat.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-stone-700 dark:text-stone-300">
                      {cat.name}
                    </span>
                    <span className="text-stone-400 font-mono">
                      {cat.count} issues ({percent}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-stone-200/60 dark:bg-stone-800/80 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-600 transition-all duration-500"
                      style={{ width: `${(cat.count / maxCategoryCount) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Location Block Hotspots */}
        <div className="glass-panel rounded-3xl p-6 border border-stone-200/70 dark:border-stone-800/80 shadow-glass space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <Building className="w-4 h-4 text-indigo-500" />
            <span>Top Campus Problem Areas</span>
          </h3>

          <div className="space-y-3 pt-2">
            {locations.map((loc) => {
              const percent = Math.round((loc.count / stats.total) * 100) || 0;
              return (
                <div key={loc.block} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-indigo-500" />
                      {loc.block}
                    </span>
                    <span className="text-stone-400 font-mono">
                      {loc.count} tickets ({percent}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-stone-200/60 dark:bg-stone-800/80 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-500"
                      style={{ width: `${(loc.count / maxLocationCount) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Worker Performance Scorecards */}
      <div className="glass-panel rounded-3xl p-6 border border-stone-200/70 dark:border-stone-800/80 shadow-glass space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-500" />
            <span>Technician Performance Scorecards</span>
          </h3>
          <span className="text-xs text-stone-400">Based on verified user ratings</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {workers.map((w) => (
            <div
              key={w.id}
              className="p-5 rounded-2xl glass-card border border-stone-200/60 dark:border-stone-800/60 space-y-4"
            >
              <div className="flex items-center gap-3">
                <img
                  src={
                    w.avatar ||
                    `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(w.name)}`
                  }
                  alt={w.name}
                  className="w-12 h-12 rounded-xl object-cover ring-2 ring-amber-500/30 shadow-md"
                />
                <div>
                  <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                    {w.name}
                  </h4>
                  <p className="text-[11px] text-stone-400">{w.department}</p>
                </div>
              </div>

              {/* Rating Pill */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs">
                <span className="font-semibold text-stone-600 dark:text-stone-300">
                  User Evaluation
                </span>
                <div className="flex items-center gap-1 text-amber-500 font-extrabold">
                  <Star className="w-4 h-4 fill-amber-500" />
                  <span>{w.avgRating} / 5</span>
                  <span className="text-[10px] text-stone-400 font-normal">
                    ({w.ratingsCount})
                  </span>
                </div>
              </div>

              {/* Task Counters */}
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2 rounded-xl bg-stone-100/70 dark:bg-stone-900/60">
                  <p className="text-lg font-extrabold text-emerald-500">{w.completed}</p>
                  <p className="text-[9px] uppercase font-bold text-stone-400">Resolved</p>
                </div>
                <div className="p-2 rounded-xl bg-stone-100/70 dark:bg-stone-900/60">
                  <p className="text-lg font-extrabold text-orange-500">{w.active}</p>
                  <p className="text-[9px] uppercase font-bold text-stone-400">In Progress</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
