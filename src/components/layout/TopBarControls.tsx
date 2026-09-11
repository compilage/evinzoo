import React from 'react';
import { PageRoute, User } from '../../types';

export interface TopBarControlsProps {
  currentRoute: PageRoute;
  setCurrentRoute: (route: PageRoute) => void;
  user: User | null;
  onLogout?: () => void;
  onToggleRole?: () => void;
  onToggleSidebar?: () => void;
  unreadNotificationsCount?: number;
}

/**
 * TopBarControls replaces the legacy fixed full-width toolbar.
 * - On Desktop: The horizontal top toolbar is completely removed to provide a borderless,
 *   infinitely scalable canvas, leaving only the floating Notification Chip at top-right.
 * - On Mobile: Displays a compact floating chip at top-start (menu button + "Evinzoo")
 *   and the floating Notification Chip at top-end.
 */
export const TopBarControls: React.FC<TopBarControlsProps> = ({
  currentRoute,
  setCurrentRoute,
  user,
  onToggleSidebar,
  unreadNotificationsCount = 0,
}) => {
  return (
    <>
      {/* 1. Mobile-Only Top-Start Floating Chip (Menu Button + Branded "Evinzoo") */}
      <div className="fixed top-3.5 left-4 z-30 md:hidden select-none">
        <button
          onClick={onToggleSidebar}
          className="flex items-center gap-2.5 bg-surface/90 backdrop-blur-md border border-outline-variant/80 hover:border-primary/40 rounded-full shadow-sm hover:shadow px-3.5 py-1.5 active:scale-95 transition-all group"
          aria-label="Open navigation menu"
          title="Open menu"
        >
          {/* Clean Menu Icon without any box/background */}
          <span className="material-symbols-outlined text-[20px] text-primary transition-transform group-hover:scale-105">
            menu
          </span>
          <span className="w-px h-3.5 bg-outline-variant" />
          {/* Awesome Branded "Evinzoo" Wordmark */}
          <span className="font-display-lg font-extrabold text-[15px] tracking-tight bg-gradient-to-r from-primary via-primary to-primary-container bg-clip-text text-transparent">
            Evinzoo
          </span>
        </button>
      </div>

      {/* 2. Universal Top-End Floating Notification Button (Simple Icon with Active Dot) */}
      <div className="fixed top-3.5 right-4 sm:top-5 sm:right-6 z-30 select-none">
        {user ? (
          <button
            onClick={() => setCurrentRoute('notifications')}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border backdrop-blur-md flex items-center justify-center transition-all active:scale-95 shadow-sm relative ${
              currentRoute === 'notifications'
                ? 'bg-primary text-on-primary border-primary shadow-md ring-2 ring-primary/20'
                : 'bg-surface/90 hover:bg-surface-container border-outline-variant hover:border-primary/40 text-primary'
            }`}
            title="Notifications & Alerts"
            aria-label="View Notifications"
          >
            <span className="material-symbols-outlined text-[20px] sm:text-[22px]">
              notifications
            </span>
            {/* Simple indicator dot if active notifications exist */}
            {unreadNotificationsCount > 0 && (
              <span
                className={`absolute top-2 right-2 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full ring-2 ${
                  currentRoute === 'notifications'
                    ? 'bg-white ring-primary'
                    : 'bg-error ring-surface'
                }`}
              />
            )}
          </button>
        ) : (
          /* Unauthenticated Visitor: Floating Get Started CTA */
          <button
            onClick={() => setCurrentRoute('login')}
            className="bg-primary text-on-primary rounded-full px-4 py-1.5 sm:px-5 sm:py-2 text-xs font-bold active:scale-95 transition-transform shadow-md hover:bg-primary-container"
          >
            Get Started
          </button>
        )}
      </div>
    </>
  );
};

export default TopBarControls;
