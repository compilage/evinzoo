import React from 'react';
import { PageRoute, Service, User } from '../types';
import { ProviderOnboardingPage } from './provider/ProviderOnboardingPage';

export interface ProviderApplicationPageProps {
  user: User | null;
  currentRoute?: PageRoute;
  setCurrentRoute: (route: PageRoute) => void;
  onApplicationApproved: (updatedUser: User, initialService?: Service) => void;
}

export const ProviderApplicationPage: React.FC<ProviderApplicationPageProps> = (props) => {
  return <ProviderOnboardingPage {...props} />;
};

export { ProviderOnboardingPage };
