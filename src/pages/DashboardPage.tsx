import React, { useState } from 'react';
import { Activity, Booking, PageRoute } from '../types';

interface DashboardPageProps {
  setCurrentRoute: (route: PageRoute) => void;
  bookings: Booking[];
  activities: Activity[];
  onUpdateBookingStatus: (id: string, newStatus: Booking['status']) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  setCurrentRoute,
  bookings,
  activities,
  onUpdateBookingStatus,
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('This Week');

  return (
    <main className="max-w-container-max mx-auto px-4 md:px-margin-desktop w-full py-6 md:py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-headline-lg-mobile md:font-headline-lg text-2xl md:text-3xl font-bold text-primary">
              Provider Dashboard
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-on-tertiary-container/10 text-on-tertiary-container text-[11px] font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-on-tertiary-container"></span>
              <span>Live</span>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-secondary mt-1">
            Real-time activity, event logistics metrics, and pending client requests.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentRoute('services')}
            className="px-4 py-2 bg-surface-container border border-outline-variant rounded-xl text-xs font-bold text-primary hover:bg-surface-container-high transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">storefront</span>
            <span>Manage Catalog</span>
          </button>
          <button
            onClick={() => setCurrentRoute('bookings')}
            className="px-4 py-2 bg-primary text-on-primary rounded-xl text-xs font-bold active:scale-95 transition-transform shadow-sm flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>All Bookings</span>
          </button>
        </div>
      </div>

      {/* Quick Stats Grid: 2 cards in the same row */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="flex flex-col gap-1 rounded-2xl p-5 bg-surface-container-lowest border border-outline-variant shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-secondary text-xs font-medium">Total Bookings</p>
            <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center border border-outline-variant">
              <span className="material-symbols-outlined text-primary text-[18px]">event_available</span>
            </div>
          </div>
          <p className="text-primary text-3xl font-bold leading-tight mt-2">
            {bookings.length}
          </p>
          <p className="text-on-tertiary-container text-[11px] font-semibold flex items-center gap-1 mt-2">
            <span className="material-symbols-outlined text-[14px]">trending_up</span> +4.2% active rate
          </p>
        </div>

        <div className="flex flex-col gap-1 rounded-2xl p-5 bg-surface-container-lowest border border-outline-variant shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-secondary text-xs font-medium">Catalog Views</p>
            <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center border border-outline-variant">
              <span className="material-symbols-outlined text-primary text-[18px]">visibility</span>
            </div>
          </div>
          <p className="text-primary text-3xl font-bold leading-tight mt-2">1.2k</p>
          <p className="text-on-tertiary-container text-[11px] font-semibold flex items-center gap-1 mt-2">
            <span className="material-symbols-outlined text-[14px]">trending_up</span> +8.1% impression reach
          </p>
        </div>
      </div>

      {/* Main Grid: Bookings + Chart & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Upcoming Bookings */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-title-md text-lg font-bold text-primary">
              Upcoming Bookings
            </h2>
            <button
              onClick={() => setCurrentRoute('bookings')}
              className="text-primary text-xs font-bold hover:underline"
            >
              View All ({bookings.length})
            </button>
          </div>

          <div className="space-y-3">
            {bookings.slice(0, 4).map((booking) => (
              <div
                key={booking.id}
                className="flex flex-col gap-3 p-4 bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm hover:border-primary/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="size-12 rounded-xl overflow-hidden shrink-0 bg-surface-container flex items-center justify-center border border-outline-variant">
                    {booking.avatar ? (
                      <img
                        className="w-full h-full object-cover"
                        src={booking.avatar}
                        alt={booking.clientName}
                      />
                    ) : (
                      <span className="material-symbols-outlined text-secondary">
                        {booking.clientType === 'business' ? 'business' : 'person'}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <p className="text-primary text-sm font-bold truncate">
                        {booking.clientName}
                      </p>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          booking.status === 'Confirmed'
                            ? 'bg-secondary-container text-on-secondary-container'
                            : booking.status === 'In-Progress'
                            ? 'bg-tertiary-fixed text-on-tertiary-fixed'
                            : 'bg-surface-variant text-on-surface-variant'
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>
                    <p className="text-secondary text-xs truncate">{booking.serviceTitle}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-outline-variant text-xs">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-secondary">
                      <span className="material-symbols-outlined text-[15px]">schedule</span>
                      <span>{booking.time || booking.date}</span>
                    </div>
                    <div className="flex items-center gap-1 font-mono-data text-primary font-bold">
                      <span className="material-symbols-outlined text-[15px] text-secondary">payments</span>
                      <span>${booking.value.toLocaleString()}</span>
                    </div>
                  </div>

                  {booking.status === 'Pending' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onUpdateBookingStatus(booking.id, 'Confirmed')}
                        className="px-2.5 py-1 bg-primary text-on-primary rounded-lg text-[11px] font-bold hover:bg-primary-container"
                      >
                        Accept
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Revenue Weekly Chart (Stitch Screen 7fe8ca7f) */}
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-primary text-base font-bold">Weekly Earnings Overview</h3>
                <p className="text-xs text-secondary mt-0.5">Last 7 days vs previous period</p>
              </div>
              <button
                onClick={() =>
                  setSelectedTimeframe((prev) =>
                    prev === 'This Week' ? 'This Month' : prev === 'This Month' ? 'Quarterly' : 'This Week'
                  )
                }
                className="flex items-center gap-1 bg-surface px-3 py-1.5 rounded-xl border border-outline-variant text-xs font-semibold text-primary hover:bg-surface-container transition-colors"
                title="Click to toggle timeframe"
              >
                <span>{selectedTimeframe}</span>
                <span className="material-symbols-outlined text-sm">expand_more</span>
              </button>
            </div>

            <div className="flex flex-col gap-1 mb-6">
              <p className="text-primary text-3xl font-bold tracking-tight">$2,840</p>
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-xs text-on-tertiary-container">
                  trending_up
                </span>
                <p className="text-on-tertiary-container text-xs font-bold">+5.2%</p>
                <span className="text-secondary text-xs">• Verified receipts</span>
              </div>
            </div>

            {/* Bars */}
            <div className="grid h-[150px] grid-flow-col gap-3 sm:gap-6 grid-rows-[1fr_auto] items-end justify-items-center px-2 pt-4">
              {[
                { day: 'M', height: '70%', val: '$380' },
                { day: 'T', height: '85%', val: '$520' },
                { day: 'W', height: '50%', val: '$260' },
                { day: 'T', height: '65%', val: '$410' },
                { day: 'F', height: '90%', val: '$680' },
                { day: 'S', height: '40%', val: '$240' },
                { day: 'S', height: '55%', val: '$350' },
              ].map((b, i) => (
                <React.Fragment key={i}>
                  <div className="w-full flex flex-col items-center h-full justify-end group cursor-pointer">
                    <span className="text-[10px] text-secondary opacity-0 group-hover:opacity-100 transition-opacity mb-1 font-mono-data">
                      {b.val}
                    </span>
                    <div
                      className="bg-primary/15 group-hover:bg-primary/30 transition-colors rounded-t-xl w-full border-t-2 border-primary"
                      style={{ height: b.height }}
                    ></div>
                  </div>
                  <p className="text-secondary text-[11px] font-bold mt-2">{b.day}</p>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Recent Activity Feed */}
        <div className="space-y-4">
          <h2 className="font-title-md text-lg font-bold text-primary">
            Recent Activity
          </h2>

          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant overflow-hidden shadow-sm">
            <div className="divide-y divide-outline-variant">
              {activities.map((act) => (
                <div
                  key={act.id}
                  className="p-4 flex items-start gap-3 hover:bg-surface transition-colors cursor-pointer"
                >
                  <div
                    className={`size-9 rounded-xl flex items-center justify-center shrink-0 ${
                      act.type === 'booking'
                        ? 'bg-secondary-container text-on-secondary-container'
                        : act.type === 'payment'
                        ? 'bg-on-tertiary-container/10 text-on-tertiary-container'
                        : 'bg-error-container text-error'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {act.type === 'booking'
                        ? 'event_available'
                        : act.type === 'payment'
                        ? 'payments'
                        : 'cancel'}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline gap-2 mb-0.5">
                      <p className="text-xs font-bold text-primary truncate">{act.title}</p>
                      <p className="text-[10px] text-secondary shrink-0">{act.time}</p>
                    </div>
                    <p className="text-[11px] text-secondary truncate">{act.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-surface border-t border-outline-variant text-center">
              <span className="text-[11px] font-bold text-secondary uppercase tracking-wider">
                System Activity Log • Up to date
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
