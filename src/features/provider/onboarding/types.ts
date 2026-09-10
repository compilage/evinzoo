import { ProviderApplication, User, Service } from '../../../types';

export type OnboardingSubRoute =
  | 'user-details'
  | 'business-details'
  | 'onboarding-checkout'
  | 'status';

export type AnimationDirection = 'forward' | 'backward';

export interface OnboardingFormData {
  profilePhone: string;
  businessName: string;
  dispatchPhone: string;
  dispatchEmail: string;
  description: string;
  agreedToTerms: boolean;
}

export interface OnboardingErrors {
  profilePhone?: string;
  businessName?: string;
  dispatchPhone?: string;
  dispatchEmail?: string;
  description?: string;
  agreedToTerms?: string;
  general?: string;
}

export interface StepComponentProps {
  user: User;
  formData: OnboardingFormData;
  errors: OnboardingErrors;
  updateFormField: <K extends keyof OnboardingFormData>(key: K, value: OnboardingFormData[K]) => void;
  onNext: () => void;
  onBack: () => void;
  submitting?: boolean;
}

export interface StatusTrackerProps {
  user: User;
  application: ProviderApplication;
  isApprovingSimulation: boolean;
  onSimulateApproval: () => void;
  onNavigateToAccount: () => void;
  onApplicationApproved: (updatedUser: User, initialService?: Service) => void;
}
