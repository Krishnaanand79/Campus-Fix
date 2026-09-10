import React from 'react';
import { Search, Filter, SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';
import { CategoryIcon } from '../common/CategoryIcons';

const CATEGORIES = [
  'All',
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
  'All',
  'Hostel Block A',
  'Girls Hostel Block 2',
  'Academic Block 3',
  'Central Library',
  'Central Cafeteria',
  'Sports Complex',
  'Science Block',
];

export const IssueFilterBar = ({
  search,
  setSearch,
  category,
  setCategory,
  block,
  setBlock,
  status,
  setStatus,
  sortBy,
  setSortBy,
  onReset,
}) => {
  return (
    <div className="glass-panel rounded-3xl p-4 sm:p-5 mb-6 space-y-4 border border-slate-200/70 dark:border-slate-800/80 shadow-glass">
      {/* Top Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search Bar */}
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search campus issues by keywords, room, or area..."
            className="w-full pl-10 pr-9 py-2 rounded-xl text-xs sm:text-sm glass-input placeholder-slate-400 focus:ring-2 focus:ring-indigo-500/25"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Dropdowns Row */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
          {/* Block Selector */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400 hidden lg:inline">Location:</span>
            <select
              value={block}
              onChange={(e) => setBlock(e.target.value)}
              className="px-3 py-2 rounded-xl text-xs glass-input cursor-pointer text-slate-700 dark:text-slate-200"
            >
              <option value="All">All Campus Locations</option>
              {BLOCKS.filter((b) => b !== 'All').map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Status Selector */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400 hidden lg:inline">Status:</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-3 py-2 rounded-xl text-xs glass-input cursor-pointer text-slate-700 dark:text-slate-200"
            >
              <option value="All">All Statuses</option>
              <option value="REPORTED">Reported</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved (Pending Verify)</option>
              <option value="CLOSED">Closed</option>
              <option value="REOPENED">Reopened</option>
            </select>
          </div>

          {/* Sort By Selector */}
          <div className="flex items-center gap-1.5 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-xl text-xs glass-input cursor-pointer text-slate-700 dark:text-slate-200"
            >
              <option value="priority">Top Smart Priority</option>
              <option value="votes">Most Community +1s</option>
              <option value="recent">Most Recent</option>
              <option value="oldest">Oldest Unresolved</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Filter Chips Horizontal Scroll with Vector Icons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
        <span className="text-xs text-slate-400 font-semibold shrink-0 mr-1 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5 text-indigo-500" /> Filter:
        </span>
        {CATEGORIES.map((cat) => {
          const isSelected = category === cat;
          return (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-glowBrand scale-105 font-bold'
                  : 'bg-slate-200/50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:bg-slate-300/60 dark:hover:bg-slate-700/60'
              }`}
            >
              {cat !== 'All' && <CategoryIcon category={cat} className="w-3.5 h-3.5" />}
              <span>{cat}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
