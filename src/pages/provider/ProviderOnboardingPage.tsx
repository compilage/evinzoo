import React from 'react';
import { PageRoute, Service, User } from '../../types';
import { parseOnboardingSubRoute } from '../../app/routes';
import {
  OnboardingSubRoute,
  AnimationDirection,
  useProviderOnboarding,
  OnboardingLayout,
  UserDetailsStep,
  BusinessDetailsStep,
  OnboardingCheckoutStep,
  OnboardingStatusTracker,
} from '../../features/provider/onboarding';

interface ProviderOnboardingPageProps {
  user: User | null;
  currentRoute?: PageRoute;
  setCurrentRoute: (route: PageRoute) => void;
  onApplicationApproved: (updatedUser: User, initialService?: Service) => void;
}

export const ProviderOnboardingPage: React.FC<ProviderOnboardingPageProps> = ({
  user,
  currentRoute = 'provider-onboarding/user-details',
  setCurrentRoute,
  onApplicationApproved,
}) => {
  const activeSubRoute: OnboardingSubRoute = parseOnboardingSubRoute(currentRoute);

  const handleNavigateSubRoute = (sub: OnboardingSubRoute, _dir: AnimationDirection) => {
    setCurrentRoute(`provider-onboarding/${sub}` as PageRoute);
  };

  const {
    formData,
    errors,
    direction,
    application,
    isLoadingApp,
    submitting,
    isApprovingSimulation,
    updateFormField,
    handleNextFromUserDetails,
    handleNextFromBusinessDetails,
    handleBackToUserDetails,
    handleBackToBusinessDetails,
    handleSubmitCheckout,
    handleSimulateApproval,
  } = useProviderOnboarding({
    user,
    activeSubRoute,
    onNavigateSubRoute: handleNavigateSubRoute,
    onApplicationApproved,
  });

  // -------------------------------------------------------------
  // Case 1: Unauthenticated
  // -------------------------------------------------------------
  if (!user) {
    return (
      <main className="max-w-xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center animate-fade-in">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4 border border-primary/20">
          <span className="material-symbols-outlined text-2xl sm:text-3xl">storefront</span>
        </div>
        <span className="text-[10px] sm:text-xs font-bold text-secondary uppercase tracking-widest bg-surface-container px-3 py-1 rounded-full border border-outline-variant">
          Provider Onboarding
        </span>
        <h1 className="font-headline-lg text-2xl sm:text-3xl font-bold text-primary mt-3 mb-2 tracking-tight">
          Evinzoo Provider Network
        </h1>
        <p className="text-xs sm:text-sm text-secondary mb-8 max-w-sm mx-auto leading-relaxed">
          Sign in or create an account to start your partner application, list your services, and receive bookings.
        </p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 max-w-sm mx-auto">
          <button
            onClick={() => setCurrentRoute('login')}
            className="w-full sm:w-auto px-6 py-3 bg-primary text-on-primary rounded-xl text-xs sm:text-sm font-bold hover:bg-primary-container transition-all active:scale-98 shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Sign In to Account</span>
            <span className="material-symbols-outlined text-base">login</span>
          </button>
          <button
            onClick={() => setCurrentRoute('signup')}
            className="w-full sm:w-auto px-6 py-3 bg-surface-container border border-outline-variant text-primary rounded-xl text-xs sm:text-sm font-bold hover:bg-surface-container-high transition-all active:scale-98 cursor-pointer"
          >
            Create an Account
          </button>
        </div>
      </main>
    );
  }

  // -------------------------------------------------------------
  // Case 2: Already an approved provider
  // -------------------------------------------------------------
  if (user.role === 'provider') {
    const providerDisplayName = user.providerDetails?.businessName || user.companyName || user.name;
    return (
      <main className="max-w-xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center animate-fade-in">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
          <span className="material-symbols-outlined text-2xl sm:text-3xl filled">verified</span>
        </div>
        <span className="text-[10px] sm:text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
          Verified Provider Account
        </span>
        <h1 className="font-headline-lg text-2xl sm:text-3xl font-bold text-primary mt-3 mb-2 tracking-tight">
          Welcome to the Partner Network!
        </h1>
        <p className="text-xs sm:text-sm text-secondary mb-6 max-w-md mx-auto leading-relaxed">
          Your provider profile <strong>{providerDisplayName}</strong> is active. You can now manage your catalog, review client bookings, and set your operational schedule.
        </p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 max-w-sm mx-auto">
          <button
            onClick={() => setCurrentRoute('dashboard')}
            className="w-full sm:w-auto px-6 py-3 bg-primary text-on-primary rounded-xl text-xs sm:text-sm font-bold hover:bg-primary-container transition-all active:scale-98 shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Open Provider Dashboard</span>
            <span className="material-symbols-outlined text-base">dashboard</span>
          </button>
          <button
            onClick={() => setCurrentRoute('services')}
            className="w-full sm:w-auto px-6 py-3 bg-surface-container border border-outline-variant text-primary rounded-xl text-xs sm:text-sm font-bold hover:bg-surface-container-high transition-all active:scale-98 cursor-pointer"
          >
            Manage Services
          </button>
        </div>
      </main>
    );
  }

  // -------------------------------------------------------------
  // Case 3: Loading initial state
  // -------------------------------------------------------------
  if (isLoadingApp) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="w-7 h-7 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // -------------------------------------------------------------
  // Case 4: Application Status Tracker (Active or Submitted)
  // -------------------------------------------------------------
  if (activeSubRoute === 'status' && application) {
    return (
      <OnboardingLayout currentSubRoute="status" direction={direction}>
        <OnboardingStatusTracker
          user={user}
          application={application}
          isApprovingSimulation={isApprovingSimulation}
          onSimulateApproval={handleSimulateApproval}
          onNavigateToAccount={() => setCurrentRoute('account')}
          onApplicationApproved={onApplicationApproved}
        />
      </OnboardingLayout>
    );
  }

  // -------------------------------------------------------------
  // Case 5: 3-Screen Onboarding Flow (User Details -> Business Details -> Checkout)
  // -------------------------------------------------------------
  return (
    <OnboardingLayout currentSubRoute={activeSubRoute} direction={direction}>
      {activeSubRoute === 'user-details' && (
        <UserDetailsStep
          user={user}
          formData={formData}
          errors={errors}
          updateFormField={updateFormField}
          onNext={handleNextFromUserDetails}
          onBack={() => setCurrentRoute('account')}
        />
      )}

      {activeSubRoute === 'business-details' && (
        <BusinessDetailsStep
          user={user}
          formData={formData}
          errors={errors}
          updateFormField={updateFormField}
          onNext={handleNextFromBusinessDetails}
          onBack={handleBackToUserDetails}
        />
      )}

      {activeSubRoute === 'onboarding-checkout' && (
        <OnboardingCheckoutStep
          user={user}
          formData={formData}
          errors={errors}
          updateFormField={updateFormField}
          onNext={handleSubmitCheckout}
          onBack={handleBackToBusinessDetails}
          submitting={submitting}
        />
      )}
    </OnboardingLayout>
  );
};
