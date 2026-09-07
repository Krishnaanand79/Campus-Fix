import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, GraduationCap, Shield, Wrench, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      if (res.user.role === 'ADMIN') navigate('/admin');
      else if (res.user.role === 'WORKER') navigate('/worker');
      else navigate('/');
    } else {
      setError(res.message);
    }
  };

  const handleQuickDemo = async (role) => {
    setLoading(true);
    setError('');
    const res = await demoLogin(role);
    setLoading(false);

    if (res.success) {
      if (role === 'admin') navigate('/admin');
      else if (role === 'worker') navigate('/worker');
      else navigate('/');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full glass-panel rounded-3xl p-6 sm:p-8 border border-stone-200/70 dark:border-stone-800/80 shadow-glass space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl overflow-hidden p-0.5 bg-gradient-to-br from-amber-500 via-orange-500 to-rose-600 shadow-glowAmber">
            <img src="/logo.svg" alt="CampusFix" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl font-extrabold text-stone-900 dark:text-stone-100">
            Welcome to CampusFix
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Sign in to manage and track campus maintenance requests
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* 1-Click Demo Persona Switchers */}
        <div className="space-y-2">
          <span className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 text-center">
            ⚡ Quick 1-Click Demo Logins
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleQuickDemo('student')}
              className="p-2.5 rounded-xl glass-card text-center hover:border-emerald-500 group transition-all"
            >
              <GraduationCap className="w-5 h-5 mx-auto text-emerald-500 group-hover:scale-110 transition-transform mb-1" />
              <p className="text-[11px] font-bold text-stone-800 dark:text-stone-200">Student</p>
              <p className="text-[9px] text-stone-400">Reporter</p>
            </button>

            <button
              onClick={() => handleQuickDemo('admin')}
              className="p-2.5 rounded-xl glass-card text-center hover:border-indigo-500 group transition-all"
            >
              <Shield className="w-5 h-5 mx-auto text-indigo-500 group-hover:scale-110 transition-transform mb-1" />
              <p className="text-[11px] font-bold text-stone-800 dark:text-stone-200">Admin</p>
              <p className="text-[9px] text-stone-400">Director</p>
            </button>

            <button
              onClick={() => handleQuickDemo('worker')}
              className="p-2.5 rounded-xl glass-card text-center hover:border-orange-500 group transition-all"
            >
              <Wrench className="w-5 h-5 mx-auto text-orange-500 group-hover:scale-110 transition-transform mb-1" />
              <p className="text-[11px] font-bold text-stone-800 dark:text-stone-200">Worker</p>
              <p className="text-[9px] text-stone-400">Technician</p>
            </button>
          </div>
        </div>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-stone-200 dark:border-stone-800"></div>
          <span className="flex-shrink mx-3 text-[10px] text-stone-400 uppercase font-bold">
            Or Use Credentials
          </span>
          <div className="flex-grow border-t border-stone-200 dark:border-stone-800"></div>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Campus Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="student@campusfix.edu"
              className="w-full p-2.5 rounded-xl text-xs glass-input"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full p-2.5 rounded-xl text-xs glass-input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:opacity-95 shadow-glowAmber hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-1.5"
          >
            <LogIn className="w-4 h-4" />
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center text-xs text-stone-500 dark:text-stone-400 pt-2 border-t border-stone-200/50 dark:border-stone-800/60">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-bold text-amber-500 hover:underline">
            Register as new user
          </Link>
        </div>
      </div>
    </div>
  );
};
