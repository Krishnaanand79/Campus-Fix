import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Sun,
  Moon,
  PlusCircle,
  Shield,
  Wrench,
  User,
  LogOut,
  FolderPlus,
  Flame,
  Menu,
  X,
  LayoutDashboard,
  Sparkles,
  Radio,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { NotificationDropdown } from './NotificationDropdown';

export const Navbar = () => {
  const { user, isAuthenticated, logout, isAdmin, isWorker } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/70 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <div className="w-11 h-11 shrink-0 group-hover:scale-105 transition-transform">
            <img src="/campusfixWithoutNamelogo.png" alt="CampusFix Emblem" className="w-full h-full object-contain drop-shadow-md" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 dark:from-indigo-400 dark:via-sky-400 dark:to-cyan-300 bg-clip-text text-transparent">
                CampusFix
              </span>
              <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                v2.0
              </span>
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 hidden sm:block -mt-1 font-medium">
              Smart Maintenance OS
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5">
          <Link
            to="/"
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              isActive('/')
                ? 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30 font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
            }`}
          >
            Home
          </Link>

          <Link
            to="/feed"
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              isActive('/feed')
                ? 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30 font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-cyan-500" />
            <span>Live Feed</span>
          </Link>

          {isAuthenticated && (
            <Link
              to="/my-issues"
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                isActive('/my-issues')
                  ? 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30 font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
              }`}
            >
              My Complaints
            </Link>
          )}

          {isAdmin && (
            <>
              <Link
                to="/admin"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive('/admin')
                    ? 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30 font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-indigo-500 hover:bg-indigo-500/10'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                Admin Center
              </Link>
              <Link
                to="/admin/analytics"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive('/admin/analytics')
                    ? 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-cyan-500 hover:bg-cyan-500/10'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                Analytics
              </Link>
            </>
          )}

          {isWorker && (
            <Link
              to="/worker"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                isActive('/worker')
                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-emerald-500 hover:bg-emerald-500/10'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              Technician Portal
            </Link>
          )}
        </nav>

        {/* Action Controls & Utilities */}
        <div className="flex items-center gap-2">
          {/* Report Problem Button */}
          <Link
            to="/report"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 hover:opacity-95 shadow-glowBrand hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Report Problem</span>
          </Link>

          {/* Notification Bell */}
          {isAuthenticated && <NotificationDropdown />}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-cyan-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-all"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
          </button>

          {/* Clean User Profile */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1 pl-2.5 rounded-xl glass-card hover:border-indigo-500/40 transition-all cursor-pointer"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold leading-tight text-slate-900 dark:text-slate-100">{user?.name}</p>
                  <span
                    className={`inline-block text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded ${
                      isAdmin
                        ? 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400'
                        : isWorker
                        ? 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400'
                        : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                    }`}
                  >
                    {user?.role}
                  </span>
                </div>
                <img
                  src={
                    user?.avatar ||
                    `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user?.name || 'User')}`
                  }
                  alt={user?.name}
                  className="w-8 h-8 rounded-lg object-cover ring-1 ring-indigo-500/30"
                />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl glass-panel p-2 z-50 shadow-2xl border border-slate-200/70 dark:border-slate-800/80 animate-fadeIn">
                  <div className="px-3 py-2 border-b border-slate-200/50 dark:border-slate-800/50 mb-1">
                    <p className="text-xs font-bold truncate text-slate-900 dark:text-slate-100">{user?.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{user?.department}</p>
                    <span
                      className={`inline-block mt-1.5 px-2 py-0.5 text-[9px] font-extrabold rounded-full uppercase ${
                        isAdmin
                          ? 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400'
                          : isWorker
                          ? 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400'
                          : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      Active Role: {user?.role}
                    </span>
                  </div>

                  <Link
                    to="/my-issues"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
                  >
                    <FolderPlus className="w-4 h-4 text-indigo-500" /> My Complaints
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
                    >
                      <Shield className="w-4 h-4 text-indigo-500" /> Admin Command Center
                    </Link>
                  )}

                  {isWorker && (
                    <Link
                      to="/worker"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
                    >
                      <Wrench className="w-4 h-4 text-cyan-500" /> Field Worker Portal
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors mt-1 border-t border-slate-200/40 dark:border-slate-800/40 pt-2"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="hidden sm:inline-block px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-800 dark:text-white glass-card hover:border-indigo-500/50 transition-all"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile menu hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden p-4 border-t border-slate-200/70 dark:border-slate-800/80 glass-panel space-y-2 animate-fadeIn">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
          >
            Home
          </Link>
          <Link
            to="/feed"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
          >
            Live Feed
          </Link>
          {isAuthenticated && (
            <Link
              to="/my-issues"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
            >
              My Complaints
            </Link>
          )}
          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-xs font-semibold text-indigo-600 dark:text-indigo-400"
            >
              Admin Center
            </Link>
          )}
          {isWorker && (
            <Link
              to="/worker"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-xs font-semibold text-cyan-600 dark:text-cyan-400"
            >
              Worker Portal
            </Link>
          )}
          {isAuthenticated ? (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-500/10"
            >
              Sign Out
            </button>
          ) : (
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-xs font-semibold text-indigo-500"
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </header>
  );
};
