import { Booking, Service, Provider, Activity, User } from '../types';

export const INITIAL_USER: User = {
  id: 'user-provider-1',
  name: 'Sarah Jenkins',
  email: 'sarah.jenkins@eliteevents.com',
  role: 'provider',
  companyName: 'Elite Events Co.',
  providerId: '8842',
  isLive: true,
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAtlxnZgm7Z1lflDZVDkOKW9n1QJCcEt5715Ny_GRutOl6KDaUIE4V7FLAJatybLk8snhqSE9-3blgzKISuAFPqiBXdOEQrmIivTZNNfNtA0N8pL1vcIbUMZUrIGk1z_Y9qBDricivwS2fTE6RGftsxdcjJWHwq7hIfLd03LPG6mHTwlm-OoLXeLksg2Z1JChLWUuUPNoOcdyX1LP4ouqwwrtBHdEjgOmpZ_YawqqMBJllnL0xzzVQ'
};

export const INITIAL_PROVIDERS: Provider[] = [
  {
    id: 'prov-1',
    name: 'Elite Corporate Catering',
    category: 'Catering',
    rating: 4.9,
    reviewsCount: 142,
    description: 'Premium full-service catering for corporate events, galas, and conferences. Dedicated culinary team and servers included.',
    startingPrice: 45,
    priceUnit: '/hd',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvlvL1J_XynMp5hzx3m1k2ztRRnaPw6p6SrHbZHXa_g0b1eOgY6dOpjdM63bQXEe6aKYUB-bExuoEyAHRTiAL9cKR50Zdk2ECjvo7PKgFs9rwpVdJiwTqkCSirlmzS2bBb5L65K2D8Pp0yql_7hwAs1IBtUmd41KEAHcZCH6nUkgPp9MxaHTBjK0tmd4cC2FQxKo8KqiHkFphZsLm6eZAcAXrab-mi9PKrmymDQ0rJ214dYa3IIPU',
    available: true
  },
  {
    id: 'prov-2',
    name: 'Prestige Executive Transport',
    category: 'Transport',
    rating: 4.8,
    reviewsCount: 98,
    description: 'Fleet of luxury sprinters, executive sedans, and high-capacity guest shuttles. Reliable logistics for VIP guests.',
    startingPrice: 150,
    priceUnit: '/hr',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgUN7l-85TQY5nvpBKT8zlRaOBUyJI4GuykdlYoDPTL3ckkD_gkrojro5qGfg1S4CEh3zggD1nVENDKAGviyy1Qy2FMLt9UoU3_T7VZRHaQMhzaZhlIOc7VhrFJXpnrpXvunCLT_DxXJNHahQWaa1QiJ_J_03OiZlBz9k_MEbzrEVLC1Qp1y0udTykl5A7l73wSje_h9cXfqoSMOapZcUmBuoEdPuKDh2Hvmc4yGEzHJqpSPnPCnE',
    available: true
  },
  {
    id: 'prov-3',
    name: 'SonicSight Pro AV & Staging',
    category: 'Staging & AV',
    rating: 5.0,
    reviewsCount: 64,
    description: 'Complete staging, concert sound systems, dynamic LED walls, and directional lighting solutions for conferences and keynotes.',
    startingPrice: 1200,
    priceUnit: '/day',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCl5TlzF7M0VIES_0a33_BWwpc6fSkCTBlz269ARhe4G-0wTJKsFl0py11Jc4B4Aa-dsffwnJbbMX_xOfyEhlCo5wb67HUWR-4oSREjfVDxE6h0GdS04GUlM0yXf0zCHzyVHdF8qVKAbWr-ck45-G6kM84q0EtRYVTW2eDFruraJH61hXFZakQGFYKVY7oggycnHbwgnwCCp2NLVIFJHIXpHGzIBbS42puV0-YCgeyACnhG0oqEURc',
    available: true
  },
  {
    id: 'prov-4',
    name: 'Vanguard Event Security',
    category: 'Security',
    rating: 4.9,
    reviewsCount: 79,
    description: 'Licensed professional crowd control, VIP executive close protection, and credential checkpoint management.',
    startingPrice: 65,
    priceUnit: '/hr',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZeCZZrDuM6Q8dGXTQoyXl6ezp52QPZDj0huU7FSxcccZCVAdCuAuRxjZODTZA64KdSccoTP_s1FXSiwijuKrF_gdeztARd1gY_N5PDE0C43N33HNeb-lgirya2mKSI41r9Pt1_HDcCnAU4s2l4AmoBESoeW2bs2b589_KUcQphQzPI0bRSBHohTtBJmvj3e0DWnyv7meijP8eqLtokF5ElUqmWDlYlSaPDiuVXNJB_uEH6TSN2_U',
    available: true
  }
];

export const INITIAL_SERVICES: Service[] = [
  {
    id: 'srv-1',
    title: 'Premium Catering Package',
    description: 'Full service fine dining for 50-200 guests with custom menu design and waitstaff.',
    category: 'Catering',
    price: 1200,
    priceUnit: '/ event',
    status: 'Active',
    rating: 4.9,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCwYMH9HcB6mFz7ZRYtgmV1JmxbIzCmViZz86FbPKw28KaNA1wEbtch1niqViQu04Y-9WSl0A67Hq4ff4j5c3kK8JHQjsqOpV_J1XyG52yJG_CUXNqLmo03KEv8TQXDX3nEHviG4J5dzbTlRThgbrgjG1iQL0rj1Z1dqJukUolf17tKQ3DL9giG46LVXFZKqEFtY4rrSZxtUIHK2jZmMn1z5nh7v6BUt2ZOfkRKFzeGRtusNy155SI'
  },
  {
    id: 'srv-2',
    title: 'Executive Transport Fleet',
    description: 'Luxury SUV and executive sprinter logistics for VIP attendees and keynote speakers.',
    category: 'Transport',
    price: 450,
    priceUnit: '/ day',
    status: 'Active',
    rating: 4.8,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnwlEPWTTenp0R411729y3gkcz-MPc6XvhN5RqmkKdhDHfcJR4OGHUubfOi8I5jA7ONnUPkU1CpNoZtZdZWhA4H6wHBy_45-4eGIZhcjqccsaFWupUoT21Ml0QP1rAQjFxJSzl-zwRCE8KHleoLx_LUZDg1f4EVdVy-5-kFkOtCu9hbfsPsfWG1-g8LdbhfIhU27VvO-WBv4iCo3hK_Ukbc6GhR84KuwLyGxprdw7_WawPWr3k74o'
  },
  {
    id: 'srv-3',
    title: 'A/V Stage Setup Basic',
    description: 'Wireless microphones, crystal clear digital PA audio, and ambient stage spotlighting.',
    category: 'Staging & AV',
    price: 300,
    priceUnit: '/ event',
    status: 'Draft',
    rating: 4.6,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBt_gvVt9Et_WGbvrSCDaqXLjXVEguhw85VmgoFhrGoPldHj8Ym5BzRApkK6aqyO39fXhvplfRLPmgETWQkzeQvlK7WPk4f5cxJLpLCS9iRfDNJQkKMkdxEpDek3e-q5FvzbusW5TY7RFT7sYcUYpg5GStXsASj-iaDqz4IGo2wGuHue2oAGejAor_T0_euqar7PHjM24SEgLEzHLXw67yjXxWOkIff2RIgchwM9wwXsyBvo6w4T1o'
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'bk-1',
    code: '#BK-9921-A',
    serviceTitle: 'Tech Summit Catering',
    clientName: 'Innovate Corp',
    clientType: 'business',
    date: 'Oct 24, 2024',
    time: 'Today, 2:30 PM',
    value: 4500.0,
    status: 'Pending',
    notes: 'Requires vegetarian and gluten-free dedicated stations.',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBOcZgG2JOF2Sxk2Ya_cXByD290B3aFa3bws1iDKAiiBu8OSr59JN7PPEf42XmRt3E8I9LP4OALjqnwwZ8abT7e1Y2oEGp2HbMpTQRAIR0riWM2ua281oTa679CmEhMttfSIB7Ap2eKxhdCy8qVp9CwEZVkhfWampQutjlNxTN64mfkAAubeASN1d4Yb-DyfFvjxbKYrCtvZGAiAFs_cxnSv123f16yAJq3Oh31G-fm6BZVXSdqXBs'
  },
  {
    id: 'bk-2',
    code: '#BK-9844-C',
    serviceTitle: 'Gala Equipment Hire',
    clientName: 'Sarah Jenkins',
    clientType: 'person',
    date: 'Nov 12, 2024',
    time: 'Tomorrow, 10:00 AM',
    value: 1250.0,
    status: 'Confirmed',
    notes: 'Lighting trusses and 4 wireless lapel mics.',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCoc1wxyarZVisRm_PFHzJuOBElnxfymTBNSbB8xo08TpYwU7vlBreMPmBol1J36MWauH_HsZEudBfzawBf-JILqMtHfpExMlhA_Awf84K8b-GPBF_ngKwze_yIVfvKUjm3c_MoAWM-Cf4ZWJfObV0MzPUW9F9d-tEY_zpspC_TWwwJhJlN-7HEY85uTtL8JeZuTMTxl7uPA3mFFF0sFxjVWoGRiQg0lq__qG6jkQ-04m_tVSKghxM'
  },
  {
    id: 'bk-3',
    code: '#BK-9710-F',
    serviceTitle: 'Stage Lighting Setup',
    clientName: 'SoundWave Prod',
    clientType: 'business',
    date: 'Oct 18, 2024',
    time: 'Oct 18, 6:00 PM',
    value: 3800.0,
    status: 'Confirmed',
    notes: 'Indoor ballroom stage setup with motorized rigging.'
  },
  {
    id: 'bk-4',
    code: '#BK-9650-B',
    serviceTitle: 'VIP Executive Fleet Shuttle',
    clientName: 'Global Capital Partners',
    clientType: 'business',
    date: 'Oct 28, 2024',
    time: 'Oct 28, 8:00 AM',
    value: 2600.0,
    status: 'In-Progress',
    notes: '3 Black Mercedes Sprinters from Airport to Convention Center.'
  }
];

export const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: 'act-1',
    title: 'New booking from Emily Rose',
    subtitle: 'Standard Consultation scheduled for Friday',
    time: '2:45 PM',
    type: 'booking'
  },
  {
    id: 'act-2',
    title: 'Payment received: $450.00',
    subtitle: 'Invoice #INV-2041 • Michael Chen',
    time: '11:30 AM',
    type: 'payment',
    amount: 450
  },
  {
    id: 'act-3',
    title: 'Canceled: Marcus Aurelius',
    subtitle: 'Strategy Session canceled by client',
    time: 'Yesterday',
    type: 'cancel'
  }
];

// LocalStorage helpers
const STORAGE_KEYS = {
  SERVICES: 'evinzoo_services',
  BOOKINGS: 'evinzoo_bookings',
  USER: 'evinzoo_user',
  PROVIDERS: 'evinzoo_providers'
};

export const storage = {
  getServices(): Service[] {
    const raw = localStorage.getItem(STORAGE_KEYS.SERVICES) || localStorage.getItem('eventlogix_services');
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(INITIAL_SERVICES));
      return INITIAL_SERVICES;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_SERVICES;
    }
  },
  saveServices(services: Service[]) {
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
  },

  getBookings(): Booking[] {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKINGS) || localStorage.getItem('eventlogix_bookings');
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
      return INITIAL_BOOKINGS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_BOOKINGS;
    }
  },
  saveBookings(bookings: Booking[]) {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  },

  getUser(): User {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(INITIAL_USER));
      return INITIAL_USER;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_USER;
    }
  },
  saveUser(user: User) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }
};
