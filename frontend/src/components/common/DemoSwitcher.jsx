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
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 transition-all shadow-sm"
        title="Quickly switch between Student, Admin, and Worker demo roles"
      >
        <UserCheck className="w-3.5 h-3.5 text-amber-500" />
        <span className="hidden sm:inline">Role Switcher:</span>
        <span className="font-bold uppercase tracking-wider">{user ? user.role : 'Guest'}</span>
        <ChevronDown className="w-3 h-3 ml-0.5 opacity-70" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl glass-panel p-2 z-50 shadow-2xl border border-stone-200/70 dark:border-stone-800/80">
          <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-stone-400 border-b border-stone-200/50 dark:border-stone-800/50 mb-1">
            Switch Demo Account
          </div>

          <button
            onClick={() => handleSwitch('student', '/')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-left transition-all ${
              user?.role === 'USER'
                ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 font-semibold'
                : 'text-stone-700 dark:text-stone-300 hover:bg-stone-200/50 dark:hover:bg-stone-800/50'
            }`}
          >
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
              <GraduationCap className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="font-medium">Student / Reporter</p>
              <p className="text-[10px] opacity-70">Aryan Sharma (CS)</p>
            </div>
          </button>

          <button
            onClick={() => handleSwitch('admin', '/admin')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-left transition-all ${
              user?.role === 'ADMIN'
                ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 font-semibold'
                : 'text-stone-700 dark:text-stone-300 hover:bg-stone-200/50 dark:hover:bg-stone-800/50'
            }`}
          >
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-500">
              <Shield className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="font-medium">Campus Admin</p>
              <p className="text-[10px] opacity-70">Dr. Rajesh Verma</p>
            </div>
          </button>

          <button
            onClick={() => handleSwitch('worker', '/worker')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-left transition-all ${
              user?.role === 'WORKER'
                ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 font-semibold'
                : 'text-stone-700 dark:text-stone-300 hover:bg-stone-200/50 dark:hover:bg-stone-800/50'
            }`}
          >
            <div className="p-1.5 rounded-lg bg-orange-500/10 text-orange-500">
              <Wrench className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="font-medium">Maintenance Worker</p>
              <p className="text-[10px] opacity-70">Ramesh Kumar (Tech)</p>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};
