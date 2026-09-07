import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, PhoneCall, Heart, Sparkles, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="w-full glass-panel border-t border-stone-200/50 dark:border-stone-800/60 mt-16 py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Brand & Vision */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg overflow-hidden p-0.5 bg-gradient-to-br from-amber-500 to-orange-600 shadow-glowAmber">
                <img src="/logo.svg" alt="CampusFix" className="w-full h-full object-contain" />
              </div>
              <span className="font-extrabold text-lg bg-gradient-to-r from-amber-600 via-orange-500 to-rose-500 bg-clip-text text-transparent">
                CampusFix
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 max-w-md leading-relaxed">
              Smart Campus Maintenance & Issue Management System. Empowering campus communities through
              collaborative reporting, transparent prioritization, technician accountability, and verified resolutions.
            </p>
            <div className="flex items-center gap-3 text-xs text-stone-400 pt-1">
              <span className="inline-flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Community Driven
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Proof of Work
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100">
              Navigation
            </h4>
            <ul className="space-y-1.5 text-xs text-stone-500 dark:text-stone-400">
              <li>
                <Link to="/" className="hover:text-amber-500 transition-colors">
                  Public Feed
                </Link>
              </li>
              <li>
                <Link to="/report" className="hover:text-amber-500 transition-colors">
                  Report a Problem
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-amber-500 transition-colors">
                  Admin Center
                </Link>
              </li>
              <li>
                <Link to="/worker" className="hover:text-amber-500 transition-colors">
                  Worker Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Campus Support */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100">
              Campus Emergency
            </h4>
            <div className="space-y-1.5 text-xs text-stone-500 dark:text-stone-400">
              <p className="flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-amber-500" /> Maintenance Helpline: 1800-CAMPUS
              </p>
              <p className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-orange-500" /> Central Estate Office, Block 1
              </p>
              <p className="text-[11px] text-stone-400 pt-1">Available 24/7 for critical emergencies.</p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-stone-200/50 dark:border-stone-800/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500 dark:text-stone-400">
          <p>© {new Date().getFullYear()} CampusFix. Built with MERN Stack & Glassmorphism Design.</p>
          <p className="flex items-center gap-1">
            Engineered with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Smart Campuses
          </p>
        </div>
      </div>
    </footer>
  );
};
