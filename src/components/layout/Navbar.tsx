import React, { useState, useRef, useEffect } from 'react';
import { PageRoute, User } from '../../types';

interface NavbarProps {
  currentRoute: PageRoute;
  setCurrentRoute: (route: PageRoute) => void;
  user: User | null;
  onLogout: () => void;
  onToggleRole?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRoute,
  setCurrentRoute,
  user,
  onLogout,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isProvider = user?.role === 'provider';

  return (
    <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-outline-variant">
      <div className="max-w-container-max mx-auto px-4 md:px-margin-desktop h-16 flex items-center justify-between">
        {/* Brand Logo & Portal Identity */}
        <div
          onClick={() => setCurrentRoute(isProvider ? 'dashboard' : 'landing')}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          <div className="w-9 h-9 rounded-2xl bg-primary flex items-center justify-center text-on-primary shadow-sm group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-[20px]">
              {isProvider ? 'storefront' : 'event'}
            </span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xl md:text-2xl font-bold font-display-lg text-primary tracking-tight leading-none">
                {isProvider ? 'Evinzoo Business' : 'Evinzoo'}
              </span>
              {isProvider && (
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-on-tertiary-container/10 text-on-tertiary-container text-[10px] font-bold">
                  <span className={`w-1.5 h-1.5 rounded-full ${user.isLive ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                  <span>ID: {user.providerId}</span>
                </span>
              )}
            </div>
            <span className="text-[10px] text-secondary font-medium tracking-wider uppercase">
              {isProvider ? 'Partner Hub & Dispatch' : 'Logistics Network'}
            </span>
          </div>
        </div>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center gap-6">
          {isProvider ? (
            /* Business Owner Nav */
            <>
              <button
                onClick={() => setCurrentRoute('dashboard')}
                className={`text-xs uppercase tracking-wider font-bold transition-colors ${
                  currentRoute === 'dashboard' ? 'text-primary' : 'text-secondary hover:text-primary'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setCurrentRoute('bookings')}
                className={`text-xs uppercase tracking-wider font-bold transition-colors ${
                  currentRoute === 'bookings' ? 'text-primary' : 'text-secondary hover:text-primary'
                }`}
              >
                Bookings
              </button>
              <button
                onClick={() => setCurrentRoute('services')}
                className={`text-xs uppercase tracking-wider font-bold transition-colors ${
                  currentRoute === 'services' ? 'text-primary' : 'text-secondary hover:text-primary'
                }`}
              >
                Service Catalog
              </button>
              <button
                onClick={() => setCurrentRoute('notifications')}
                className={`text-xs uppercase tracking-wider font-bold transition-colors ${
                  currentRoute === 'notifications' ? 'text-primary' : 'text-secondary hover:text-primary'
                }`}
              >
                Notifications
              </button>
            </>
          ) : user ? (
            /* Logged-In Consumer Nav */
            <>
              <button
                onClick={() => setCurrentRoute('landing')}
                className={`text-xs uppercase tracking-wider font-bold transition-colors ${
                  currentRoute === 'landing' ? 'text-primary' : 'text-secondary hover:text-primary'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => setCurrentRoute('bookings')}
                className={`text-xs uppercase tracking-wider font-bold transition-colors ${
                  currentRoute === 'bookings' ? 'text-primary' : 'text-secondary hover:text-primary'
                }`}
              >
                Bookings
              </button>
              <button
                onClick={() => setCurrentRoute('notifications')}
                className={`text-xs uppercase tracking-wider font-bold transition-colors ${
                  currentRoute === 'notifications' ? 'text-primary' : 'text-secondary hover:text-primary'
                }`}
              >
                Notifications
              </button>
            </>
          ) : (
            /* Unauthenticated Visitor Nav */
            <>
              <button
                onClick={() => setCurrentRoute('landing')}
                className={`text-xs uppercase tracking-wider font-bold transition-colors ${
                  currentRoute === 'landing' ? 'text-primary' : 'text-secondary hover:text-primary'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => setCurrentRoute('marketplace')}
                className={`text-xs uppercase tracking-wider font-bold transition-colors ${
                  currentRoute === 'marketplace' ? 'text-primary' : 'text-secondary hover:text-primary'
                }`}
              >
                Find Services
              </button>
            </>
          )}
        </nav>

        {/* User / Auth Controls */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2.5 p-1 pl-1.5 pr-2.5 rounded-full hover:bg-surface-container transition-colors border border-outline-variant shadow-sm"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-7 h-7 rounded-full object-cover border border-outline-variant"
                />
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-bold text-primary leading-tight">
                    {user.companyName || user.name}
                  </p>
                  {isProvider && (
                    <span className="text-[9px] font-bold uppercase tracking-wider text-on-tertiary-container block">
                      Provider
                    </span>
                  )}
                </div>
                <span className="material-symbols-outlined text-sm text-secondary">
                  expand_more
                </span>
              </button>

              {/* Dropdown Menu */}
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-surface-container-lowest rounded-3xl shadow-2xl border border-outline-variant py-2 z-50 animate-fade-in divide-y divide-outline-variant">
                  <div className="px-4 py-3">
                    <p className="text-xs font-bold text-primary truncate">{user.name}</p>
                    <p className="text-[11px] text-secondary truncate">{user.email}</p>
                    {isProvider && (
                      <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-on-tertiary-container/10 border border-on-tertiary-container/20 text-[10px] font-bold text-on-tertiary-container">
                        <span className={`w-1.5 h-1.5 rounded-full ${user.isLive ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                        <span>{user.isLive ? 'Live on Marketplace' : 'Offline / Paused'}</span>
                      </div>
                    )}
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setCurrentRoute('account');
                        setMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-primary hover:bg-surface flex items-center gap-2.5"
                    >
                      <span className="material-symbols-outlined text-[16px] text-secondary">
                        person
                      </span>
                      <span>Account & Profile</span>
                    </button>

                    {isProvider ? (
                      <>
                        <button
                          onClick={() => {
                            setCurrentRoute('dashboard');
                            setMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-xs font-medium text-primary hover:bg-surface flex items-center gap-2.5"
                        >
                          <span className="material-symbols-outlined text-[16px] text-secondary">
                            dashboard
                          </span>
                          <span>Provider Dashboard</span>
                        </button>
                        <button
                          onClick={() => {
                            setCurrentRoute('services');
                            setMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-xs font-medium text-primary hover:bg-surface flex items-center gap-2.5"
                        >
                          <span className="material-symbols-outlined text-[16px] text-secondary">
                            storefront
                          </span>
                          <span>Service Catalog</span>
                        </button>
                        <button
                          onClick={() => {
                            setCurrentRoute('notifications');
                            setMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-xs font-medium text-primary hover:bg-surface flex items-center gap-2.5"
                        >
                          <span className="material-symbols-outlined text-[16px] text-secondary">
                            notifications
                          </span>
                          <span>Notifications</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setCurrentRoute('bookings');
                            setMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-xs font-medium text-primary hover:bg-surface flex items-center gap-2.5"
                        >
                          <span className="material-symbols-outlined text-[16px] text-secondary">
                            calendar_today
                          </span>
                          <span>My Bookings</span>
                        </button>
                        <button
                          onClick={() => {
                            setCurrentRoute('notifications');
                            setMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-xs font-medium text-primary hover:bg-surface flex items-center gap-2.5"
                        >
                          <span className="material-symbols-outlined text-[16px] text-secondary">
                            notifications
                          </span>
                          <span>Notifications</span>
                        </button>
                        <button
                          onClick={() => {
                            setCurrentRoute('apply-provider');
                            setMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-xs font-bold text-primary hover:bg-surface flex items-center gap-2.5 text-primary"
                        >
                          <span className="material-symbols-outlined text-[16px] text-primary">
                            verified
                          </span>
                          <span>Become a Partner</span>
                        </button>
                      </>
                    )}
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        onLogout();
                        setMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-bold text-error hover:bg-error-container/20 flex items-center gap-2.5 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">logout</span>
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Unauthenticated Visitor: Only "Get Started" button (No "Sign In") */
            <button
              onClick={() => setCurrentRoute('login')}
              className="bg-primary text-on-primary rounded-2xl px-5 py-2.5 text-xs font-bold active:scale-95 transition-transform shadow-sm hover:bg-primary-container"
            >
              Get Started
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
