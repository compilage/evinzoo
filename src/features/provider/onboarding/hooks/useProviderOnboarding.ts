import { useState, useEffect, useCallback } from 'react';
import { User, Service, ProviderApplication } from '../../../../types';
import { OnboardingSubRoute, OnboardingFormData, OnboardingErrors, AnimationDirection } from '../types';
import { onboardingApi } from '../api/onboardingApi';
import { authService } from '../../../../services/authService';

interface UseProviderOnboardingProps {
  user: User | null;
  activeSubRoute: OnboardingSubRoute;
  onNavigateSubRoute: (subRoute: OnboardingSubRoute, direction: AnimationDirection) => void;
  onApplicationApproved: (updatedUser: User, initialService?: Service) => void;
}

export function useProviderOnboarding({
  user,
  activeSubRoute,
  onNavigateSubRoute,
  onApplicationApproved,
}: UseProviderOnboardingProps) {
  const [formData, setFormData] = useState<OnboardingFormData>({
    profilePhone: user?.phone || '',
    businessName: '',
    dispatchPhone: user?.phone || '',
    dispatchEmail: user?.email || '',
    description: '',
    agreedToTerms: false,
  });

  const [errors, setErrors] = useState<OnboardingErrors>({});
  const [direction, setDirection] = useState<AnimationDirection>('forward');
  const [application, setApplication] = useState<ProviderApplication | null>(null);
  const [isLoadingApp, setIsLoadingApp] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isApprovingSimulation, setIsApprovingSimulation] = useState(false);

  // Sync user profile phone & email into form
  useEffect(() => {
    if (!user) {
      setIsLoadingApp(false);
      return;
    }

    if (user.phone) {
      setFormData((prev) => ({
        ...prev,
        profilePhone: prev.profilePhone || user.phone || '',
        dispatchPhone: prev.dispatchPhone || user.phone || '',
      }));
    }

    if (user.email) {
      setFormData((prev) => ({
        ...prev,
        dispatchEmail: prev.dispatchEmail || user.email || '',
      }));
    }

    // Load existing application if any
    onboardingApi
      .getMyApplication(user.id)
      .then((existing) => {
        setApplication(existing);
        // If user already has an active application and is on the base page, take them to status
        if (existing && activeSubRoute !== 'status') {
          onNavigateSubRoute('status', 'forward');
        }
      })
      .catch((err) => {
        console.error('[Onboarding] Error loading application:', err);
      })
      .finally(() => {
        setIsLoadingApp(false);
      });
  }, [user]);

  const updateFormField = useCallback(<K extends keyof OnboardingFormData>(key: K, value: OnboardingFormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined, general: undefined }));
  }, []);

  // Screen 1 -> Screen 2
  const handleNextFromUserDetails = () => {
    const phone = formData.profilePhone.trim();
    if (!phone) {
      setErrors({ profilePhone: 'Please provide a valid phone number to continue.' });
      return;
    }
    if (phone.replace(/\D/g, '').length < 10) {
      setErrors({ profilePhone: 'Please enter a valid 10-digit phone number.' });
      return;
    }

    // Auto-prefill dispatch phone if blank
    if (!formData.dispatchPhone.trim()) {
      updateFormField('dispatchPhone', phone);
    }

    // Persist phone to profile in background if updated
    if (user && user.phone !== phone) {
      authService.updateUser({ ...user, phone }).catch(console.error);
    }

    setDirection('forward');
    onNavigateSubRoute('business-details', 'forward');
  };

  // Screen 2 -> Screen 3
  const handleNextFromBusinessDetails = () => {
    const phone = formData.dispatchPhone.trim() || formData.profilePhone.trim();
    if (!phone) {
      setErrors({ dispatchPhone: 'A contact phone number is required.' });
      return;
    }
    setDirection('forward');
    onNavigateSubRoute('onboarding-checkout', 'forward');
  };

  // Screen 2 -> Screen 1
  const handleBackToUserDetails = () => {
    setDirection('backward');
    onNavigateSubRoute('user-details', 'backward');
  };

  // Screen 3 -> Screen 2
  const handleBackToBusinessDetails = () => {
    setDirection('backward');
    onNavigateSubRoute('business-details', 'backward');
  };

  // Screen 3 -> Submit Application
  const handleSubmitCheckout = async () => {
    if (!formData.agreedToTerms) {
      setErrors({ agreedToTerms: 'You must agree to the Terms of Service to proceed.' });
      return;
    }

    if (!user) {
      setErrors({ general: 'User session expired. Please sign in again.' });
      return;
    }

    setSubmitting(true);
    setErrors({});

    try {
      const createdApp = await onboardingApi.submitApplication(user.id, {
        businessName: formData.businessName.trim() || undefined,
        businessDescription: formData.description.trim() || undefined,
        businessPhone: formData.dispatchPhone.trim() || formData.profilePhone.trim(),
        businessEmail: formData.dispatchEmail.trim() || user.email,
      });

      setApplication(createdApp);
      setDirection('forward');
      onNavigateSubRoute('status', 'forward');
    } catch (err: any) {
      console.error('[Onboarding] Submit error:', err);
      setErrors({ general: err.message || 'Failed to submit application. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  // Simulation handler for dev testing
  const handleSimulateApproval = async () => {
    if (!application || !user) return;
    setIsApprovingSimulation(true);
    try {
      const success = await onboardingApi.simulateAdminApproval(application.id);
      if (success) {
        setApplication((prev) =>
          prev
            ? {
                ...prev,
                status: 'approved',
                kycStatus: 'verified',
                reviewedAt: new Date().toISOString(),
              }
            : null
        );

        const updatedUser: User = {
          ...user,
          role: 'provider',
          companyName: application.businessName || user.name,
          isLive: true,
          providerDetails: {
            profileId: user.id,
            businessName: application.businessName || undefined,
            businessDescription: application.businessDescription || undefined,
            businessPhone: application.businessPhone || undefined,
            businessEmail: application.businessEmail || undefined,
            kycStatus: 'verified',
            serviceability: { latitude: 0.0, longitude: 0.0 },
            isAvailable: true,
          },
        };

        onApplicationApproved(updatedUser);
      }
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setIsApprovingSimulation(false);
    }
  };

  return {
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
  };
}
