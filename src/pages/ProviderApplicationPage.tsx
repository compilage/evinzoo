import React, { useState, useEffect } from 'react';
import { PageRoute, Service, User, ProviderApplication } from '../types';
import { providerService } from '../services/providerService';
import { authService } from '../services/authService';

interface ProviderApplicationPageProps {
  user: User | null;
  setCurrentRoute: (route: PageRoute) => void;
  onApplicationApproved: (updatedUser: User, initialService?: Service) => void;
}

export const ProviderApplicationPage: React.FC<ProviderApplicationPageProps> = ({
  user,
  setCurrentRoute,
  onApplicationApproved,
}) => {
  // Wizard Step State (1: Account Verification, 2: Business Details, 3: Activation & Offer)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Step 1: User Account Details
  const [profilePhone, setProfilePhone] = useState(user?.phone || '');
  const [step1Confirmed, setStep1Confirmed] = useState(false);
  const [step1Error, setStep1Error] = useState<string | null>(null);

  // Step 2: Business Details
  const [businessName, setBusinessName] = useState('');
  const [dispatchPhone, setDispatchPhone] = useState('');
  const [dispatchEmail, setDispatchEmail] = useState(user?.email || '');
  const [description, setDescription] = useState('');

  // Step 3: Activation & Offer (Payment Screen)
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Application tracking state
  const [application, setApplication] = useState<ProviderApplication | null>(null);
  const [isLoadingApp, setIsLoadingApp] = useState(true);
  const [isApprovingSimulation, setIsApprovingSimulation] = useState(false);

  useEffect(() => {
    if (!user) {
      setIsLoadingApp(false);
      return;
    }

    if (user.phone) {
      setProfilePhone(user.phone);
      if (!dispatchPhone) setDispatchPhone(user.phone);
    }
    if (user.email && !dispatchEmail) {
      setDispatchEmail(user.email);
    }

    // Fetch existing application if any
    providerService
      .getMyApplication(user.id)
      .then((existing) => {
        setApplication(existing);
      })
      .catch((err) => {
        console.error('Error fetching application status:', err);
      })
      .finally(() => {
        setIsLoadingApp(false);
      });
  }, [user]);

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
            className="w-full sm:w-auto px-6 py-3 bg-primary text-on-primary rounded-xl text-xs sm:text-sm font-bold hover:bg-primary-container transition-all active:scale-98 shadow-sm flex items-center justify-center gap-2"
          >
            <span>Sign In to Account</span>
            <span className="material-symbols-outlined text-base">login</span>
          </button>
          <button
            onClick={() => setCurrentRoute('signup')}
            className="w-full sm:w-auto px-6 py-3 bg-surface-container border border-outline-variant text-primary rounded-xl text-xs sm:text-sm font-bold hover:bg-surface-container-high transition-all active:scale-98"
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
          You are an Approved Partner
        </h1>
        <p className="text-xs sm:text-sm text-secondary mb-6 max-w-sm mx-auto leading-relaxed">
          Your provider account <strong className="text-primary">{providerDisplayName}</strong> is actively verified on the Evinzoo network.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-3 max-w-sm mx-auto">
          <button
            onClick={() => setCurrentRoute('dashboard')}
            className="w-full sm:w-auto px-6 py-3 bg-primary text-on-primary rounded-xl text-xs sm:text-sm font-bold hover:bg-primary/90 transition-all active:scale-98 shadow-sm flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-base">space_dashboard</span>
            <span>Provider Dashboard</span>
          </button>
          <button
            onClick={() => setCurrentRoute('services')}
            className="w-full sm:w-auto px-6 py-3 bg-surface-container border border-outline-variant text-primary rounded-xl text-xs sm:text-sm font-bold hover:bg-surface-container-high transition-colors active:scale-98"
          >
            Service Catalog
          </button>
        </div>
      </main>
    );
  }

  // -------------------------------------------------------------
  // Loading state
  // -------------------------------------------------------------
  if (isLoadingApp) {
    return (
      <main className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-3 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-xs text-secondary font-medium">Checking application status...</p>
      </main>
    );
  }

  // Simulation handler for testing
  const handleSimulateApproval = async () => {
    if (!application) return;
    setIsApprovingSimulation(true);
    try {
      await providerService.simulateAdminApproval(application.id);
      const updatedUser = await authService.getCurrentUser();
      if (updatedUser) {
        onApplicationApproved(updatedUser);
      }
    } catch (err: any) {
      console.error('Approval simulation error:', err);
    } finally {
      setIsApprovingSimulation(false);
    }
  };

  // -------------------------------------------------------------
  // Case 3: Application is currently submitted / under review
  // -------------------------------------------------------------
  if (application && (application.status === 'submitted' || application.status === 'reviewed')) {
    const formattedDate = new Date(application.submittedAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

    return (
      <main className="max-w-xl mx-auto px-3.5 sm:px-6 py-6 sm:py-10 pb-28 animate-fade-in">
        <div className="bg-surface-container-lowest border border-outline-variant/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm space-y-5 sm:space-y-6">
          {/* Header */}
          <div className="text-center max-w-sm mx-auto">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto mb-3 border border-amber-500/20">
              <span className="material-symbols-outlined text-2xl sm:text-3xl animate-pulse">hourglass_top</span>
            </div>
            <span className="text-[10px] sm:text-[11px] font-bold text-amber-700 bg-amber-500/10 px-3 py-0.5 rounded-full border border-amber-500/20 uppercase tracking-wider">
              Application Under Review
            </span>
            <h1 className="font-headline-lg text-xl sm:text-2xl font-bold text-primary mt-2 mb-1.5 tracking-tight">
              Evinzoo Provider Network
            </h1>
            <p className="text-xs text-secondary leading-relaxed">
              Your application is waiting for verification review. You will be notified once activated.
            </p>
          </div>

          {/* Redesigned Verification Progress Tracker with Gentle Periodic Blinking Dot & Mathematically Centered Timeline */}
          <div className="relative overflow-hidden bg-gradient-to-b from-surface-container-low to-surface p-4 sm:p-5 rounded-2xl border border-outline-variant/80 shadow-sm space-y-4">
            {/* Top Live Status Indicator Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/60">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full bg-amber-500 flex-shrink-0"
                  style={{ animation: 'pulse 2.5s ease-in-out infinite' }}
                ></span>
                <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
                  Verification in Progress
                </span>
              </div>
              <span className="text-[10px] font-semibold text-secondary bg-surface-container-high px-2 py-0.5 rounded-full border border-outline-variant/60">
                Stage 2 of 3
              </span>
            </div>

            {/* Vertical Timeline with Guaranteed Horizontal Center Alignment */}
            <div className="space-y-0">
              {/* Stage 1: Submitted (Completed) */}
              <div className="flex items-start gap-3.5 group relative">
                {/* Node & Connecting Line Column */}
                <div className="flex flex-col items-center flex-shrink-0 relative self-stretch">
                  <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs flex-shrink-0 shadow-sm shadow-emerald-500/20 ring-4 ring-emerald-500/10 z-10">
                    <span className="material-symbols-outlined text-[15px]">check</span>
                  </div>
                  {/* Mathematically Centered Connector Line */}
                  <div className="w-0.5 bg-emerald-500 absolute top-7 bottom-0 left-1/2 -translate-x-1/2 z-0"></div>
                </div>

                <div className="min-w-0 flex-1 pt-0.5 pb-6">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-xs font-bold text-primary">Application Submitted</p>
                    <span className="text-[9px] font-bold text-emerald-700 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                      Completed
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-secondary mt-0.5">
                    Recorded on {formattedDate}
                  </p>
                </div>
              </div>

              {/* Stage 2: Verification Review (Active) */}
              <div className="flex items-start gap-3.5 relative">
                {/* Node & Connecting Line Column */}
                <div className="flex flex-col items-center flex-shrink-0 relative self-stretch">
                  <div className="w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs flex-shrink-0 shadow-sm shadow-amber-500/20 ring-4 ring-amber-500/20 z-10">
                    <span
                      className="w-2 h-2 rounded-full bg-white"
                      style={{ animation: 'pulse 2.5s ease-in-out infinite' }}
                    ></span>
                  </div>
                  {/* Mathematically Centered Connector Line to Stage 3 */}
                  <div className="w-0.5 bg-outline-variant absolute top-7 bottom-0 left-1/2 -translate-x-1/2 z-0"></div>
                </div>

                <div className="min-w-0 flex-1 bg-surface-container-lowest p-3 sm:p-3.5 rounded-xl border border-outline-variant/80 shadow-sm space-y-1.5 mb-6">
                  <div className="flex items-center justify-between flex-wrap gap-1">
                    <p className="text-xs font-bold text-primary flex items-center gap-1.5">
                      <span>Verification Review</span>
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-amber-500"
                        style={{ animation: 'pulse 2.5s ease-in-out infinite' }}
                      ></span>
                    </p>
                    <span className="text-[9px] font-bold text-amber-700 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 uppercase tracking-wider">
                      In Queue
                    </span>
                  </div>
                  <p className="text-[11px] text-secondary leading-relaxed">
                    Our team is reviewing your profile and verifying dispatch readiness.
                  </p>
                  <div className="flex items-center gap-1.5 text-[11px] text-secondary pt-1.5 border-t border-outline-variant/40 mt-1">
                    <span className="material-symbols-outlined text-[13px] text-amber-600 flex-shrink-0">schedule</span>
                    <span>Estimated review time: 24–72 hours</span>
                  </div>
                </div>
              </div>

              {/* Stage 3: Activation (Upcoming) */}
              <div className="flex items-start gap-3.5 opacity-60 relative">
                {/* Node Column */}
                <div className="flex flex-col items-center flex-shrink-0 relative">
                  <div className="w-7 h-7 rounded-full bg-surface-container border border-outline-variant text-secondary flex items-center justify-center text-xs flex-shrink-0 ring-4 ring-surface z-10">
                    <span className="material-symbols-outlined text-[15px]">storefront</span>
                  </div>
                </div>

                <div className="min-w-0 flex-1 pt-0.5">
                  <p className="text-xs font-bold text-primary">Provider Activation</p>
                  <p className="text-[10px] sm:text-[11px] text-secondary mt-0.5">
                    Account upgraded to Provider; Service Catalog and Bookings Hub unlocked.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Submitted Information Card */}
          <div className="bg-surface p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-outline-variant/70 space-y-3">
            <div className="flex items-center justify-between border-b border-outline-variant/60 pb-2">
              <span className="text-[11px] font-bold text-primary uppercase tracking-wider">Submitted Details</span>
              <span className="text-[10px] font-mono text-secondary bg-surface-container px-2 py-0.5 rounded border border-outline-variant/50">
                ID: {application.id.slice(0, 8)}
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-outline-variant/30">
                <span className="text-secondary text-[11px]">Operating As</span>
                <span className="font-semibold text-primary text-right truncate max-w-[200px]">
                  {application.businessName || `${user.name} (Personal)`}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-outline-variant/30">
                <span className="text-secondary text-[11px]">Dispatch Phone</span>
                <span className="font-semibold text-primary font-mono text-right">
                  {application.businessPhone || 'Not provided'}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-outline-variant/30">
                <span className="text-secondary text-[11px]">Contact Email</span>
                <span className="font-semibold text-primary text-right truncate max-w-[200px]">
                  {application.businessEmail || user.email}
                </span>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-secondary text-[11px]">Fee Paid</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
                  Launch Discount (₹0 Paid)
                </span>
              </div>

              {application.businessDescription && (
                <div className="pt-1.5 border-t border-outline-variant/30">
                  <span className="text-[10px] text-secondary uppercase font-bold block mb-0.5">Description</span>
                  <p className="text-[11px] text-secondary italic bg-surface-container/50 p-2.5 rounded-lg border border-outline-variant/40">
                    "{application.businessDescription}"
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Developer Sandbox Helper for Local Simulation */}
          <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-surface-container/40 border border-outline-variant/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="text-left">
              <p className="text-[11px] font-bold text-primary flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px] text-secondary">terminal</span>
                <span>Testing Sandbox</span>
              </p>
              <p className="text-[10px] text-secondary mt-0.5 leading-snug">
                Simulate verifier approval to instantly test the provider experience.
              </p>
            </div>
            <button
              onClick={handleSimulateApproval}
              disabled={isApprovingSimulation}
              className="w-full sm:w-auto px-4 py-2.5 bg-primary text-on-primary rounded-xl text-xs font-bold hover:bg-primary/90 transition-all active:scale-95 shadow-sm disabled:opacity-50 whitespace-nowrap text-center"
            >
              {isApprovingSimulation ? 'Processing...' : 'Simulate Approval'}
            </button>
          </div>
        </div>
      </main>
    );
  }

  // -------------------------------------------------------------
  // Wizard Navigation Handlers
  // -------------------------------------------------------------
  const handleProceedStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep1Error(null);

    const trimmedPhone = profilePhone.trim();
    if (!trimmedPhone || trimmedPhone.length < 7) {
      setStep1Error('A valid phone number is required to proceed.');
      return;
    }

    if (!step1Confirmed) {
      setStep1Error('Please confirm your contact details before continuing.');
      return;
    }

    // Save phone to profile if it was empty or changed
    if (!user.phone || user.phone !== trimmedPhone) {
      try {
        await authService.updateUser({ ...user, phone: trimmedPhone });
      } catch (err) {
        console.warn('Could not save phone to profile immediately:', err);
      }
    }

    // Auto-populate dispatch phone if empty
    if (!dispatchPhone) {
      setDispatchPhone(trimmedPhone);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentStep(2);
  };

  const handleProceedStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!dispatchEmail.trim() || !dispatchEmail.includes('@')) {
      setError('Please provide a valid contact email for booking dispatch.');
      return;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentStep(3);
  };

  const handleFinalSubmit = async () => {
    setError(null);

    if (!agreedToTerms) {
      setError('Please agree to the Evinzoo Partner Quality Standards to submit.');
      return;
    }

    setSubmitting(true);

    try {
      const createdApp = await providerService.submitApplication(user.id, {
        businessName: businessName.trim() || undefined,
        businessDescription: description.trim() || undefined,
        businessPhone: dispatchPhone.trim() || profilePhone.trim() || undefined,
        businessEmail: dispatchEmail.trim() || user.email || undefined,
      });

      setApplication(createdApp);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setError(err.message || 'Failed to submit application. Please check your details and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUseProfilePhone = () => {
    if (profilePhone.trim()) {
      setDispatchPhone(profilePhone.trim());
    }
  };

  // Step titles for stepper
  const stepTitles = {
    1: 'Account Verification',
    2: 'Business Setup',
    3: 'Activation & Offer',
  };

  // -------------------------------------------------------------
  // Case 4: 3-Phase Multi-Step Form (Mobile-First Minimal Redesign)
  // -------------------------------------------------------------
  return (
    <main className="max-w-xl mx-auto px-3.5 sm:px-6 py-5 sm:py-8 pb-28 animate-fade-in">
      {/* Top Header - Provider Onboarding */}
      <div className="text-center mb-5 sm:mb-7">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-2">
          <span className="material-symbols-outlined text-[14px]">storefront</span>
          <span>Provider Onboarding</span>
        </div>
        <h1 className="font-headline-lg text-xl sm:text-2xl md:text-3xl font-bold text-primary tracking-tight">
          Evinzoo Provider Network
        </h1>
        <p className="text-xs sm:text-sm text-secondary mt-1 max-w-sm mx-auto leading-relaxed">
          List your services, manage event dispatches, and receive high-value bookings.
        </p>
      </div>

      {/* Modern Segmented Stepper */}
      <div className="bg-surface-container-lowest p-3.5 sm:p-4 rounded-2xl border border-outline-variant/80 shadow-sm mb-4 sm:mb-6">
        {/* Stepper Header Row */}
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-primary text-on-primary text-[10px] font-bold flex items-center justify-center">
              {currentStep}
            </span>
            <span className="text-xs font-bold text-primary">
              {stepTitles[currentStep]}
            </span>
          </div>
          <span className="text-[10px] font-semibold text-secondary uppercase tracking-wider">
            Step {currentStep} of 3
          </span>
        </div>

        {/* 3-Segment Progress Indicator */}
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
          {/* Segment 1 */}
          <div className="h-1.5 rounded-full transition-all duration-300 overflow-hidden bg-surface-container">
            <div
              className={`h-full transition-all duration-300 ${
                currentStep >= 1 ? 'bg-primary' : 'bg-transparent'
              }`}
            ></div>
          </div>
          {/* Segment 2 */}
          <div className="h-1.5 rounded-full transition-all duration-300 overflow-hidden bg-surface-container">
            <div
              className={`h-full transition-all duration-300 ${
                currentStep >= 2 ? 'bg-primary' : 'bg-transparent'
              }`}
            ></div>
          </div>
          {/* Segment 3 */}
          <div className="h-1.5 rounded-full transition-all duration-300 overflow-hidden bg-surface-container">
            <div
              className={`h-full transition-all duration-300 ${
                currentStep === 3 ? 'bg-primary' : 'bg-transparent'
              }`}
            ></div>
          </div>
        </div>

        {/* Sub-label for desktop/tablet only */}
        <div className="hidden sm:grid grid-cols-3 gap-2 mt-2 text-[10px] font-medium text-secondary text-center">
          <span className={currentStep === 1 ? 'text-primary font-bold' : ''}>1. Verification</span>
          <span className={currentStep === 2 ? 'text-primary font-bold' : ''}>2. Business</span>
          <span className={currentStep === 3 ? 'text-primary font-bold' : ''}>3. Activation</span>
        </div>
      </div>

      {/* Main Form Container Card */}
      <div className="bg-surface-container-lowest p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-outline-variant/80 shadow-sm">
        {/* Error Notification */}
        {(error || step1Error) && (
          <div className="mb-4 sm:mb-5 p-3 sm:p-3.5 rounded-xl bg-error-container/40 border border-error/20 text-error text-xs font-semibold flex items-start gap-2 animate-fade-in">
            <span className="material-symbols-outlined text-base flex-shrink-0 mt-0.5">error</span>
            <span className="leading-snug">{error || step1Error}</span>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* PHASE 1: User Account Details Verification & Confirmation    */}
        {/* ------------------------------------------------------------- */}
        {currentStep === 1 && (
          <form onSubmit={handleProceedStep1} className="space-y-4 sm:space-y-5 animate-fade-in">
            {/* Step Header */}
            <div className="border-b border-outline-variant/60 pb-3">
              <span className="text-[10px] font-bold text-secondary uppercase tracking-wider block">
                Phase 1 of 3
              </span>
              <h2 className="text-base sm:text-lg font-bold text-primary mt-0.5">
                Verify Your Contact Details
              </h2>
              <p className="text-[11px] sm:text-xs text-secondary mt-0.5 leading-relaxed">
                A valid mobile phone number is required for booking dispatch and coordination.
              </p>
            </div>

            {/* Account Profile Snapshot Card */}
            <div className="bg-surface p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-outline-variant/70 space-y-3.5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden border border-outline-variant/70 bg-surface-container flex-shrink-0">
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-xs sm:text-sm text-primary truncate">{user.name}</h3>
                  <p className="text-[11px] text-secondary truncate mt-0.5">{user.email}</p>
                </div>
              </div>

              {/* Phone Input - Minimal required label */}
              <div className="border-t border-outline-variant/50 pt-3">
                <label className="text-[11px] font-bold text-primary block mb-1.5" htmlFor="verify-phone">
                  Mobile Phone Number <span className="text-error">*</span>
                </label>

                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-secondary text-[17px]">
                    phone
                  </span>
                  <input
                    id="verify-phone"
                    type="tel"
                    required
                    value={profilePhone}
                    onChange={(e) => {
                      setProfilePhone(e.target.value);
                      if (step1Error) setStep1Error(null);
                    }}
                    placeholder="Enter phone number (e.g. +91 98765 43210)"
                    className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm bg-surface-container-lowest border border-outline-variant rounded-xl focus:outline-none focus:ring-1.5 focus:ring-primary text-primary transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Confirmation Checkbox Box */}
            <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-surface border border-outline-variant/60">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={step1Confirmed}
                  onChange={(e) => {
                    setStep1Confirmed(e.target.checked);
                    if (step1Error) setStep1Error(null);
                  }}
                  className="mt-0.5 rounded border-outline-variant text-primary focus:ring-primary h-4 w-4 flex-shrink-0"
                />
                <span className="text-[11px] sm:text-xs text-secondary leading-relaxed">
                  I confirm my contact details (<strong>{user.name}</strong>, <strong>{profilePhone || 'Phone pending'}</strong>) are correct and active for provider operations.
                </span>
              </label>
            </div>

            {/* Action Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={!profilePhone.trim() || profilePhone.trim().length < 7 || !step1Confirmed}
                className="w-full h-12 bg-primary text-on-primary rounded-xl text-xs sm:text-sm font-bold hover:bg-primary/90 transition-all active:scale-98 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <span>Continue to Business Details</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </form>
        )}

        {/* ------------------------------------------------------------- */}
        {/* PHASE 2: Business & Dispatch Information                      */}
        {/* ------------------------------------------------------------- */}
        {currentStep === 2 && (
          <form onSubmit={handleProceedStep2} className="space-y-4 sm:space-y-5 animate-fade-in">
            {/* Step Header */}
            <div className="border-b border-outline-variant/60 pb-3">
              <span className="text-[10px] font-bold text-secondary uppercase tracking-wider block">
                Phase 2 of 3
              </span>
              <h2 className="text-base sm:text-lg font-bold text-primary mt-0.5">
                Business Details
              </h2>
              <p className="text-[11px] sm:text-xs text-secondary mt-0.5 leading-relaxed">
                Configure your public brand and booking communication channel.
              </p>
            </div>

            {/* Business Name */}
            <div>
              <label className="text-[11px] font-bold text-secondary uppercase tracking-wider block mb-1" htmlFor="biz-name">
                Business / Brand Name
              </label>
              <input
                id="biz-name"
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder={`e.g. Apex Events`}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-surface border border-outline-variant rounded-xl focus:outline-none focus:ring-1.5 focus:ring-primary text-primary transition-all"
              />
              <p className="text-[10px] text-secondary mt-1">
                If left empty, your provider profile will display your personal name: <strong>{user.name}</strong>.
              </p>
            </div>

            {/* Dispatch Phone */}
            <div>
              <div className="flex items-center justify-between mb-1 flex-wrap gap-1">
                <label className="text-[11px] font-bold text-secondary uppercase tracking-wider" htmlFor="biz-phone">
                  Contact Phone
                </label>
                {profilePhone && dispatchPhone !== profilePhone && (
                  <button
                    type="button"
                    onClick={handleUseProfilePhone}
                    className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1 bg-surface px-2 py-0.5 rounded border border-outline-variant/70 active:scale-95 transition-all"
                  >
                    <span className="material-symbols-outlined text-[12px]">phone_iphone</span>
                    <span>Use Profile Phone</span>
                  </button>
                )}
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-secondary text-[17px]">
                  call
                </span>
                <input
                  id="biz-phone"
                  type="tel"
                  value={dispatchPhone}
                  onChange={(e) => setDispatchPhone(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm bg-surface border border-outline-variant rounded-xl focus:outline-none focus:ring-1.5 focus:ring-primary text-primary transition-all"
                />
              </div>
            </div>

            {/* Business Contact Email */}
            <div>
              <label className="text-[11px] font-bold text-secondary uppercase tracking-wider block mb-1" htmlFor="biz-email">
                Contact Email <span className="text-error">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-secondary text-[17px]">
                  mail
                </span>
                <input
                  id="biz-email"
                  type="email"
                  required
                  value={dispatchEmail}
                  onChange={(e) => setDispatchEmail(e.target.value)}
                  placeholder="dispatch@company.com"
                  className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm bg-surface border border-outline-variant rounded-xl focus:outline-none focus:ring-1.5 focus:ring-primary text-primary transition-all"
                />
              </div>
            </div>

            {/* Description / Bio */}
            <div>
              <label className="text-[11px] font-bold text-secondary uppercase tracking-wider block mb-1" htmlFor="biz-desc">
                Description / Other Details
              </label>
              <textarea
                id="biz-desc"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Briefly describe your services (e.g. wedding catering, sound & light equipment, event transport fleet)..."
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-surface border border-outline-variant rounded-xl focus:outline-none focus:ring-1.5 focus:ring-primary text-primary resize-none transition-all"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5 pt-2 border-t border-outline-variant/60">
              <button
                type="button"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setCurrentStep(1);
                }}
                className="h-12 px-4 text-xs font-bold text-secondary hover:text-primary rounded-xl border border-outline-variant hover:bg-surface transition-colors active:scale-95 flex items-center justify-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                <span className="hidden sm:inline">Back</span>
              </button>

              <button
                type="submit"
                className="flex-1 h-12 bg-primary text-on-primary rounded-xl text-xs sm:text-sm font-bold hover:bg-primary/90 transition-all active:scale-98 shadow-sm flex items-center justify-center gap-2"
              >
                <span>Continue to Activation</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </form>
        )}

        {/* ------------------------------------------------------------- */}
        {/* PHASE 3: Network Activation & Promotional Offer (Payment)     */}
        {/* ------------------------------------------------------------- */}
        {currentStep === 3 && (
          <div className="space-y-4 sm:space-y-5 animate-fade-in">
            {/* Step Header */}
            <div className="border-b border-outline-variant/60 pb-3">
              <span className="text-[10px] font-bold text-secondary uppercase tracking-wider block">
                Phase 3 of 3
              </span>
              <h2 className="text-base sm:text-lg font-bold text-primary mt-0.5">
                Activation & Launch Offer
              </h2>
              <p className="text-[11px] sm:text-xs text-secondary mt-0.5 leading-relaxed">
                Review your partner registration and complete your network activation.
              </p>
            </div>

            {/* Special Offer Card */}
            <div className="bg-surface rounded-xl sm:rounded-2xl border-2 border-emerald-500/30 p-4 sm:p-5 shadow-sm space-y-3.5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-emerald-600 text-lg sm:text-xl">loyalty</span>
                  <h3 className="font-bold text-xs sm:text-sm text-primary">
                    Network Onboarding Fee
                  </h3>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
                  🎉 Launch Offer (100% OFF)
                </span>
              </div>

              {/* Pricing Receipt Breakdown */}
              <div className="bg-surface-container-lowest p-3 sm:p-3.5 rounded-xl border border-outline-variant/70 space-y-2 text-xs">
                <div className="flex items-center justify-between text-secondary text-[11px] sm:text-xs">
                  <span>Registration Fee</span>
                  <span className="line-through font-mono text-secondary">₹499 INR</span>
                </div>
                <div className="flex items-center justify-between text-emerald-600 font-bold text-[11px] sm:text-xs">
                  <span>Launch Discount</span>
                  <span className="font-mono">-₹499 INR</span>
                </div>
                <div className="border-t border-outline-variant/70 pt-2 flex items-center justify-between">
                  <span className="font-bold text-xs sm:text-sm text-primary">Total Due Today</span>
                  <div className="text-right">
                    <span className="font-mono font-bold text-base sm:text-lg text-emerald-600 block leading-tight">
                      ₹0 INR
                    </span>
                    <span className="text-[9px] sm:text-[10px] text-secondary">Zero charge for early partners</span>
                  </div>
                </div>
              </div>

              {/* Included Perks List */}
              <div className="space-y-1.5 pt-1">
                <p className="font-bold text-primary text-[10px] sm:text-[11px] uppercase tracking-wider">
                  Included with Your Activation:
                </p>
                <div className="space-y-1.5 text-[11px] text-secondary">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-600 text-[15px] flex-shrink-0">check_circle</span>
                    <span>Verified Partner Badge & Public ID</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-600 text-[15px] flex-shrink-0">check_circle</span>
                    <span>Unlimited Service Catalog Listings</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-600 text-[15px] flex-shrink-0">check_circle</span>
                    <span>Live Booking Dispatch Hub Access</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-600 text-[15px] flex-shrink-0">check_circle</span>
                    <span>0% Platform Commission during launch period</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Overview Summary Box */}
            <div className="bg-surface p-3 sm:p-3.5 rounded-xl border border-outline-variant/70 text-xs space-y-1.5">
              <span className="text-[10px] font-bold text-secondary uppercase tracking-wider block">
                Application Summary
              </span>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-secondary">Operating As:</span>
                <span className="font-bold text-primary truncate max-w-[180px]">
                  {businessName.trim() || `${user.name} (Personal)`}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-secondary">Dispatch Phone:</span>
                <span className="font-bold text-primary font-mono">{dispatchPhone || profilePhone}</span>
              </div>
            </div>

            {/* Quality Standards Agreement Checkbox */}
            <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-surface border border-outline-variant/60">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => {
                    setAgreedToTerms(e.target.checked);
                    if (error) setError(null);
                  }}
                  className="mt-0.5 rounded border-outline-variant text-primary focus:ring-primary h-4 w-4 flex-shrink-0"
                />
                <span className="text-[11px] sm:text-xs text-secondary leading-relaxed">
                  I agree to the <strong className="text-primary">Evinzoo Partner Quality & Verification Standards</strong>. I authorize Evinzoo to verify my contact details before account activation.
                </span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5 pt-2 border-t border-outline-variant/60">
              <button
                type="button"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setCurrentStep(2);
                }}
                className="h-12 px-4 text-xs font-bold text-secondary hover:text-primary rounded-xl border border-outline-variant hover:bg-surface transition-colors active:scale-95 flex items-center justify-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                <span className="hidden sm:inline">Back</span>
              </button>

              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={submitting || !agreedToTerms}
                className="flex-1 h-12 bg-primary text-on-primary rounded-xl text-xs sm:text-sm font-bold hover:bg-primary/90 transition-all active:scale-98 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">verified</span>
                    <span>Submit Application (₹0 Due)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};
