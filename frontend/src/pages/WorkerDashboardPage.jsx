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
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { StatusBadge, PriorityBadge } from '../components/common/Badge';
import { ProofUploadModal } from '../components/worker/ProofUploadModal';

export const WorkerDashboardPage = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL', 'ASSIGNED', 'ACKNOWLEDGED', 'IN_PROGRESS', 'RESOLVED'

  const [selectedTask, setSelectedTask] = useState(null);
  const [showProofModal, setShowProofModal] = useState(false);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/workers/tasks', {
        params: { status: activeTab !== 'ALL' ? activeTab : undefined },
      });
      if (res.data.success) {
        setTasks(res.data.tasks || []);
      }
    } catch (err) {
      console.error('Failed to load worker tasks', err);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleAcknowledge = async (taskId) => {
    try {
      const res = await api.put(`/workers/tasks/${taskId}/acknowledge`);
      if (res.data.success) fetchTasks();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to acknowledge');
    }
  };

  const handleStartWork = async (taskId) => {
    try {
      const res = await api.put(`/workers/tasks/${taskId}/start`);
      if (res.data.success) fetchTasks();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to start task');
    }
  };

  const openProofModal = (task) => {
    setSelectedTask(task);
    setShowProofModal(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-stone-200/70 dark:border-stone-800/80 shadow-glass flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-orange-500/15 text-orange-600 dark:text-orange-400 border border-orange-500/30 mb-2">
            <Wrench className="w-3.5 h-3.5" />
            <span>Field Maintenance Technician Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100">
            Assigned Maintenance Tasks
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            Welcome, <strong>{user?.name}</strong>. Complete tasks, upload before/after proof, and request user verification.
          </p>
        </div>

        <button
          onClick={fetchTasks}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold glass-card text-stone-700 dark:text-stone-300 hover:border-orange-500"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Queue
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-stone-200/60 dark:border-stone-800/60 scrollbar-none">
        {[
          { id: 'ALL', label: 'All Tasks' },
          { id: 'ASSIGNED', label: 'New Assigned' },
          { id: 'ACKNOWLEDGED', label: 'Acknowledged' },
          { id: 'IN_PROGRESS', label: 'In Progress 🔨' },
          { id: 'RESOLVED', label: 'Completed Proof ✅' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-orange-500 text-white shadow-glowOrange'
                : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 glass-card'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tasks Queue */}
      {loading ? (
        <div className="text-center py-16 text-stone-400 text-xs">
          Loading assigned work orders...
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-16 glass-panel rounded-3xl border border-dashed border-stone-300 dark:border-stone-800">
          <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
            No Tasks in This Queue
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            You have no pending maintenance orders under the "{activeTab}" status.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="glass-card rounded-3xl p-5 sm:p-6 border border-stone-200/60 dark:border-stone-800/80 flex flex-col justify-between gap-4 hover:border-orange-500/40 transition-all"
            >
              <div className="space-y-3">
                {/* Status & Badges */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={task.status} />
                    <PriorityBadge priority={task.priority} score={task.priorityScore} />
                  </div>
                  <span className="text-[10px] uppercase font-bold text-orange-500">
                    👍 {task.upvotesCount} users affected
                  </span>
                </div>

                {/* Title */}
                <Link
                  to={`/issues/${task._id}`}
                  className="block font-bold text-base text-stone-900 dark:text-stone-100 hover:text-orange-500 transition-colors leading-snug"
                >
                  {task.title}
                </Link>

                {/* Location */}
                <div className="p-2.5 rounded-xl bg-stone-100/60 dark:bg-stone-900/50 flex items-center gap-2 text-xs text-stone-700 dark:text-stone-300">
                  <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
                  <span className="font-medium">
                    {task.location?.block} • {task.location?.floor} • {task.location?.area}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2 leading-relaxed">
                  {task.description}
                </p>

                {/* Reporter snippet */}
                <div className="text-[11px] text-stone-400 flex items-center justify-between pt-1">
                  <span>Reported by: {task.reportedBy?.name || 'Campus Student'}</span>
                  {task.deadline && (
                    <span className="text-rose-500 font-semibold">
                      Due: {new Date(task.deadline).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-stone-200/50 dark:border-stone-800/60 flex items-center justify-between gap-2">
                <Link
                  to={`/issues/${task._id}`}
                  className="text-xs font-semibold text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 flex items-center gap-1"
                >
                  View Ticket <ExternalLink className="w-3 h-3" />
                </Link>

                <div className="flex items-center gap-2">
                  {task.status === 'ASSIGNED' && (
                    <button
                      onClick={() => handleAcknowledge(task._id)}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-700 shadow-md transition-all"
                    >
                      Acknowledge Task
                    </button>
                  )}

                  {task.status === 'ACKNOWLEDGED' && (
                    <button
                      onClick={() => handleStartWork(task._id)}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 shadow-md transition-all"
                    >
                      Start On-Site Work
                    </button>
                  )}

                  {['ACKNOWLEDGED', 'IN_PROGRESS'].includes(task.status) && (
                    <button
                      onClick={() => openProofModal(task)}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-95 shadow-md flex items-center gap-1.5 transition-all"
                    >
                      <Camera className="w-3.5 h-3.5" /> Upload Proof & Resolve
                    </button>
                  )}

                  {['RESOLVED', 'CLOSED'].includes(task.status) && (
                    <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4" /> Proof Submitted
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
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
