import React, { useState, useEffect } from 'react';
import { UserCheck, Calendar, FileText, X, AlertCircle, CheckCircle } from 'lucide-react';
import api from '../../services/api';

export const WorkerAssignmentModal = ({ issue, isOpen, onClose, onSuccess }) => {
  const [workers, setWorkers] = useState([]);
  const [selectedWorkerId, setSelectedWorkerId] = useState('');
  const [deadline, setDeadline] = useState('');
  const [instructions, setInstructions] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchWorkers();
      if (issue?.assignedWorker) {
        setSelectedWorkerId(
          typeof issue.assignedWorker === 'object'
            ? issue.assignedWorker._id
            : issue.assignedWorker
        );
      }
      if (issue?.deadline) {
        setDeadline(new Date(issue.deadline).toISOString().split('T')[0]);
      }
    }
  }, [isOpen, issue]);

  const fetchWorkers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/workers');
      if (res.data.success) {
        setWorkers(res.data.workers || []);
      }
    } catch (err) {
      console.error('Failed to load workers', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!selectedWorkerId) {
      setError('Please select a maintenance technician.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await api.post(`/admin/issues/${issue._id}/assign`, {
        workerId: selectedWorkerId,
        deadline: deadline || undefined,
        instructions,
      });

      if (res.data.success) {
        if (onSuccess) onSuccess(res.data.issue);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Worker assignment failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen || !issue) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="glass-panel rounded-3xl max-w-xl w-full p-6 sm:p-7 relative border border-stone-200/70 dark:border-stone-800/80 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-stone-800/50"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5 text-indigo-600 dark:text-indigo-400 mb-2">
          <div className="p-2 rounded-xl bg-indigo-500/20">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
              Assign Maintenance Worker
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Dispatch certified technician to resolve "{issue.title}"
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleAssign} className="space-y-4 my-3">
          {/* Worker List Cards */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-2">
              Select Available Technician <span className="text-rose-500">*</span>
            </label>

            {loading ? (
              <div className="text-center py-6 text-xs text-stone-400">Loading workers...</div>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {workers.map((w) => {
                  const isSelected = selectedWorkerId === w._id;
                  return (
                    <div
                      key={w._id}
                      onClick={() => setSelectedWorkerId(w._id)}
                      className={`p-3 rounded-xl cursor-pointer transition-all border flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-500/15 shadow-sm'
                          : 'border-stone-200/60 dark:border-stone-800/60 glass-card hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={
                            w.avatar ||
                            `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(w.name)}`
                          }
                          alt={w.name}
                          className="w-9 h-9 rounded-lg object-cover ring-1 ring-stone-300 dark:ring-stone-700"
                        />
                        <div>
                          <p className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                            {w.name}
                            {isSelected && <CheckCircle className="w-3.5 h-3.5 text-indigo-500" />}
                          </p>
                          <p className="text-[10px] text-stone-500 dark:text-stone-400">
                            {w.department}
                          </p>
                          {w.specialties?.length > 0 && (
                            <div className="flex gap-1 mt-1 flex-wrap">
                              {w.specialties.map((s, idx) => (
                                <span
                                  key={idx}
                                  className="text-[9px] px-1.5 py-0.2 rounded bg-stone-200/70 dark:bg-stone-800/80 text-stone-600 dark:text-stone-300"
                                >
                                  {s}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-200/60 dark:bg-stone-800/80 text-stone-600 dark:text-stone-400">
                          {w.activeTasks || 0} active {w.activeTasks === 1 ? 'task' : 'tasks'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Deadline & Instructions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-indigo-500" /> Target Deadline
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full p-2.5 rounded-xl text-xs glass-input"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-indigo-500" /> Instructions / Notes
              </label>
              <input
                type="text"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="e.g. Inspect breaker panel first"
                className="w-full p-2.5 rounded-xl text-xs glass-input"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-3 border-t border-stone-200/50 dark:border-stone-800/60">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold glass-card text-stone-600 dark:text-stone-300 hover:text-stone-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg flex items-center gap-1.5"
            >
              <UserCheck className="w-3.5 h-3.5" />
              {submitting ? 'Assigning...' : 'Dispatch Worker'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
