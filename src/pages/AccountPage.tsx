import React, { useState } from 'react';
import { PageRoute, User } from '../types';

interface AccountPageProps {
  user: User | null;
  setCurrentRoute: (route: PageRoute) => void;
  onUpdateUser: (updatedUser: User) => void;
  onLogout: () => void;
}

export const AccountPage: React.FC<AccountPageProps> = ({
  user,
  setCurrentRoute,
  onUpdateUser,
  onLogout,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [companyName, setCompanyName] = useState(user?.companyName || '');

  if (!user) {
    return (
      <main className="max-w-md mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-primary mb-2">Sign in to access your profile</h2>
        <p className="text-xs text-secondary mb-6">Manage your reservations, event details, and account preferences.</p>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => setCurrentRoute('login')}
            className="px-5 py-2.5 bg-primary text-on-primary rounded-xl text-xs font-bold shadow-sm"
          >
            Sign In
          </button>
          <button
            onClick={() => setCurrentRoute('signup')}
            className="px-5 py-2.5 bg-surface-container border border-outline-variant text-primary rounded-xl text-xs font-bold"
          >
            Create Account
          </button>
        </div>
      </main>
    );
  }

  const isProvider = user.role === 'provider';

  const handleToggleLive = () => {
    const updated = { ...user, isLive: !user.isLive };
    onUpdateUser(updated);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = { ...user, name, companyName: isProvider ? companyName : undefined };
    onUpdateUser(updated);
    setIsEditing(false);
  };

  return (
    <main className="max-w-2xl mx-auto px-4 md:px-0 py-6 md:py-10 pb-28">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-2xl font-bold text-primary">
            Account & Preferences
          </h1>
          <p className="text-xs text-secondary mt-0.5">
            {isProvider ? 'Business profile, marketplace availability, and operations.' : 'Personal settings and event reservation history.'}
          </p>
        </div>
      </div>

      {/* Identity Card */}
      {isProvider ? (
        <>
          {/* Business Details Container: Row(icon, Column(Name, Row(Dot[red/green], ID))), connected Row(text, switch) */}
          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant shadow-sm mb-6 space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 bg-surface-container rounded-2xl overflow-hidden border border-outline-variant flex-shrink-0">
                <img
                  alt={user.companyName}
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPGGDgEkAI9NNwEvOnAw7HWJtGFORk7yMvXGfDnJVbdTqkNQhcihkdg7BhkDZ-_TP4cQL0l64UwwuEpNijLFuLiSec3WQ1pH4lD5ZP2bmNnpKWRCna57hP8q0iieBT4D_DrFUDKlALbCyYDxrHU2NS9LkupO3AMiRLEW9nFMQD4UopTmQUXsnNIaEM9BnlOY_ThA2tlkCzXkP8ZdK-Rw8PJ5R58MccZ9f5PlP1vCpN0ELgWCSQmTE"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h2 className="font-title-md text-lg font-bold text-primary leading-tight">
                    {user.companyName || 'Verified Partner'}
                  </h2>
                  <span className="px-2 py-0.5 rounded-full bg-on-tertiary-container/10 text-on-tertiary-container text-[10px] font-bold uppercase tracking-wider">
                    Provider
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`w-2.5 h-2.5 rounded-full transition-colors ${
                      user.isLive ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'bg-red-500'
                    }`}
                  ></span>
                  <p className="font-mono-data text-xs text-secondary font-medium">
                    ID: {user.providerId || '8842'}
                  </p>
                </div>
              </div>
            </div>

            {/* Connected Section Just Below: Row(text, switch) */}
            <div className="border-t border-outline-variant pt-3.5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                  <span>Status:</span>
                  <span className={user.isLive ? 'text-emerald-600' : 'text-red-500'}>
                    {user.isLive ? 'Active' : 'Offline/Out of service'}
                  </span>
                </div>

                {/* Below Status row: two texts with status icons Marketplace and Bookings */}
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1 text-xs">
                    <span
                      className={`material-symbols-outlined text-[16px] ${
                        user.isLive ? 'text-emerald-600 filled' : 'text-red-500'
                      }`}
                    >
                      {user.isLive ? 'check_circle' : 'cancel'}
                    </span>
                    <span className={user.isLive ? 'text-primary font-medium' : 'text-secondary font-medium'}>
                      Marketplace
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-xs">
                    <span
                      className={`material-symbols-outlined text-[16px] ${
                        user.isLive ? 'text-emerald-600 filled' : 'text-red-500'
                      }`}
                    >
                      {user.isLive ? 'check_circle' : 'cancel'}
                    </span>
                    <span className={user.isLive ? 'text-primary font-medium' : 'text-secondary font-medium'}>
                      Bookings
                    </span>
                  </div>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 ml-4">
                <input
                  type="checkbox"
                  checked={user.isLive}
                  onChange={handleToggleLive}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>
          </div>

          {/* Separate Section: Provider Profile Details & Contact Details */}
          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant shadow-sm mb-6 space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant pb-3">
              <h3 className="font-label-bold text-xs font-bold text-primary uppercase tracking-wider">
                Provider Profile & Contact Details
              </h3>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="w-8 h-8 flex items-center justify-center text-secondary hover:text-primary transition-colors bg-surface border border-outline-variant rounded-xl"
                title="Edit Contact Profile"
              >
                <span className="material-symbols-outlined text-[16px]">edit</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-surface-variant overflow-hidden flex-shrink-0 border border-outline-variant">
                  <img
                    alt={user.name}
                    className="w-full h-full object-cover"
                    src={user.avatar}
                  />
                </div>
                <div>
                  <span className="text-[10px] text-secondary uppercase font-bold block">Lead Representative</span>
                  <p className="font-title-md text-sm font-bold text-primary">{user.name}</p>
                  <p className="text-secondary text-[11px]">Authorized Administrator</p>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-secondary uppercase font-bold block">Business Email</span>
                <p className="font-semibold text-primary mt-0.5">{user.email}</p>
              </div>

              <div>
                <span className="text-[10px] text-secondary uppercase font-bold block">Dispatch Phone</span>
                <p className="font-semibold text-primary mt-0.5">{user.providerApplication?.phone || '+1 (415) 555-0192'}</p>
              </div>

              <div>
                <span className="text-[10px] text-secondary uppercase font-bold block">Operating City & Region</span>
                <p className="font-semibold text-primary mt-0.5">{user.providerApplication?.city || 'San Francisco, CA'}</p>
              </div>

              {user.providerApplication?.licenseNumber && (
                <div className="sm:col-span-2">
                  <span className="text-[10px] text-secondary uppercase font-bold block">Commercial License / Tax ID</span>
                  <p className="font-mono-data font-semibold text-primary mt-0.5">{user.providerApplication.licenseNumber}</p>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        /* Consumer Profile Header */
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl overflow-hidden border border-outline-variant bg-surface flex-shrink-0">
                <img
                  alt={user.name}
                  className="w-full h-full object-cover"
                  src={user.avatar}
                />
              </div>
              <div>
                <h2 className="font-title-md text-lg font-bold text-primary leading-tight">
                  {user.name}
                </h2>
                <p className="text-xs text-secondary mt-1">{user.email}</p>
              </div>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="w-8 h-8 flex items-center justify-center text-secondary hover:text-primary transition-colors bg-surface border border-outline-variant rounded-xl"
              title="Edit Profile"
            >
              <span className="material-symbols-outlined text-[16px]">edit</span>
            </button>
          </div>

          {/* Become Partner Callout Banner */}
          <div className="p-4 rounded-xl bg-surface-container border border-outline-variant flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-primary">Do you offer event services?</p>
              <p className="text-[11px] text-secondary mt-0.5">
                Join our network as an event service partner to list packages and receive bookings.
              </p>
            </div>
            <button
              onClick={() => setCurrentRoute('apply-provider')}
              className="px-4 py-2 bg-primary text-on-primary rounded-xl text-xs font-bold hover:bg-primary-container transition-all active:scale-95 shadow-sm whitespace-nowrap"
            >
              Become a Partner
            </button>
          </div>
        </div>
      )}

      {/* Inline Edit Form */}
      {isEditing && (
        <form onSubmit={handleSaveProfile} className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant shadow-sm mb-6 space-y-4">
          <h3 className="text-xs font-bold text-primary uppercase tracking-wider">Edit Profile Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-secondary uppercase mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-surface border border-outline-variant rounded-xl focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            {isProvider && (
              <div>
                <label className="block text-[10px] font-bold text-secondary uppercase mb-1">
                  Company Legal Entity
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-surface border border-outline-variant rounded-xl focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-3 py-1.5 text-xs text-secondary hover:text-primary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-primary text-on-primary rounded-xl text-xs font-bold"
            >
              Save Profile
            </button>
          </div>
        </form>
      )}

      {/* Provider Operations Grid */}
      {isProvider && (
        <div className="mb-6">
          <h3 className="font-label-bold text-xs font-bold text-secondary uppercase tracking-widest mb-3 px-1">
            Operations & Management
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <button
              onClick={() => setCurrentRoute('services')}
              className="flex flex-col items-center justify-center p-4 bg-surface-container-lowest border border-outline-variant rounded-2xl hover:bg-surface-container active:scale-95 transition-all text-center h-28 shadow-sm group"
            >
              <span className="material-symbols-outlined text-secondary group-hover:text-primary mb-2 text-2xl">
                storefront
              </span>
              <span className="font-body-sm text-xs font-bold text-primary">Service Catalog</span>
            </button>

            <button
              onClick={() => setCurrentRoute('bookings')}
              className="flex flex-col items-center justify-center p-4 bg-surface-container-lowest border border-outline-variant rounded-2xl hover:bg-surface-container active:scale-95 transition-all text-center h-28 shadow-sm group"
            >
              <span className="material-symbols-outlined text-secondary group-hover:text-primary mb-2 text-2xl">
                calendar_month
              </span>
              <span className="font-body-sm text-xs font-bold text-primary">Bookings Queue</span>
            </button>

            <button
              onClick={() => setCurrentRoute('dashboard')}
              className="flex flex-col items-center justify-center p-4 bg-surface-container-lowest border border-outline-variant rounded-2xl hover:bg-surface-container active:scale-95 transition-all text-center h-28 shadow-sm group"
            >
              <span className="material-symbols-outlined text-secondary group-hover:text-primary mb-2 text-2xl">
                monitoring
              </span>
              <span className="font-body-sm text-xs font-bold text-primary">Earnings & Analytics</span>
            </button>
          </div>
        </div>
      )}

      {/* Support & Security Section */}
      <div className="mb-8">
        <h3 className="font-label-bold text-xs font-bold text-secondary uppercase tracking-widest mb-3 px-1">
          Support & Security
        </h3>
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm divide-y divide-outline-variant text-xs font-medium">
          <a
            href="#"
            className="flex items-center justify-between px-4 py-3.5 hover:bg-surface transition-colors"
          >
            <span className="text-primary">Standard Service Agreement</span>
            <span className="material-symbols-outlined text-secondary text-sm">open_in_new</span>
          </a>
          <a
            href="#"
            className="flex items-center justify-between px-4 py-3.5 hover:bg-surface transition-colors"
          >
            <span className="text-primary">Privacy Policy & Logistics Compliance</span>
            <span className="material-symbols-outlined text-secondary text-sm">open_in_new</span>
          </a>
          <button
            onClick={onLogout}
            className="flex items-center justify-between px-4 py-3.5 hover:bg-error-container/20 text-error transition-colors w-full text-left"
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base">logout</span>
              <span className="font-bold">Sign Out from Evinzoo</span>
            </div>
            <span className="material-symbols-outlined text-sm">chevron_right</span>
          </button>
        </div>
      </div>
    </main>
  );
};
