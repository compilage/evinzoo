import React from 'react';
import { StepComponentProps } from '../types';

export const OnboardingCheckoutStep: React.FC<StepComponentProps> = ({
  formData,
  errors,
  updateFormField,
  onNext,
  onBack,
  submitting,
}) => {
  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <span className="text-[10px] sm:text-xs font-bold text-secondary uppercase tracking-wider bg-surface-container px-3 py-1 rounded-full border border-outline-variant">
          Phase 3: Activation
        </span>
        <h2 className="text-xl sm:text-2xl font-bold text-primary mt-2 tracking-tight">
          Partner Activation & Offer
        </h2>
        <p className="text-xs sm:text-sm text-secondary mt-1 max-w-md mx-auto leading-relaxed">
          Review your onboarding fee and activate your provider network credentials.
        </p>
      </div>

      {/* Main Pricing & Checkout Card */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 sm:p-7 shadow-sm">
        {/* Error banner if submission failed */}
        {errors.general && (
          <div className="mb-5 p-3.5 bg-error/10 border border-error/20 rounded-xl text-error text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">error</span>
            <span>{errors.general}</span>
          </div>
        )}

        {/* Plan Summary Box */}
        <div className="bg-surface-container/60 border border-outline-variant/60 rounded-xl p-4 sm:p-5 mb-5">
          <div className="flex items-center justify-between pb-3.5 border-b border-outline-variant/40">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-primary">
                Provider Network Membership
              </h3>
              <p className="text-[11px] text-secondary">
                Standard onboarding, verification badge & catalog listing
              </p>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-500/15 px-2.5 py-1 rounded-full uppercase tracking-wider border border-emerald-500/20">
              Active Offer
            </span>
          </div>

          <div className="pt-3.5 space-y-2.5 text-xs sm:text-sm">
            <div className="flex justify-between text-secondary">
              <span>Standard Registration Fee</span>
              <span className="line-through">₹499 INR</span>
            </div>

            <div className="flex justify-between text-emerald-600 font-semibold">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">local_offer</span>
                <span>Launch Discount</span>
              </span>
              <span>-₹499 INR</span>
            </div>

            <div className="pt-2 border-t border-outline-variant/40 flex justify-between items-baseline">
              <div>
                <span className="font-bold text-primary text-sm sm:text-base">Due Today</span>
                <span className="block text-[10px] text-secondary">No hidden charges or card required</span>
              </div>
              <div className="text-right">
                <span className="text-xl sm:text-2xl font-black text-primary">₹0</span>
                <span className="text-xs text-secondary ml-1">INR</span>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Checklist */}
        <div className="mb-6 space-y-2">
          <div className="flex items-center gap-2 text-xs text-secondary">
            <span className="material-symbols-outlined text-base text-emerald-600">check_circle</span>
            <span>Unlimited event service catalog listings</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-secondary">
            <span className="material-symbols-outlined text-base text-emerald-600">check_circle</span>
            <span>Direct booking requests from event planners</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-secondary">
            <span className="material-symbols-outlined text-base text-emerald-600">check_circle</span>
            <span>Dedicated Provider Dashboard & availability schedule</span>
          </div>
        </div>

        {/* Terms Agreement Checkbox (Required) */}
        <div className="pt-4 border-t border-outline-variant/60">
          <label className="flex items-start gap-3 cursor-pointer select-none group">
            <input
              type="checkbox"
              checked={formData.agreedToTerms}
              onChange={(e) => updateFormField('agreedToTerms', e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary/20 cursor-pointer accent-primary"
            />
            <span className="text-xs text-secondary leading-relaxed">
              I agree to the <span className="text-primary font-semibold underline">Evinzoo Partner Terms of Service</span>, Service Quality Guarantee, and Code of Conduct. <span className="text-error font-bold">*</span>
            </span>
          </label>
          {errors.agreedToTerms && (
            <p className="text-[11px] text-error mt-1.5 flex items-center gap-1 pl-7">
              <span className="material-symbols-outlined text-xs">error</span>
              <span>{errors.agreedToTerms}</span>
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-7 pt-5 border-t border-outline-variant/60 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBack}
            disabled={submitting}
            className="px-5 py-2.5 bg-surface-container border border-outline-variant text-primary rounded-xl text-xs sm:text-sm font-bold hover:bg-surface-container-high transition-all active:scale-98 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            <span>Back</span>
          </button>

          <button
            type="button"
            onClick={onNext}
            disabled={submitting || !formData.agreedToTerms}
            className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all active:scale-98 shadow-sm ${
              formData.agreedToTerms && !submitting
                ? 'bg-primary text-on-primary hover:bg-primary-container cursor-pointer'
                : 'bg-surface-container text-secondary/50 cursor-not-allowed border border-outline-variant/50'
            }`}
          >
            {submitting ? (
              <>
                <span className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
                <span>Submitting Application...</span>
              </>
            ) : (
              <>
                <span>Submit Application</span>
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
