import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Clock,
  ThumbsUp,
  Flame,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { StatusBadge, PriorityBadge } from '../common/Badge';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export const IssueCard = ({ issue, onUpvoteChange }) => {
  const { user, isAuthenticated } = useAuth();
  const [upvotesCount, setUpvotesCount] = useState(issue.upvotesCount || 1);
  const [hasUpvoted, setHasUpvoted] = useState(
    issue.upvotes?.some((id) => (typeof id === 'object' ? id._id : id) === user?._id)
  );
  const [isUpvoting, setIsUpvoting] = useState(false);

  const handleUpvote = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      alert('Please log in or select a demo account to +1 this issue!');
      return;
    }

    try {
      setIsUpvoting(true);
      const res = await api.post(`/issues/${issue._id}/upvote`);
      if (res.data.success) {
        setHasUpvoted(res.data.hasUpvoted);
        setUpvotesCount(res.data.upvotesCount);
        if (onUpvoteChange) {
          onUpvoteChange(issue._id, res.data.upvotesCount, res.data.hasUpvoted);
        }
      }
    } catch (err) {
      console.error('Failed to upvote', err);
    } finally {
      setIsUpvoting(false);
    }
  };

  const formattedDate = new Date(issue.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  const thumbnail =
    issue.images && issue.images.length > 0
      ? issue.images[0].startsWith('/uploads')
        ? `http://localhost:5000${issue.images[0]}`
        : issue.images[0]
      : null;

  return (
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col group border border-stone-200/60 dark:border-stone-800/80 hover:border-amber-500/40 transition-all duration-300">
      {/* Thumbnail Banner (if image exists) */}
      {thumbnail && (
        <div className="relative h-44 w-full overflow-hidden bg-stone-900/10">
          <img
            src={thumbnail}
            alt={issue.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-black/50 text-white backdrop-blur-md border border-white/20">
              {issue.category}
            </span>
          </div>
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
            <span className="flex items-center gap-1 font-medium drop-shadow">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              {issue.location?.block} • {issue.location?.area}
            </span>
          </div>
        </div>
      )}

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Header Badges if no image */}
          {!thumbnail && (
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                {issue.category}
              </span>
              <span className="flex items-center gap-1 text-[11px] text-stone-400">
                <MapPin className="w-3 h-3 text-amber-500" />
                {issue.location?.block}
              </span>
            </div>
          )}

          {/* Status & Priority Row */}
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <StatusBadge status={issue.status} />
            <PriorityBadge priority={issue.priority} score={issue.priorityScore} />
          </div>

          {/* Title */}
          <Link to={`/issues/${issue._id}`}>
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 group-hover:text-amber-500 transition-colors line-clamp-2 leading-snug">
              {issue.title}
            </h3>
          </Link>

          {/* Description */}
          <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2 mt-2 leading-relaxed">
            {issue.description}
          </p>

          {/* Proof Indicator banner if resolved */}
          {issue.status === 'RESOLVED' && issue.proof?.afterMedia?.length > 0 && (
            <div className="mt-3 p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> Work Proof Uploaded
              </span>
              <span className="text-[10px] uppercase font-bold underline">Verify Now</span>
            </div>
          )}
        </div>

        {/* Card Footer */}
        <div className="pt-4 mt-4 border-t border-stone-200/50 dark:border-stone-800/60 flex items-center justify-between gap-2">
          {/* +1 Upvote Button */}
          <button
            onClick={handleUpvote}
            disabled={isUpvoting}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              hasUpvoted
                ? 'bg-amber-500 text-white shadow-glowAmber scale-105'
                : 'bg-stone-200/60 dark:bg-stone-800/80 text-stone-700 dark:text-stone-300 hover:bg-amber-500/15 hover:text-amber-500 hover:border-amber-500/30'
            }`}
            title="Click to +1 if you are also facing this problem"
          >
            <ThumbsUp className={`w-3.5 h-3.5 ${hasUpvoted ? 'fill-white' : ''}`} />
            <span>+1</span>
            <span className="opacity-90 font-mono">({upvotesCount})</span>
          </button>

          {/* Reporter & Details CTA */}
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-stone-400 hidden sm:inline">
              {formattedDate}
            </span>
            <Link
              to={`/issues/${issue._id}`}
              className="flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline"
            >
              Details <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
