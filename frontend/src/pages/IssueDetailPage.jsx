import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Clock,
  ThumbsUp,
  UserCheck,
  Wrench,
  ShieldCheck,
  Star,
  ArrowLeft,
  Calendar,
  AlertTriangle,
  RotateCcw,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { StatusBadge, PriorityBadge } from '../components/common/Badge';
import { CategoryBadge } from '../components/common/CategoryIcons';
import { IssueTimeline } from '../components/issues/IssueTimeline';
import { BeforeAfterViewer } from '../components/issues/BeforeAfterViewer';
import { VerificationModal } from '../components/verification/VerificationModal';
import { WorkerAssignmentModal } from '../components/admin/WorkerAssignmentModal';
import { StatusChangeModal } from '../components/admin/StatusChangeModal';
import { ProofUploadModal } from '../components/worker/ProofUploadModal';

export const IssueDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, isWorker } = useAuth();

  const [issue, setIssue] = useState(null);
  const [rating, setRating] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals state
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showProofModal, setShowProofModal] = useState(false);

  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [upvotesCount, setUpvotesCount] = useState(0);

  const fetchIssueDetail = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/issues/${id}`);
      if (res.data.success) {
        setIssue(res.data.issue);
        setRating(res.data.rating);
        setUpvotesCount(res.data.issue.upvotesCount || 1);
        if (user && res.data.issue.upvotes) {
          setHasUpvoted(
            res.data.issue.upvotes.some(
              (uid) => (typeof uid === 'object' ? uid._id : uid) === user._id
            )
          );
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load complaint details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssueDetail();
  }, [id, user]);

  const handleUpvote = async () => {
    if (!isAuthenticated) {
      alert('Please log in with your account to +1 this complaint!');
      return;
    }

    try {
      const res = await api.post(`/issues/${id}/upvote`);
      if (res.data.success) {
        setHasUpvoted(res.data.hasUpvoted);
        setUpvotesCount(res.data.upvotesCount);
        setIssue((prev) => ({
          ...prev,
          priority: res.data.priority,
          priorityScore: res.data.priorityScore,
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Quick Worker Actions
  const handleWorkerAction = async (actionType) => {
    try {
      if (actionType === 'acknowledge') {
        const res = await api.put(`/workers/tasks/${id}/acknowledge`);
        if (res.data.success) fetchIssueDetail();
      } else if (actionType === 'start') {
        const res = await api.put(`/workers/tasks/${id}/start`);
        if (res.data.success) fetchIssueDetail();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-slate-400">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm">Loading complaint details and verification proof...</p>
      </div>
    );
  }

  if (error || !issue) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          {error || 'Issue Not Found'}
        </h2>
        <Link
          to="/"
          className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold glass-card"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Public Feed
        </Link>
      </div>
    );
  }

  const isReporter =
    user && (typeof issue.reportedBy === 'object' ? issue.reportedBy._id : issue.reportedBy) === user._id;
  const isAssignedWorker =
    user && (typeof issue.assignedWorker === 'object' ? issue.assignedWorker?._id : issue.assignedWorker) === user._id;

  const isPendingVerification = issue.status === 'RESOLVED';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back Link & Quick Nav */}
      <div className="flex items-center justify-between">
        <Link
          to="/feed"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Feed
        </Link>

        {/* Admin Quick Toolbar */}
        {isAdmin && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowStatusModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold glass-card text-slate-700 dark:text-slate-200 hover:border-indigo-500"
            >
              <Sliders className="w-3.5 h-3.5 text-indigo-500" /> Status
            </button>
            <button
              onClick={() => setShowAssignModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md"
            >
              <UserCheck className="w-3.5 h-3.5" /> Assign Worker
            </button>
          </div>
        )}
      </div>

      {/* Verification Action Banner (if RESOLVED) */}
      {isPendingVerification && (
        <div className="p-5 sm:p-6 rounded-3xl glass-panel border border-emerald-500/40 bg-emerald-500/10 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 animate-pulse-subtle">
          <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
            <div className="p-3 rounded-2xl bg-emerald-500/20 shrink-0">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                Maintenance Completed! User Verification Required
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                The assigned technician marked this issue as resolved. Inspect the work proof below and verify if the issue is truly solved.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowVerifyModal(true)}
            className="w-full sm:w-auto shrink-0 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-95 shadow-glowEmerald"
          >
            Verify & Rate Resolution
          </button>
        </div>
      )}

      {/* Main Issue Card Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border border-slate-200/70 dark:border-slate-800/80 shadow-glass">
        {/* Badges & Meta */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <CategoryBadge category={issue.category} />
            <StatusBadge status={issue.status} />
            <PriorityBadge priority={issue.priority} score={issue.priorityScore} />
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Reported {new Date(issue.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 leading-tight">
          {issue.title}
        </h1>

        {/* Location Banner */}
        <div className="p-3.5 rounded-2xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/60 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
            <MapPin className="w-4 h-4 text-cyan-500 shrink-0" />
            <span>
              {issue.location?.block} • {issue.location?.floor} • {issue.location?.area}
            </span>
          </div>
          <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 bg-slate-200/60 dark:bg-slate-800/80 px-2 py-0.5 rounded-md">
            On Campus
          </span>
        </div>

        {/* Description */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Problem Description
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
            {issue.description}
          </p>
        </div>

        {/* Media Gallery (if any photos uploaded) */}
        {issue.images && issue.images.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Attached Evidence Photos
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {issue.images.map((img, i) => {
                const src = img.startsWith('http://localhost:5000')
                  ? img.replace('http://localhost:5000', '')
                  : img;
                return (
                  <div
                    key={i}
                    className="relative h-64 rounded-2xl overflow-hidden border border-slate-200/70 dark:border-slate-800/80 bg-slate-900/20"
                  >
                    <img src={src} alt="Evidence" className="w-full h-full object-cover" />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Community +1 Endorsement Bar */}
        <div className="p-4 rounded-2xl glass-card border border-indigo-500/25 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-indigo-600 dark:text-cyan-400 flex items-center gap-1.5">
              <ThumbsUp className="w-4 h-4" /> Community Prioritization
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              <strong>{upvotesCount} campus members</strong> have endorsed this issue.
            </p>
          </div>

          <button
            onClick={handleUpvote}
            className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              hasUpvoted
                ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-glowBrand scale-105'
                : 'bg-slate-200/60 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-indigo-500/15 hover:text-indigo-600 dark:hover:text-cyan-400'
            }`}
          >
            <ThumbsUp className={`w-3.5 h-3.5 ${hasUpvoted ? 'fill-white' : ''}`} />
            <span>{hasUpvoted ? "You +1'd This Issue" : "+1 I'm Facing This Too"}</span>
            <span className="font-mono opacity-80">({upvotesCount})</span>
          </button>
        </div>

        {/* Stakeholder Details (Reporter & Assigned Worker) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200/50 dark:border-slate-800/60">
          {/* Reporter */}
          <div className="flex items-center gap-3 p-3.5 rounded-2xl glass-card">
            <img
              src={
                issue.reportedBy?.avatar ||
                `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(
                  issue.reportedBy?.name || 'Reporter'
                )}`
              }
              alt="Reporter"
              className="w-10 h-10 rounded-xl object-cover ring-1 ring-indigo-500/30"
            />
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Reported By</span>
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                {issue.reportedBy?.name || 'Campus Resident'}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {issue.reportedBy?.department || 'General'}
              </p>
            </div>
          </div>

          {/* Assigned Worker */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl glass-card">
            <div className="flex items-center gap-3">
              <img
                src={
                  issue.assignedWorker?.avatar ||
                  `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(
                    issue.assignedWorker?.name || 'Worker'
                  )}`
                }
                alt="Worker"
                className="w-10 h-10 rounded-xl object-cover ring-1 ring-cyan-500/30"
              />
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Assigned Tech</span>
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  {issue.assignedWorker?.name || 'Unassigned (Pending Admin)'}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {issue.assignedWorker?.department || 'Awaiting dispatch'}
                </p>
              </div>
            </div>

            {/* Worker quick actions if current logged in worker is assigned */}
            {isAssignedWorker && (
              <div className="flex items-center gap-1.5">
                {issue.status === 'ASSIGNED' && (
                  <button
                    onClick={() => handleWorkerAction('acknowledge')}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-700 shadow-sm"
                  >
                    Acknowledge
                  </button>
                )}
                {issue.status === 'ACKNOWLEDGED' && (
                  <button
                    onClick={() => handleWorkerAction('start')}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 shadow-sm"
                  >
                    Start Work
                  </button>
                )}
                {['ACKNOWLEDGED', 'IN_PROGRESS'].includes(issue.status) && (
                  <button
                    onClick={() => setShowProofModal(true)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm"
                  >
                    Complete & Proof
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Proof of Work Before & After Viewer */}
      <BeforeAfterViewer proof={issue.proof} originalImages={issue.images} />

      {/* Rating & Review Section (if resolved/closed with feedback) */}
      {rating && (
        <div className="glass-card rounded-2xl p-6 border border-indigo-500/30 bg-indigo-500/5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Verified User Rating & Review
              </h3>
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-4 h-4 ${
                    rating.rating >= s
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-slate-300 dark:text-slate-700'
                  }`}
                />
              ))}
              <span className="text-xs font-bold text-amber-500 ml-1.5">
                {rating.rating}/5
              </span>
            </div>
          </div>
          {rating.review && (
            <p className="text-xs text-slate-600 dark:text-slate-300 italic pl-7">
              "{rating.review}"
            </p>
          )}
        </div>
      )}

      {/* Issue Lifecycle Timeline */}
      <IssueTimeline timeline={issue.timeline} currentStatus={issue.status} />

      {/* Modals */}
      <VerificationModal
        issue={issue}
        isOpen={showVerifyModal}
        onClose={() => setShowVerifyModal(false)}
        onSuccess={(updated) => setIssue(updated)}
      />

      <WorkerAssignmentModal
        issue={issue}
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        onSuccess={(updated) => setIssue(updated)}
      />

      <StatusChangeModal
        issue={issue}
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        onSuccess={(updated) => setIssue(updated)}
      />

      <ProofUploadModal
        task={issue}
        isOpen={showProofModal}
        onClose={() => setShowProofModal(false)}
        onSuccess={(updated) => setIssue(updated)}
      />
    </div>
  );
};
