import React from 'react';
import { PageRoute, User } from '../../types';

interface MobileNavProps {
  currentRoute: PageRoute;
  setCurrentRoute: (route: PageRoute) => void;
  user: User | null;
  onOpenNotifications: () => void;
  unreadNotificationsCount?: number;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentRoute,
  setCurrentRoute,
  user,
  onOpenNotifications,
  unreadNotificationsCount = 2,
}) => {
  // Requirement 1: When user is not logged in, do not show bottom navigation on landing or anywhere
  if (!user || currentRoute === 'login' || currentRoute === 'signup') {
    return null;
  }

  const isProvider = user.role === 'provider';

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-surface-container-lowest border-t border-outline-variant px-4 py-2 pb-safe flex justify-around items-center shadow-lg md:hidden">
      {isProvider ? (
        /* Partners / Providers: Dashboard, Bookings, Notifications */
        <>
          <button
            onClick={() => setCurrentRoute('dashboard')}
            className={`flex flex-col items-center justify-center w-20 py-1 transition-all active:scale-95 ${
              currentRoute === 'dashboard'
                ? 'text-primary font-bold'
                : 'text-secondary hover:text-primary'
            }`}
          >
            <div
              className={`p-1 rounded-full ${
                currentRoute === 'dashboard' ? 'bg-secondary-container text-on-secondary-container' : ''
              }`}
            >
              <span className="material-symbols-outlined text-[22px]">dashboard</span>
            </div>
            <span className="text-[11px] font-medium mt-0.5">Dashboard</span>
          </button>

          <button
            onClick={() => setCurrentRoute('bookings')}
            className={`flex flex-col items-center justify-center w-20 py-1 transition-all active:scale-95 ${
              currentRoute === 'bookings'
                ? 'text-primary font-bold'
                : 'text-secondary hover:text-primary'
            }`}
          >
            <div
              className={`p-1 rounded-full ${
                currentRoute === 'bookings' ? 'bg-secondary-container text-on-secondary-container' : ''
              }`}
            >
              <span className="material-symbols-outlined text-[22px]">calendar_month</span>
            </div>
            <span className="text-[11px] font-medium mt-0.5">Bookings</span>
          </button>

          <button
            onClick={onOpenNotifications}
            className="flex flex-col items-center justify-center w-20 py-1 transition-all active:scale-95 text-secondary hover:text-primary relative"
          >
            <div className="p-1 rounded-full relative">
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 bg-error rounded-full ring-2 ring-surface-container-lowest"></span>
              )}
            </div>
            <span className="text-[11px] font-medium mt-0.5">Notifications</span>
          </button>
        </>
      ) : (
        /* Normal Consumers: Home, Explore, Bookings */
        <>
          <button
            onClick={() => setCurrentRoute('landing')}
            className={`flex flex-col items-center justify-center w-20 py-1 transition-all active:scale-95 ${
              currentRoute === 'landing'
                ? 'text-primary font-bold'
                : 'text-secondary hover:text-primary'
            }`}
          >
            <div
              className={`p-1 rounded-full ${
                currentRoute === 'landing' ? 'bg-secondary-container text-on-secondary-container' : ''
              }`}
            >
              <span className="material-symbols-outlined text-[22px]">home</span>
            </div>
            <span className="text-[11px] font-medium mt-0.5">Home</span>
          </button>

          <button
            onClick={() => setCurrentRoute('marketplace')}
            className={`flex flex-col items-center justify-center w-20 py-1 transition-all active:scale-95 ${
              currentRoute === 'marketplace'
                ? 'text-primary font-bold'
                : 'text-secondary hover:text-primary'
            }`}
          >
            <div
              className={`p-1 rounded-full ${
                currentRoute === 'marketplace' ? 'bg-secondary-container text-on-secondary-container' : ''
              }`}
            >
              <span className="material-symbols-outlined text-[22px]">search</span>
            </div>
            <span className="text-[11px] font-medium mt-0.5">Explore</span>
          </button>

          <button
            onClick={() => setCurrentRoute('bookings')}
            className={`flex flex-col items-center justify-center w-20 py-1 transition-all active:scale-95 ${
              currentRoute === 'bookings'
                ? 'text-primary font-bold'
                : 'text-secondary hover:text-primary'
            }`}
          >
            <div
              className={`p-1 rounded-full ${
                currentRoute === 'bookings' ? 'bg-secondary-container text-on-secondary-container' : ''
              }`}
            >
              <span className="material-symbols-outlined text-[22px]">calendar_today</span>
            </div>
            <span className="text-[11px] font-medium mt-0.5">Bookings</span>
          </button>
        </>
      )}
    </nav>
  );
};
