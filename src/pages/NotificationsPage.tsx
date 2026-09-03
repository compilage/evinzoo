import React, { useState } from 'react';
import { Activity, PageRoute, User } from '../types';

interface NotificationsPageProps {
  user: User | null;
  setCurrentRoute: (route: PageRoute) => void;
  activities: Activity[];
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({
  user,
  setCurrentRoute,
  activities,
}) => {
  const [filter, setFilter] = useState<'all' | 'booking' | 'payment'>('all');
  const isProvider = user?.role === 'provider';

  const filteredActivities = activities.filter((act) => {
    if (filter === 'all') return true;
    return act.type === filter;
  });

  return (
    <main className="max-w-3xl mx-auto px-4 md:px-margin-desktop w-full py-6 md:py-10 pb-28">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-headline-lg-mobile md:font-headline-lg text-2xl md:text-3xl font-bold text-primary">
              {isProvider ? 'Business Notifications' : 'Activity & Alerts'}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-bold">
              {isProvider ? 'Partner Hub' : 'Consumer'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-secondary mt-1">
            {isProvider
              ? 'New client reservation requests, job alerts, and payment deposits.'
              : 'Updates on your event bookings, confirmations, and scheduling notices.'}
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-surface-container-lowest p-1 rounded-2xl border border-outline-variant shadow-sm self-start">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              filter === 'all'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-secondary hover:text-primary'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('booking')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              filter === 'booking'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-secondary hover:text-primary'
            }`}
          >
            Bookings
          </button>
          <button
            onClick={() => setFilter('payment')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              filter === 'payment'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-secondary hover:text-primary'
            }`}
          >
            Payments
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant shadow-sm overflow-hidden divide-y divide-outline-variant">
        {filteredActivities.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="w-12 h-12 rounded-2xl bg-surface-container text-secondary flex items-center justify-center mx-auto mb-3">
              <span className="material-symbols-outlined text-2xl">notifications_off</span>
            </div>
            <p className="text-sm font-bold text-primary">No notifications</p>
            <p className="text-xs text-secondary mt-1">
              You are all caught up with your recent event alerts.
            </p>
          </div>
        ) : (
          filteredActivities.map((act) => (
            <div
              key={act.id}
              className="p-4 sm:p-5 flex items-start gap-3.5 hover:bg-surface-container-low/50 transition-colors"
            >
              {/* Icon Box */}
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border border-outline-variant ${
                  act.type === 'booking'
                    ? 'bg-secondary-container text-on-secondary-container'
                    : act.type === 'payment'
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-error-container text-error'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {act.type === 'booking'
                    ? 'event_available'
                    : act.type === 'payment'
                    ? 'payments'
                    : 'cancel'}
                </span>
              </div>

              {/* Message & Meta */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h4 className="text-sm font-bold text-primary truncate">
                    {act.title}
                  </h4>
                  <span className="text-[11px] text-secondary shrink-0 font-medium">
                    {act.time}
                  </span>
                </div>
                <p className="text-xs text-secondary mt-0.5 leading-relaxed">
                  {act.subtitle}
                </p>

                {/* Quick Action Button */}
                <div className="mt-2.5 flex items-center gap-2">
                  <button
                    onClick={() => setCurrentRoute('bookings')}
                    className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                  >
                    <span>{isProvider ? 'View Booking Queue' : 'View Reservation'}</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
};
