import { ProviderApplication, User, UserRole } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const STORAGE_KEY_ACCOUNTS = 'evinzoo_registered_accounts';
const STORAGE_KEY_SESSION = 'evinzoo_current_session';

// Real authentication mode: no pre-seeded dummy users
const INITIAL_ACCOUNTS: User[] = [];

/**
 * Extracts and verifies the authoritative `user_role` claim directly from the signed JWT access token.
 * Populated by the trusted database custom_access_token_hook.
 */
export function extractUserRoleFromJwt(session: any): UserRole {
  try {
    if (session?.access_token) {
      const payloadBase64 = session.access_token.split('.')[1];
      if (payloadBase64) {
        // Handle URL-safe base64 decoding
        const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        const claims = JSON.parse(jsonPayload);
        if (claims.user_role === 'provider' || claims.user_role === 'consumer' || claims.user_role === 'employee') {
          return claims.user_role;
        }
        if (claims.app_metadata?.user_role === 'provider' || claims.app_metadata?.user_role === 'consumer' || claims.app_metadata?.user_role === 'employee') {
          return claims.app_metadata.user_role;
        }
      }
    }
  } catch (err) {
    console.warn('[Evinzoo Auth] Could not decode user_role claim from access token:', err);
  }
  return 'consumer';
}

export function mapProfileToUser(
  profile: any,
  fallbackEmail?: string,
  providerDetails?: any,
  roleOverride?: UserRole
): User {
  // Authoritative role: roleOverride (from signed JWT) > fallback
  const role: UserRole = roleOverride || (profile.user_role as UserRole) || (profile.role as UserRole) || 'consumer';
  return {
    id: profile.id,
    userId: profile.user_id,
    name: profile.full_name || profile.name || 'Evinzoo Member',
    email: profile.email || fallbackEmail || '',
    phone: profile.phone || providerDetails?.business_phone || undefined,
    role,
    avatar:
      profile.avatar_url ||
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAZeCZZrDuM6Q8dGXTQoyXl6ezp52QPZDj0huU7FSxcccZCVAdCuAuRxjZODTZA64KdSccoTP_s1FXSiwijuKrF_gdeztARd1gY_N5PDE0C43N33HNeb-lgirya2mKSI41r9Pt1_HDcCnAU4s2l4AmoBESoeW2bs2b589_KUcQphQzPI0bRSBHohTtBJmvj3e0DWnyv7meijP8eqLtokF5ElUqmWDlYlSaPDiuVXNJB_uEH6TSN2_U',
    companyName: providerDetails?.business_name || profile.company_name || undefined,
    providerId:
      profile.provider_id ||
      (role === 'provider'
        ? profile.user_id
          ? profile.user_id.replace('USR-', 'PRV-')
          : `PRV-${profile.id.slice(0, 6).toUpperCase()}`
        : undefined),
    isLive: providerDetails ? Boolean(providerDetails.is_available) : Boolean(profile.is_live),
    providerDetails: providerDetails
      ? {
          profileId: profile.id,
          businessName: providerDetails.business_name || undefined,
          businessDescription: providerDetails.business_description || undefined,
          businessPhone: providerDetails.business_phone || undefined,
          businessEmail: providerDetails.business_email || undefined,
          kycStatus: providerDetails.kyc_status || 'verified',
          serviceability: providerDetails.serviceability || { latitude: 0.0, longitude: 0.0 },
          isAvailable: Boolean(providerDetails.is_available),
          createdAt: providerDetails.created_at,
          updatedAt: providerDetails.updated_at,
        }
      : undefined,
  };
}

export const authService = {
  // Local storage fallback helpers
  getMockAccounts(): User[] {
    localStorage.removeItem('eventlogix_registered_accounts');
    const raw = localStorage.getItem(STORAGE_KEY_ACCOUNTS);
    if (!raw) {
      return INITIAL_ACCOUNTS;
    }
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : INITIAL_ACCOUNTS;
    } catch {
      return INITIAL_ACCOUNTS;
    }
  },

  saveMockAccounts(accounts: User[]) {
    localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(accounts));
  },

  getMockSession(): User | null {
    localStorage.removeItem('eventlogix_current_session');
    const raw = localStorage.getItem(STORAGE_KEY_SESSION);
    if (!raw) return null;
    try {
      const session = JSON.parse(raw);
      if (
        !session ||
        session.email === 'client@evinzoo.com' ||
        session.name === 'Alex Rivera' ||
        session.email === 'sarah@eliteevents.com' ||
        session.name === 'Sarah Jenkins'
      ) {
        localStorage.removeItem(STORAGE_KEY_SESSION);
        return null;
      }
      return session;
    } catch {
      localStorage.removeItem(STORAGE_KEY_SESSION);
      return null;
    }
  },

  setMockSession(user: User | null) {
    if (!user) {
      localStorage.removeItem(STORAGE_KEY_SESSION);
    } else {
      localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(user));
    }
  },

  /**
   * Fast reverification of the authoritative user_role directly from the signed JWT access token.
   * Leverages Supabase's local cached session (no network overhead if session is valid).
   */
  async getVerifiedUserRole(): Promise<UserRole | null> {
    if (!isSupabaseConfigured) {
      const mock = this.getMockSession();
      return mock ? mock.role : null;
    }

    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error || !session?.user) {
        return null;
      }

      return extractUserRoleFromJwt(session);
    } catch (err) {
      console.warn('[Evinzoo Auth] Failed to verify JWT user_role:', err);
      return null;
    }
  },

  /**
   * Refreshes the active user model and re-validates JWT custom claims.
   */
  async refreshSessionUser(): Promise<User | null> {
    return this.getCurrentUser();
  },

  // 1. Initial Session Retrieval
  async getCurrentUser(): Promise<User | null> {
    if (!isSupabaseConfigured) {
      return this.getMockSession();
    }

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.user) {
        return null;
      }

      const userRole = extractUserRoleFromJwt(session);

      // Fetch profile from public.profiles
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profileError || !profile) {
        // Fallback to user metadata if profile trigger is processing
        return {
          id: session.user.id,
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Evinzoo Member',
          email: session.user.email || '',
          role: userRole,
          isLive: false,
          avatar:
            session.user.user_metadata?.avatar_url ||
            'https://lh3.googleusercontent.com/aida-public/AB6AXuAZeCZZrDuM6Q8dGXTQoyXl6ezp52QPZDj0huU7FSxcccZCVAdCuAuRxjZODTZA64KdSccoTP_s1FXSiwijuKrF_gdeztARd1gY_N5PDE0C43N33HNeb-lgirya2mKSI41r9Pt1_HDcCnAU4s2l4AmoBESoeW2bs2b589_KUcQphQzPI0bRSBHohTtBJmvj3e0DWnyv7meijP8eqLtokF5ElUqmWDlYlSaPDiuVXNJB_uEH6TSN2_U',
        };
      }

      let providerDetails = null;
      if (userRole === 'provider') {
        const { data: details } = await supabase
          .from('provider_details')
          .select('*')
          .eq('profile_id', profile.id)
          .maybeSingle();
        providerDetails = details;
      }

      return mapProfileToUser(profile, session.user.email, providerDetails, userRole);
    } catch (err) {
      console.error('[Evinzoo Auth] Failed to fetch current user session:', err);
      return null;
    }
  },

  // 2. Real Registration (All new users register as Consumer)
  async signup(name: string, email: string, password: string, phone?: string): Promise<User> {
    const normalizedEmail = email.trim().toLowerCase();
    if (!name.trim()) throw new Error('Please enter your full name.');
    if (!normalizedEmail || !normalizedEmail.includes('@')) throw new Error('Please enter a valid email address.');
    if (!password || password.length < 6) throw new Error('Password must be at least 6 characters long.');

    if (!isSupabaseConfigured) {
      const accounts = this.getMockAccounts();
      const existing = accounts.find((u) => u.email.toLowerCase() === normalizedEmail);
      if (existing) {
        throw new Error('An account with this email address already exists. Please sign in instead.');
      }
      const newUser: User = {
        id: `usr-${Date.now()}`,
        userId: `USR-${Math.floor(100000 + Math.random() * 900000)}`,
        name: name.trim(),
        email: normalizedEmail,
        phone: phone?.trim(),
        password: password,
        role: 'consumer',
        isLive: false,
        avatar:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuAZeCZZrDuM6Q8dGXTQoyXl6ezp52QPZDj0huU7FSxcccZCVAdCuAuRxjZODTZA64KdSccoTP_s1FXSiwijuKrF_gdeztARd1gY_N5PDE0C43N33HNeb-lgirya2mKSI41r9Pt1_HDcCnAU4s2l4AmoBESoeW2bs2b589_KUcQphQzPI0bRSBHohTtBJmvj3e0DWnyv7meijP8eqLtokF5ElUqmWDlYlSaPDiuVXNJB_uEH6TSN2_U',
      };
      accounts.push(newUser);
      this.saveMockAccounts(accounts);
      this.setMockSession(newUser);
      return newUser;
    }

    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password: password,
      options: {
        data: {
          full_name: name.trim(),
          phone: phone?.trim() || null,
        },
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error('Registration failed. Please check your details and try again.');
    }

    // Try fetching the created profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profile) {
      return mapProfileToUser(profile, data.user.email, null, 'consumer');
    }

    return {
      id: data.user.id,
      name: name.trim(),
      email: normalizedEmail,
      role: 'consumer',
      isLive: false,
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAZeCZZrDuM6Q8dGXTQoyXl6ezp52QPZDj0huU7FSxcccZCVAdCuAuRxjZODTZA64KdSccoTP_s1FXSiwijuKrF_gdeztARd1gY_N5PDE0C43N33HNeb-lgirya2mKSI41r9Pt1_HDcCnAU4s2l4AmoBESoeW2bs2b589_KUcQphQzPI0bRSBHohTtBJmvj3e0DWnyv7meijP8eqLtokF5ElUqmWDlYlSaPDiuVXNJB_uEH6TSN2_U',
    };
  },

  // 3. Real Login
  async login(email: string, password: string): Promise<User> {
    const normalizedEmail = email.trim().toLowerCase();

    if (!isSupabaseConfigured) {
      const accounts = this.getMockAccounts();
      const match = accounts.find(
        (u) => u.email.toLowerCase() === normalizedEmail && u.password === password
      );
      if (!match) {
        throw new Error('Invalid email or password. Please verify your credentials.');
      }
      this.setMockSession(match);
      return match;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password: password,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error('Login failed. Please verify your credentials.');
    }

    const userRole = extractUserRoleFromJwt(data.session);

    // Fetch user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError || !profile) {
      return {
        id: data.user.id,
        name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'Evinzoo Member',
        email: data.user.email || normalizedEmail,
        role: userRole,
        isLive: false,
        avatar:
          data.user.user_metadata?.avatar_url ||
          'https://lh3.googleusercontent.com/aida-public/AB6AXuAZeCZZrDuM6Q8dGXTQoyXl6ezp52QPZDj0huU7FSxcccZCVAdCuAuRxjZODTZA64KdSccoTP_s1FXSiwijuKrF_gdeztARd1gY_N5PDE0C43N33HNeb-lgirya2mKSI41r9Pt1_HDcCnAU4s2l4AmoBESoeW2bs2b589_KUcQphQzPI0bRSBHohTtBJmvj3e0DWnyv7meijP8eqLtokF5ElUqmWDlYlSaPDiuVXNJB_uEH6TSN2_U',
      };
    }

    let providerDetails = null;
    if (userRole === 'provider') {
      const { data: details } = await supabase
        .from('provider_details')
        .select('*')
        .eq('profile_id', profile.id)
        .maybeSingle();
      providerDetails = details;
    }

    return mapProfileToUser(profile, data.user.email, providerDetails, userRole);
  },

  // 4. Real Sign Out
  async logout(): Promise<void> {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    this.setMockSession(null);
  },

  // 5. Auth State Change Listener
  onAuthStateChange(callback: (user: User | null) => void) {
    if (!isSupabaseConfigured) {
      return { unsubscribe: () => {} };
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session?.user) {
        callback(null);
        return;
      }

      const userRole = extractUserRoleFromJwt(session);

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profile) {
        let providerDetails = null;
        if (userRole === 'provider') {
          const { data: details } = await supabase
            .from('provider_details')
            .select('*')
            .eq('profile_id', profile.id)
            .maybeSingle();
          providerDetails = details;
        }
        callback(mapProfileToUser(profile, session.user.email, providerDetails, userRole));
      } else {
        callback({
          id: session.user.id,
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Evinzoo Member',
          email: session.user.email || '',
          role: userRole,
          isLive: false,
          avatar:
            session.user.user_metadata?.avatar_url ||
            'https://lh3.googleusercontent.com/aida-public/AB6AXuAZeCZZrDuM6Q8dGXTQoyXl6ezp52QPZDj0huU7FSxcccZCVAdCuAuRxjZODTZA64KdSccoTP_s1FXSiwijuKrF_gdeztARd1gY_N5PDE0C43N33HNeb-lgirya2mKSI41r9Pt1_HDcCnAU4s2l4AmoBESoeW2bs2b589_KUcQphQzPI0bRSBHohTtBJmvj3e0DWnyv7meijP8eqLtokF5ElUqmWDlYlSaPDiuVXNJB_uEH6TSN2_U',
        });
      }
    });

    return {
      unsubscribe: () => subscription.unsubscribe(),
    };
  },

  // 6. Provider Application Mock Transition (Phase 2 will migrate this to provider_applications table)
  async applyToBeProvider(
    userId: string,
    appData: {
      businessName: string;
      category: 'Catering' | 'Transport' | 'Staging & AV' | 'Security';
      city: string;
      phone: string;
      description: string;
      licenseNumber: string;
    }
  ): Promise<User> {
    if (isSupabaseConfigured) {
      const { data: updatedProfile, error } = await supabase
        .from('profiles')
        .update({
          phone: appData.phone,
        })
        .eq('id', userId)
        .select()
        .single();

      if (!error && updatedProfile) {
        return mapProfileToUser(updatedProfile, undefined, undefined, 'provider');
      }
    }

    const accounts = this.getMockAccounts();
    const idx = accounts.findIndex((u) => u.id === userId);
    const now = new Date().toISOString();
    const providerApp: ProviderApplication = {
      id: `app-${Date.now()}`,
      profileId: userId,
      businessName: appData.businessName,
      businessDescription: appData.description,
      businessPhone: appData.phone,
      kycStatus: 'verified',
      status: 'approved',
      statusHistory: [{ status: 'approved', timestamp: now }],
      submittedAt: now,
    };

    const newProviderId = Math.floor(1000 + Math.random() * 9000).toString();
    const updatedUser: User = {
      ...(idx !== -1 ? accounts[idx] : { id: userId, email: '', name: '', avatar: '' }),
      role: 'provider',
      companyName: appData.businessName,
      providerId: newProviderId,
      isLive: true,
      providerApplication: providerApp,
    };

    if (idx !== -1) {
      accounts[idx] = updatedUser;
      this.saveMockAccounts(accounts);
    }
    this.setMockSession(updatedUser);
    return updatedUser;
  },

  // 7. Update User Profile
  async updateUser(user: User): Promise<User> {
    if (isSupabaseConfigured) {
      const { data: updated, error } = await supabase
        .from('profiles')
        .update({
          full_name: user.name,
          phone: user.phone,
          avatar_url: user.avatar,
        })
        .eq('id', user.id)
        .select()
        .single();

      if (user.role === 'provider' && (user.companyName !== undefined || user.isLive !== undefined)) {
        await supabase
          .from('provider_details')
          .update({
            ...(user.companyName !== undefined ? { business_name: user.companyName } : {}),
            ...(user.isLive !== undefined ? { is_available: user.isLive } : {}),
            updated_at: new Date().toISOString(),
          })
          .eq('profile_id', user.id);
      }

      if (!error && updated) {
        return mapProfileToUser(updated, user.email, user.providerDetails, user.role);
      }
    }

    const accounts = this.getMockAccounts();
    const idx = accounts.findIndex((u) => u.id === user.id);
    if (idx !== -1) {
      accounts[idx] = user;
      this.saveMockAccounts(accounts);
    }
    this.setMockSession(user);
    return user;
  },
};
