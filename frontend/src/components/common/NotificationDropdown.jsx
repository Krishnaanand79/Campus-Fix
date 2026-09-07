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
        return <Clock className="w-4 h-4 text-amber-500" />;
      default:
        return <Info className="w-4 h-4 text-orange-500" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-stone-200/50 dark:hover:bg-stone-800/50 transition-all"
        title="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-gradient-to-r from-amber-500 to-orange-600 rounded-full animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-84 sm:w-96 rounded-2xl glass-panel p-3 z-50 shadow-2xl border border-stone-200/60 dark:border-stone-800/80 transform origin-top-right transition-all">
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-stone-200/50 dark:border-stone-800/50">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-stone-900 dark:text-stone-100">
                Notifications
              </span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={() => markAsRead('all')}
                className="text-xs text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 font-medium"
              >
                <Check className="w-3 h-3" /> Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-stone-400 text-xs">
                No notifications yet. You're all caught up!
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  onClick={() => handleNotificationClick(n)}
                  className={`p-2.5 rounded-xl cursor-pointer transition-all border ${
                    n.isRead
                      ? 'bg-transparent border-transparent hover:bg-stone-100/50 dark:hover:bg-stone-900/40 text-stone-600 dark:text-stone-400'
                      : 'bg-amber-500/5 border-amber-500/20 hover:bg-amber-500/10 text-stone-900 dark:text-stone-200'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="p-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 shrink-0 mt-0.5">
                      {getIcon(n.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold leading-tight flex items-center justify-between">
                        <span className="truncate">{n.title}</span>
                        {!n.isRead && (
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 ml-1"></span>
                        )}
                      </p>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-2 mt-1">
                        {n.message}
                      </p>
                      <span className="text-[9px] text-stone-400 block mt-1">
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
