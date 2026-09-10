import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';

export const MainLayout = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div
      className={`relative min-h-screen flex flex-col justify-between overflow-x-hidden ${
        isLoginPage ? 'bg-cover bg-center bg-no-repeat bg-fixed' : ''
      }`}
      style={isLoginPage ? { backgroundImage: "url('/loginbg.png')" } : undefined}
    >
      {/* Background Ambient Mesh Glows (Warm Aesthetic) for normal pages */}
      {!isLoginPage && (
        <div className="ambient-glow">
          <div className="ambient-blob-1" />
          <div className="ambient-blob-2" />
        </div>
      )}

      {/* Subtle overlay on login page to ensure crisp contrast */}
      {isLoginPage && (
        <div className="fixed inset-0 bg-slate-900/10 dark:bg-slate-950/45 backdrop-blur-[0.5px] pointer-events-none z-0" />
      )}

      {/* Foreground Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex flex-col">
          <Outlet />
        </main>
        <Footer className={isLoginPage ? 'backdrop-blur-xl bg-white/75 dark:bg-slate-900/85 border-t border-white/60 dark:border-slate-800/60' : ''} />
      </div>
    </div>
  );
};
