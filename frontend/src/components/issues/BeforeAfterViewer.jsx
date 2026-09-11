import React, { useState } from 'react';
import { ShieldCheck, FileText, CheckCircle, ArrowRight } from 'lucide-react';

export const BeforeAfterViewer = ({ proof, originalImages = [] }) => {
  const [activeTab, setActiveTab] = useState('sideBySide');

  if (!proof || (!proof.afterMedia?.length && !proof.workNotes)) {
    return null;
  }

  const beforeImg =
    proof.beforeMedia?.[0] || originalImages[0] || 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=800';
  const afterImg =
    proof.afterMedia?.[0] || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800';

  const formatSrc = (src) => {
    if (!src) return '';
    return src.startsWith('http://localhost:5000')
      ? src.replace('http://localhost:5000', '')
      : src;
  };

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-7 border border-emerald-500/30 dark:border-emerald-500/20 bg-emerald-500/5 shadow-glass">
      <div className="flex items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-500">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
              Work Completed & Proof of Resolution
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Verified physical evidence submitted by the assigned maintenance technician
            </p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 shrink-0">
          <CheckCircle className="w-3.5 h-3.5" /> Proof Submitted
        </span>
      </div>

      {/* Before / After Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {/* Before Card */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-rose-500">
            <span>BEFORE REPAIR</span>
            <span className="text-[10px] text-slate-400 font-normal">Original Complaint Condition</span>
          </div>
          <div className="relative h-52 rounded-2xl overflow-hidden border border-rose-500/30 bg-slate-900/30">
            <img
              src={formatSrc(beforeImg)}
              alt="Before Repair Proof"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg text-[10px] font-extrabold bg-rose-600 text-white shadow-md">
              BEFORE
            </div>
          </div>
        </div>

        {/* After Card */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-500">
            <span>AFTER REPAIR</span>
            <span className="text-[10px] text-slate-400 font-normal">Resolved Physical State</span>
          </div>
          <div className="relative h-52 rounded-2xl overflow-hidden border border-emerald-500/40 bg-slate-900/30">
            <img
              src={formatSrc(afterImg)}
              alt="After Repair Proof"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg text-[10px] font-extrabold bg-emerald-600 text-white shadow-md">
              AFTER (FIXED)
            </div>
          </div>
        </div>
      </div>

      {/* Worker Notes */}
      {proof.workNotes && (
        <div className="p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-800/60">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
            <FileText className="w-3.5 h-3.5 text-indigo-500" />
            Technician Completion Notes:
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-5 italic">
            "{proof.workNotes}"
          </p>
        </div>
      )}
    </div>
  );
};
