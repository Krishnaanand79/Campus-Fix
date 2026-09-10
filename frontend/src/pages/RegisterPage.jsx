import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { GoogleAuthButton } from '../components/auth/GoogleAuthButton';

export const RegisterPage = () => {
  const { register, googleLogin } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER');
  const [department, setDepartment] = useState('Computer Science');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await register({
      name,
      email,
      password,
      role,
      department,
      phone,
    });
    setLoading(false);

    if (res.success) {
      if (role === 'ADMIN') navigate('/admin');
      else if (role === 'WORKER') navigate('/worker');
      else navigate('/feed');
    } else {
      setError(res.message);
    }
  };

  const handleGoogleSuccess = async (credential) => {
    setError('');
    const res = await googleLogin(credential, role);
    if (res.success) {
      if (res.user.role === 'ADMIN') navigate('/admin');
      else if (res.user.role === 'WORKER') navigate('/worker');
      else navigate('/feed');
    } else {
      setError(res.message || 'Google registration failed.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full glass-panel rounded-3xl p-6 sm:p-8 border border-slate-200/70 dark:border-slate-800/80 shadow-glass space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-block group mb-1">
            <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto group-hover:scale-105 transition-transform duration-300">
              <img src="/campusfixWithoutNamelogo.png" alt="CampusFix" className="w-full h-full object-contain drop-shadow-xl" />
            </div>
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
            Create CampusFix Account
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Join your university maintenance & operations network
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Quick Google Sign Up */}
        <div className="space-y-2.5 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block text-center">
            One-Click Registration
          </span>

          <div className="p-3 rounded-2xl border border-slate-200/70 dark:border-slate-800/80 glass-card flex flex-col items-center justify-center">
            <GoogleAuthButton
              text="signup_with"
              role={role}
              onSuccess={handleGoogleSuccess}
              onError={(msg) => setError(msg)}
            />
          </div>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-200/60 dark:border-slate-800/80 w-full"></div>
          <span className="bg-slate-50 dark:bg-[#0f172a] px-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold absolute rounded-full border border-slate-200/60 dark:border-slate-800/60">
            or register manually
          </span>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g. Aryan Sharma"
              className="w-full p-2.5 rounded-xl text-xs glass-input"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              University Email <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="name@campus.edu"
              className="w-full p-2.5 rounded-xl text-xs glass-input"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Account Role <span className="text-rose-500">*</span>
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-2.5 rounded-xl text-xs glass-input cursor-pointer"
            >
              <option value="USER">Campus Resident (Student / Faculty / Staff)</option>
              <option value="WORKER">Maintenance Technician / Worker</option>
              <option value="ADMIN">Campus Administrator</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Department
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Mechanical Eng."
                className="w-full p-2.5 rounded-xl text-xs glass-input"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full p-2.5 rounded-xl text-xs glass-input"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Password <span className="text-rose-500">*</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="At least 6 characters"
              className="w-full p-2.5 rounded-xl text-xs glass-input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 hover:opacity-95 shadow-glowBrand hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            {loading ? 'Creating Account...' : 'Register Account'}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200/50 dark:border-slate-800/60 flex items-center justify-center gap-2">
          <span>Already have an account?</span>
          <Link to="/login" className="font-bold text-indigo-600 dark:text-cyan-400 hover:underline flex items-center gap-1">
            Sign in here <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
