import React from 'react';
import { OnboardingSubRoute, AnimationDirection } from '../types';
import { OnboardingStepper } from './OnboardingStepper';

interface OnboardingLayoutProps {
  currentSubRoute: OnboardingSubRoute;
  direction: AnimationDirection;
  children: React.ReactNode;
}

export const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({
  currentSubRoute,
  direction,
  children,
}) => {
  const showStepper = currentSubRoute !== 'status';
  const animationClass = direction === 'forward' ? 'step-slide-right' : 'step-slide-left';

  return (
    <main className="min-h-[calc(100vh-160px)] px-4 sm:px-6 py-8 sm:py-12 flex flex-col justify-start">
      {/* Top Stepper for Screens 1, 2, 3 */}
      {showStepper && <OnboardingStepper currentStep={currentSubRoute} />}

      {/* Animated Screen Content Container */}
      <div key={currentSubRoute} className={`w-full ${animationClass}`}>
        {children}
      </div>

      {/* Bottom Trust & Security Indicator */}
      <footer className="w-full max-w-xl mx-auto mt-8 sm:mt-12 text-center">
        <div className="inline-flex items-center gap-4 text-[11px] text-secondary/80 font-medium">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-sm text-emerald-600">verified_user</span>
            <span>Verified Network</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-sm text-primary">lock</span>
            <span>Secure Verification</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-sm text-amber-600">support_agent</span>
            <span>24/7 Partner Support</span>
          </span>
        </div>
      </footer>
    </main>
  );
};
