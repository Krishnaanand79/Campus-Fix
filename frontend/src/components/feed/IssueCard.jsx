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
import { CategoryBadge, CATEGORY_CONFIG } from '../common/CategoryIcons';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export const IssueCard = ({ issue, onUpvoteChange }) => {
  const { user, isAuthenticated } = useAuth();
  const [upvotesCount, setUpvotesCount] = useState(issue.upvotesCount || 1);
  const [hasUpvoted, setHasUpvoted] = useState(
    issue.upvotes?.some((id) => (typeof id === 'object' ? id._id : id) === user?._id)
  );
  const [isUpvoting, setIsUpvoting] = useState(false);

  const catConfig = CATEGORY_CONFIG[issue.category] || CATEGORY_CONFIG.Other;

  const handleUpvote = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      alert('Please log in with your resident account to +1 this issue!');
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
    <div className="glass-card rounded-3xl overflow-hidden flex flex-col justify-between group border border-slate-200/70 dark:border-slate-800/80 hover:border-indigo-500/50 hover:shadow-glowBrand transition-all duration-300">
      <div>
        {/* Thumbnail Banner or Category SVG Vector Banner */}
        {thumbnail ? (
          <div className="relative h-44 w-full overflow-hidden bg-slate-900/20">
            <img
              src={thumbnail}
              alt={issue.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
              <CategoryBadge category={issue.category} size="xs" />
            </div>
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
              <span className="flex items-center gap-1 font-semibold drop-shadow truncate">
                <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                {issue.location?.block} • {issue.location?.area}
              </span>
            </div>
          </div>
        ) : (
          <div className={`relative h-28 w-full overflow-hidden bg-gradient-to-br ${catConfig.gradient} p-4 flex flex-col justify-between text-white shadow-sm`}>
            {/* Background SVG vector watermark */}
            <div className="absolute -right-3 -bottom-3 w-24 h-24 opacity-20 pointer-events-none group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              {catConfig.svg}
            </div>
            <div className="flex items-center justify-between relative z-10">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/25 backdrop-blur-md text-white border border-white/20">
                <span className="w-3 h-3">{catConfig.svg}</span>
                <span>{issue.category}</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-white/95 relative z-10 drop-shadow-sm truncate">
              <MapPin className="w-3.5 h-3.5 text-white/85 shrink-0" />
              <span className="truncate">{issue.location?.block} • {issue.location?.area}</span>
            </div>
          </div>
        )}

        {/* Card Body */}
        <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
          {/* Status & Priority Row */}
          <div className="flex items-center justify-between gap-2">
            <StatusBadge status={issue.status} />
            <PriorityBadge priority={issue.priority} score={issue.priorityScore} />
          </div>

          {/* Title */}
          <Link to={`/issues/${issue._id}`}>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-2 leading-snug">
              {issue.title}
            </h3>
          </Link>

          {/* Description */}
          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mt-2 leading-relaxed">
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
        <div className="pt-4 mt-4 border-t border-slate-200/50 dark:border-slate-800/60 flex items-center justify-between gap-2 px-5 pb-5">
          {/* +1 Upvote Button */}
          <button
            onClick={handleUpvote}
            disabled={isUpvoting}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              hasUpvoted
                ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-glowBrand scale-105'
                : 'bg-slate-200/60 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-indigo-500/15 hover:text-indigo-600 dark:hover:text-cyan-400 hover:border-indigo-500/30'
            }`}
            title="Click to +1 if you are also facing this problem"
          >
            <ThumbsUp className={`w-3.5 h-3.5 ${hasUpvoted ? 'fill-white' : ''}`} />
            <span>+1</span>
            <span className="opacity-90 font-mono">({upvotesCount})</span>
          </button>

          {/* Reporter & Details CTA */}
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              {formattedDate}
            </span>
            <Link
              to={`/issues/${issue._id}`}
              className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-cyan-400 hover:underline"
            >
              Details <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
