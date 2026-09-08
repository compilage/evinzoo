import { ProviderApplication, ProviderDetails } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const STORAGE_KEY_APPLICATIONS = 'evinzoo_provider_applications';
const STORAGE_KEY_PROVIDER_DETAILS = 'evinzoo_provider_details';

function mapDbToApplication(row: any): ProviderApplication {
  return {
    id: row.id,
    profileId: row.profile_id,
    businessName: row.business_name || undefined,
    businessDescription: row.business_description || undefined,
    businessPhone: row.business_phone || undefined,
    businessEmail: row.business_email || undefined,
    kycStatus: row.kyc_status || 'pending',
    status: row.status || 'submitted',
    statusHistory: Array.isArray(row.status_history) ? row.status_history : [],
    submittedAt: row.submitted_at || row.created_at || new Date().toISOString(),
    reviewedAt: row.reviewed_at || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapDbToProviderDetails(row: any): ProviderDetails {
  return {
    profileId: row.profile_id,
    businessName: row.business_name || undefined,
    businessDescription: row.business_description || undefined,
    businessPhone: row.business_phone || undefined,
    businessEmail: row.business_email || undefined,
    kycStatus: row.kyc_status || 'pending',
    serviceability: row.serviceability || { latitude: 0.0, longitude: 0.0 },
    isAvailable: Boolean(row.is_available),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const providerService = {
  // Local storage mock helpers
  getMockApplications(): ProviderApplication[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_APPLICATIONS);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  saveMockApplications(apps: ProviderApplication[]) {
    localStorage.setItem(STORAGE_KEY_APPLICATIONS, JSON.stringify(apps));
  },

  getMockProviderDetailsList(): ProviderDetails[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_PROVIDER_DETAILS);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  saveMockProviderDetailsList(details: ProviderDetails[]) {
    localStorage.setItem(STORAGE_KEY_PROVIDER_DETAILS, JSON.stringify(details));
  },

  // 1. Submit a Provider Application (Section 4)
  async submitApplication(
    profileId: string,
    data: {
      businessName?: string;
      businessDescription?: string;
      businessPhone?: string;
      businessEmail?: string;
    }
  ): Promise<ProviderApplication> {
    const now = new Date().toISOString();
    const initialHistory = [{ status: 'submitted', timestamp: now }];

    if (isSupabaseConfigured) {
      const { data: created, error } = await supabase
        .from('provider_applications')
        .insert({
          profile_id: profileId,
          business_name: data.businessName?.trim() || null,
          business_description: data.businessDescription?.trim() || null,
          business_phone: data.businessPhone?.trim() || null,
          business_email: data.businessEmail?.trim() || null,
          kyc_status: 'pending',
          status: 'submitted',
          status_history: initialHistory,
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return mapDbToApplication(created);
    }

    // Mock mode fallback
    const apps = this.getMockApplications();
    const newApp: ProviderApplication = {
      id: `app-${Date.now()}`,
      profileId,
      businessName: data.businessName?.trim() || undefined,
      businessDescription: data.businessDescription?.trim() || undefined,
      businessPhone: data.businessPhone?.trim() || undefined,
      businessEmail: data.businessEmail?.trim() || undefined,
      kycStatus: 'pending',
      status: 'submitted',
      statusHistory: initialHistory as any,
      submittedAt: now,
      createdAt: now,
      updatedAt: now,
    };
    apps.unshift(newApp);
    this.saveMockApplications(apps);
    return newApp;
  },

  // 2. Fetch User's Application
  async getMyApplication(profileId: string): Promise<ProviderApplication | null> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('provider_applications')
        .select('*')
        .eq('profile_id', profileId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error || !data) {
        return null;
      }
      return mapDbToApplication(data);
    }

    const apps = this.getMockApplications();
    return apps.find((a) => a.profileId === profileId) || null;
  },

  // 3. Fetch Provider Operational Details (Section 5)
  async getProviderDetails(profileId: string): Promise<ProviderDetails | null> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('provider_details')
        .select('*')
        .eq('profile_id', profileId)
        .maybeSingle();

      if (error || !data) {
        return null;
      }
      return mapDbToProviderDetails(data);
    }

    const list = this.getMockProviderDetailsList();
    return list.find((d) => d.profileId === profileId) || null;
  },

  // 4. Update Provider Details
  async updateProviderDetails(
    profileId: string,
    updates: Partial<ProviderDetails>
  ): Promise<ProviderDetails | null> {
    if (isSupabaseConfigured) {
      const dbUpdates: any = { updated_at: new Date().toISOString() };
      if ('businessName' in updates) dbUpdates.business_name = updates.businessName?.trim() || null;
      if ('businessDescription' in updates) dbUpdates.business_description = updates.businessDescription?.trim() || null;
      if ('businessPhone' in updates) dbUpdates.business_phone = updates.businessPhone?.trim() || null;
      if ('businessEmail' in updates) dbUpdates.business_email = updates.businessEmail?.trim() || null;
      if ('isAvailable' in updates) dbUpdates.is_available = updates.isAvailable;
      if ('serviceability' in updates) dbUpdates.serviceability = updates.serviceability;

      const { data, error } = await supabase
        .from('provider_details')
        .update(dbUpdates)
        .eq('profile_id', profileId)
        .select()
        .single();

      if (error || !data) {
        return null;
      }
      return mapDbToProviderDetails(data);
    }

    const list = this.getMockProviderDetailsList();
    const idx = list.findIndex((d) => d.profileId === profileId);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updates, updatedAt: new Date().toISOString() };
      this.saveMockProviderDetailsList(list);
      return list[idx];
    }
    return null;
  },

  // 5. Toggle Provider Availability
  async toggleAvailability(profileId: string, isAvailable: boolean): Promise<boolean> {
    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('provider_details')
        .update({
          is_available: isAvailable,
          updated_at: new Date().toISOString(),
        })
        .eq('profile_id', profileId);

      return !error;
    }

    const list = this.getMockProviderDetailsList();
    const idx = list.findIndex((d) => d.profileId === profileId);
    if (idx !== -1) {
      list[idx].isAvailable = isAvailable;
      list[idx].updatedAt = new Date().toISOString();
      this.saveMockProviderDetailsList(list);
      return true;
    }
    return false;
  },

  // 6. Admin / Verifier Approval Execution (Calls the transactional approve_provider_application function)
  async simulateAdminApproval(appId: string): Promise<boolean> {
    if (isSupabaseConfigured) {
      const { error } = await supabase.rpc('approve_provider_application', { app_id: appId });
      return !error;
    }

    // Mock fallback
    const apps = this.getMockApplications();
    const app = apps.find((a) => a.id === appId);
    if (!app) return false;

    const now = new Date().toISOString();
    app.status = 'approved';
    app.kycStatus = 'verified';
    app.reviewedAt = now;
    app.statusHistory.push({ status: 'approved', timestamp: now });
    this.saveMockApplications(apps);

    const list = this.getMockProviderDetailsList();
    const existingIdx = list.findIndex((d) => d.profileId === app.profileId);
    const newDetails: ProviderDetails = {
      profileId: app.profileId,
      businessName: app.businessName,
      businessDescription: app.businessDescription,
      businessPhone: app.businessPhone,
      businessEmail: app.businessEmail,
      kycStatus: 'verified',
      serviceability: { latitude: 0.0, longitude: 0.0 },
      isAvailable: true,
      createdAt: now,
      updatedAt: now,
    };

    if (existingIdx !== -1) {
      list[existingIdx] = newDetails;
    } else {
      list.push(newDetails);
    }
    this.saveMockProviderDetailsList(list);
    return true;
  },
};
