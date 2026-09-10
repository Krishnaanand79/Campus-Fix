import React, { useState } from 'react';
import { UserCheck, Shield, Wrench, GraduationCap, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const DemoSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, demoLogin } = useAuth();
  const navigate = useNavigate();

  const handleSwitch = async (role, path) => {
    setIsOpen(false);
    await demoLogin(role);
    if (path) navigate(path);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30 transition-all shadow-sm"
        title="Quickly switch between Student, Admin, and Worker demo roles"
      >
        <UserCheck className="w-3.5 h-3.5 text-indigo-500" />
        <span className="hidden sm:inline">Role Switcher:</span>
        <span className="font-bold uppercase tracking-wider">{user ? user.role : 'Guest'}</span>
        <ChevronDown className="w-3 h-3 ml-0.5 opacity-70" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl glass-panel p-2 z-50 shadow-2xl border border-slate-200/70 dark:border-slate-800/80">
          <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200/50 dark:border-slate-800/50 mb-1">
            Quick Portal Access
          </div>

          <button
            onClick={() => handleSwitch('student', '/')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-left transition-all ${
              user?.role === 'USER'
                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
            }`}
          >
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
              <GraduationCap className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="font-medium">Student / Resident</p>
              <p className="text-[10px] opacity-70">student@campusfix.edu</p>
            </div>
          </button>

          <button
            onClick={() => handleSwitch('admin', '/admin')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-left transition-all ${
              user?.role === 'ADMIN'
                ? 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
            }`}
          >
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-500">
              <Shield className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="font-medium">Campus Administrator</p>
              <p className="text-[10px] opacity-70">admin@campusfix.edu</p>
            </div>
          </button>

          <button
            onClick={() => handleSwitch('worker', '/worker')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-left transition-all ${
              user?.role === 'WORKER'
                ? 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 font-semibold'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
            }`}
          >
            <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-500">
              <Wrench className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="font-medium">Maintenance Technician</p>
              <p className="text-[10px] opacity-70">worker@campusfix.edu</p>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};
