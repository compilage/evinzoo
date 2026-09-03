export type PageRoute =
  | 'landing'
  | 'marketplace'
  | 'dashboard'
  | 'bookings'
  | 'services'
  | 'account'
  | 'login'
  | 'signup'
  | 'apply-provider'
  | 'notifications';

export type UserRole = 'client' | 'provider';

export interface ProviderApplication {
  businessName: string;
  category: 'Catering' | 'Transport' | 'Staging & AV' | 'Security';
  city: string;
  phone: string;
  description: string;
  licenseNumber: string;
  status: 'none' | 'pending' | 'approved';
  appliedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  companyName?: string;
  providerId?: string;
  providerApplication?: ProviderApplication;
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
