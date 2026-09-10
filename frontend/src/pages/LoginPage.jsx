import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  LogIn,
  GraduationCap,
  Shield,
  Wrench,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  KeyRound,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { GoogleAuthButton } from '../components/auth/GoogleAuthButton';

const ROLE_PRESETS = {
  student: {
    id: 'student',
    title: 'Student / Resident',
    subtitle: 'Report campus problems, upvote fixes & verify work',
    icon: GraduationCap,
    themeColor: 'emerald',
    badgeClass: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    cardSelected: 'border-emerald-500 bg-emerald-500/10 shadow-glowEmerald',
    btnGradient: 'from-emerald-600 via-teal-600 to-cyan-600',
    demoEmail: 'student@campusfix.edu',
    demoPass: 'Student@123',
    destination: '/feed',
  },
  worker: {
    id: 'worker',
    title: 'Maintenance Worker',
    subtitle: 'Manage assigned tasks, on-site repairs & upload proof',
    icon: Wrench,
    themeColor: 'cyan',
    badgeClass: 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30',
    cardSelected: 'border-cyan-500 bg-cyan-500/10 shadow-glowCyan',
    btnGradient: 'from-cyan-600 via-blue-600 to-indigo-600',
    demoEmail: 'worker@campusfix.edu',
    demoPass: 'Worker@123',
    destination: '/worker',
  },
  admin: {
    id: 'admin',
    title: 'Campus Administrator',
    subtitle: 'Dispatch technicians, triage complaints & analytics',
    icon: Shield,
    themeColor: 'indigo',
    badgeClass: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30',
    cardSelected: 'border-indigo-500 bg-indigo-500/10 shadow-glowBrand',
    btnGradient: 'from-indigo-600 via-violet-600 to-purple-600',
    demoEmail: 'admin@campusfix.edu',
    demoPass: 'Admin@123',
    destination: '/admin',
  },
};

export const LoginPage = () => {
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const urlRole = searchParams.get('role');
  const [selectedRole, setSelectedRole] = useState(
    urlRole && ROLE_PRESETS[urlRole.toLowerCase()] ? urlRole.toLowerCase() : 'student'
  );

  const currentPreset = ROLE_PRESETS[selectedRole] || ROLE_PRESETS.student;

  const [email, setEmail] = useState(currentPreset.demoEmail);
  const [password, setPassword] = useState(currentPreset.demoPass);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Update email & pass when role changes
  const handleRoleSelect = (roleKey) => {
    setSelectedRole(roleKey);
    const preset = ROLE_PRESETS[roleKey];
    setEmail(preset.demoEmail);
    setPassword(preset.demoPass);
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      if (res.user.role === 'ADMIN') navigate('/admin');
      else if (res.user.role === 'WORKER') navigate('/worker');
      else navigate('/feed');
    } else {
      setError(res.message || 'Login failed. Please check credentials.');
    }
  };

  const handleGoogleSuccess = async (credential) => {
    setError('');
    const mappedRole = selectedRole === 'admin' ? 'ADMIN' : selectedRole === 'worker' ? 'WORKER' : 'USER';
    const res = await googleLogin(credential, mappedRole);
    if (res.success) {
      if (res.user.role === 'ADMIN') navigate('/admin');
      else if (res.user.role === 'WORKER') navigate('/worker');
      else navigate('/feed');
    } else {
      setError(res.message || 'Google authentication failed.');
    }
  };

  const handleFillDemo = () => {
    setEmail(currentPreset.demoEmail);
    setPassword(currentPreset.demoPass);
  };

  return (
    <div className="relative flex-grow w-full min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-8">
      {/* Center: Compact Login Card */}
      <div className="max-w-[420px] w-full glass-panel rounded-2xl p-4 sm:p-5 border border-white/80 dark:border-slate-700/80 shadow-2xl space-y-3 relative shrink-0 backdrop-blur-xl bg-white/85 dark:bg-slate-900/90 animate-fadeIn z-10 my-auto">
        {/* Header */}
        <div className="text-center space-y-1">
          <Link to="/" className="inline-block group">
            <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto group-hover:scale-105 transition-transform duration-300">
              <img src="/campusfixWithoutNamelogo.png" alt="CampusFix" className="w-full h-full object-contain drop-shadow-lg" />
            </div>
          </Link>
          <h1 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100 leading-tight">
            Sign In to CampusFix OS
          </h1>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Select role to sign in or access test credentials
          </p>
        </div>

        {/* Step 1: Compact Role Selection Cards */}
        <div className="space-y-1.5">
          <div className="grid grid-cols-3 gap-1.5">
            {Object.values(ROLE_PRESETS).map((preset) => {
              const isSelected = selectedRole === preset.id;
              const IconComponent = preset.icon;

              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleRoleSelect(preset.id)}
                  className={`py-2 px-1.5 rounded-xl border text-center transition-all relative flex flex-col items-center justify-center gap-1 cursor-pointer ${
                    isSelected
                      ? `${preset.cardSelected} border-2 shadow-sm`
                      : 'border-slate-200/70 dark:border-slate-800/80 glass-card hover:border-slate-400 dark:hover:border-slate-700'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-1.5 right-1.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    </div>
                  )}

                  <div
                    className={`p-1.5 rounded-lg ${
                      isSelected
                        ? `bg-${preset.themeColor}-500 text-white shadow-sm`
                        : 'bg-slate-200/60 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <IconComponent className="w-3.5 h-3.5" />
                  </div>

                  <p className="text-[10px] sm:text-[11px] font-bold text-slate-900 dark:text-slate-100 text-center leading-tight">
                    {preset.title}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Instant Google Sign-In */}
        <div className="flex flex-col items-center justify-center">
          <GoogleAuthButton
            text="signin_with"
            role={selectedRole === 'admin' ? 'ADMIN' : selectedRole === 'worker' ? 'WORKER' : 'USER'}
            onSuccess={handleGoogleSuccess}
            onError={(msg) => setError(msg)}
          />
        </div>

        {/* Compact Divider */}
        <div className="relative flex items-center justify-center my-1">
          <div className="border-t border-slate-200/60 dark:border-slate-800/80 w-full"></div>
          <span className="bg-slate-50 dark:bg-[#0f172a] px-2.5 text-[10px] uppercase tracking-wider text-slate-400 font-bold absolute rounded-full border border-slate-200/60 dark:border-slate-800/60">
            or password
          </span>
        </div>

        {/* Step 2: Credentials Form */}
        <form onSubmit={handleLogin} className="space-y-2.5">
          <div className="flex items-center justify-between text-left">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Credentials
            </label>

            {/* Quick Fill Test Account */}
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-[10px] font-semibold text-indigo-600 dark:text-cyan-400 hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <KeyRound className="w-2.5 h-2.5" />
              <span>Fill {currentPreset.title} Demo</span>
            </button>
          </div>

          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Campus Email (e.g. name@campusfix.edu)"
              className="w-full py-2 px-3 rounded-xl text-xs glass-input"
            />
          </div>

          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
              className="w-full py-2 px-3 rounded-xl text-xs glass-input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r ${currentPreset.btnGradient} hover:opacity-95 shadow-glowBrand hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 cursor-pointer`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>
              {loading
                ? 'Authenticating...'
                : `Sign In as ${currentPreset.title}`}
            </span>
          </button>
        </form>

        {/* Footer info */}
        <div className="text-center text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200/50 dark:border-slate-800/60 flex items-center justify-center gap-1.5">
          <span>New campus resident?</span>
          <Link to="/register" className="font-bold text-indigo-600 dark:text-cyan-400 hover:underline flex items-center gap-1">
            Register <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
};
