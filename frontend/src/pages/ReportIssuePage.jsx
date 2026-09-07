import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PlusCircle,
  MapPin,
  Camera,
  AlertTriangle,
  Sparkles,
  Info,
  CheckCircle,
  Search,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { DuplicateWarningModal } from '../components/feed/DuplicateWarningModal';

const CATEGORIES = [
  'Plumbing',
  'Electrical',
  'Lighting',
  'AC/Cooling',
  'Washroom',
  'Internet/Wi-Fi',
  'Furniture',
  'Infrastructure',
  'Cleaning',
  'Security',
  'Parking',
  'Garden/Landscaping',
  'Other',
];

const BLOCKS = [
  'Hostel Block A',
  'Girls Hostel Block 2',
  'Academic Block 3',
  'Central Library',
  'Central Cafeteria',
  'Sports Complex',
  'Science Block',
  'Admin Building',
];

const FLOORS = ['Ground Floor', '1st Floor', '2nd Floor', '3rd Floor', '4th Floor', 'Terrace', 'Outdoor'];

export const ReportIssuePage = () => {
  const { isAuthenticated, user, demoLogin } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Plumbing');
  const [block, setBlock] = useState('Hostel Block A');
  const [floor, setFloor] = useState('Ground Floor');
  const [area, setArea] = useState('');
  const [severity, setSeverity] = useState('MEDIUM');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  // Duplicate modal state
  const [duplicates, setDuplicates] = useState([]);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [checkingDuplicates, setCheckingDuplicates] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    setFiles(selected);
    const newPreviews = selected.map((file) => URL.createObjectURL(file));
    setPreviews(newPreviews);
  };

  // Check duplicate issues
  const checkDuplicates = async () => {
    if (!title.trim() || !block || !area.trim()) return;

    try {
      setCheckingDuplicates(true);
      const res = await api.post('/issues/check-duplicates', {
        title,
        description,
        category,
        location: { block, floor, area },
      });

      if (res.data.success && res.data.count > 0) {
        setDuplicates(res.data.duplicates);
        setShowDuplicateModal(true);
        return true;
      }
    } catch (err) {
      console.warn('Duplicate check skipped', err);
    } finally {
      setCheckingDuplicates(false);
    }
    return false;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      // Auto-log in demo student if user didn't log in
      await demoLogin('student');
    }

    if (!title || !description || !block || !area) {
      setError('Please fill out title, description, and structured location fields.');
      return;
    }

    // Run duplicate check first
    const hasDuplicates = await checkDuplicates();
    if (hasDuplicates) {
      return; // Handled in modal
    }

    await executeSubmission();
  };

  const executeSubmission = async () => {
    setSubmitting(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('category', category);
      formData.append('severity', severity);
      formData.append('description', description);
      formData.append('location[block]', block);
      formData.append('location[floor]', floor);
      formData.append('location[area]', area);

      files.forEach((file) => {
        formData.append('media', file);
      });

      const res = await api.post('/issues', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        navigate(`/issues/${res.data.issue._id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit issue');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpvoteExisting = async (existingIssueId) => {
    try {
      await api.post(`/issues/${existingIssueId}/upvote`);
      setShowDuplicateModal(false);
      navigate(`/issues/${existingIssueId}`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>New Campus Maintenance Ticket</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100">
          Report an Infrastructure Problem
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
          Detailed location and clear descriptions allow technicians to diagnose and repair issues rapidly.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2.5">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Form Card */}
      <form
        onSubmit={handleFormSubmit}
        className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border border-stone-200/70 dark:border-stone-800/80 shadow-glass"
      >
        {/* Title */}
        <div>
          <label className="block text-xs font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider mb-1.5">
            Issue Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={checkDuplicates}
            required
            placeholder="e.g. Water leakage from ceiling near Hostel A entrance"
            className="w-full p-3 rounded-xl text-xs sm:text-sm glass-input placeholder-stone-400 focus:ring-2 focus:ring-amber-500/20"
          />
        </div>

        {/* Category & Severity Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider mb-1.5">
              Category <span className="text-rose-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 rounded-xl text-xs sm:text-sm glass-input cursor-pointer"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider mb-1.5">
              Estimated Severity
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setSeverity(s)}
                  className={`py-2 rounded-xl text-[11px] font-bold uppercase transition-all ${
                    severity === s
                      ? s === 'CRITICAL'
                        ? 'bg-rose-500 text-white shadow-lg'
                        : s === 'HIGH'
                        ? 'bg-orange-500 text-white shadow-lg'
                        : s === 'MEDIUM'
                        ? 'bg-amber-500 text-white shadow-lg'
                        : 'bg-emerald-500 text-white shadow-lg'
                      : 'bg-stone-200/50 dark:bg-stone-800/60 text-stone-600 dark:text-stone-400'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Structured Location Section */}
        <div className="p-4 rounded-2xl bg-stone-100/60 dark:bg-stone-900/40 border border-stone-200/50 dark:border-stone-800/50 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-stone-900 dark:text-stone-100">
            <MapPin className="w-4 h-4 text-amber-500" />
            <span>Structured Campus Location</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-stone-500 dark:text-stone-400 mb-1">
                Campus Block / Facility <span className="text-rose-500">*</span>
              </label>
              <select
                value={block}
                onChange={(e) => setBlock(e.target.value)}
                className="w-full p-2.5 rounded-xl text-xs glass-input"
              >
                {BLOCKS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-500 dark:text-stone-400 mb-1">
                Floor Level
              </label>
              <select
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
                className="w-full p-2.5 rounded-xl text-xs glass-input"
              >
                {FLOORS.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-stone-500 dark:text-stone-400 mb-1">
              Specific Room / Area / Landmark <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              onBlur={checkDuplicates}
              required
              placeholder="e.g. Room 204, East Stairwell, Outside Chemistry Lab 2"
              className="w-full p-2.5 rounded-xl text-xs glass-input"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider mb-1.5">
            Detailed Problem Description <span className="text-rose-500">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            placeholder="Describe exactly what happened, since when it has been occurring, and any immediate safety hazards..."
            className="w-full p-3 rounded-xl text-xs sm:text-sm glass-input placeholder-stone-400 focus:ring-2 focus:ring-amber-500/20"
          />
        </div>

        {/* Photo / Video Upload */}
        <div>
          <label className="block text-xs font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider mb-1.5">
            Upload Evidence Photos or Videos (Optional)
          </label>
          <div className="border-2 border-dashed border-stone-300 dark:border-stone-700 rounded-2xl p-5 text-center hover:border-amber-500/50 transition-colors">
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileChange}
              id="report-media-input"
              className="hidden"
            />
            <label
              htmlFor="report-media-input"
              className="cursor-pointer flex flex-col items-center gap-2"
            >
              <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500">
                <Camera className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline">
                Upload image or short video clip
              </span>
              <span className="text-[10px] text-stone-400">
                Attach clear photo showing the damage (Max 5 files, 25MB each)
              </span>
            </label>
          </div>

          {previews.length > 0 && (
            <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
              {previews.map((src, i) => (
                <div
                  key={i}
                  className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-stone-300 dark:border-stone-700"
                >
                  <img src={src} alt="Upload preview" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit & Duplicate Check CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-stone-200/50 dark:border-stone-800/60">
          <button
            type="button"
            onClick={checkDuplicates}
            disabled={checkingDuplicates || !title.trim()}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold glass-card text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 flex items-center justify-center gap-1.5"
          >
            <Search className="w-3.5 h-3.5" />
            {checkingDuplicates ? 'Scanning Duplicates...' : 'Check Duplicate Complaints'}
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:opacity-95 shadow-glowAmber hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            {submitting ? 'Submitting Complaint...' : 'Submit Campus Complaint'}
          </button>
        </div>
      </form>

      {/* Duplicate Warning Modal */}
      <DuplicateWarningModal
        isOpen={showDuplicateModal}
        duplicates={duplicates}
        onUpvoteExisting={handleUpvoteExisting}
        onProceedAnyway={() => {
          setShowDuplicateModal(false);
          executeSubmission();
        }}
        onClose={() => setShowDuplicateModal(false)}
      />
    </div>
  );
};
