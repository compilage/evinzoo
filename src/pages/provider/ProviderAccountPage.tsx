import React, { useState, useEffect } from 'react';
import { PageRoute, User } from '../../types';
import { providerService } from '../../services/providerService';

interface ProviderAccountPageProps {
  user: User;
  setCurrentRoute: (route: PageRoute) => void;
  onUpdateUser: (updatedUser: User) => void;
  onLogout: () => void;
}

export const ProviderAccountPage: React.FC<ProviderAccountPageProps> = ({
  user,
  setCurrentRoute,
  onUpdateUser,
  onLogout,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [businessName, setBusinessName] = useState(
    user.providerDetails?.businessName || user.companyName || ''
  );
  const [dispatchPhone, setDispatchPhone] = useState(
    user.providerDetails?.businessPhone || user.phone || ''
  );
  const [businessDescription, setBusinessDescription] = useState(
    user.providerDetails?.businessDescription || ''
  );
  const [avatar, setAvatar] = useState(user.avatar || '');
  const [isSaving, setIsSaving] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  useEffect(() => {
    setBusinessName(user.providerDetails?.businessName || user.companyName || '');
    setDispatchPhone(user.providerDetails?.businessPhone || user.phone || '');
    setBusinessDescription(user.providerDetails?.businessDescription || '');
    setAvatar(user.avatar || '');
  }, [user]);

  const providerId =
    user.providerId ||
    (user.userId
      ? user.userId.replace('USR-', 'PRV-')
      : `PRV-${user.id.slice(0, 6).toUpperCase()}`);

  const handleToggleLive = async () => {
    const nextLive = !user.isLive;
    const updated: User = { ...user, isLive: nextLive };
    onUpdateUser(updated);
    try {
      await providerService.toggleAvailability(user.id, nextLive);
    } catch (err) {
      console.error('Failed to toggle provider live state:', err);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updated: User = {
        ...user,
        companyName: businessName.trim() || user.companyName,
        phone: dispatchPhone.trim() || user.phone,
        avatar: avatar.trim() || user.avatar,
        providerDetails: user.providerDetails
          ? {
              ...user.providerDetails,
              businessName: businessName.trim() || undefined,
              businessPhone: dispatchPhone.trim() || undefined,
              businessDescription: businessDescription.trim() || undefined,
            }
          : undefined,
      };

      await providerService.updateProviderDetails(user.id, {
        businessName: businessName.trim() || undefined,
        businessPhone: dispatchPhone.trim() || undefined,
        businessDescription: businessDescription.trim() || undefined,
      });

      await onUpdateUser(updated);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update provider profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-6 md:py-10 pb-28 w-full">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold font-display-lg text-primary tracking-tight">
              Partner Hub & Account
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
              Provider
            </span>
          </div>
          <p className="text-xs text-secondary mt-0.5">
            Operational controls, live dispatch availability, and business profile.
          </p>
        </div>
      </div>

      {/* Card 1: Business Details & Live Availability Switch (Mobile-Friendly) */}
      <div className="bg-surface-container-lowest p-4 sm:p-6 rounded-2xl border border-outline-variant shadow-sm mb-5 space-y-4">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-surface-container rounded-2xl overflow-hidden border border-outline-variant flex-shrink-0">
            <img
              alt={businessName || user.name}
              className="w-full h-full object-cover"
              src={user.avatar}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-primary leading-tight truncate">
                {businessName || user.name}
              </h2>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  user.isLive
                    ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]'
                    : 'bg-red-500'
                }`}
              ></span>
              <p className="font-mono text-xs text-secondary font-medium">
                ID: <span className="font-bold text-primary">{providerId}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Live Status Row with Big Touch Switch */}
        <div className="border-t border-outline-variant pt-3.5 flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
              <span>Marketplace Availability:</span>
              <span className={user.isLive ? 'text-emerald-600' : 'text-red-500'}>
                {user.isLive ? 'Live & Accepting' : 'Offline / Paused'}
              </span>
            </div>
            <p className="text-[11px] text-secondary mt-0.5">
              {user.isLive
                ? 'Your services appear in customer search results and bookings are open.'
                : 'Your catalog is temporarily hidden from new client searches.'}
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 p-1">
            <input
              type="checkbox"
              checked={Boolean(user.isLive)}
              onChange={handleToggleLive}
              className="sr-only peer"
              aria-label="Toggle Live Availability"
            />
            <div className="w-12 h-7 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[6px] after:start-[6px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 shadow-inner"></div>
          </label>
        </div>
      </div>

      {/* Card 2: Quick Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
        <div className="bg-surface-container-lowest p-3.5 sm:p-4 rounded-2xl border border-outline-variant shadow-sm">
          <div className="flex items-center gap-1.5 text-secondary mb-1">
            <span className="material-symbols-outlined text-[17px] text-emerald-600">verified</span>
            <span className="text-[10px] font-bold uppercase tracking-wider">KYC Status</span>
          </div>
          <p className="text-sm sm:text-base font-bold text-emerald-700 mt-1 uppercase">
            {user.providerDetails?.kycStatus || 'Verified'}
          </p>
          <p className="text-[10px] text-secondary mt-0.5">Legally Compliant</p>
        </div>

        <div className="bg-surface-container-lowest p-3.5 sm:p-4 rounded-2xl border border-outline-variant shadow-sm">
          <div className="flex items-center gap-1.5 text-secondary mb-1">
            <span className="material-symbols-outlined text-[17px] text-primary">storefront</span>
            <span className="text-[10px] font-bold uppercase tracking-wider">Catalog</span>
          </div>
          <button
            onClick={() => setCurrentRoute('services')}
            className="text-left group block mt-1"
          >
            <p className="text-sm sm:text-base font-bold text-primary group-hover:underline">
              Manage Items
            </p>
            <p className="text-[10px] text-secondary mt-0.5">Tap to configure</p>
          </button>
        </div>

        <div className="col-span-2 sm:col-span-1 bg-surface-container-lowest p-3.5 sm:p-4 rounded-2xl border border-outline-variant shadow-sm flex sm:flex-col justify-between sm:justify-start items-center sm:items-start">
          <div>
            <div className="flex items-center gap-1.5 text-secondary mb-1">
              <span className="material-symbols-outlined text-[17px] text-primary">payments</span>
              <span className="text-[10px] font-bold uppercase tracking-wider">Payouts</span>
            </div>
            <p className="text-sm sm:text-base font-bold text-primary sm:mt-1">Automated</p>
          </div>
          <p className="text-[10px] text-secondary sm:mt-0.5">24h Post-Event</p>
        </div>
      </div>

      {/* Card 3: Business Contact & Dispatch Profile */}
      <div className="bg-surface-container-lowest p-4 sm:p-6 rounded-2xl border border-outline-variant shadow-sm mb-5 space-y-4">
        <div className="flex items-center justify-between border-b border-outline-variant pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-primary">badge</span>
            <h3 className="text-xs font-bold text-primary uppercase tracking-wider">
              Business & Dispatch Details
            </h3>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1 py-1"
          >
            <span className="material-symbols-outlined text-[14px]">edit</span>
            <span>{isEditing ? 'Close' : 'Edit Details'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs">
          <div className="bg-surface p-3.5 rounded-xl border border-outline-variant/60">
            <span className="text-[10px] text-secondary uppercase font-bold block">Business Name</span>
            <p className="font-semibold text-primary mt-0.5 text-sm">
              {businessName || user.name}
            </p>
          </div>

          <div className="bg-surface p-3.5 rounded-xl border border-outline-variant/60">
            <span className="text-[10px] text-secondary uppercase font-bold block">Dispatch Phone</span>
            <p className="font-semibold text-primary mt-0.5 text-sm">
              {dispatchPhone || <span className="text-secondary font-normal italic">Not provided</span>}
            </p>
          </div>

          <div className="bg-surface p-3.5 rounded-xl border border-outline-variant/60">
            <span className="text-[10px] text-secondary uppercase font-bold block">Business Email</span>
            <p className="font-semibold text-primary mt-0.5 text-sm truncate">
              {user.providerDetails?.businessEmail || user.email}
            </p>
          </div>

          <div className="bg-surface p-3.5 rounded-xl border border-outline-variant/60">
            <span className="text-[10px] text-secondary uppercase font-bold block">Lead Representative</span>
            <p className="font-semibold text-primary mt-0.5 text-sm">{user.name}</p>
          </div>

          {businessDescription && (
            <div className="bg-surface p-3.5 rounded-xl border border-outline-variant/60 sm:col-span-2">
              <span className="text-[10px] text-secondary uppercase font-bold block">Business Description</span>
              <p className="text-primary mt-1 text-xs leading-relaxed">{businessDescription}</p>
            </div>
          )}
        </div>
      </div>

      {/* Editing Form */}
      {isEditing && (
        <form
          onSubmit={handleSaveProfile}
          className="bg-surface-container-lowest p-5 sm:p-6 rounded-2xl border-2 border-primary/20 shadow-lg mb-5 space-y-4 animate-fade-in"
        >
          <div className="flex items-center justify-between border-b border-outline-variant pb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]">business</span>
              <h3 className="text-xs font-bold text-primary uppercase tracking-wider">
                Edit Provider Profile
              </h3>
            </div>
            <span className="text-[10px] text-secondary">Updates immediately</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-[10px] font-bold text-secondary uppercase mb-1" htmlFor="p-name">
                Business / Brand Name <span className="text-error">*</span>
              </label>
              <input
                id="p-name"
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Royal Decorators & Events"
                className="w-full px-3.5 py-2.5 text-xs bg-surface border border-outline-variant rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-primary min-h-[42px]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-secondary uppercase mb-1" htmlFor="p-phone">
                Dispatch Contact Phone <span className="text-error">*</span>
              </label>
              <input
                id="p-phone"
                type="tel"
                required
                value={dispatchPhone}
                onChange={(e) => setDispatchPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-2.5 text-xs bg-surface border border-outline-variant rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-primary min-h-[42px]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold text-secondary uppercase mb-1" htmlFor="p-desc">
                Business Description
              </label>
              <textarea
                id="p-desc"
                rows={3}
                value={businessDescription}
                onChange={(e) => setBusinessDescription(e.target.value)}
                placeholder="Briefly describe your equipment, catering, venue or logistics services..."
                className="w-full px-3.5 py-2.5 text-xs bg-surface border border-outline-variant rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-primary resize-none"
              ></textarea>
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-outline-variant">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2.5 text-xs font-bold text-secondary hover:text-primary rounded-xl border border-outline-variant hover:bg-surface transition-colors min-h-[40px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 bg-primary text-on-primary rounded-xl text-xs font-bold hover:opacity-95 transition-all active:scale-95 shadow-sm disabled:opacity-50 flex items-center gap-1.5 min-h-[40px]"
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

      {/* Operations Quick Links */}
      <div className="mb-5">
        <h3 className="text-xs font-bold text-secondary uppercase tracking-widest mb-3 px-1">
          Operations & Shortcuts
        </h3>
        <div className="grid grid-cols-3 gap-2.5">
          <button
            onClick={() => setCurrentRoute('services')}
            className="flex flex-col items-center justify-center p-3 bg-surface-container-lowest border border-outline-variant rounded-2xl hover:bg-surface-container active:scale-95 transition-all text-center h-24 shadow-sm"
          >
            <span className="material-symbols-outlined text-primary mb-1 text-2xl">
              storefront
            </span>
            <span className="text-[11px] font-bold text-primary leading-tight">Catalog</span>
          </button>

          <button
            onClick={() => setCurrentRoute('bookings')}
            className="flex flex-col items-center justify-center p-3 bg-surface-container-lowest border border-outline-variant rounded-2xl hover:bg-surface-container active:scale-95 transition-all text-center h-24 shadow-sm"
          >
            <span className="material-symbols-outlined text-primary mb-1 text-2xl">
              calendar_month
            </span>
            <span className="text-[11px] font-bold text-primary leading-tight">Bookings</span>
          </button>

          <button
            onClick={() => setCurrentRoute('dashboard')}
            className="flex flex-col items-center justify-center p-3 bg-surface-container-lowest border border-outline-variant rounded-2xl hover:bg-surface-container active:scale-95 transition-all text-center h-24 shadow-sm"
          >
            <span className="material-symbols-outlined text-primary mb-1 text-2xl">
              monitoring
            </span>
            <span className="text-[11px] font-bold text-primary leading-tight">Analytics</span>
          </button>
        </div>
      </div>

      {/* Support & Log Out */}
      <div className="mb-6">
        <h3 className="text-xs font-bold text-secondary uppercase tracking-widest mb-3 px-1">
          Support & Security
        </h3>
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm divide-y divide-outline-variant text-xs font-medium">
          <button
            onClick={() => setShowTermsModal(true)}
            className="flex items-center justify-between px-4 py-3.5 hover:bg-surface transition-colors w-full text-left min-h-[48px]"
          >
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-secondary text-base">description</span>
              <span className="text-primary font-medium">Partner Terms of Service</span>
            </div>
            <span className="material-symbols-outlined text-secondary text-sm">chevron_right</span>
          </button>

          <button
            onClick={() => setShowPrivacyModal(true)}
            className="flex items-center justify-between px-4 py-3.5 hover:bg-surface transition-colors w-full text-left min-h-[48px]"
          >
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-secondary text-base">shield</span>
              <span className="text-primary font-medium">Privacy Policy</span>
            </div>
            <span className="material-symbols-outlined text-secondary text-sm">chevron_right</span>
          </button>

          <button
            onClick={onLogout}
            className="flex items-center justify-between px-4 py-3.5 hover:bg-error-container/20 text-error transition-colors w-full text-left min-h-[48px]"
          >
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-base">logout</span>
              <span className="font-bold">Log Out</span>
            </div>
            <span className="material-symbols-outlined text-sm">chevron_right</span>
          </button>
        </div>
      </div>

      {/* Terms Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface-container-lowest rounded-t-3xl sm:rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto border border-outline-variant p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-outline-variant pb-3 sticky top-0 bg-surface-container-lowest">
              <h3 className="text-base font-bold text-primary">Partner Terms of Service</h3>
              <button
                onClick={() => setShowTermsModal(false)}
                className="w-8 h-8 rounded-full hover:bg-surface flex items-center justify-center text-secondary"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <div className="text-xs text-secondary space-y-3 leading-relaxed">
              <p>
                As a registered Evinzoo Service Partner, you agree to fulfill confirmed bookings in good faith, adhere to scheduled dispatch times, and maintain service safety standards.
              </p>
              <p>
                <strong>Payouts:</strong> Client payments are held in escrow and disbursed into your linked settlement account within 24 hours following confirmed event completion.
              </p>
            </div>
            <button
              onClick={() => setShowTermsModal(false)}
              className="w-full py-2.5 bg-primary text-on-primary rounded-xl text-xs font-bold"
            >
              Understood
            </button>
          </div>
        </div>
      )}

      {/* Privacy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface-container-lowest rounded-t-3xl sm:rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto border border-outline-variant p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-outline-variant pb-3 sticky top-0 bg-surface-container-lowest">
              <h3 className="text-base font-bold text-primary">Partner Privacy Policy</h3>
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="w-8 h-8 rounded-full hover:bg-surface flex items-center justify-center text-secondary"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <div className="text-xs text-secondary space-y-3 leading-relaxed">
              <p>
                Provider business phone numbers and profiles are made visible to clients who book services from your catalog. Financial details are encrypted and never stored in plain text.
              </p>
            </div>
            <button
              onClick={() => setShowPrivacyModal(false)}
              className="w-full py-2.5 bg-primary text-on-primary rounded-xl text-xs font-bold"
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </main>
  );
};
