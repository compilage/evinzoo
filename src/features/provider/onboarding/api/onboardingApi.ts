import { providerService } from '../../../../services/providerService';
import { ProviderApplication } from '../../../../types';

export const onboardingApi = {
  async getMyApplication(profileId: string): Promise<ProviderApplication | null> {
    return providerService.getMyApplication(profileId);
  },

  async submitApplication(
    profileId: string,
    data: {
      businessName?: string;
      businessDescription?: string;
      businessPhone?: string;
      businessEmail?: string;
    }
  ): Promise<ProviderApplication> {
    return providerService.submitApplication(profileId, data);
  },

  async simulateAdminApproval(appId: string): Promise<boolean> {
    return providerService.simulateAdminApproval(appId);
  },
};
