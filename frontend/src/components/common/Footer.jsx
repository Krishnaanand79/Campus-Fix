import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, PhoneCall, Heart, Sparkles, MapPin, Activity } from 'lucide-react';

export const Footer = ({ className = '' }) => {
  return (
    <footer className={`w-full glass-panel border-t border-slate-200/70 dark:border-slate-800/80 py-8 transition-colors ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Brand & Vision */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 shrink-0">
                <img src="/campusfixWithoutNamelogo.png" alt="CampusFix Emblem" className="w-full h-full object-contain drop-shadow-md" />
              </div>
              <span className="font-extrabold text-lg bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 dark:from-indigo-400 dark:via-sky-400 dark:to-cyan-300 bg-clip-text text-transparent">
                CampusFix
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Operational
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
              Smart Campus Maintenance & Operations OS. Connecting students, facility technicians, and university administration with verified photo proof and crowd-prioritization.
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-400 pt-1">
              <span className="inline-flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Community Driven
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Proof of Work
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-cyan-500" /> Real-time SLA
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Quick Navigation
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
              <li>
                <Link to="/feed" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Live Maintenance Feed
                </Link>
              </li>
              <li>
                <Link to="/report" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Report Infrastructure Issue
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Administration Command Center
                </Link>
              </li>
              <li>
                <Link to="/worker" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Technician Workstation
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Campus Support */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Emergency Dispatch
            </h4>
            <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
              <p className="flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-indigo-500" /> Emergency Hotline: 1800-CAMPUS-FIX
              </p>
              <p className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-500" /> Central Facilities Directorate, Hall 1
              </p>
              <p className="text-[11px] text-slate-400 pt-1">Priority dispatch active 24/7 for hazards & outages.</p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} CampusFix OS. Built with SkillUI Design Principles.</p>
          <p className="flex items-center gap-1">
            Engineered with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Smart Universities
          </p>
        </div>
      </div>
    </footer>
  );
};
