import React from 'react';
import { OnboardingSubRoute } from '../types';

interface OnboardingStepperProps {
  currentStep: OnboardingSubRoute;
}

const STEPS = [
  { id: 'user-details' as const, number: 1, label: 'Personal Details', shortLabel: 'Details', icon: 'person' },
  { id: 'business-details' as const, number: 2, label: 'Business Profile', shortLabel: 'Business', icon: 'storefront' },
  { id: 'onboarding-checkout' as const, number: 3, label: 'Activation', shortLabel: 'Activation', icon: 'verified' },
];

export const OnboardingStepper: React.FC<OnboardingStepperProps> = ({ currentStep }) => {
  const getStepStatus = (stepId: OnboardingSubRoute) => {
    const order: Record<OnboardingSubRoute, number> = {
      'user-details': 1,
      'business-details': 2,
      'onboarding-checkout': 3,
      status: 4,
    };

    const currentOrder = order[currentStep] || 1;
    const stepOrder = order[stepId] || 1;

    if (stepOrder < currentOrder) return 'completed';
    if (stepOrder === currentOrder) return 'active';
    return 'upcoming';
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 mb-6 sm:mb-8">
      <div className="flex items-center justify-between relative">
        {/* Continuous Background Track */}
        <div className="absolute top-1/2 left-6 right-6 -translate-y-1/2 h-0.5 bg-outline-variant/40 -z-0" />

        {STEPS.map((step) => {
          const status = getStepStatus(step.id);
          const isCompleted = status === 'completed';
          const isActive = status === 'active';

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center group">
              <div
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300 ${
                  isCompleted
                    ? 'bg-primary text-on-primary shadow-sm'
                    : isActive
                    ? 'bg-primary text-on-primary ring-4 ring-primary/15 shadow-sm scale-105'
                    : 'bg-surface-container border border-outline-variant text-secondary'
                }`}
              >
                {isCompleted ? (
                  <span className="material-symbols-outlined text-base sm:text-lg">check</span>
                ) : (
                  <span>{step.number}</span>
                )}
              </div>

              <span
                className={`mt-2 text-[10px] sm:text-xs font-semibold tracking-tight transition-colors duration-200 hidden xs:block ${
                  isActive ? 'text-primary font-bold' : isCompleted ? 'text-primary' : 'text-secondary'
                }`}
              >
                <span className="hidden sm:inline">{step.label}</span>
                <span className="inline sm:hidden">{step.shortLabel}</span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
