import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const RegisterPage = () => {
  const { register } = useAuth();
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
      else navigate('/');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full glass-panel rounded-3xl p-6 sm:p-8 border border-stone-200/70 dark:border-stone-800/80 shadow-glass space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl overflow-hidden p-0.5 bg-gradient-to-br from-amber-500 to-rose-600 shadow-glowAmber">
            <img src="/logo.svg" alt="CampusFix" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl font-extrabold text-stone-900 dark:text-stone-100">
            Create CampusFix Account
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Join your university maintenance network
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
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
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
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
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
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
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
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
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
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
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
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
            className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:opacity-95 shadow-glowAmber hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-1.5"
          >
            <UserPlus className="w-4 h-4" />
            {loading ? 'Creating Account...' : 'Register Account'}
          </button>
        </form>

        <div className="text-center text-xs text-stone-500 dark:text-stone-400 pt-2 border-t border-stone-200/50 dark:border-stone-800/60">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-amber-500 hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};
