import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Wrench,
  CheckCircle,
  Clock,
  MapPin,
  Camera,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  User,
  Shield,
  Phone,
  Calendar,
  FileText,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { StatusBadge, PriorityBadge } from '../components/common/Badge';
import { ProofUploadModal } from '../components/worker/ProofUploadModal';

export const WorkerDashboardPage = () => {
  const { user, isAdmin } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL', 'ASSIGNED', 'ACKNOWLEDGED', 'IN_PROGRESS', 'RESOLVED'

  // Admin supervision state
  const [workersList, setWorkersList] = useState([]);
  const [selectedWorkerId, setSelectedWorkerId] = useState('ALL');

  const [selectedTask, setSelectedTask] = useState(null);
  const [showProofModal, setShowProofModal] = useState(false);

  // If Admin, load workers list so they can supervise any technician queue
  useEffect(() => {
    if (isAdmin) {
      api.get('/admin/workers')
        .then((res) => {
          if (res.data.success) {
            setWorkersList(res.data.workers || []);
          }
        })
        .catch((err) => console.warn('Could not load worker list for admin', err));
    }
  }, [isAdmin]);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        status: activeTab !== 'ALL' ? activeTab : undefined,
      };

      if (isAdmin && selectedWorkerId !== 'ALL') {
        params.workerId = selectedWorkerId;
      }

      const res = await api.get('/workers/tasks', { params });
      if (res.data.success) {
        setTasks(res.data.tasks || []);
      }
    } catch (err) {
      console.error('Failed to load worker tasks', err);
    } finally {
      setLoading(false);
    }
  }, [activeTab, isAdmin, selectedWorkerId]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleAcknowledge = async (taskId) => {
    try {
      const res = await api.put(`/workers/tasks/${taskId}/acknowledge`);
      if (res.data.success) {
        setTasks((prev) =>
          prev.map((t) => (t._id === taskId ? { ...t, status: 'ACKNOWLEDGED' } : t))
        );
        fetchTasks();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to acknowledge');
    }
  };

  const handleStartWork = async (taskId) => {
    try {
      const res = await api.put(`/workers/tasks/${taskId}/start`);
      if (res.data.success) {
        setTasks((prev) =>
          prev.map((t) => (t._id === taskId ? { ...t, status: 'IN_PROGRESS' } : t))
        );
        fetchTasks();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to start task');
    }
  };

  const openProofModal = (task) => {
    setSelectedTask(task);
    setShowProofModal(true);
  };

  // Extract latest instruction note from timeline
  const getAssignmentNote = (task) => {
    const assignmentEntry = [...(task.timeline || [])]
      .reverse()
      .find((t) => t.status === 'ASSIGNED');
    return assignmentEntry ? assignmentEntry.note : null;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-200/70 dark:border-slate-800/80 shadow-glass flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
        {/* Subtle background emblem watermark */}
        <div className="absolute -right-8 -bottom-8 w-44 h-44 opacity-5 dark:opacity-10 pointer-events-none select-none">
          <img src="/campusfixWithoutNamelogo.png" alt="" className="w-full h-full object-contain" />
        </div>

        <div className="flex items-start gap-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 hidden sm:block drop-shadow-lg">
            <img src="/campusfixWithoutNamelogo.png" alt="CampusFix" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 mb-2">
              <Wrench className="w-3.5 h-3.5 text-cyan-500" />
              <span>Field Maintenance Technician Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
              Assigned Maintenance Tasks
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Logged in as <strong>{user?.name || 'Maintenance Staff'}</strong> ({user?.role}) •{' '}
              {user?.department || 'Facility Department'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          {isAdmin && (
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700">
              <Shield className="w-4 h-4 text-indigo-500 ml-2 shrink-0" />
              <select
                value={selectedWorkerId}
                onChange={(e) => setSelectedWorkerId(e.target.value)}
                className="text-xs bg-transparent font-semibold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer pr-2"
              >
                <option value="ALL">All Technicians</option>
                {workersList.map((w) => (
                  <option key={w._id} value={w._id}>
                    {w.name} ({w.activeTasks || 0} active)
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={fetchTasks}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold glass-card text-slate-700 dark:text-slate-300 hover:border-cyan-500 shrink-0 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh Queue
          </button>
        </div>
      </div>

      {/* Admin Supervise Banner */}
      {isAdmin && (
        <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-700 dark:text-indigo-300 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Shield className="w-5 h-5 shrink-0 text-indigo-500" />
            <div>
              <p className="font-bold">Administrator Supervise Mode</p>
              <p className="opacity-80">
                You are viewing field tickets as an Administrator. You can switch technician queues above or monitor all assigned orders across staff.
              </p>
            </div>
          </div>
          <Link
            to="/admin"
            className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 shrink-0 shadow-sm"
          >
            Back to Admin Center
          </Link>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200/60 dark:border-slate-800/60 scrollbar-none">
        {[
          { id: 'ALL', label: 'All Work Orders' },
          { id: 'ASSIGNED', label: 'New Assigned' },
          { id: 'ACKNOWLEDGED', label: 'Acknowledged' },
          { id: 'IN_PROGRESS', label: 'In Progress 🔨' },
          { id: 'RESOLVED', label: 'Completed / Proof ✅' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-glowBrand'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 glass-card'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tasks Queue */}
      {loading ? (
        <div className="text-center py-20 text-slate-400 text-xs">
          <div className="w-8 h-8 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          Loading assigned work orders from database...
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-16 glass-panel rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 space-y-3">
          <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            No Assigned Tasks in This Queue
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            {activeTab === 'ALL'
              ? 'There are currently no maintenance work orders assigned to this technician. Once tickets are assigned from the Admin Center, they will appear here in real-time.'
              : `You have no maintenance work orders under the "${activeTab}" status filter.`}
          </p>
          <div className="pt-2">
            <button
              onClick={() => setActiveTab('ALL')}
              className="px-4 py-2 rounded-xl text-xs font-bold glass-card text-indigo-600 dark:text-cyan-400 hover:border-indigo-500 cursor-pointer"
            >
              View All Assigned Orders
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {tasks.map((task) => {
            const assignmentNote = getAssignmentNote(task);

            return (
              <div
                key={task._id}
                className="glass-card rounded-3xl p-5 sm:p-6 border border-slate-200/70 dark:border-slate-800/80 flex flex-col justify-between gap-4 hover:border-indigo-500/40 transition-all shadow-sm"
              >
                <div className="space-y-3.5">
                  {/* Status & Priority Badges */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={task.status} />
                      <PriorityBadge priority={task.priority} score={task.priorityScore} />
                    </div>
                    <span className="text-[10px] uppercase font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">
                      👍 {task.upvotesCount || 1} community votes
                    </span>
                  </div>

                  {/* Assigned Technician Tag (Supervision View) */}
                  {task.assignedWorker && (
                    <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                      <img
                        src={
                          task.assignedWorker.avatar ||
                          `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(
                            task.assignedWorker.name || 'Worker'
                          )}`
                        }
                        alt=""
                        className="w-5 h-5 rounded-full object-cover ring-1 ring-cyan-500/40"
                      />
                      <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-200">
                        Technician: <strong>{task.assignedWorker.name}</strong>
                      </span>
                    </div>
                  )}

                  {/* Title */}
                  <Link
                    to={`/issues/${task._id}`}
                    className="block font-bold text-base text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors leading-snug"
                  >
                    {task.title}
                  </Link>

                  {/* Location Info */}
                  <div className="p-3 rounded-2xl bg-slate-100/70 dark:bg-slate-900/60 flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 border border-slate-200/40 dark:border-slate-800/40">
                    <MapPin className="w-4 h-4 text-cyan-500 shrink-0" />
                    <span className="font-semibold">
                      {task.location?.block} • {task.location?.floor} • {task.location?.area}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {task.description}
                  </p>

                  {/* Instructions from Admin if present */}
                  {assignmentNote && (
                    <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-900 dark:text-indigo-300 flex items-start gap-2">
                      <FileText className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                      <p className="text-[11px] leading-relaxed">
                        <strong className="font-bold">Instructions: </strong>
                        {assignmentNote}
                      </p>
                    </div>
                  )}

                  {/* Meta snippet: Reporter & Deadline */}
                  <div className="text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-200/40 dark:border-slate-800/40">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      Reported by: <strong>{task.reportedBy?.name || 'Campus Student'}</strong>
                      {task.reportedBy?.phone && ` (${task.reportedBy.phone})`}
                    </span>
                    {task.deadline && (
                      <span className="text-rose-500 font-bold flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Due: {new Date(task.deadline).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-3 border-t border-slate-200/50 dark:border-slate-800/60 flex items-center justify-between gap-2 flex-wrap">
                  <Link
                    to={`/issues/${task._id}`}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 cursor-pointer"
                  >
                    View Ticket Details <ExternalLink className="w-3 h-3" />
                  </Link>

                  <div className="flex items-center gap-2">
                    {task.status === 'ASSIGNED' && (
                      <button
                        onClick={() => handleAcknowledge(task._id)}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-700 shadow-glowCyan transition-all hover:scale-105 cursor-pointer"
                      >
                        Acknowledge Task
                      </button>
                    )}

                    {task.status === 'ACKNOWLEDGED' && (
                      <button
                        onClick={() => handleStartWork(task._id)}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-glowBrand transition-all hover:scale-105 cursor-pointer"
                      >
                        Start On-Site Work
                      </button>
                    )}

                    {['ACKNOWLEDGED', 'IN_PROGRESS'].includes(task.status) && (
                      <button
                        onClick={() => openProofModal(task)}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-95 shadow-glowEmerald flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer"
                      >
                        <Camera className="w-3.5 h-3.5" /> Upload Proof & Resolve
                      </button>
                    )}

                    {['RESOLVED', 'CLOSED', 'USER_VERIFIED'].includes(task.status) && (
                      <span className="text-xs font-bold text-emerald-500 flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                        <ShieldCheck className="w-4 h-4" /> Proof Submitted
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Proof Upload Modal */}
      <ProofUploadModal
        task={selectedTask}
        isOpen={showProofModal}
        onClose={() => setShowProofModal(false)}
        onSuccess={() => fetchTasks()}
      />
    </div>
  );
};
