import React, { useState, useEffect } from 'react';
import { PageRoute, User, ProviderApplication } from '../types';
import { providerService } from '../services/providerService';

interface AccountPageProps {
  user: User | null;
  setCurrentRoute: (route: PageRoute) => void;
  onUpdateUser: (updatedUser: User) => void;
  onLogout: () => void;
  bookingsCount?: number;
}

const AVATAR_PRESETS = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAZeCZZrDuM6Q8dGXTQoyXl6ezp52QPZDj0huU7FSxcccZCVAdCuAuRxjZODTZA64KdSccoTP_s1FXSiwijuKrF_gdeztARd1gY_N5PDE0C43N33HNeb-lgirya2mKSI41r9Pt1_HDcCnAU4s2l4AmoBESoeW2bs2b589_KUcQphQzPI0bRSBHohTtBJmvj3e0DWnyv7meijP8eqLtokF5ElUqmWDlYlSaPDiuVXNJB_uEH6TSN2_U',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
];

export const AccountPage: React.FC<AccountPageProps> = ({
  user,
  setCurrentRoute,
  onUpdateUser,
  onLogout,
  bookingsCount = 0,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [companyName, setCompanyName] = useState(user?.companyName || '');
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [application, setApplication] = useState<ProviderApplication | null>(user?.providerApplication || null);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setAvatar(user.avatar || '');
      setCompanyName(user.companyName || '');

      if (user.role === 'consumer') {
        providerService
          .getMyApplication(user.id)
          .then((app) => setApplication(app))
          .catch((err) => console.error('Failed to load application status in account page:', err));
      }
    }
  }, [user]);

  if (!user) {
    return (
      <main className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-surface-container rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary">
          <span className="material-symbols-outlined text-3xl">account_circle</span>
        </div>
        <h2 className="text-xl font-bold text-primary mb-2">Sign in to access your profile</h2>
        <p className="text-xs text-secondary mb-6">Manage your reservations, contact details, and account preferences.</p>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => setCurrentRoute('login')}
            className="px-5 py-2.5 bg-primary text-on-primary rounded-xl text-xs font-bold shadow-sm hover:opacity-95 transition-opacity"
          >
            Sign In
          </button>
          <button
            onClick={() => setCurrentRoute('signup')}
            className="px-5 py-2.5 bg-surface-container border border-outline-variant text-primary rounded-xl text-xs font-bold hover:bg-surface-container-high transition-colors"
          >
            Create Account
          </button>
        </div>
      </main>
    );
  }

  const isProvider = user.role === 'provider';
  const publicUserId = user.userId || `USR-${user.id.slice(0, 6).toUpperCase()}`;

  const handleToggleLive = async () => {
    const nextLive = !user.isLive;
    const updated = { ...user, isLive: nextLive };
    onUpdateUser(updated);
    if (isProvider) {
      await providerService.toggleAvailability(user.id, nextLive);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updated: User = {
        ...user,
        name: name.trim() || user.name,
        phone: phone.trim() || undefined,
        avatar: avatar.trim() || user.avatar,
        companyName: isProvider ? (companyName.trim() || undefined) : user.companyName,
      };
      if (isProvider) {
        await providerService.updateProviderDetails(user.id, {
          businessName: companyName.trim() || undefined,
          businessPhone: phone.trim() || undefined,
        });
      }
      await onUpdateUser(updated);
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setName(user.name || '');
    setPhone(user.phone || '');
    setAvatar(user.avatar || '');
    setCompanyName(user.companyName || '');
    setIsEditing(false);
  };

  return (
    <main className="max-w-2xl mx-auto px-4 md:px-0 py-6 md:py-10 pb-28">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-2xl font-bold text-primary">
            Profile & Account
          </h1>
          <p className="text-xs text-secondary mt-0.5">
            {isProvider
              ? 'Business profile, marketplace status, and operational controls.'
              : 'Personal settings, contact details, and event reservation history.'}
          </p>
        </div>
      </div>

      {/* Provider View */}
      {isProvider ? (
        <>
          {/* Business Details Container: Row(icon, Column(Name, Row(Dot[red/green], ID))), connected Row(text, switch) */}
          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant shadow-sm mb-6 space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 bg-surface-container rounded-2xl overflow-hidden border border-outline-variant flex-shrink-0">
                <img
                  alt={user.companyName}
                  className="w-full h-full object-cover"
                  src={user.avatar}
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h2 className="font-title-md text-lg font-bold text-primary leading-tight">
                    {user.providerDetails?.businessName || user.companyName || user.name}
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
                    {user.isLive ? 'Active' : 'Offline / Out of service'}
                  </span>
                </div>

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

          {/* Provider Profile & Contact Details Section */}
          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant shadow-sm mb-6 space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant pb-3">
              <h3 className="font-label-bold text-xs font-bold text-primary uppercase tracking-wider">
                Provider Profile & Contact Details
              </h3>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-3 py-1.5 flex items-center gap-1.5 text-xs text-secondary hover:text-primary transition-colors bg-surface border border-outline-variant rounded-xl font-medium"
                title="Edit Contact Profile"
              >
                <span className="material-symbols-outlined text-[15px]">edit</span>
                <span>{isEditing ? 'Close' : 'Edit Details'}</span>
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
                <span className="text-[10px] text-secondary uppercase font-bold block">Operating Identity</span>
                <p className="font-semibold text-primary mt-0.5">
                  {user.providerDetails?.businessName || user.companyName ? (
                    user.providerDetails?.businessName || user.companyName
                  ) : (
                    <span>
                      {user.name} <span className="text-secondary font-normal">(Personal profile name)</span>
                    </span>
                  )}
                </p>
              </div>

              <div>
                <span className="text-[10px] text-secondary uppercase font-bold block">Dispatch Phone</span>
                <p className="font-semibold text-primary mt-0.5">
                  {user.providerDetails?.businessPhone || user.phone || 'Not provided'}
                </p>
              </div>

              <div>
                <span className="text-[10px] text-secondary uppercase font-bold block">Contact Email</span>
                <p className="font-semibold text-primary mt-0.5">
                  {user.providerDetails?.businessEmail || user.email}
                </p>
              </div>

              <div className="sm:col-span-2">
                <span className="text-[10px] text-secondary uppercase font-bold block">KYC Status</span>
                <span className="inline-flex items-center gap-1.5 mt-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>{user.providerDetails?.kycStatus || 'verified'}</span>
                </span>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Consumer View */
        <>
          {/* Section 1: Profile Header with Avatar, Name, Email & Full-Width Edit on Mobile */}
          <div className="bg-surface-container-lowest p-5 sm:p-6 rounded-2xl border border-outline-variant shadow-sm mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 sm:gap-4 w-full sm:w-auto">
                <div className="relative flex-shrink-0">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-outline-variant bg-surface-container shadow-sm">
                    <img
                      alt={user.name}
                      className="w-full h-full object-cover"
                      src={user.avatar}
                    />
                  </div>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary text-on-primary rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                    title="Change Photo"
                  >
                    <span className="material-symbols-outlined text-[13px]">photo_camera</span>
                  </button>
                </div>

                <div className="min-w-0 flex-1">
                  <h2 className="font-title-md text-lg sm:text-xl font-bold text-primary leading-tight truncate">
                    {user.name}
                  </h2>
                  <p className="font-mono text-[11px] text-secondary mt-1">
                    ID: <span className="font-semibold text-primary">{publicUserId}</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsEditing(!isEditing)}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 sm:py-2 text-xs font-bold text-primary bg-surface hover:bg-surface-container border border-outline-variant rounded-xl transition-all shadow-sm active:scale-98"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {isEditing ? 'close' : 'edit'}
                </span>
                <span>{isEditing ? 'Close Editing' : 'Edit Profile'}</span>
              </button>
            </div>
          </div>

          {/* Section 2: Summary Stats / Metrics (2 items in row 1, 3rd full width on small screens) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
            {/* Item 1: Total Bookings */}
            <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant shadow-sm">
              <div className="flex items-center gap-2 text-secondary mb-1">
                <span className="material-symbols-outlined text-[18px] text-primary">calendar_month</span>
                <span className="text-[11px] font-medium uppercase tracking-wider">Total Bookings</span>
              </div>
              <p className="text-2xl font-bold text-primary mt-1">{bookingsCount}</p>
              <p className="text-[10px] text-secondary mt-0.5">All-time reservations</p>
            </div>

            {/* Item 2: Status */}
            <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant shadow-sm">
              <div className="flex items-center gap-2 text-secondary mb-1">
                <span className="material-symbols-outlined text-[18px] text-emerald-500">verified</span>
                <span className="text-[11px] font-medium uppercase tracking-wider">Status</span>
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <p className="text-base sm:text-lg font-bold text-primary">Active</p>
              </div>
              <p className="text-[10px] text-secondary mt-0.5">Verified profile</p>
            </div>

            {/* Item 3: Plan / Membership - full width on mobile (col-span-2), 1 column on sm+ */}
            <div className="col-span-2 sm:col-span-1 bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant shadow-sm flex sm:flex-col justify-between sm:justify-start items-center sm:items-start">
              <div>
                <div className="flex items-center gap-2 text-secondary mb-1">
                  <span className="material-symbols-outlined text-[18px] text-primary">badge</span>
                  <span className="text-[11px] font-medium uppercase tracking-wider">Membership</span>
                </div>
                <p className="text-base sm:text-lg font-bold text-primary sm:mt-1">Standard</p>
              </div>
              <p className="text-[10px] text-secondary sm:mt-0.5">Verified Member</p>
            </div>
          </div>

          {/* Section 3: Contact Details Section with Evinzoo ID AT THE TOP */}
          <div className="bg-surface-container-lowest p-5 sm:p-6 rounded-2xl border border-outline-variant shadow-sm mb-6 space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-primary">contact_mail</span>
                <h3 className="font-label-bold text-xs font-bold text-primary uppercase tracking-wider">
                  Contact Information
                </h3>
              </div>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[14px]">edit</span>
                  <span>Update</span>
                </button>
              )}
            </div>

            {/* Evinzoo ID Section - Prominently at the TOP */}
            <div className="bg-surface p-3.5 sm:p-4 rounded-xl border border-outline-variant/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                  <span className="material-symbols-outlined text-[20px]">badge</span>
                </div>
                <div>
                  <span className="text-[10px] text-secondary uppercase font-bold tracking-wider block">
                    Evinzoo ID
                  </span>
                  <p className="font-mono font-bold text-sm sm:text-base text-primary tracking-wide">
                    {publicUserId}
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs">
              <div className="bg-surface p-3.5 rounded-xl border border-outline-variant/60">
                <span className="text-[10px] text-secondary uppercase font-bold block">Full Name</span>
                <p className="font-semibold text-primary mt-0.5 text-sm">{user.name}</p>
              </div>

              <div className="bg-surface p-3.5 rounded-xl border border-outline-variant/60">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-secondary uppercase font-bold block">Email Address</span>
                  <span className="text-[9px] font-bold text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                    Verified
                  </span>
                </div>
                <p className="font-semibold text-primary mt-0.5 text-sm truncate">{user.email}</p>
              </div>

              <div className="bg-surface p-3.5 rounded-xl border border-outline-variant/60 sm:col-span-2">
                <span className="text-[10px] text-secondary uppercase font-bold block">Phone Number</span>
                <p className="font-semibold text-primary mt-0.5 text-sm">
                  {user.phone ? (
                    user.phone
                  ) : (
                    <span className="text-secondary font-normal italic">Not provided (Add phone number for SMS alerts)</span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: Application Status (when applied) OR Become a Partner Callout */}
          {application && (application.status === 'submitted' || application.status === 'reviewed') ? (
            <div className="p-4 sm:p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant shadow-sm mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center flex-shrink-0 border border-amber-500/20">
                  <span
                    className="material-symbols-outlined text-[20px]"
                    style={{ animation: 'pulse 3.5s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}
                  >
                    hourglass_top
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-xs font-bold text-primary">Provider Application</p>
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-amber-700 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-amber-500"
                        style={{ animation: 'pulse 2.5s ease-in-out infinite' }}
                      ></span>
                      <span>Under Review</span>
                    </span>
                  </div>
                  <p className="text-[11px] text-secondary truncate mt-0.5">
                    Submitted on {new Date(application.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • Verification in progress
                  </p>
                </div>
              </div>
              <button
                onClick={() => setCurrentRoute('join-provider-network')}
                className="w-full sm:w-auto px-4 py-2 bg-surface-container border border-outline-variant hover:border-primary text-primary rounded-xl text-xs font-bold hover:bg-surface-container-high transition-all active:scale-95 whitespace-nowrap flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>Track Status</span>
                <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
              </button>
            </div>
          ) : application && application.status === 'rejected' ? (
            <div className="p-4 rounded-2xl bg-surface-container-lowest border border-error/30 shadow-sm mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-error/10 text-error flex items-center justify-center flex-shrink-0 border border-error/20">
                  <span className="material-symbols-outlined text-[20px]">cancel</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-xs font-bold text-primary">Provider Application</p>
                    <span className="text-[10px] font-bold text-error bg-error/10 px-2 py-0.5 rounded-full border border-error/20">
                      Needs Attention
                    </span>
                  </div>
                  <p className="text-[11px] text-secondary truncate mt-0.5">
                    Application was not approved. Click to view notes and reapply.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setCurrentRoute('join-provider-network')}
                className="w-full sm:w-auto px-4 py-2 bg-surface-container border border-outline-variant hover:border-primary text-primary rounded-xl text-xs font-bold hover:bg-surface-container-high transition-all active:scale-95 whitespace-nowrap flex items-center justify-center gap-1.5"
              >
                <span>View Details</span>
                <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
              </button>
            </div>
          ) : (
            <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant shadow-sm mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-primary">
                  <span className="material-symbols-outlined text-[18px]">storefront</span>
                  <p className="text-xs font-bold">Do you offer event services?</p>
                </div>
                <p className="text-[11px] text-secondary max-w-md">
                  Join our network as an event service partner to list packages, receive bookings, and access provider dispatch tools.
                </p>
              </div>
              <button
                onClick={() => setCurrentRoute('join-provider-network')}
                className="w-full sm:w-auto px-4 py-2.5 bg-primary text-on-primary rounded-xl text-xs font-bold hover:bg-primary/90 transition-all active:scale-95 shadow-sm whitespace-nowrap flex-shrink-0"
              >
                Become a Partner
              </button>
            </div>
          )}
        </>
      )}

      {/* Specific & Detailed Profile Editing Form */}
      {isEditing && (
        <form
          onSubmit={handleSaveProfile}
          className="bg-surface-container-lowest p-6 rounded-2xl border-2 border-primary/20 shadow-md mb-6 space-y-5 animate-fade-in"
        >
          <div className="flex items-center justify-between border-b border-outline-variant pb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]">manage_accounts</span>
              <h3 className="text-xs font-bold text-primary uppercase tracking-wider">
                Edit Profile Information
              </h3>
            </div>
            <span className="text-[11px] text-secondary">All changes update instantly</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-[10px] font-bold text-secondary uppercase mb-1.5" htmlFor="edit-name">
                Full Name <span className="text-error">*</span>
              </label>
              <input
                id="edit-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="w-full px-3.5 py-2.5 text-xs bg-surface border border-outline-variant rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-primary"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-[10px] font-bold text-secondary uppercase mb-1.5" htmlFor="edit-phone">
                Phone Number
              </label>
              <input
                id="edit-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +1 (555) 019-2834"
                className="w-full px-3.5 py-2.5 text-xs bg-surface border border-outline-variant rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-primary"
              />
            </div>

            {/* Provider Company Name (if applicable) */}
            {isProvider && (
              <div className="sm:col-span-2">
                <label className="block text-[10px] font-bold text-secondary uppercase mb-1.5" htmlFor="edit-company">
                  Company / Brand Name
                </label>
                <input
                  id="edit-company"
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Your business brand name"
                  className="w-full px-3.5 py-2.5 text-xs bg-surface border border-outline-variant rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-primary"
                />
              </div>
            )}

            {/* Profile Avatar Selection & URL */}
            <div className="sm:col-span-2 space-y-2">
              <label className="block text-[10px] font-bold text-secondary uppercase mb-1.5" htmlFor="edit-avatar">
                Profile Avatar
              </label>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden border border-outline-variant flex-shrink-0 bg-surface">
                  <img
                    src={avatar || user.avatar}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = user.avatar;
                    }}
                  />
                </div>
                <input
                  id="edit-avatar"
                  type="url"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                  className="flex-1 px-3.5 py-2 text-xs bg-surface border border-outline-variant rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-primary"
                />
              </div>

              {/* Quick Preset Avatars */}
              <div className="pt-1">
                <span className="text-[10px] text-secondary font-medium block mb-1.5">Or choose a preset:</span>
                <div className="flex items-center gap-2">
                  {AVATAR_PRESETS.map((preset, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setAvatar(preset)}
                      className={`w-8 h-8 rounded-full overflow-hidden border-2 transition-all ${
                        avatar === preset ? 'border-primary scale-110 shadow-sm' : 'border-outline-variant opacity-75 hover:opacity-100'
                      }`}
                    >
                      <img src={preset} alt={`Preset ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-outline-variant">
            <button
              type="button"
              onClick={handleCancelEdit}
              className="px-4 py-2 text-xs font-bold text-secondary hover:text-primary rounded-xl border border-outline-variant hover:bg-surface transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 bg-primary text-on-primary rounded-xl text-xs font-bold hover:bg-primary/90 transition-all active:scale-95 shadow-sm disabled:opacity-50 flex items-center gap-1.5"
            >
              {isSaving ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Provider Operations Grid (if provider) */}
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

      {/* Support & Security Section: Simple terms as requested */}
      <div className="mb-8">
        <h3 className="font-label-bold text-xs font-bold text-secondary uppercase tracking-widest mb-3 px-1">
          Support & Security
        </h3>
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm divide-y divide-outline-variant text-xs font-medium">
          {/* Terms & Conditions */}
          <button
            onClick={() => setShowTermsModal(true)}
            className="flex items-center justify-between px-4 py-3.5 hover:bg-surface transition-colors w-full text-left"
          >
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-secondary text-base">description</span>
              <span className="text-primary font-medium">Terms & Conditions</span>
            </div>
            <span className="material-symbols-outlined text-secondary text-sm">chevron_right</span>
          </button>

          {/* Privacy Policy */}
          <button
            onClick={() => setShowPrivacyModal(true)}
            className="flex items-center justify-between px-4 py-3.5 hover:bg-surface transition-colors w-full text-left"
          >
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-secondary text-base">shield</span>
              <span className="text-primary font-medium">Privacy Policy</span>
            </div>
            <span className="material-symbols-outlined text-secondary text-sm">chevron_right</span>
          </button>

          {/* Log Out */}
          <button
            onClick={onLogout}
            className="flex items-center justify-between px-4 py-3.5 hover:bg-error-container/20 text-error transition-colors w-full text-left"
          >
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-base">logout</span>
              <span className="font-bold">Log Out</span>
            </div>
            <span className="material-symbols-outlined text-sm">chevron_right</span>
          </button>
        </div>
      </div>

      {/* Terms & Conditions Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-outline-variant pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">description</span>
                <h3 className="text-base font-bold text-primary">Terms & Conditions</h3>
              </div>
              <button
                onClick={() => setShowTermsModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-secondary hover:text-primary hover:bg-surface"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <div className="overflow-y-auto pr-1 text-xs text-secondary space-y-3 leading-relaxed">
              <p className="font-semibold text-primary">Last Updated: October 2024</p>
              <p>
                Welcome to Evinzoo. By accessing or using our marketplace platform and reservation services, you agree to be bound by these Terms & Conditions.
              </p>
              <h4 className="font-bold text-primary">1. Service Reservations</h4>
              <p>
                Evinzoo facilitates connections between event clients, organizers, and certified service providers. All reservations are subject to provider confirmation and schedule availability.
              </p>
              <h4 className="font-bold text-primary">2. Cancellation & Refunds</h4>
              <p>
                Reservations may be cancelled according to the provider policy specified at the time of booking. Confirmed bookings cancelled within 48 hours of dispatch may incur a cancellation fee.
              </p>
              <h4 className="font-bold text-primary">3. User Conduct & Security</h4>
              <p>
                Users must provide accurate contact information and maintain the confidentiality of their credentials. Commercial activities must comply with applicable local laws and logistics standards.
              </p>
            </div>
            <div className="pt-3 border-t border-outline-variant flex justify-end">
              <button
                onClick={() => setShowTermsModal(false)}
                className="px-5 py-2 bg-primary text-on-primary rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Policy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-outline-variant pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">shield</span>
                <h3 className="text-base font-bold text-primary">Privacy Policy</h3>
              </div>
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-secondary hover:text-primary hover:bg-surface"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <div className="overflow-y-auto pr-1 text-xs text-secondary space-y-3 leading-relaxed">
              <p className="font-semibold text-primary">Last Updated: October 2024</p>
              <p>
                At Evinzoo, your privacy and data security are our top priorities. This Privacy Policy describes how we collect, protect, and use your information.
              </p>
              <h4 className="font-bold text-primary">1. Data We Collect</h4>
              <p>
                We collect your name, email address, phone number, and reservation preferences when you register and book services on Evinzoo.
              </p>
              <h4 className="font-bold text-primary">2. How We Use Information</h4>
              <p>
                Your contact details are used exclusively to process your reservations, dispatch event services, send booking updates, and improve platform experience. We never sell your personal data to third parties.
              </p>
              <h4 className="font-bold text-primary">3. Storage & Encryption</h4>
              <p>
                All account data is secured using industry-standard Row Level Security (RLS) policies and encrypted authentication protocols.
              </p>
            </div>
            <div className="pt-3 border-t border-outline-variant flex justify-end">
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="px-5 py-2 bg-primary text-on-primary rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
