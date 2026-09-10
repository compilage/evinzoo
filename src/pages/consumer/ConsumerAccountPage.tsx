import React, { useState, useEffect } from 'react';
import { PageRoute, User, ProviderApplication } from '../../types';
import { providerService } from '../../services/providerService';

interface ConsumerAccountPageProps {
  user: User;
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

export const ConsumerAccountPage: React.FC<ConsumerAccountPageProps> = ({
  user,
  setCurrentRoute,
  onUpdateUser,
  onLogout,
  bookingsCount = 0,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [avatar, setAvatar] = useState(user.avatar || '');
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [application, setApplication] = useState<ProviderApplication | null>(user.providerApplication || null);

  useEffect(() => {
    setName(user.name || '');
    setPhone(user.phone || '');
    setAvatar(user.avatar || '');

    // Check user's provider onboarding application
    providerService
      .getMyApplication(user.id)
      .then((app) => setApplication(app))
      .catch((err) => console.error('Failed to load application status:', err));
  }, [user]);

  const publicUserId = user.userId || `USR-${user.id.slice(0, 6).toUpperCase()}`;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updated: User = {
        ...user,
        name: name.trim() || user.name,
        phone: phone.trim() || undefined,
        avatar: avatar.trim() || user.avatar,
      };
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
    setIsEditing(false);
  };

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-6 md:py-10 pb-28 w-full">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-display-lg text-primary tracking-tight">
            Profile & Account
          </h1>
          <p className="text-xs text-secondary mt-0.5">
            Personal settings, reservations, and security preferences.
          </p>
        </div>
      </div>

      {/* Section 1: Consumer Profile Header */}
      <div className="bg-surface-container-lowest p-4 sm:p-6 rounded-2xl border border-outline-variant shadow-sm mb-5">
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
                className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary text-on-primary rounded-full flex items-center justify-center shadow-md active:scale-95 transition-transform"
                title="Change Photo"
                aria-label="Change Photo"
              >
                <span className="material-symbols-outlined text-[14px]">photo_camera</span>
              </button>
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="text-lg sm:text-xl font-bold text-primary leading-tight truncate">
                {user.name}
              </h2>
              <p className="font-mono text-xs text-secondary mt-1">
                ID: <span className="font-semibold text-primary">{publicUserId}</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 sm:py-2 text-xs font-bold text-primary bg-surface hover:bg-surface-container border border-outline-variant rounded-xl transition-all shadow-sm active:scale-98 min-h-[42px]"
          >
            <span className="material-symbols-outlined text-[16px]">
              {isEditing ? 'close' : 'edit'}
            </span>
            <span>{isEditing ? 'Close Editing' : 'Edit Profile'}</span>
          </button>
        </div>
      </div>

      {/* Section 2: Summary Stats / Metrics (Optimized for small mobile viewports) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
        {/* Item 1: Total Bookings */}
        <div className="bg-surface-container-lowest p-3.5 sm:p-4 rounded-2xl border border-outline-variant shadow-sm">
          <div className="flex items-center gap-1.5 text-secondary mb-1">
            <span className="material-symbols-outlined text-[17px] text-primary">calendar_month</span>
            <span className="text-[10px] font-bold uppercase tracking-wider">Bookings</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-primary mt-1">{bookingsCount}</p>
          <p className="text-[10px] text-secondary mt-0.5">Reservations</p>
        </div>

        {/* Item 2: Status */}
        <div className="bg-surface-container-lowest p-3.5 sm:p-4 rounded-2xl border border-outline-variant shadow-sm">
          <div className="flex items-center gap-1.5 text-secondary mb-1">
            <span className="material-symbols-outlined text-[17px] text-emerald-500">verified</span>
            <span className="text-[10px] font-bold uppercase tracking-wider">Status</span>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <p className="text-sm sm:text-base font-bold text-primary">Active</p>
          </div>
          <p className="text-[10px] text-secondary mt-0.5">Verified Profile</p>
        </div>

        {/* Item 3: Membership (full width on small screens, col 3 on sm+) */}
        <div className="col-span-2 sm:col-span-1 bg-surface-container-lowest p-3.5 sm:p-4 rounded-2xl border border-outline-variant shadow-sm flex sm:flex-col justify-between sm:justify-start items-center sm:items-start">
          <div>
            <div className="flex items-center gap-1.5 text-secondary mb-1">
              <span className="material-symbols-outlined text-[17px] text-primary">badge</span>
              <span className="text-[10px] font-bold uppercase tracking-wider">Plan</span>
            </div>
            <p className="text-sm sm:text-base font-bold text-primary sm:mt-1">Standard</p>
          </div>
          <p className="text-[10px] text-secondary sm:mt-0.5">Member Access</p>
        </div>
      </div>

      {/* Section 3: Contact Details Section with Evinzoo ID AT THE TOP */}
      <div className="bg-surface-container-lowest p-4 sm:p-6 rounded-2xl border border-outline-variant shadow-sm mb-5 space-y-4">
        <div className="flex items-center justify-between border-b border-outline-variant pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-primary">contact_mail</span>
            <h3 className="text-xs font-bold text-primary uppercase tracking-wider">
              Contact Information
            </h3>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1 py-1"
            >
              <span className="material-symbols-outlined text-[14px]">edit</span>
              <span>Update</span>
            </button>
          )}
        </div>

        {/* Evinzoo ID Section - Prominently displayed */}
        <div className="bg-surface p-3 sm:p-4 rounded-xl border border-outline-variant/80 flex items-center justify-between">
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
                <span className="text-secondary font-normal italic">
                  Not provided (Add phone number for dispatch & booking SMS alerts)
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Section 4: Application Status (when applied) OR Become a Partner Callout */}
      {application && (application.status === 'submitted' || application.status === 'reviewed') ? (
        <div className="p-4 sm:p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant shadow-sm mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center flex-shrink-0 border border-amber-500/20">
              <span className="material-symbols-outlined text-[20px] animate-pulse">hourglass_top</span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                <p className="text-xs sm:text-sm font-bold text-primary truncate">
                  Provider Application Under Review
                </p>
              </div>
              <p className="text-[11px] text-secondary mt-0.5 truncate">
                Our onboarding team is reviewing your verification (typically 24–72 hours).
              </p>
            </div>
          </div>
          <button
            onClick={() => setCurrentRoute('provider-onboarding/status')}
            className="w-full sm:w-auto px-4 py-2 bg-surface-container border border-outline-variant hover:border-primary text-primary rounded-xl text-xs font-bold hover:bg-surface-container-high transition-all active:scale-95 whitespace-nowrap flex items-center justify-center gap-1.5 min-h-[40px]"
          >
            <span>Track Status</span>
            <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
          </button>
        </div>
      ) : (
        <div className="p-4 sm:p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant shadow-sm mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-primary">
              <span className="material-symbols-outlined text-[18px]">storefront</span>
              <p className="text-xs sm:text-sm font-bold">Evinzoo Provider Network</p>
            </div>
            <p className="text-[11px] text-secondary max-w-md">
              Offer event services? Join the provider network to list packages, receive confirmed bookings, and access automated dispatch tools.
            </p>
          </div>
          <button
            onClick={() => setCurrentRoute('provider-onboarding/user-details')}
            className="w-full sm:w-auto px-5 py-2.5 bg-primary text-on-primary rounded-xl text-xs font-bold hover:opacity-95 transition-all active:scale-95 shadow-sm whitespace-nowrap flex-shrink-0 min-h-[42px]"
          >
            Apply to Become a Provider
          </button>
        </div>
      )}

      {/* Editing Form (Modal or Inline Drawer for Mobile) */}
      {isEditing && (
        <form
          onSubmit={handleSaveProfile}
          className="bg-surface-container-lowest p-5 sm:p-6 rounded-2xl border-2 border-primary/20 shadow-lg mb-5 space-y-4 animate-fade-in"
        >
          <div className="flex items-center justify-between border-b border-outline-variant pb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]">manage_accounts</span>
              <h3 className="text-xs font-bold text-primary uppercase tracking-wider">
                Edit Profile
              </h3>
            </div>
            <span className="text-[10px] text-secondary">Updates immediately</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-[10px] font-bold text-secondary uppercase mb-1" htmlFor="edit-name">
                Full Name <span className="text-error">*</span>
              </label>
              <input
                id="edit-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="w-full px-3.5 py-2.5 text-xs bg-surface border border-outline-variant rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-primary min-h-[42px]"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-[10px] font-bold text-secondary uppercase mb-1" htmlFor="edit-phone">
                Phone Number
              </label>
              <input
                id="edit-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-2.5 text-xs bg-surface border border-outline-variant rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-primary min-h-[42px]"
              />
            </div>

            {/* Profile Avatar Selection */}
            <div className="sm:col-span-2 space-y-2">
              <label className="block text-[10px] font-bold text-secondary uppercase mb-1" htmlFor="edit-avatar">
                Profile Photo
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
                  placeholder="https://example.com/photo.jpg"
                  className="flex-1 px-3.5 py-2 text-xs bg-surface border border-outline-variant rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-primary min-h-[42px]"
                />
              </div>

              {/* Quick Preset Avatars */}
              <div className="pt-1">
                <span className="text-[10px] text-secondary font-medium block mb-1.5">Or choose a preset:</span>
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                  {AVATAR_PRESETS.map((preset, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setAvatar(preset)}
                      className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-all flex-shrink-0 ${
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

      {/* Support, Legal & Logout */}
      <div className="mb-6">
        <h3 className="text-xs font-bold text-secondary uppercase tracking-widest mb-3 px-1">
          Support & Security
        </h3>
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm divide-y divide-outline-variant text-xs font-medium">
          {/* Terms & Conditions */}
          <button
            onClick={() => setShowTermsModal(true)}
            className="flex items-center justify-between px-4 py-3.5 hover:bg-surface transition-colors w-full text-left min-h-[48px]"
          >
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-secondary text-base">description</span>
              <span className="text-primary font-medium">Terms of Service</span>
            </div>
            <span className="material-symbols-outlined text-secondary text-sm">chevron_right</span>
          </button>

          {/* Privacy Policy */}
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

          {/* Log Out */}
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
              <h3 className="text-base font-bold text-primary">Terms of Service</h3>
              <button
                onClick={() => setShowTermsModal(false)}
                className="w-8 h-8 rounded-full hover:bg-surface flex items-center justify-center text-secondary"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <div className="text-xs text-secondary space-y-3 leading-relaxed">
              <p>
                Welcome to Evinzoo. By utilizing our platform to discover or reserve event equipment, venues, catering, and logistics services, you agree to comply with our community standard guidelines.
              </p>
              <p>
                <strong>Reservations & Escrow:</strong> All booking deposits and fee payments are securely held in escrow until mutual event fulfillment confirmation.
              </p>
              <p>
                <strong>Cancellations:</strong> Refunds and schedule adjustments adhere to individual service provider cancellation rules established at booking confirmation.
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
              <h3 className="text-base font-bold text-primary">Privacy Policy</h3>
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="w-8 h-8 rounded-full hover:bg-surface flex items-center justify-center text-secondary"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <div className="text-xs text-secondary space-y-3 leading-relaxed">
              <p>
                Your privacy is paramount. Evinzoo processes your personal details strictly to manage your event bookings and notify you of dispatch updates.
              </p>
              <p>
                Your phone number is only shared with confirmed service providers assigned to your approved reservations.
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
