import { useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { authService } from '../services/authService';

interface UseVerifiedRoleOptions {
  user: User | null;
  onUpdateUser?: (user: User) => void;
}

interface UseVerifiedRoleResult {
  role: UserRole | null;
  isVerifying: boolean;
  activeUser: User | null;
}

/**
 * Custom hook for Page Controllers to verify the active user's role directly
 * against the authoritative signed Supabase JWT custom claim (`user_role`).
 *
 * Provides optimistic instantaneous rendering using passed-in user state,
 * while asynchronously re-validating cached JWT tokens to prevent any privilege
 * spoofing or stale role state.
 */
export function useVerifiedRole({
  user,
  onUpdateUser,
}: UseVerifiedRoleOptions): UseVerifiedRoleResult {
  const [role, setRole] = useState<UserRole | null>(user?.role || null);
  const [activeUser, setActiveUser] = useState<User | null>(user);
  const [isVerifying, setIsVerifying] = useState<boolean>(Boolean(user));

  useEffect(() => {
    let isMounted = true;

    if (!user) {
      setRole(null);
      setActiveUser(null);
      setIsVerifying(false);
      return;
    }

    // Immediately keep in sync with incoming user prop
    setRole(user.role);
    setActiveUser(user);

    const recheckRole = async () => {
      try {
        const verifiedRole = await authService.getVerifiedUserRole();
        if (!isMounted) return;

        if (verifiedRole && verifiedRole !== user.role) {
          // Discrepancy detected (e.g. application was approved or session refreshed)
          const refreshed = await authService.refreshSessionUser();
          if (isMounted && refreshed) {
            setActiveUser(refreshed);
            setRole(refreshed.role);
            if (onUpdateUser) {
              onUpdateUser(refreshed);
            }
          }
        } else if (verifiedRole) {
          setRole(verifiedRole);
        }
      } catch (err) {
        console.warn('[useVerifiedRole] Re-verification check failed:', err);
      } finally {
        if (isMounted) {
          setIsVerifying(false);
        }
      }
    };

    recheckRole();

    return () => {
      isMounted = false;
    };
  }, [user?.id, user?.role]);

  return {
    role,
    isVerifying,
    activeUser,
  };
}
