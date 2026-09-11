import React, { useEffect, useState, useRef } from 'react';
import { PageRoute, User } from '../../types';
import { providerService } from '../../services/providerService';

export interface SmartSidebarProps {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  isDesktopCollapsed: boolean;
  onToggleDesktopCollapse: () => void;
  currentRoute: PageRoute;
  setCurrentRoute: (route: PageRoute) => void;
  user: User | null;
  onLogout: () => void;
  onToggleRole?: () => void;
  unreadNotificationsCount?: number;
  onUpdateUser?: (updatedUser: User) => void;
}

interface NavItem {
  route: PageRoute;
  label: string;
  icon: string;
}

export const SmartSidebar: React.FC<SmartSidebarProps> = ({
  isMobileOpen,
  onCloseMobile,
  isDesktopCollapsed,
  onToggleDesktopCollapse,
  currentRoute,
  setCurrentRoute,
  user,
  onLogout,
  onToggleRole,
  onUpdateUser,
}) => {
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close popover on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsPopoverOpen(false);
      }
    };
    if (isPopoverOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPopoverOpen]);

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isPopoverOpen) {
          setIsPopoverOpen(false);
        } else if (isMobileOpen) {
          onCloseMobile();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileOpen, isPopoverOpen, onCloseMobile]);

  // Lock body scroll on mobile overlay
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  const isProvider = user?.role === 'provider';
  const publicId = isProvider
    ? user.providerId || (user.userId ? user.userId.replace('USR-', 'PRV-') : 'PRV-ACTIVE')
    : user?.userId || (user ? `USR-${user.id.slice(0, 6).toUpperCase()}` : '');

  // User display name: Business name if provider and present, else individual name
  const displayName = isProvider
    ? user?.providerDetails?.businessName || user?.companyName || user?.name || 'Partner'
    : user?.name || 'Member';

  const handleNavigate = (route: PageRoute) => {
    setCurrentRoute(route);
    setIsPopoverOpen(false);
    if (isMobileOpen) {
      onCloseMobile();
    }
  };

  const handleToggleLive = async () => {
    if (!user || !isProvider) return;
    const nextLive = !user.isLive;
    const updated: User = { ...user, isLive: nextLive };
    if (onUpdateUser) {
      onUpdateUser(updated);
    }
    try {
      await providerService.toggleAvailability(user.id, nextLive);
    } catch (err) {
      console.error('Failed to toggle provider live availability:', err);
    }
  };

  // Streamlined navigation list (Removed Account and Notifications as per request)
  const navItems: NavItem[] = isProvider
    ? [
        { route: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
        { route: 'services', label: 'Service Catalog', icon: 'storefront' },
        { route: 'bookings', label: 'Bookings Queue', icon: 'calendar_month' },
        { route: 'marketplace', label: 'Explore Marketplace', icon: 'travel_explore' },
      ]
    : [
        { route: 'landing', label: 'Home', icon: 'home' },
        { route: 'marketplace', label: 'Find Services', icon: 'storefront' },
        { route: 'bookings', label: 'My Bookings', icon: 'calendar_month' },
      ];

  const isItemActive = (itemRoute: PageRoute) => {
    if (itemRoute === 'landing') return currentRoute === 'landing';
    return currentRoute.startsWith(itemRoute);
  };

  // -------------------------------------------------------------
  // Floating Profile Popover Menu (ChatGPT-Inspired)
  // -------------------------------------------------------------
  const renderProfilePopover = (isCollapsedDesktop: boolean) => {
    if (!isPopoverOpen || !user) return null;

    const hasSubmittedApp =
      user.providerApplication &&
      (user.providerApplication.status === 'submitted' ||
        user.providerApplication.status === 'reviewed');

    return (
      <div
        ref={popoverRef}
        className={`bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-2xl p-2 z-50 text-xs animate-modal-pop backdrop-blur-xl ${
          isCollapsedDesktop
            ? 'fixed left-[76px] bottom-3 w-64'
            : 'absolute bottom-full mb-2 left-2 right-2'
        }`}
      >
        {/* Popover Header Snapshot */}
        <div
          onClick={() => handleNavigate('account')}
          className="p-2.5 rounded-xl hover:bg-surface-container cursor-pointer transition-colors flex items-center justify-between gap-2"
          title="Go to Account & Profile"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={user.avatar}
              alt={displayName}
              className="w-8 h-8 rounded-xl object-cover border border-outline-variant flex-shrink-0"
            />
            <div className="min-w-0">
              <p className="font-bold text-[13.5px] text-primary truncate leading-tight">
                {displayName}
              </p>
              <p className="text-[11px] text-secondary font-mono truncate">{publicId}</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-secondary text-[13px]">
            chevron_right
          </span>
        </div>

        <div className="h-px bg-outline-variant/60 my-1.5" />

        {/* Dynamic Context Actions */}
        <div className="space-y-0.5">
          {/* Consumer Action: Become a Provider / Track Application */}
          {!isProvider && (
            <button
              onClick={() =>
                handleNavigate(
                  hasSubmittedApp
                    ? 'provider-onboarding/status'
                    : 'provider-onboarding/user-details'
                )
              }
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-primary hover:bg-surface-container transition-colors text-left"
            >
              <span className="material-symbols-outlined text-[15px] text-amber-500">
                {hasSubmittedApp ? 'hourglass_top' : 'auto_awesome'}
              </span>
              <span className="truncate">
                {hasSubmittedApp ? 'Application Under Review' : 'Become a Provider'}
              </span>
            </button>
          )}

          {/* Provider Actions: Live Availability & Dashboard */}
          {isProvider && (
            <>
              <div className="px-3 py-1.5 flex items-center justify-between rounded-xl bg-surface/50 border border-outline-variant/50 my-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      user.isLive ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'
                    }`}
                  />
                  <span className="text-[11px] font-bold text-primary">
                    {user.isLive ? 'Live on Marketplace' : 'Offline / Paused'}
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={Boolean(user.isLive)}
                    onChange={handleToggleLive}
                    className="sr-only peer"
                    aria-label="Toggle Live Availability"
                  />
                  <div className="w-8 h-4 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] after:start-[1px] after:bg-white after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-emerald-500" />
                </label>
              </div>

              <button
                onClick={() => handleNavigate('dashboard')}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-primary hover:bg-surface-container transition-colors text-left"
              >
                <span className="material-symbols-outlined text-[15px] text-secondary">
                  dashboard
                </span>
                <span>Provider Operations Hub</span>
              </button>
            </>
          )}

          {/* Profile */}
          <button
            onClick={() => handleNavigate('account')}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-primary hover:bg-surface-container transition-colors text-left"
          >
            <span className="material-symbols-outlined text-[15px] text-secondary">
              account_circle
            </span>
            <span>Profile</span>
          </button>

          {/* Settings */}
          <button
            onClick={() => handleNavigate('account')}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-primary hover:bg-surface-container transition-colors text-left"
          >
            <span className="material-symbols-outlined text-[15px] text-secondary">
              settings
            </span>
            <span>Settings</span>
          </button>

          {/* Switch Role View */}
          {onToggleRole && (
            <button
              onClick={() => {
                onToggleRole();
                setIsPopoverOpen(false);
                if (isMobileOpen) onCloseMobile();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-primary hover:bg-surface-container transition-colors text-left"
            >
              <span className="material-symbols-outlined text-[15px] text-secondary">
                swap_horiz
              </span>
              <span className="truncate">
                {isProvider ? 'Switch to Consumer View' : 'Switch to Provider Hub'}
              </span>
            </button>
          )}
        </div>

        <div className="h-px bg-outline-variant/60 my-1.5" />

        {/* Help & Terms */}
        <button
          onClick={() => {
            setShowTermsModal(true);
            setIsPopoverOpen(false);
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-secondary hover:text-primary hover:bg-surface-container transition-colors text-left"
        >
          <span className="material-symbols-outlined text-[15px]">help</span>
          <span>Help & Terms</span>
        </button>

        {/* Sign Out */}
        <button
          onClick={() => {
            setIsPopoverOpen(false);
            onLogout();
            if (isMobileOpen) onCloseMobile();
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-error hover:bg-error-container/20 transition-colors text-left"
        >
          <span className="material-symbols-outlined text-[15px]">logout</span>
          <span>Log out</span>
        </button>
      </div>
    );
  };

  // -------------------------------------------------------------
  // Inner Sidebar Layout
  // -------------------------------------------------------------
  const renderSidebarContent = (isCollapsed: boolean, isMobile: boolean) => (
    <div className="w-full h-full flex flex-col justify-between select-none relative">
      {/* 1. Top Header Area */}
      <div>
        {isCollapsed ? (
          /* Desktop Collapsed: Single Merged Icon Button with Focus/Hover Transformation & Visible Divider */
          <div className="relative group flex justify-center py-3.5 border-b border-outline-variant">
            <button
              onClick={onToggleDesktopCollapse}
              className="w-10 h-10 rounded-xl hover:bg-primary/10 focus:bg-primary/10 flex items-center justify-center relative transition-all duration-200 active:scale-95 text-primary focus:outline-none"
              aria-label="Open sidebar"
              title="Open sidebar"
            >
              {/* Default State: Clean Website Icon without heavy background (90% size: 20px) */}
              <span className="material-symbols-outlined text-[20px] group-hover:scale-0 group-hover:opacity-0 group-focus:scale-0 group-focus:opacity-0 transition-all duration-200">
                {isProvider ? 'storefront' : 'event'}
              </span>

              {/* Hover / Focus State: Animated Expand Button (90% size: 20px) */}
              <span className="material-symbols-outlined text-[20px] absolute scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 group-focus:scale-100 group-focus:opacity-100 transition-all duration-200">
                dock_to_right
              </span>
            </button>

            {/* Floating "Open sidebar" Chip beside vertical sidebar */}
            <div className="opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-focus:opacity-100 group-focus:scale-100 transition-all duration-200 absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1 bg-surface-container-highest text-primary border border-outline-variant text-xs font-bold rounded-xl whitespace-nowrap shadow-xl z-50">
              Open sidebar
            </div>
          </div>
        ) : (
          /* Expanded / Mobile Header: Logo + Title + Collapse/Close Button */
          <div className="border-b border-outline-variant px-4 py-3.5 flex items-center justify-between">
            <div
              onClick={() => handleNavigate(isProvider ? 'dashboard' : 'landing')}
              className="flex items-center gap-2.5 cursor-pointer group min-w-0"
            >
              <div className="w-8 h-8 rounded-xl bg-primary text-on-primary flex items-center justify-center font-bold text-sm shadow-sm group-hover:scale-105 transition-transform flex-shrink-0">
                {/* 90% size: 17px */}
                <span className="material-symbols-outlined text-[17px]">
                  {isProvider ? 'storefront' : 'event'}
                </span>
              </div>
              <span className="font-display-lg font-bold text-base text-primary tracking-tight truncate">
                {isProvider ? 'Evinzoo Business' : 'Evinzoo'}
              </span>
            </div>

            {isMobile ? (
              <button
                onClick={onCloseMobile}
                className="w-8 h-8 rounded-xl hover:bg-surface-container flex items-center justify-center text-secondary hover:text-primary transition-colors active:scale-95"
                aria-label="Close sidebar"
                title="Close sidebar"
              >
                {/* 90% size: 18px */}
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            ) : (
              <button
                onClick={onToggleDesktopCollapse}
                className="w-8 h-8 rounded-xl hover:bg-surface-container flex items-center justify-center text-secondary hover:text-primary transition-colors active:scale-95"
                aria-label="Collapse sidebar"
                title="Close sidebar"
              >
                {/* 90% size: 18px */}
                <span className="material-symbols-outlined text-[18px]">dock_to_left</span>
              </button>
            )}
          </div>
        )}

        {/* 2. Middle: Navigation Links */}
        <div className="py-3 px-3 space-y-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
          {navItems.map((item) => {
            const active = isItemActive(item.route);

            return (
              <div key={item.route} className="relative group">
                <button
                  onClick={() => handleNavigate(item.route)}
                  className={`flex items-center transition-all min-h-[40px] ${
                    isCollapsed
                      ? 'w-9 h-9 mx-auto justify-center rounded-xl bg-transparent'
                      : 'w-full px-3 py-2 rounded-xl text-xs'
                  } ${
                    active
                      ? isCollapsed
                        ? 'text-primary font-bold'
                        : 'bg-primary/15 text-primary font-bold'
                      : isCollapsed
                      ? 'text-secondary hover:text-primary hover:bg-primary/5'
                      : 'text-primary/80 hover:text-primary hover:bg-surface-container/70 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* 90% size: 18px */}
                    <span
                      className={`material-symbols-outlined text-[18px] transition-transform flex-shrink-0 ${
                        active ? 'scale-105 text-primary' : 'text-secondary group-hover:text-primary'
                      }`}
                    >
                      {item.icon}
                    </span>
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                  </div>
                </button>

                {/* Floating Tooltip in Collapsed Desktop Mode */}
                {isCollapsed && (
                  <div className="opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 transition-all duration-150 absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1 bg-surface-container-highest text-primary border border-outline-variant text-xs font-bold rounded-xl whitespace-nowrap shadow-xl z-50">
                    {item.label}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Bottom: Minimal Profile Section (Name + ID Only) with Floating Popover */}
      <div className="border-t border-outline-variant p-2.5 bg-surface-container-low/30 relative">
        {/* Render Floating Popover if open */}
        {renderProfilePopover(isCollapsed && !isMobile)}

        {user ? (
          <div>
            {isCollapsed ? (
              /* Collapsed Desktop: Centered Avatar Trigger */
              <div className="relative flex justify-center py-1">
                <button
                  onClick={() => setIsPopoverOpen(!isPopoverOpen)}
                  className={`w-10 h-10 rounded-xl overflow-hidden border-2 transition-all flex items-center justify-center active:scale-95 ${
                    isPopoverOpen
                      ? 'border-primary shadow-md ring-2 ring-primary/20'
                      : 'border-outline-variant hover:border-primary'
                  }`}
                  aria-label="User profile options"
                  title={displayName}
                >
                  <img
                    src={user.avatar}
                    alt={displayName}
                    className="w-full h-full object-cover"
                  />
                </button>
              </div>
            ) : (
              /* Expanded / Mobile: Minimal Profile Row (1.10x Scaled Text) */
              <div
                onClick={() => setIsPopoverOpen(!isPopoverOpen)}
                className={`p-2 rounded-xl cursor-pointer transition-colors flex items-center justify-between gap-2.5 select-none ${
                  isPopoverOpen ? 'bg-surface-container' : 'hover:bg-surface-container'
                }`}
                title="Account options"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={user.avatar}
                    alt={displayName}
                    className="w-9 h-9 rounded-xl object-cover border border-outline-variant flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-[13.5px] font-bold text-primary truncate leading-tight">
                      {displayName}
                    </p>
                    <p className="text-[11px] text-secondary font-mono truncate mt-0.5">
                      {publicId}
                    </p>
                  </div>
                </div>

                {/* 90% size: 15px */}
                <span
                  className={`material-symbols-outlined text-secondary text-[15px] transition-transform flex-shrink-0 ${
                    isPopoverOpen ? 'rotate-180' : ''
                  }`}
                >
                  unfold_more
                </span>
              </div>
            )}
          </div>
        ) : (
          /* Guest / Unauthenticated */
          <div>
            {isCollapsed ? (
              <button
                onClick={() => handleNavigate('login')}
                className="w-10 h-10 mx-auto rounded-xl bg-surface border border-outline-variant flex items-center justify-center text-primary hover:bg-surface-container transition-colors"
                title="Sign In"
              >
                {/* 90% size: 18px */}
                <span className="material-symbols-outlined text-[18px]">login</span>
              </button>
            ) : (
              <div className="space-y-1.5">
                <button
                  onClick={() => handleNavigate('login')}
                  className="w-full py-2 bg-primary text-on-primary rounded-xl text-xs font-bold shadow-sm"
                >
                  Sign In
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Terms & Privacy Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full border border-outline-variant p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-outline-variant pb-3">
              <h3 className="text-base font-bold text-primary">Help & Terms</h3>
              <button
                onClick={() => setShowTermsModal(false)}
                className="w-8 h-8 rounded-full hover:bg-surface flex items-center justify-center text-secondary"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <div className="text-xs text-secondary space-y-2.5 leading-relaxed">
              <p>Welcome to the Evinzoo event logistics & vendor marketplace platform.</p>
              <p>All contracts and payments are secured via escrow until event completion confirmation.</p>
              <p>For support inquiries, reach out to support@evinzoo.com.</p>
            </div>
            <button
              onClick={() => setShowTermsModal(false)}
              className="w-full py-2.5 bg-primary text-on-primary rounded-xl text-xs font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* ------------------------------------------------------------- */}
      {/* A. Desktop Left Sidebar (Fixed on md+, collapsible)            */}
      {/* ------------------------------------------------------------- */}
      <aside
        className={`hidden md:flex flex-col fixed top-0 bottom-0 left-0 z-40 bg-surface-container-lowest border-r border-outline-variant transition-all duration-300 ease-in-out ${
          isDesktopCollapsed ? 'w-[68px]' : 'w-60'
        }`}
        aria-label="Desktop Sidebar Navigation"
      >
        {renderSidebarContent(isDesktopCollapsed, false)}
      </aside>

      {/* ------------------------------------------------------------- */}
      {/* B. Mobile Left Sidebar (Off-canvas overlay with backdrop scrim)*/}
      {/* ------------------------------------------------------------- */}
      <div
        className={`fixed inset-0 z-50 md:hidden flex justify-start transition-[visibility] duration-300 ${
          isMobileOpen
            ? 'visible pointer-events-auto'
            : 'invisible pointer-events-none delay-300'
        }`}
      >
        {/* Backdrop Scrim with smooth fade in/out */}
        <div
          onClick={onCloseMobile}
          className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ease-in-out cursor-pointer ${
            isMobileOpen ? 'opacity-100' : 'opacity-0'
          }`}
          aria-hidden="true"
        />

        {/* Drawer Container with smooth slide in/out */}
        <aside
          className={`relative w-[82vw] max-w-xs bg-surface-container-lowest border-r border-outline-variant shadow-2xl z-50 flex flex-col justify-between overflow-hidden transition-transform duration-300 ease-out transform ${
            isMobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Sidebar Navigation"
        >
          {renderSidebarContent(false, true)}
        </aside>
      </div>
    </>
  );
};

export default SmartSidebar;
