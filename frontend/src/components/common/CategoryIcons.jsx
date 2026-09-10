import React from 'react';

// Color mappings and SVG icons for campus categories
export const CATEGORY_CONFIG = {
  Plumbing: {
    label: 'Plumbing',
    gradient: 'from-blue-500 to-cyan-500',
    lightBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    textColor: 'text-blue-500',
    description: 'Pipes, leaks, taps, cisterns & drainage',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <path d="M12 2v6" />
        <path d="M9 5h6" />
        <path d="M4 14v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4" />
        <path d="M12 8a5 5 0 0 1 5 5v1H7v-1a5 5 0 0 1 5-5Z" />
        <circle cx="12" cy="18" r="1" />
      </svg>
    ),
  },
  Electrical: {
    label: 'Electrical',
    gradient: 'from-amber-500 to-yellow-500',
    lightBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    textColor: 'text-amber-500',
    description: 'Outages, short circuits, switches & cables',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  Lighting: {
    label: 'Lighting',
    gradient: 'from-yellow-400 to-orange-500',
    lightBg: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
    textColor: 'text-yellow-500',
    description: 'Corridor tubes, street lights & classroom lamps',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
        <path d="M9 18h6" />
        <path d="M10 22h4" />
      </svg>
    ),
  },
  'AC/Cooling': {
    label: 'AC & Cooling',
    gradient: 'from-cyan-400 to-teal-500',
    lightBg: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
    textColor: 'text-cyan-500',
    description: 'Air conditioners, chillers & ceiling fans',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2" />
        <path d="M9.6 4.6A2 2 0 1 1 11 8H2" />
        <path d="M12.6 19.4A2 2 0 1 0 14 16H2" />
      </svg>
    ),
  },
  Washroom: {
    label: 'Washroom & Sanitation',
    gradient: 'from-teal-500 to-emerald-500',
    lightBg: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20',
    textColor: 'text-teal-500',
    description: 'Flush valves, hygiene, mirror repairs & clogs',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <path d="M9 6h6a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z" />
        <path d="M12 2v4" />
        <path d="M10 18v3" />
        <path d="M14 18v3" />
      </svg>
    ),
  },
  'Internet/Wi-Fi': {
    label: 'Wi-Fi & Network',
    gradient: 'from-violet-500 to-indigo-600',
    lightBg: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20',
    textColor: 'text-violet-500',
    description: 'Hostel access points, LAN sockets & fiber drops',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <path d="M5 12.55a11 11 0 0 1 14.08 0" />
        <path d="M1.42 9a16 16 0 0 1 21.16 0" />
        <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
        <line x1="12" y1="20" x2="12.01" y2="20" />
      </svg>
    ),
  },
  Furniture: {
    label: 'Furniture & Desks',
    gradient: 'from-amber-600 to-rose-500',
    lightBg: 'bg-amber-600/10 text-amber-700 dark:text-amber-400 border-amber-600/20',
    textColor: 'text-amber-600',
    description: 'Classroom benches, lab chairs & podiums',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3" />
        <path d="M3 16v-3a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3" />
        <path d="M5 16v5" />
        <path d="M19 16v5" />
      </svg>
    ),
  },
  Infrastructure: {
    label: 'Civil Infrastructure',
    gradient: 'from-stone-600 to-stone-800',
    lightBg: 'bg-stone-500/10 text-stone-700 dark:text-stone-300 border-stone-500/20',
    textColor: 'text-stone-600',
    description: 'Roads, stairways, doors, walls & cracked tiles',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
        <path d="M6 12H4a2 2 0 0 0-2 2v8" />
        <path d="M18 9h2a2 2 0 0 1 2 2v11" />
        <path d="M10 6h4" />
        <path d="M10 10h4" />
        <path d="M10 14h4" />
        <path d="M10 18h4" />
      </svg>
    ),
  },
  Cleaning: {
    label: 'Cleaning & Hygiene',
    gradient: 'from-fuchsia-500 to-pink-500',
    lightBg: 'bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 border-fuchsia-500/20',
    textColor: 'text-fuchsia-500',
    description: 'Garbage accumulation, corridor mopping & spills',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
        <path d="M5 3v4" />
        <path d="M19 17v4" />
        <path d="M3 5h4" />
        <path d="M17 19h4" />
      </svg>
    ),
  },
  Security: {
    label: 'Campus Security',
    gradient: 'from-rose-500 to-red-600',
    lightBg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    textColor: 'text-rose-500',
    description: 'Broken locks, gates, emergency exits & CCTV',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
        <path d="M12 8v4" />
        <path d="M12 16h.01" />
      </svg>
    ),
  },
  'Garden/Landscaping': {
    label: 'Gardens & Grounds',
    gradient: 'from-emerald-500 to-green-600',
    lightBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    textColor: 'text-emerald-500',
    description: 'Overgrown branches, lawns, pathways & sprinklers',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <path d="M10 10v.2A3 3 0 0 1 8.9 16H5a3 3 0 0 1-1-5.8V10a3 3 0 0 1 6 0Z" />
        <path d="M7 16v6" />
        <path d="M13 19v3" />
        <path d="M12 19h8.3a1 1 0 0 0 .7-1.7L18 14h.3a1 1 0 0 0 .7-1.7L16 9h.2a1 1 0 0 0 .8-1.7L13 3l-4 4.3a1 1 0 0 0 .8 1.7H10l-3 3.3a1 1 0 0 0 .7 1.7H10" />
      </svg>
    ),
  },
  Parking: {
    label: 'Parking & Transit',
    gradient: 'from-orange-500 to-amber-600',
    lightBg: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
    textColor: 'text-orange-500',
    description: 'Parking bays, speed bumps, boom barriers & signs',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M9 17V9h4a3 3 0 0 1 0 6H9" />
      </svg>
    ),
  },
  Other: {
    label: 'General Maintenance',
    gradient: 'from-purple-500 to-indigo-500',
    lightBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    textColor: 'text-purple-500',
    description: 'Miscellaneous repairs & facilities requests',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  },
};

export const CategoryIcon = ({ category, className = 'w-5 h-5' }) => {
  const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.Other;
  return <span className={`inline-block ${className}`}>{config.svg}</span>;
};

export const CategoryBadge = ({ category, size = 'sm' }) => {
  const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.Other;
  const sizeClasses =
    size === 'xs'
      ? 'text-[10px] px-2 py-0.5 gap-1'
      : size === 'lg'
      ? 'text-sm px-3.5 py-1.5 gap-2 font-bold'
      : 'text-xs px-2.5 py-1 gap-1.5 font-semibold';

  return (
    <span className={`inline-flex items-center rounded-full border backdrop-blur-sm ${config.lightBg} ${sizeClasses}`}>
      <span className={size === 'xs' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'}>
        {config.svg}
      </span>
      <span>{category}</span>
    </span>
  );
};
