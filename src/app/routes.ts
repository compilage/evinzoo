import { PageRoute, OnboardingSubRoute } from '../types';

export const VALID_ROUTES: PageRoute[] = [
  'landing',
  'marketplace',
  'dashboard',
  'bookings',
  'services',
  'account',
  'login',
  'signup',
  'provider-onboarding',
  'provider-onboarding/user-details',
  'provider-onboarding/business-details',
  'provider-onboarding/onboarding-checkout',
  'provider-onboarding/status',
  'notifications',
];

export const ONBOARDING_SUB_ROUTES: OnboardingSubRoute[] = [
  'user-details',
  'business-details',
  'onboarding-checkout',
  'status',
];

/**
 * Extracts and normalizes the active page route from window.location.pathname.
 */
export function getRouteFromUrl(): PageRoute {
  if (typeof window === 'undefined') return 'landing';
  const rawPath = window.location.pathname.replace(/^\/+|\/+$/g, '');
  if (!rawPath) return 'landing';

  // Check exact matches first
  if (VALID_ROUTES.includes(rawPath as PageRoute)) {
    return rawPath as PageRoute;
  }

  // Handle prefix variations for provider-onboarding
  if (rawPath.startsWith('provider-onboarding/')) {
    const sub = rawPath.replace('provider-onboarding/', '') as OnboardingSubRoute;
    if (ONBOARDING_SUB_ROUTES.includes(sub)) {
      return `provider-onboarding/${sub}` as PageRoute;
    }
    return 'provider-onboarding';
  }

  return 'landing';
}

/**
 * Parses a PageRoute into base route and sub-route for provider onboarding.
 */
export function parseOnboardingSubRoute(route: PageRoute): OnboardingSubRoute {
  if (route === 'provider-onboarding/user-details') return 'user-details';
  if (route === 'provider-onboarding/business-details') return 'business-details';
  if (route === 'provider-onboarding/onboarding-checkout') return 'onboarding-checkout';
  if (route === 'provider-onboarding/status') return 'status';
  return 'user-details'; // default step
}

/**
 * Builds the canonical URL string for history navigation.
 */
export function buildRouteUrl(route: PageRoute): string {
  if (route === 'landing') return '/';
  return `/${route}`;
}
