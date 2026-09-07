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

  const formatSrc = (src) =>
    src?.startsWith('/uploads') ? `http://localhost:5000${src}` : src;

  return (
    <div className="glass-card rounded-2xl p-6 border border-emerald-500/30 dark:border-emerald-500/20 bg-emerald-500/5">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-500">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
              Work Completed & Proof of Resolution
            </h3>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              Verified physical evidence submitted by the assigned maintenance technician
            </p>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
          <CheckCircle className="w-3.5 h-3.5" /> Proof Verified
        </span>
      </div>

      {/* Before / After Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {/* Before Card */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-rose-500">
            <span>BEFORE REPAIR</span>
            <span className="text-[10px] text-stone-400 font-normal">Original Complaint</span>
          </div>
          <div className="relative h-48 rounded-xl overflow-hidden border border-rose-500/30 bg-black/20">
            <img
              src={formatSrc(beforeImg)}
              alt="Before Repair Proof"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-600/90 text-white">
              BEFORE
            </div>
          </div>
        </div>

        {/* After Card */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-500">
            <span>AFTER REPAIR</span>
            <span className="text-[10px] text-stone-400 font-normal">Resolved State</span>
          </div>
          <div className="relative h-48 rounded-xl overflow-hidden border border-emerald-500/40 bg-black/20">
            <img
              src={formatSrc(afterImg)}
              alt="After Repair Proof"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-600/90 text-white">
              AFTER (FIXED)
            </div>
          </div>
        </div>
      </div>

      {/* Worker Notes */}
      {proof.workNotes && (
        <div className="p-3.5 rounded-xl bg-stone-100/70 dark:bg-stone-900/60 border border-stone-200/50 dark:border-stone-800/60">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
            <FileText className="w-3.5 h-3.5 text-amber-500" />
            Technician Completion Notes:
          </div>
          <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed pl-5 italic">
            "{proof.workNotes}"
          </p>
        </div>
      )}
    </div>
  );
};
