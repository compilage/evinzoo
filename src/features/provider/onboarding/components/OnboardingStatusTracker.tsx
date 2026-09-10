import React from 'react';
import { StatusTrackerProps } from '../types';

export const OnboardingStatusTracker: React.FC<StatusTrackerProps> = ({
  user,
  application,
  isApprovingSimulation,
  onSimulateApproval,
  onNavigateToAccount,
}) => {
  const isApproved = application.status === 'approved';
  const isRejected = application.status === 'rejected';
  const isPending = !isApproved && !isRejected;

  const getStageStatus = (stage: 1 | 2 | 3) => {
    if (stage === 1) return 'completed';
    if (stage === 2) {
      if (isApproved || isRejected) return 'completed';
      return 'active';
    }
    if (stage === 3) {
      if (isApproved) return 'approved';
      if (isRejected) return 'rejected';
      return 'upcoming';
    }
    return 'upcoming';
  };

  const stage1 = getStageStatus(1);
  const stage2 = getStageStatus(2);
  const stage3 = getStageStatus(3);

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto mb-3 border border-amber-500/20">
          <span className="material-symbols-outlined text-2xl sm:text-3xl">hourglass_top</span>
        </div>
        <span className="text-[10px] sm:text-xs font-bold text-secondary uppercase tracking-widest bg-surface-container px-3 py-1 rounded-full border border-outline-variant">
          Provider Onboarding
        </span>
        <h2 className="text-xl sm:text-2xl font-bold text-primary mt-2 tracking-tight">
          Evinzoo Provider Network
        </h2>
        <p className="text-xs sm:text-sm text-secondary mt-1 max-w-sm mx-auto leading-relaxed">
          Your onboarding application has been submitted and is currently in the review queue.
        </p>
      </div>

      {/* Main Status Card */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 sm:p-7 shadow-sm">
        {/* Status Badge */}
        <div className="flex items-center justify-between pb-4 border-b border-outline-variant/60 mb-6">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-3 w-3">
              {isPending ? (
                <>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500" />
                </>
              ) : isApproved ? (
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
              ) : (
                <span className="relative inline-flex rounded-full h-3 w-3 bg-error" />
              )}
            </span>
            <span className="text-xs sm:text-sm font-bold text-primary">
              {isApproved
                ? 'Application Approved'
                : isRejected
                ? 'Application Requires Revision'
                : 'Application Under Review'}
            </span>
          </div>

          <span className="text-[11px] text-secondary font-mono">
            ID: {application.id.slice(0, 8).toUpperCase()}
          </span>
        </div>

        {/* Timeline with Mathematically Centered Rail */}
        <div className="relative mb-8 pl-1">
          {/* Stage 1: Submitted */}
          <div className="relative flex items-start gap-4 pb-8">
            <div className="relative flex flex-col items-center flex-shrink-0 w-7">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold z-10 ${
                  stage1 === 'completed'
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'bg-surface-container text-secondary border border-outline-variant'
                }`}
              >
                <span className="material-symbols-outlined text-sm">check</span>
              </div>
              <div className="absolute top-7 bottom-0 left-1/2 -translate-x-1/2 w-0.5 bg-outline-variant/60" />
            </div>

            <div className="pt-0.5">
              <h4 className="text-xs sm:text-sm font-bold text-primary flex items-center gap-2">
                <span>Application Submitted</span>
                <span className="text-[10px] text-emerald-600 bg-emerald-500/10 px-2 py-0.2 rounded font-semibold">
                  Completed
                </span>
              </h4>
              <p className="text-[11px] text-secondary mt-0.5">
                Profile and operational details securely filed.
              </p>
            </div>
          </div>

          {/* Stage 2: KYC & Compliance Review */}
          <div className="relative flex items-start gap-4 pb-8">
            <div className="relative flex flex-col items-center flex-shrink-0 w-7">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold z-10 ${
                  stage2 === 'completed'
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : stage2 === 'active'
                    ? 'bg-amber-500 text-white ring-4 ring-amber-500/20 shadow-sm'
                    : 'bg-surface-container text-secondary border border-outline-variant'
                }`}
              >
                {stage2 === 'completed' ? (
                  <span className="material-symbols-outlined text-sm">check</span>
                ) : (
                  <span className="w-2 h-2 rounded-full bg-white animate-[pulse_2.5s_ease-in-out_infinite]" />
                )}
              </div>
              <div className="absolute top-7 bottom-0 left-1/2 -translate-x-1/2 w-0.5 bg-outline-variant/60" />
            </div>

            <div className="pt-0.5">
              <h4 className="text-xs sm:text-sm font-bold text-primary flex items-center gap-2">
                <span>KYC & Profile Verification</span>
                {stage2 === 'active' && (
                  <span className="text-[10px] text-amber-700 bg-amber-500/10 px-2 py-0.2 rounded font-semibold border border-amber-500/20">
                    In Queue
                  </span>
                )}
              </h4>
              <p className="text-[11px] text-secondary mt-0.5">
                Internal team is verifying phone contacts and initial details.
              </p>
              {stage2 === 'active' && (
                <p className="text-[11px] text-secondary/80 mt-1.5 font-medium flex items-center gap-1">
                  <span>🕒 Estimated review time: 24–72 hours</span>
                </p>
              )}
            </div>
          </div>

          {/* Stage 3: Activation */}
          <div className="relative flex items-start gap-4">
            <div className="relative flex flex-col items-center flex-shrink-0 w-7">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold z-10 ${
                  stage3 === 'approved'
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : stage3 === 'rejected'
                    ? 'bg-error text-white shadow-sm'
                    : 'bg-surface-container text-secondary border border-outline-variant'
                }`}
              >
                {stage3 === 'approved' ? (
                  <span className="material-symbols-outlined text-sm">verified</span>
                ) : stage3 === 'rejected' ? (
                  <span className="material-symbols-outlined text-sm">close</span>
                ) : (
                  <span className="material-symbols-outlined text-sm">lock</span>
                )}
              </div>
            </div>

            <div className="pt-0.5">
              <h4 className="text-xs sm:text-sm font-bold text-primary">
                {stage3 === 'approved'
                  ? 'Provider Network Activated'
                  : stage3 === 'rejected'
                  ? 'Application Review Decision'
                  : 'Provider Network Activation'}
              </h4>
              <p className="text-[11px] text-secondary mt-0.5">
                {stage3 === 'approved'
                  ? 'You are now an active provider on Evinzoo!'
                  : 'Unlock your public catalog, direct booking requests, and provider dashboard.'}
              </p>
            </div>
          </div>
        </div>

        {/* Application Summary Recap */}
        <div className="bg-surface-container/60 border border-outline-variant/60 rounded-xl p-4 mb-6 text-xs">
          <h5 className="font-bold text-primary mb-2 uppercase tracking-wide text-[10px]">
            Submission Summary
          </h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-secondary">
            <div>
              <span className="text-[11px] block">Operating Business:</span>
              <strong className="text-primary font-medium">
                {application.businessName || `${user.name} (Personal Profile)`}
              </strong>
            </div>
            <div>
              <span className="text-[11px] block">Contact Phone:</span>
              <strong className="text-primary font-medium">
                {application.businessPhone || user.phone || 'Not provided'}
              </strong>
            </div>
            <div>
              <span className="text-[11px] block">Submitted At:</span>
              <span className="text-primary">
                {new Date(application.submittedAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>
            <div>
              <span className="text-[11px] block">KYC Status:</span>
              <span className="capitalize text-primary font-semibold">
                {application.kycStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-outline-variant/60">
          <button
            type="button"
            onClick={onNavigateToAccount}
            className="w-full sm:w-auto px-5 py-2.5 bg-surface-container border border-outline-variant text-primary rounded-xl text-xs sm:text-sm font-bold hover:bg-surface-container-high transition-all active:scale-98 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">person</span>
            <span>Return to Profile</span>
          </button>

          {/* Dev Simulation Button */}
          {isPending && (
            <button
              type="button"
              onClick={onSimulateApproval}
              disabled={isApprovingSimulation}
              className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs sm:text-sm font-bold hover:bg-emerald-700 transition-all active:scale-98 flex items-center justify-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
            >
              {isApprovingSimulation ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Approving...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">verified</span>
                  <span>Simulate Employee Approval</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
