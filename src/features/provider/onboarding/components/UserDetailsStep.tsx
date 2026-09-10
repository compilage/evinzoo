import React from 'react';
import { StepComponentProps } from '../types';

export const UserDetailsStep: React.FC<StepComponentProps> = ({
  user,
  formData,
  errors,
  updateFormField,
  onNext,
}) => {
  const hasValidPhone = Boolean(formData.profilePhone.trim().replace(/\D/g, '').length >= 10);

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <span className="text-[10px] sm:text-xs font-bold text-secondary uppercase tracking-wider bg-surface-container px-3 py-1 rounded-full border border-outline-variant">
          Phase 1: Verification
        </span>
        <h2 className="text-xl sm:text-2xl font-bold text-primary mt-2 tracking-tight">
          Confirm Your Account Details
        </h2>
        <p className="text-xs sm:text-sm text-secondary mt-1 max-w-md mx-auto leading-relaxed">
          Please verify your personal contact information. These details secure your partner account and enable customer communication.
        </p>
      </div>

      {/* Main Form Card */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 sm:p-7 shadow-sm">
        <div className="space-y-5">
          {/* Full Name (Profile Identity) */}
          <div>
            <label className="block text-xs font-bold text-primary mb-1.5 uppercase tracking-wide">
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                disabled
                value={user.name}
                className="w-full px-4 py-3 bg-surface-container/50 border border-outline-variant/60 rounded-xl text-xs sm:text-sm text-primary font-medium cursor-not-allowed select-none"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                <span>Verified Profile</span>
              </span>
            </div>
            <p className="text-[11px] text-secondary mt-1">
              Your name as registered on your Evinzoo account.
            </p>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-bold text-primary mb-1.5 uppercase tracking-wide">
              Account Email
            </label>
            <div className="relative">
              <input
                type="email"
                disabled
                value={user.email}
                className="w-full px-4 py-3 bg-surface-container/50 border border-outline-variant/60 rounded-xl text-xs sm:text-sm text-primary font-medium cursor-not-allowed select-none"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">lock</span>
                <span>Account Primary</span>
              </span>
            </div>
            <p className="text-[11px] text-secondary mt-1">
              All official platform communications and booking alerts will be sent here.
            </p>
          </div>

          {/* Mobile Phone (Required) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-primary uppercase tracking-wide flex items-center gap-1">
                <span>Personal Mobile Phone</span>
                <span className="text-error font-bold">*</span>
              </label>
              {formData.profilePhone && (
                <span className="text-[11px] text-secondary">
                  {hasValidPhone ? '✓ Valid phone' : 'Enter 10 digits'}
                </span>
              )}
            </div>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-secondary flex items-center gap-1 border-r border-outline-variant pr-2 pointer-events-none">
                <span>+91</span>
              </div>
              <input
                type="tel"
                value={formData.profilePhone}
                onChange={(e) => updateFormField('profilePhone', e.target.value)}
                placeholder="e.g. 9876543210"
                maxLength={14}
                className={`w-full pl-16 pr-4 py-3 bg-surface-container-lowest border rounded-xl text-xs sm:text-sm text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                  errors.profilePhone
                    ? 'border-error focus:border-error focus:ring-error/20'
                    : 'border-outline-variant focus:border-primary'
                }`}
              />
            </div>
            {errors.profilePhone ? (
              <p className="text-[11px] text-error mt-1.5 flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">error</span>
                <span>{errors.profilePhone}</span>
              </p>
            ) : (
              <p className="text-[11px] text-secondary mt-1">
                Required for urgent booking dispatches and two-factor provider verification.
              </p>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-7 pt-5 border-t border-outline-variant/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-secondary flex items-center gap-1.5 order-2 sm:order-1">
            <span className="material-symbols-outlined text-sm text-emerald-600">security</span>
            <span>Secured with end-to-end encryption</span>
          </div>
          <button
            type="button"
            onClick={onNext}
            disabled={!hasValidPhone}
            className={`w-full sm:w-auto px-6 py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-98 order-1 sm:order-2 shadow-sm ${
              hasValidPhone
                ? 'bg-primary text-on-primary hover:bg-primary-container cursor-pointer'
                : 'bg-surface-container text-secondary/50 cursor-not-allowed border border-outline-variant/50'
            }`}
          >
            <span>Confirm & Continue</span>
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};
