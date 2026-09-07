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
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { NotificationDropdown } from './NotificationDropdown';
import { DemoSwitcher } from './DemoSwitcher';

export const Navbar = () => {
  const { user, isAuthenticated, logout, isAdmin, isWorker } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-stone-200/50 dark:border-stone-800/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <div className="relative w-9 h-9 rounded-xl overflow-hidden p-0.5 bg-gradient-to-br from-amber-500 via-orange-500 to-rose-600 shadow-glowAmber group-hover:scale-105 transition-transform">
            <img src="/logo.svg" alt="CampusFix Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-amber-600 via-orange-500 to-rose-500 bg-clip-text text-transparent">
                CampusFix
              </span>
              <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                v2.0
              </span>
            </div>
            <span className="text-[10px] text-stone-500 dark:text-stone-400 hidden sm:block -mt-1 font-medium">
              Smart Maintenance Platform
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5">
          <Link
            to="/"
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              isActive('/')
                ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                : 'text-stone-600 dark:text-stone-300 hover:text-amber-500 hover:bg-stone-200/40 dark:hover:bg-stone-800/40'
            }`}
          >
            Public Feed
          </Link>

          {isAuthenticated && (
            <Link
              to="/my-issues"
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                isActive('/my-issues')
                  ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                  : 'text-stone-600 dark:text-stone-300 hover:text-amber-500 hover:bg-stone-200/40 dark:hover:bg-stone-800/40'
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
                    ? 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30'
                    : 'text-stone-600 dark:text-stone-300 hover:text-indigo-500 hover:bg-indigo-500/10'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                Admin Center
              </Link>
              <Link
                to="/admin/analytics"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive('/admin/analytics')
                    ? 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30'
                    : 'text-stone-600 dark:text-stone-300 hover:text-indigo-500 hover:bg-indigo-500/10'
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
                  ? 'bg-orange-500/15 text-orange-600 dark:text-orange-400 border border-orange-500/30'
                  : 'text-stone-600 dark:text-stone-300 hover:text-orange-500 hover:bg-orange-500/10'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              Worker Dashboard
            </Link>
          )}
        </nav>

        {/* Action Controls & Utilities */}
        <div className="flex items-center gap-2">
          {/* Quick Demo Switcher */}
          <DemoSwitcher />

          {/* Report Problem Button */}
          <Link
            to="/report"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:opacity-95 shadow-glowAmber hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Report Problem</span>
          </Link>

          {/* Notification Bell */}
          {isAuthenticated && <NotificationDropdown />}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-stone-200/50 dark:hover:bg-stone-800/50 transition-all"
            title={theme === 'dark' ? 'Switch to Warm Light Mode' : 'Switch to Warm Dark Mode'}
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* User Profile / Auth */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1 pl-2 rounded-xl glass-card hover:border-amber-500/40 transition-all"
              >
                <div className="text-right hidden xl:block">
                  <p className="text-xs font-bold leading-tight">{user.name}</p>
                  <p className="text-[10px] text-stone-400 font-semibold uppercase">{user.role}</p>
                </div>
                <img
                  src={
                    user.avatar ||
                    `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.name)}`
                  }
                  alt={user.name}
                  className="w-8 h-8 rounded-lg object-cover ring-1 ring-amber-500/30"
                />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-2xl glass-panel p-2 z-50 shadow-2xl border border-stone-200/70 dark:border-stone-800/80">
                  <div className="px-3 py-2 border-b border-stone-200/50 dark:border-stone-800/50 mb-1">
                    <p className="text-xs font-bold truncate">{user.name}</p>
                    <p className="text-[10px] text-stone-400 truncate">{user.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 text-[9px] font-bold rounded-full bg-amber-500/15 text-amber-500 uppercase">
                      {user.role}
                    </span>
                  </div>

                  <Link
                    to="/my-issues"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-stone-700 dark:text-stone-300 hover:bg-stone-200/50 dark:hover:bg-stone-800/50"
                  >
                    <FolderPlus className="w-4 h-4 text-amber-500" /> My Complaints
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors"
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
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-stone-700 dark:text-stone-200 hover:text-amber-500 transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="hidden sm:inline-block px-3 py-1.5 rounded-xl text-xs font-semibold text-stone-800 dark:text-white glass-card hover:border-amber-500/50 transition-all"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile menu hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-200/50 dark:hover:bg-stone-800/50"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-t border-stone-200/50 dark:border-stone-800/60 px-4 py-3 space-y-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-medium text-stone-700 dark:text-stone-200 hover:bg-stone-200/40 dark:hover:bg-stone-800/40"
          >
            Public Feed
          </Link>
          {isAuthenticated && (
            <Link
              to="/my-issues"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-medium text-stone-700 dark:text-stone-200 hover:bg-stone-200/40 dark:hover:bg-stone-800/40"
            >
              My Complaints
            </Link>
          )}
          {isAdmin && (
            <>
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-medium text-indigo-500 hover:bg-indigo-500/10"
              >
                Admin Center
              </Link>
              <Link
                to="/admin/analytics"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-medium text-indigo-500 hover:bg-indigo-500/10"
              >
                Admin Analytics
              </Link>
            </>
          )}
          {isWorker && (
            <Link
              to="/worker"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-medium text-orange-500 hover:bg-orange-500/10"
            >
              Worker Dashboard
            </Link>
          )}
        </div>
      )}
    </header>
  );
};
