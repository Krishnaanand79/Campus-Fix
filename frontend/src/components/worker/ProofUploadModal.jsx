import React, { useState } from 'react';
import { ShieldCheck, Upload, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';

export const ProofUploadModal = ({ task, isOpen, onClose, onSuccess }) => {
  const [workNotes, setWorkNotes] = useState('');
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !task) return null;

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);

    // Create image previews
    const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!workNotes.trim()) {
      setError('Please provide detailed notes on the maintenance work completed.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('workNotes', workNotes);

      files.forEach((file) => {
        formData.append('proofMedia', file);
      });

      const res = await api.put(`/workers/tasks/${task._id}/resolve`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        if (onSuccess) onSuccess(res.data.issue);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit proof of work');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="glass-panel rounded-3xl max-w-lg w-full p-6 sm:p-7 relative border border-stone-200/70 dark:border-stone-800/80 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-stone-800/50"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5 text-emerald-600 dark:text-emerald-400 mb-2">
          <div className="p-2 rounded-xl bg-emerald-500/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
              Complete Task & Upload Proof
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Submit proof-of-work documentation for "{task.title}"
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 my-3">
          {/* Work Notes */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Work Completed Details <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={workNotes}
              onChange={(e) => setWorkNotes(e.target.value)}
              rows={4}
              required
              placeholder="Describe repairs carried out, parts replaced, and tests performed to ensure problem is fixed..."
              className="w-full p-3 rounded-xl text-xs glass-input focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          {/* After-Photos Upload */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Upload "After" Proof Photos / Videos
            </label>
            <div className="border-2 border-dashed border-stone-300 dark:border-stone-700 rounded-2xl p-4 text-center hover:border-emerald-500/50 transition-colors">
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="hidden"
                id="proof-media-input"
              />
              <label
                htmlFor="proof-media-input"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
                    Click to select photos
                  </span>
                  <p className="text-[11px] text-stone-400 mt-0.5">
                    Clear photo of the repaired area (PNG, JPG, MP4 up to 25MB)
                  </p>
                </div>
              </label>
            </div>

            {/* Previews */}
            {previews.length > 0 && (
              <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                {previews.map((src, i) => (
                  <div
                    key={i}
                    className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-emerald-500/40"
                  >
                    <img src={src} alt="Proof preview" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
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
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-95 shadow-lg flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              {submitting ? 'Submitting Proof...' : 'Mark Resolved & Notify Reporter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
