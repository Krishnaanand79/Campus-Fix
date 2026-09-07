import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Sliders,
  UserCheck,
  AlertTriangle,
  Clock,
  CheckCircle2,
  TrendingUp,
  LayoutDashboard,
  Search,
  Filter,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import api from '../services/api';
import { StatusBadge, PriorityBadge } from '../components/common/Badge';
import { WorkerAssignmentModal } from '../components/admin/WorkerAssignmentModal';
import { StatusChangeModal } from '../components/admin/StatusChangeModal';

export const AdminDashboardPage = () => {
  const [issues, setIssues] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  // Selected issue for modals
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  const fetchAdminData = useCallback(async () => {
    try {
      setLoading(true);
      const [issuesRes, statsRes] = await Promise.all([
        api.get('/admin/issues', {
          params: {
            search: search || undefined,
            status: statusFilter !== 'All' ? statusFilter : undefined,
            priority: priorityFilter !== 'All' ? priorityFilter : undefined,
            limit: 50,
          },
        }),
        api.get('/analytics/dashboard'),
      ]);

      if (issuesRes.data.success) setIssues(issuesRes.data.issues || []);
      if (statsRes.data.success) setStats(statsRes.data.stats || null);
    } catch (err) {
      console.error('Failed to load admin data', err);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, priorityFilter]);

  useEffect(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  const openAssignModal = (issue) => {
    setSelectedIssue(issue);
    setShowAssignModal(true);
  };

  const openStatusModal = (issue) => {
    setSelectedIssue(issue);
    setShowStatusModal(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-stone-200/70 dark:border-stone-800/80 shadow-glass flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30 mb-2">
            <Shield className="w-3.5 h-3.5" />
            <span>Campus Operations & Estate Directorate</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100">
            Maintenance Command Center
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            Review community complaints, calibrate smart priority, and dispatch certified technicians.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/analytics"
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md flex items-center gap-1.5"
          >
            <LayoutDashboard className="w-4 h-4" /> Full Analytics
          </Link>
          <button
            onClick={fetchAdminData}
            className="p-2 rounded-xl glass-card text-stone-600 dark:text-stone-300 hover:text-indigo-500"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="glass-card rounded-2xl p-4 border border-stone-200/60 dark:border-stone-800/60">
          <p className="text-[10px] uppercase font-bold text-stone-400">Total Tracked</p>
          <p className="text-2xl font-extrabold text-stone-900 dark:text-stone-100 mt-1">
            {stats?.total || 0}
          </p>
          <span className="text-[10px] text-amber-500 font-semibold">Campus-Wide</span>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-stone-200/60 dark:border-stone-800/60">
          <p className="text-[10px] uppercase font-bold text-stone-400">Under Review</p>
          <p className="text-2xl font-extrabold text-amber-500 mt-1">
            {stats?.pending || 0}
          </p>
          <span className="text-[10px] text-stone-400">Needs verification</span>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-stone-200/60 dark:border-stone-800/60">
          <p className="text-[10px] uppercase font-bold text-stone-400">In Progress</p>
          <p className="text-2xl font-extrabold text-orange-500 mt-1">
            {stats?.inProgress || 0}
          </p>
          <span className="text-[10px] text-stone-400">Workers dispatched</span>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-stone-200/60 dark:border-stone-800/60">
          <p className="text-[10px] uppercase font-bold text-stone-400">Critical Alerts</p>
          <p className="text-2xl font-extrabold text-rose-500 mt-1">
            {stats?.critical || 0}
          </p>
          <span className="text-[10px] text-rose-400">Immediate hazard</span>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-stone-200/60 dark:border-stone-800/60 col-span-2 lg:col-span-1">
          <p className="text-[10px] uppercase font-bold text-stone-400">Avg Resolution</p>
          <p className="text-2xl font-extrabold text-emerald-500 mt-1">
            {stats?.avgResolutionHours || 0}h
          </p>
          <span className="text-[10px] text-emerald-400">Turnaround time</span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="glass-panel rounded-2xl p-4 border border-stone-200/60 dark:border-stone-800/60 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search title, location, room..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs glass-input"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl text-xs glass-input cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="REPORTED">Reported</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
            <option value="REOPENED">Reopened</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl text-xs glass-input cursor-pointer"
          >
            <option value="All">All Priorities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      {/* Issues Management Table */}
      <div className="glass-panel rounded-3xl overflow-hidden border border-stone-200/70 dark:border-stone-800/80 shadow-glass">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-stone-200/60 dark:border-stone-800/60 bg-stone-100/50 dark:bg-stone-900/50 text-stone-500 dark:text-stone-400 uppercase text-[10px] tracking-wider font-bold">
                <th className="p-4">Issue Title & Category</th>
                <th className="p-4">Location</th>
                <th className="p-4">+1 Votes</th>
                <th className="p-4">Smart Priority</th>
                <th className="p-4">Current Status</th>
                <th className="p-4">Assigned Worker</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200/50 dark:divide-stone-800/50">
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-stone-400">
                    Loading admin table...
                  </td>
                </tr>
              ) : issues.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-stone-400">
                    No complaints match the filter.
                  </td>
                </tr>
              ) : (
                issues.map((issue) => (
                  <tr
                    key={issue._id}
                    className="hover:bg-amber-500/5 transition-colors group"
                  >
                    <td className="p-4 max-w-xs">
                      <Link
                        to={`/issues/${issue._id}`}
                        className="font-bold text-stone-900 dark:text-stone-100 hover:text-amber-500 flex items-center gap-1.5 leading-snug line-clamp-2"
                      >
                        {issue.title}
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                      </Link>
                      <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                        {issue.category}
                      </span>
                    </td>

                    <td className="p-4 whitespace-nowrap text-stone-600 dark:text-stone-300">
                      <p className="font-semibold">{issue.location?.block}</p>
                      <p className="text-[10px] text-stone-400">{issue.location?.area}</p>
                    </td>

                    <td className="p-4 whitespace-nowrap font-bold text-amber-500">
                      👍 {issue.upvotesCount || 1}
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      <PriorityBadge priority={issue.priority} score={issue.priorityScore} />
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      <StatusBadge status={issue.status} />
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      {issue.assignedWorker ? (
                        <div className="flex items-center gap-2">
                          <img
                            src={
                              issue.assignedWorker.avatar ||
                              `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(
                                issue.assignedWorker.name
                              )}`
                            }
                            alt=""
                            className="w-6 h-6 rounded-md object-cover ring-1 ring-stone-300"
                          />
                          <span className="font-semibold text-stone-800 dark:text-stone-200">
                            {issue.assignedWorker.name}
                          </span>
                        </div>
                      ) : (
                        <span className="text-stone-400 italic">Unassigned</span>
                      )}
                    </td>

                    <td className="p-4 whitespace-nowrap text-right space-x-1.5">
                      <button
                        onClick={() => openAssignModal(issue)}
                        className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20"
                        title="Assign or reassign technician"
                      >
                        Assign
                      </button>
                      <button
                        onClick={() => openStatusModal(issue)}
                        className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-stone-600 dark:text-stone-300 bg-stone-200/60 dark:bg-stone-800/80 hover:bg-stone-300"
                        title="Change status"
                      >
                        Status
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <WorkerAssignmentModal
        issue={selectedIssue}
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        onSuccess={() => fetchAdminData()}
      />

      <StatusChangeModal
        issue={selectedIssue}
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        onSuccess={() => fetchAdminData()}
      />
    </div>
  );
};
