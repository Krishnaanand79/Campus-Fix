import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, ExternalLink, Info, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { useNavigate } from 'react-router-dom';

export const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (n) => {
    markAsRead(n._id);
    if (n.issueId) {
      const issueId = typeof n.issueId === 'object' ? n.issueId._id : n.issueId;
      navigate(`/issues/${issueId}`);
      setIsOpen(false);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'HIGH_PRIORITY_ALERT':
      case 'REOPENED_ALERT':
        return <AlertTriangle className="w-4 h-4 text-rose-500" />;
      case 'VERIFICATION_REQUEST':
      case 'RATING_RECEIVED':
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'ASSIGNMENT':
        return <Clock className="w-4 h-4 text-indigo-500" />;
      default:
        return <Info className="w-4 h-4 text-cyan-500" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-cyan-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-all"
        title="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full animate-pulse shadow-glowBrand">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-84 sm:w-96 rounded-2xl glass-panel p-3 z-50 shadow-2xl border border-slate-200/70 dark:border-slate-800/80 transform origin-top-right transition-all">
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-200/50 dark:border-slate-800/50">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                Notifications
              </span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={() => markAsRead('all')}
                className="text-xs text-indigo-600 dark:text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <Check className="w-3 h-3" /> Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                No notifications yet. You're all caught up!
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  onClick={() => handleNotificationClick(n)}
                  className={`p-2.5 rounded-xl cursor-pointer transition-all border ${
                    n.isRead
                      ? 'bg-transparent border-transparent hover:bg-slate-100/50 dark:hover:bg-slate-800/40 text-slate-600 dark:text-slate-400'
                      : 'bg-indigo-500/5 border-indigo-500/20 hover:bg-indigo-500/10 text-slate-900 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 shrink-0 mt-0.5">
                      {getIcon(n.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold leading-tight flex items-center justify-between">
                        <span className="truncate">{n.title}</span>
                        {!n.isRead && (
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 ml-1"></span>
                        )}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                        {n.message}
                      </p>
                      <span className="text-[9px] text-slate-400 block mt-1">
                        {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
