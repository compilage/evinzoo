export type PageRoute =
  | 'landing'
  | 'marketplace'
  | 'dashboard'
  | 'bookings'
  | 'services'
  | 'account'
  | 'login'
  | 'signup'
  | 'join-provider-network'
  | 'notifications';

export type UserRole = 'consumer' | 'provider';

export type ProviderApplicationStatus = 'submitted' | 'reviewed' | 'approved' | 'rejected';
export type KycStatus = 'pending' | 'verified' | 'rejected';

export interface ProviderApplication {
  id: string;
  profileId: string;
  businessName?: string; // nullable in DB
  businessDescription?: string;
  businessPhone?: string;
  businessEmail?: string;
  kycStatus: KycStatus;
  status: ProviderApplicationStatus;
  statusHistory: Array<{ status: ProviderApplicationStatus; timestamp: string }>;
  submittedAt: string;
  reviewedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProviderDetails {
  profileId: string;
  businessName?: string; // nullable in DB
  businessDescription?: string;
  businessPhone?: string;
  businessEmail?: string;
  kycStatus: KycStatus;
  serviceability: { latitude: number; longitude: number };
  isAvailable: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id: string;          // internal UUID (auth.users.id)
  userId?: string;     // public-facing unique identifier (e.g. USR-8K4P2M)
  name: string;        // full_name in profiles table
  email: string;
  phone?: string;
  password?: string;
  role: UserRole;      // 'consumer' | 'provider'
  companyName?: string; // Loaded from provider_details.business_name or fallback
  providerId?: string;
  providerApplication?: ProviderApplication;
  providerDetails?: ProviderDetails;
  isLive: boolean;
  avatar: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  category: 'Catering' | 'Transport' | 'Staging & AV' | 'Security';
  price: number;
  priceUnit: string;
  image: string;
  status: 'Active' | 'Draft';
  rating?: number;
}

export interface Booking {
  id: string;
  code: string;
  serviceTitle: string;
  clientName: string;
  clientType: 'business' | 'person';
  date: string;
  time?: string;
  value: number;
  status: 'Pending' | 'Confirmed' | 'In-Progress' | 'Cancelled';
  notes?: string;
  avatar?: string;
}

export interface Activity {
  id: string;
  title: string;
  subtitle: string;
  time: string;
  type: 'booking' | 'payment' | 'cancel';
  amount?: number;
}

export interface Provider {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviewsCount?: number;
  description: string;
  startingPrice: number;
  priceUnit: string;
  image: string;
  available: boolean;
}
