import React from 'react';
import { Search, Filter, SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';

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
    <div className="glass-panel rounded-2xl p-4 sm:p-5 mb-8 space-y-4 border border-stone-200/60 dark:border-stone-800/80">
      {/* Top Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search Bar */}
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search campus issues by keywords, room, or area..."
            className="w-full pl-10 pr-9 py-2 rounded-xl text-xs sm:text-sm glass-input placeholder-stone-400 focus:ring-2 focus:ring-amber-500/20"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Dropdowns Row */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
          {/* Block Selector */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-stone-400 hidden lg:inline">Location:</span>
            <select
              value={block}
              onChange={(e) => setBlock(e.target.value)}
              className="px-3 py-2 rounded-xl text-xs glass-input cursor-pointer"
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
            <span className="text-stone-400 hidden lg:inline">Status:</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-3 py-2 rounded-xl text-xs glass-input cursor-pointer"
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
            <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-xl text-xs glass-input cursor-pointer"
            >
              <option value="priority">Top Smart Priority</option>
              <option value="votes">Most Community +1s</option>
              <option value="recent">Most Recent</option>
              <option value="oldest">Oldest Unresolved</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Filter Chips Horizontal Scroll */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
        <span className="text-xs text-stone-400 font-semibold shrink-0 mr-1 flex items-center gap-1">
          <Filter className="w-3 h-3 text-amber-500" /> Categories:
        </span>
        {CATEGORIES.map((cat) => {
          const isSelected = category === cat;
          return (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-amber-500 text-white shadow-glowAmber scale-105'
                  : 'bg-stone-200/50 dark:bg-stone-800/60 text-stone-600 dark:text-stone-300 hover:bg-stone-300/50 dark:hover:bg-stone-700/50'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
};
