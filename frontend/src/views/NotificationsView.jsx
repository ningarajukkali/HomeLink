import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function NotificationsView() {
  const {
    notifications,
    markAllNotificationsRead,
    navigate,
    goBack
  } = useApp();

  const [filterType, setFilterType] = useState('all'); // 'all' | 'unread' | 'request' | 'system'

  const filtered = notifications.filter(n => {
    if (filterType === 'unread') return !n.read;
    if (filterType === 'request') return n.type === 'request';
    if (filterType === 'system') return n.type === 'system' || n.type === 'security';
    return true;
  });

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6 pb-20 md:pb-12">
      {/* Header matching Stitch 6cc93f556f754e6cb659d590577eb605 */}
      <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
        <div className="flex items-center gap-3">
          <button
            onClick={goBack}
            className="w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">arrow_back</span>
          </button>
          <div>
            <h1 className="text-xl font-extrabold text-on-surface">Notifications</h1>
            <p className="text-xs text-outline font-medium">Activity updates & inquiries in Rewa</p>
          </div>
        </div>

        <button
          onClick={markAllNotificationsRead}
          className="text-xs font-bold text-primary-container hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm">done_all</span>
          <span>Mark all read</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex rounded-2xl bg-surface-container p-1 text-xs font-extrabold overflow-x-auto">
        {[
          { id: 'all', label: `All (${notifications.length})` },
          { id: 'unread', label: `Unread (${notifications.filter(n => !n.read).length})` },
          { id: 'request', label: 'Requests' },
          { id: 'system', label: 'System & Safety' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`flex-1 py-2 px-3 rounded-xl transition-all cursor-pointer whitespace-nowrap text-center ${
              filterType === tab.id
                ? 'bg-surface-container-lowest text-primary shadow-sm'
                : 'text-outline hover:text-on-surface'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.length > 0 ? (
          filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => item.actionRoute && navigate(item.actionRoute)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                item.read
                  ? 'bg-surface-container-lowest border-outline-variant/30 text-outline'
                  : 'bg-primary-fixed/10 border-primary-container/40 text-on-surface shadow-sm'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                item.type === 'request'
                  ? 'bg-secondary-container/40 text-secondary'
                  : item.type === 'security'
                  ? 'bg-emerald-500/10 text-emerald-600'
                  : 'bg-primary-container/10 text-primary-container'
              }`}>
                <span className="material-symbols-outlined text-2xl">
                  {item.type === 'request' ? 'person_add' : item.type === 'security' ? 'verified_user' : 'notifications'}
                </span>
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-extrabold text-sm text-on-surface">{item.title}</h4>
                  <span className="text-[11px] font-semibold text-outline">{item.time}</span>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  {item.message}
                </p>
              </div>

              {!item.read && (
                <div className="w-2.5 h-2.5 rounded-full bg-primary-container shrink-0 mt-2" />
              )}
            </div>
          ))
        ) : (
          <div className="p-12 text-center bg-surface-container-lowest rounded-3xl border border-outline-variant/30">
            <span className="material-symbols-outlined text-3xl text-outline mb-2">notifications_off</span>
            <p className="text-xs font-bold text-outline">No notifications in this filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
