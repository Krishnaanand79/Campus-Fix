import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderPlus,
  ThumbsUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { StatusBadge, PriorityBadge } from '../components/common/Badge';

export const UserDashboardPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('reported'); // 'reported', 'upvoted', 'pending'
  const [myIssues, setMyIssues] = useState([]);
  const [upvotedIssues, setUpvotedIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const [resMy, resUpvoted] = await Promise.all([
        api.get('/issues/my'),
        api.get('/issues/my-upvotes'),
      ]);

      if (resMy.data.success) setMyIssues(resMy.data.issues || []);
      if (resUpvoted.data.success) setUpvotedIssues(resUpvoted.data.issues || []);
    } catch (err) {
      console.error('Failed to load user issues', err);
    } finally {
      setLoading(false);
    }
  };

  const pendingVerification = myIssues.filter((i) => i.status === 'RESOLVED');

  const currentList =
    activeTab === 'reported'
      ? myIssues
      : activeTab === 'upvoted'
      ? upvotedIssues
      : pendingVerification;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Profile Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-200/70 dark:border-slate-800/80 shadow-glass flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
        {/* Subtle background emblem watermark */}
        <div className="absolute -right-8 -bottom-8 w-40 h-40 opacity-5 dark:opacity-10 pointer-events-none select-none">
          <img src="/campusfixWithoutNamelogo.png" alt="" className="w-full h-full object-contain" />
        </div>

        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="relative">
            <img
              src={
                user?.avatar ||
                `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user?.name || 'User')}`
              }
              alt="Profile"
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500/40 shadow-md"
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-900 p-0.5 border border-indigo-500/40 shadow-sm">
              <img src="/campusfixWithoutNamelogo.png" alt="CampusFix" className="w-full h-full object-contain" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                {user?.name}
              </h1>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-600 dark:text-cyan-400 border border-indigo-500/30">
                {user?.role}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {user?.department} • {user?.email}
            </p>
          </div>
        </div>

        <Link
          to="/report"
          className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 hover:opacity-95 shadow-glowBrand flex items-center gap-1.5 cursor-pointer relative z-10"
        >
          <PlusCircle className="w-4 h-4" /> Report New Problem
        </Link>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-4 border border-slate-200/70 dark:border-slate-800/80 flex items-center gap-3">
          <div className="p-3 rounded-xl bg-indigo-500/15 text-indigo-500">
            <FolderPlus className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
              {myIssues.length}
            </p>
            <p className="text-xs text-slate-400">My Reported Issues</p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-slate-200/70 dark:border-slate-800/80 flex items-center gap-3">
          <div className="p-3 rounded-xl bg-cyan-500/15 text-cyan-500">
            <ThumbsUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
              {upvotedIssues.length}
            </p>
            <p className="text-xs text-slate-400">Issues Supported (+1)</p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-slate-200/70 dark:border-slate-800/80 flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-500/15 text-emerald-500">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
              {pendingVerification.length}
            </p>
            <p className="text-xs text-slate-400">Pending Verification</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200/60 dark:border-slate-800/60 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('reported')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'reported'
              ? 'bg-indigo-500/15 text-indigo-600 dark:text-cyan-400 border border-indigo-500/30'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          My Reported Complaints ({myIssues.length})
        </button>

        <button
          onClick={() => setActiveTab('upvoted')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'upvoted'
              ? 'bg-indigo-500/15 text-indigo-600 dark:text-cyan-400 border border-indigo-500/30'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Supported by Me ({upvotedIssues.length})
        </button>

        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'pending'
              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Awaiting Verification ({pendingVerification.length})
        </button>
      </div>

      {/* Issues Table / Cards */}
      {loading ? (
        <div className="text-center py-12 text-slate-400 text-xs">Loading issues...</div>
      ) : currentList.length === 0 ? (
        <div className="text-center py-16 px-4 glass-panel rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 space-y-4 max-w-2xl mx-auto">
          <div className="w-20 h-20 mx-auto drop-shadow-md">
            <img src="/campusfixWithoutNamelogo.png" alt="CampusFix" className="w-full h-full object-contain" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {activeTab === 'reported'
                ? 'No Complaints Submitted Yet'
                : activeTab === 'upvoted'
                ? 'No Supported Complaints'
                : 'No Issues Pending Verification'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
              {activeTab === 'reported'
                ? 'Spot a broken facility around campus? Report it with photos to notify maintenance technicians.'
                : activeTab === 'upvoted'
                ? 'Browse the live feed and upvote issues affecting you to boost their priority!'
                : 'When technicians resolve your complaints, they will appear here for your satisfaction verification.'}
            </p>
          </div>
          {activeTab === 'reported' && (
            <Link
              to="/report"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-cyan-500 hover:opacity-95 shadow-glowBrand transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5" /> Submit First Complaint
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {currentList.map((issue) => (
            <div
              key={issue._id}
              className="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200/70 dark:border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-indigo-500/40 transition-all"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <StatusBadge status={issue.status} />
                  <PriorityBadge priority={issue.priority} score={issue.priorityScore} />
                  <span className="text-[10px] text-slate-400">
                    {new Date(issue.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                  {issue.title}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {issue.location?.block} • {issue.location?.area} • 👍 {issue.upvotesCount} users affected
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {issue.status === 'RESOLVED' && (
                  <span className="px-3 py-1 rounded-xl text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/30">
                    Action Required
                  </span>
                )}
                <Link
                  to={`/issues/${issue._id}`}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-indigo-600 dark:text-cyan-400 glass-panel hover:bg-indigo-500/10 flex items-center gap-1 cursor-pointer"
                >
                  View Details <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
