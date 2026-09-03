import { ProviderApplication, User } from '../types';

const STORAGE_KEY_ACCOUNTS = 'eventlogix_registered_accounts';
const STORAGE_KEY_SESSION = 'eventlogix_current_session';

const INITIAL_ACCOUNTS: User[] = [
  {
    id: 'user-consumer-1',
    name: 'Alex Rivera',
    email: 'client@eventlogix.com',
    password: 'password123',
    role: 'client',
    isLive: false,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZeCZZrDuM6Q8dGXTQoyXl6ezp52QPZDj0huU7FSxcccZCVAdCuAuRxjZODTZA64KdSccoTP_s1FXSiwijuKrF_gdeztARd1gY_N5PDE0C43N33HNeb-lgirya2mKSI41r9Pt1_HDcCnAU4s2l4AmoBESoeW2bs2b589_KUcQphQzPI0bRSBHohTtBJmvj3e0DWnyv7meijP8eqLtokF5ElUqmWDlYlSaPDiuVXNJB_uEH6TSN2_U',
  },
  {
    id: 'user-provider-1',
    name: 'Sarah Jenkins',
    email: 'sarah@eliteevents.com',
    password: 'password123',
    role: 'provider',
    companyName: 'Elite Events Co.',
    providerId: '8842',
    isLive: true,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAtlxnZgm7Z1lflDZVDkOKW9n1QJCcEt5715Ny_GRutOl6KDaUIE4V7FLAJatybLk8snhqSE9-3blgzKISuAFPqiBXdOEQrmIivTZNNfNtA0N8pL1vcIbUMZUrIGk1z_Y9qBDricivwS2fTE6RGftsxdcjJWHwq7hIfLd03LPG6mHTwlm-OoLXeLksg2Z1JChLWUuUPNoOcdyX1LP4ouqwwrtBHdEjgOmpZ_YawqqMBJllnL0xzzVQ',
    providerApplication: {
      businessName: 'Elite Events Co.',
      category: 'Catering',
      city: 'San Francisco, CA',
      phone: '+1 (415) 555-0192',
      description: 'Full-scale enterprise catering and VIP banquet operations.',
      licenseNumber: 'LIC-CA-884291',
      status: 'approved',
      appliedAt: '2024-08-15',
    },
  },
];

export const authService = {
  getAccounts(): User[] {
    const raw = localStorage.getItem(STORAGE_KEY_ACCOUNTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(INITIAL_ACCOUNTS));
      return INITIAL_ACCOUNTS;
    }
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : INITIAL_ACCOUNTS;
    } catch {
      return INITIAL_ACCOUNTS;
    }
  },

  saveAccounts(accounts: User[]) {
    localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(accounts));
  },

  getCurrentUser(): User | null {
    const raw = localStorage.getItem(STORAGE_KEY_SESSION);
    if (!raw) {
      // Default to initial provider so user can immediately experience the app, or null
      return null;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  setCurrentUser(user: User | null) {
    if (!user) {
      localStorage.removeItem(STORAGE_KEY_SESSION);
    } else {
      localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(user));
    }
  },

  signup(name: string, email: string, password: string): User {
    const normalizedEmail = email.trim().toLowerCase();
    if (!name.trim()) throw new Error('Please enter your full name.');
    if (!normalizedEmail || !normalizedEmail.includes('@')) throw new Error('Please enter a valid email address.');
    if (!password || password.length < 6) throw new Error('Password must be at least 6 characters long.');

    const accounts = this.getAccounts();
    const existing = accounts.find((u) => u.email.toLowerCase() === normalizedEmail);
    if (existing) {
      throw new Error('An account with this email address already exists. Please sign in instead.');
    }

    const defaultAvatars = [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAZeCZZrDuM6Q8dGXTQoyXl6ezp52QPZDj0huU7FSxcccZCVAdCuAuRxjZODTZA64KdSccoTP_s1FXSiwijuKrF_gdeztARd1gY_N5PDE0C43N33HNeb-lgirya2mKSI41r9Pt1_HDcCnAU4s2l4AmoBESoeW2bs2b589_KUcQphQzPI0bRSBHohTtBJmvj3e0DWnyv7meijP8eqLtokF5ElUqmWDlYlSaPDiuVXNJB_uEH6TSN2_U',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBOcZgG2JOF2Sxk2Ya_cXByD290B3aFa3bws1iDKAiiBu8OSr59JN7PPEf42XmRt3E8I9LP4OALjqnwwZ8abT7e1Y2oEGp2HbMpTQRAIR0riWM2ua281oTa679CmEhMttfSIB7Ap2eKxhdCy8qVp9CwEZVkhfWampQutjlNxTN64mfkAAubeASN1d4Yb-DyfFvjxbKYrCtvZGAiAFs_cxnSv123f16yAJq3Oh31G-fm6BZVXSdqXBs',
    ];

    // Every new user ALWAYS starts as a consumer / client
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: normalizedEmail,
      password: password,
      role: 'client',
      isLive: false,
      avatar: defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)],
    };

    accounts.push(newUser);
    this.saveAccounts(accounts);
    this.setCurrentUser(newUser);
    return newUser;
  },

  login(email: string, password: string): User {
    const normalizedEmail = email.trim().toLowerCase();
    const accounts = this.getAccounts();
    const match = accounts.find(
      (u) => u.email.toLowerCase() === normalizedEmail && u.password === password
    );

    if (!match) {
      throw new Error('Invalid email or password. Please verify your credentials.');
    }

    this.setCurrentUser(match);
    return match;
  },

  logout() {
    this.setCurrentUser(null);
  },

  applyToBeProvider(
    userId: string,
    appData: {
      businessName: string;
      category: 'Catering' | 'Transport' | 'Staging & AV' | 'Security';
      city: string;
      phone: string;
      description: string;
      licenseNumber: string;
    }
  ): User {
    const accounts = this.getAccounts();
    const idx = accounts.findIndex((u) => u.id === userId);
    if (idx === -1) throw new Error('User account not found.');

    const newProviderId = Math.floor(1000 + Math.random() * 9000).toString();
    const providerApp: ProviderApplication = {
      ...appData,
      status: 'approved',
      appliedAt: new Date().toISOString().split('T')[0],
    };

    const updatedUser: User = {
      ...accounts[idx],
      role: 'provider',
      companyName: appData.businessName,
      providerId: newProviderId,
      isLive: true,
      providerApplication: providerApp,
    };

    accounts[idx] = updatedUser;
    this.saveAccounts(accounts);
    this.setCurrentUser(updatedUser);
    return updatedUser;
  },

  updateUser(user: User): User {
    const accounts = this.getAccounts();
    const idx = accounts.findIndex((u) => u.id === user.id);
    if (idx !== -1) {
      accounts[idx] = user;
      this.saveAccounts(accounts);
    }
    this.setCurrentUser(user);
    return user;
  },
};
