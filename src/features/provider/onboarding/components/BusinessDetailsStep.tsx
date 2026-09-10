import React from 'react';
import { StepComponentProps } from '../types';

export const BusinessDetailsStep: React.FC<StepComponentProps> = ({
  user,
  formData,
  errors,
  updateFormField,
  onNext,
  onBack,
}) => {
  const handleUseProfilePhone = () => {
    if (formData.profilePhone) {
      updateFormField('dispatchPhone', formData.profilePhone);
    }
  };

  const isUsingProfilePhone =
    Boolean(formData.profilePhone) &&
    formData.dispatchPhone.trim() === formData.profilePhone.trim();

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <span className="text-[10px] sm:text-xs font-bold text-secondary uppercase tracking-wider bg-surface-container px-3 py-1 rounded-full border border-outline-variant">
          Phase 2: Business Profile
        </span>
        <h2 className="text-xl sm:text-2xl font-bold text-primary mt-2 tracking-tight">
          Business & Operations Details
        </h2>
        <p className="text-xs sm:text-sm text-secondary mt-1 max-w-md mx-auto leading-relaxed">
          Tell clients about your services. You can operate under your registered personal profile name or a dedicated business brand.
        </p>
      </div>

      {/* Main Form Card */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 sm:p-7 shadow-sm">
        <div className="space-y-5">
          {/* Business Name (Optional) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-primary uppercase tracking-wide">
                Business / Brand Name
              </label>
              <span className="text-[11px] text-secondary font-medium">Optional</span>
            </div>
            <input
              type="text"
              value={formData.businessName}
              onChange={(e) => updateFormField('businessName', e.target.value)}
              placeholder={`e.g. ${user.name}'s Event Management`}
              className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl text-xs sm:text-sm text-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
            <p className="text-[11px] text-secondary mt-1">
              Leave blank to offer services under your verified profile name (<strong>{user.name}</strong>).
            </p>
          </div>

          {/* Contact / Dispatch Phone */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-primary uppercase tracking-wide flex items-center gap-1">
                <span>Customer Contact Phone</span>
                <span className="text-error font-bold">*</span>
              </label>
              {formData.profilePhone && (
                <button
                  type="button"
                  onClick={handleUseProfilePhone}
                  className={`text-[11px] font-bold transition-colors flex items-center gap-1 ${
                    isUsingProfilePhone
                      ? 'text-emerald-600 cursor-default'
                      : 'text-primary hover:text-primary-container underline cursor-pointer'
                  }`}
                >
                  <span className="material-symbols-outlined text-xs">
                    {isUsingProfilePhone ? 'check' : 'content_copy'}
                  </span>
                  <span>{isUsingProfilePhone ? 'Using Profile Phone' : 'Use Profile Phone'}</span>
                </button>
              )}
            </div>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-secondary flex items-center gap-1 border-r border-outline-variant pr-2 pointer-events-none">
                <span>+91</span>
              </div>
              <input
                type="tel"
                value={formData.dispatchPhone}
                onChange={(e) => updateFormField('dispatchPhone', e.target.value)}
                placeholder="e.g. 9876543210"
                maxLength={14}
                className={`w-full pl-16 pr-4 py-3 bg-surface-container-lowest border rounded-xl text-xs sm:text-sm text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                  errors.dispatchPhone
                    ? 'border-error focus:border-error focus:ring-error/20'
                    : 'border-outline-variant focus:border-primary'
                }`}
              />
            </div>
            {errors.dispatchPhone ? (
              <p className="text-[11px] text-error mt-1.5 flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">error</span>
                <span>{errors.dispatchPhone}</span>
              </p>
            ) : (
              <p className="text-[11px] text-secondary mt-1">
                Clients will call this number for bookings, inquiries, and coordination.
              </p>
            )}
          </div>

          {/* Business Email */}
          <div>
            <label className="block text-xs font-bold text-primary mb-1.5 uppercase tracking-wide">
              Customer Contact Email
            </label>
            <input
              type="email"
              value={formData.dispatchEmail}
              onChange={(e) => updateFormField('dispatchEmail', e.target.value)}
              placeholder="e.g. bookings@mybusiness.com"
              className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl text-xs sm:text-sm text-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
            <p className="text-[11px] text-secondary mt-1">
              Pre-filled with your account email. You can customize this to your business inbox.
            </p>
          </div>

          {/* Business Description */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-primary uppercase tracking-wide">
                Services & Overview
              </label>
              <span className="text-[11px] text-secondary font-medium">Optional</span>
            </div>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => updateFormField('description', e.target.value)}
              placeholder="Describe your event specialties, experience, or custom packages..."
              className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl text-xs sm:text-sm text-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
            />
            <p className="text-[11px] text-secondary mt-1">
              Help clients understand what makes your services stand out.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-7 pt-5 border-t border-outline-variant/60 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBack}
            className="px-5 py-2.5 bg-surface-container border border-outline-variant text-primary rounded-xl text-xs sm:text-sm font-bold hover:bg-surface-container-high transition-all active:scale-98 flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            <span>Back</span>
          </button>

          <button
            type="button"
            onClick={onNext}
            className="px-6 py-2.5 bg-primary text-on-primary rounded-xl text-xs sm:text-sm font-bold hover:bg-primary-container transition-all active:scale-98 flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <span>Continue to Activation</span>
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};
