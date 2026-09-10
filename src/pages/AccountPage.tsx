import React from 'react';
import { PageRoute, User } from '../types';
import { useVerifiedRole } from '../hooks/useVerifiedRole';
import { ConsumerAccountPage } from './consumer/ConsumerAccountPage';
import { ProviderAccountPage } from './provider/ProviderAccountPage';

export interface AccountPageProps {
  user: User | null;
  setCurrentRoute: (route: PageRoute) => void;
  onUpdateUser: (updatedUser: User) => void;
  onLogout: () => void;
  bookingsCount?: number;
}

/**
 * Main Account Page Controller.
 * Authoritatively re-verifies the user's role directly from the signed JWT access token,
 * preventing role spoofing and rendering the domain-specific account view:
 * - Providers see Partner Hub & Business Profile
 * - Consumers see Profile & Reservation Details
 */
export const AccountPage: React.FC<AccountPageProps> = ({
  user,
  setCurrentRoute,
  onUpdateUser,
  onLogout,
  bookingsCount = 0,
}) => {
  const { role, activeUser } = useVerifiedRole({
    user,
    onUpdateUser,
  });

  // 1. Unauthenticated Guest View
  if (!activeUser) {
    return (
      <main className="max-w-md mx-auto px-4 sm:px-6 py-16 text-center w-full">
        <div className="w-16 h-16 bg-surface-container rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary">
          <span className="material-symbols-outlined text-3xl">account_circle</span>
        </div>
        <h2 className="text-xl font-bold text-primary mb-2">Sign in to access your profile</h2>
        <p className="text-xs text-secondary mb-6 leading-relaxed">
          Manage your reservations, contact information, and provider account preferences.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <button
            onClick={() => setCurrentRoute('login')}
            className="w-full sm:w-auto px-6 py-3 bg-primary text-on-primary rounded-xl text-xs font-bold shadow-sm hover:opacity-95 transition-opacity min-h-[44px]"
          >
            Sign In
          </button>
          <button
            onClick={() => setCurrentRoute('signup')}
            className="w-full sm:w-auto px-6 py-3 bg-surface-container border border-outline-variant text-primary rounded-xl text-xs font-bold hover:bg-surface-container-high transition-colors min-h-[44px]"
          >
            Create Account
          </button>
        </div>
      </main>
    );
  }

  // 2. Authoritatively Verified Provider
  if (role === 'provider') {
    return (
      <ProviderAccountPage
        user={activeUser}
        setCurrentRoute={setCurrentRoute}
        onUpdateUser={onUpdateUser}
        onLogout={onLogout}
      />
    );
  }

  // 3. Authoritatively Verified Consumer
  return (
    <ConsumerAccountPage
      user={activeUser}
      setCurrentRoute={setCurrentRoute}
      onUpdateUser={onUpdateUser}
      onLogout={onLogout}
      bookingsCount={bookingsCount}
    />
  );
};

export default AccountPage;
