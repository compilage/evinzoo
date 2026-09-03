import React, { useState } from 'react';
import { PageRoute, Service, User } from '../types';
import { authService } from '../services/authService';

interface ProviderApplicationPageProps {
  user: User | null;
  setCurrentRoute: (route: PageRoute) => void;
  onApplicationApproved: (updatedUser: User, initialService?: Service) => void;
}

export const ProviderApplicationPage: React.FC<ProviderApplicationPageProps> = ({
  user,
  setCurrentRoute,
  onApplicationApproved,
}) => {
  const [businessName, setBusinessName] = useState('');
  const [category, setCategory] = useState<'Catering' | 'Transport' | 'Staging & AV' | 'Security'>('Catering');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If not logged in
  if (!user) {
    return (
      <main className="max-w-xl mx-auto px-6 py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-3xl">verified_user</span>
        </div>
        <span className="text-xs font-bold text-secondary uppercase tracking-widest">
          Provider Network
        </span>
        <h1 className="font-headline-lg text-3xl font-bold text-primary mt-1 mb-3">
          Sign In to Apply as a Provider
        </h1>
        <p className="text-sm text-secondary mb-8 max-w-md mx-auto leading-relaxed">
          To maintain network quality and verified logistics standards, all providers must first have an active Evinzoo consumer account before submitting their business verification application.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => setCurrentRoute('login')}
            className="w-full sm:w-auto px-6 py-3 bg-primary text-on-primary rounded-xl text-xs font-bold hover:bg-primary-container transition-all active:scale-95 shadow-sm"
          >
            Sign In to Existing Account
          </button>
          <button
            onClick={() => setCurrentRoute('signup')}
            className="w-full sm:w-auto px-6 py-3 bg-surface-container border border-outline-variant text-primary rounded-xl text-xs font-bold hover:bg-surface-container-high transition-all"
          >
            Create Consumer Account
          </button>
        </div>
      </main>
    );
  }

  // If already an approved provider
  if (user.role === 'provider') {
    return (
      <main className="max-w-xl mx-auto px-6 py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-3xl filled">check_circle</span>
        </div>
        <span className="text-xs font-bold text-on-tertiary-container uppercase tracking-widest">
          Verified Provider Account
        </span>
        <h1 className="font-headline-lg text-3xl font-bold text-primary mt-1 mb-2">
          You are an Approved Partner
        </h1>
        <p className="text-sm text-secondary mb-6 max-w-md mx-auto">
          Your business <strong>{user.companyName}</strong> (Provider ID: {user.providerId}) is actively registered on the Evinzoo network.
        </p>

        <div className="flex justify-center gap-3">
          <button
            onClick={() => setCurrentRoute('dashboard')}
            className="px-6 py-3 bg-primary text-on-primary rounded-xl text-xs font-bold hover:bg-primary-container transition-all active:scale-95 shadow-sm"
          >
            Open Provider Dashboard
          </button>
          <button
            onClick={() => setCurrentRoute('services')}
            className="px-6 py-3 bg-surface-container border border-outline-variant text-primary rounded-xl text-xs font-bold hover:bg-surface-container-high"
          >
            Manage Service Catalog
          </button>
        </div>
      </main>
    );
  }

  // Application Form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!businessName.trim()) {
      setError('Please provide your legal business or trade name.');
      return;
    }
    if (!city.trim()) {
      setError('Please provide your operating city / metropolitan area.');
      return;
    }
    if (!agreed) {
      setError('You must agree to the Evinzoo Provider Quality & Compliance standards.');
      return;
    }

    setSubmitting(true);

    try {
      const updatedUser = authService.applyToBeProvider(user.id, {
        businessName: businessName.trim(),
        category,
        city: city.trim(),
        phone: phone.trim(),
        description: description.trim(),
        licenseNumber: licenseNumber.trim() || `LIC-${Math.floor(100000 + Math.random() * 900000)}`,
      });

      // Also create an initial starter service in their catalog matching their selected category
      const initialService: Service = {
        id: `srv-${Date.now()}`,
        title: `${businessName.trim()} Signature ${category} Package`,
        description: description.trim() || `Professional ${category.toLowerCase()} services tailored for corporate conferences and high-profile events.`,
        category,
        price: category === 'Catering' ? 1200 : category === 'Transport' ? 450 : category === 'Staging & AV' ? 950 : 600,
        priceUnit: category === 'Catering' ? '/ event' : category === 'Transport' ? '/ day' : '/ event',
        status: 'Active',
        rating: 5.0,
        image:
          category === 'Catering'
            ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuCwYMH9HcB6mFz7ZRYtgmV1JmxbIzCmViZz86FbPKw28KaNA1wEbtch1niqViQu04Y-9WSl0A67Hq4ff4j5c3kK8JHQjsqOpV_J1XyG52yJG_CUXNqLmo03KEv8TQXDX3nEHviG4J5dzbTlRThgbrgjG1iQL0rj1Z1dqJukUolf17tKQ3DL9giG46LVXFZKqEFtY4rrSZxtUIHK2jZmMn1z5nh7v6BUt2ZOfkRKFzeGRtusNy155SI'
            : category === 'Transport'
            ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnwlEPWTTenp0R411729y3gkcz-MPc6XvhN5RqmkKdhDHfcJR4OGHUubfOi8I5jA7ONnUPkU1CpNoZtZdZWhA4H6wHBy_45-4eGIZhcjqccsaFWupUoT21Ml0QP1rAQjFxJSzl-zwRCE8KHleoLx_LUZDg1f4EVdVy-5-kFkOtCu9hbfsPsfWG1-g8LdbhfIhU27VvO-WBv4iCo3hK_Ukbc6GhR84KuwLyGxprdw7_WawPWr3k74o'
            : 'https://lh3.googleusercontent.com/aida-public/AB6AXuCl5TlzF7M0VIES_0a33_BWwpc6fSkCTBlz269ARhe4G-0wTJKsFl0py11Jc4B4Aa-dsffwnJbbMX_xOfyEhlCo5wb67HUWR-4oSREjfVDxE6h0GdS04GUlM0yXf0zCHzyVHdF8qVKAbWr-ck45-G6kM84q0EtRYVTW2eDFruraJH61hXFZakQGFYKVY7oggycnHbwgnwCCp2NLVIFJHIXpHGzIBbS42puV0-YCgeyACnhG0oqEURc',
      };

      setTimeout(() => {
        onApplicationApproved(updatedUser, initialService);
        setSubmitting(false);
        setCurrentRoute('dashboard');
      }, 500);
    } catch (err: any) {
      setError(err.message || 'Failed to submit application. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <main className="max-w-2xl mx-auto px-4 md:px-0 py-8 md:py-12">
      <div className="text-center mb-8">
        <span className="text-xs font-bold text-secondary uppercase tracking-widest">
          Provider Onboarding
        </span>
        <h1 className="font-headline-lg text-2xl md:text-3xl font-bold text-primary mt-1 mb-2">
          Apply to Become a Verified Service Provider
        </h1>
        <p className="text-xs sm:text-sm text-secondary max-w-lg mx-auto leading-relaxed">
          Provide your business credentials to list your service fleet or packages, receive direct client bookings, and manage contracts on Evinzoo.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-error-container/40 border border-error/20 text-error text-xs font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-base">error</span>
          <span>{error}</span>
        </div>
      )}

      <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-6 sm:p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Business Identity */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-primary uppercase tracking-wider pb-2 border-b border-outline-variant">
              1. Business & Service Category
            </h3>

            <div>
              <label className="block text-xs font-bold text-secondary uppercase mb-1">
                Legal Company / Trade Name *
              </label>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Apex Hospitality Group or Pacific Executive Sprinters"
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-surface border border-outline-variant rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-secondary uppercase mb-1">
                  Primary Specialization *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-surface border border-outline-variant rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  <option value="Catering">Catering (Corporate & Gala Dining)</option>
                  <option value="Transport">Transport (Executive Sprinters & Shuttles)</option>
                  <option value="Staging & AV">Staging & AV (Sound, Trusses, Lighting)</option>
                  <option value="Security">Security (Event Crowd & VIP Close Protection)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-secondary uppercase mb-1">
                  Operating City / Region *
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. San Francisco, CA"
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-surface border border-outline-variant rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-secondary uppercase mb-1">
                Dispatch / Business Phone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-surface border border-outline-variant rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {/* Section 2: Capacity & Operational Profile */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-bold text-primary uppercase tracking-wider pb-2 border-b border-outline-variant">
              2. Operations & Inventory Overview
            </h3>

            <div>
              <label className="block text-xs font-bold text-secondary uppercase mb-1">
                Fleet, Kitchen, or Technical Capabilities
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Briefly describe your equipment inventory, staff sizes, and typical event scale handled..."
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-surface border border-outline-variant rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              ></textarea>
            </div>
          </div>

          {/* Section 3: Licensing & Verification */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-bold text-primary uppercase tracking-wider pb-2 border-b border-outline-variant">
              3. Licensing & Compliance
            </h3>

            <div>
              <label className="block text-xs font-bold text-secondary uppercase mb-1">
                Business Registration / Tax License ID
              </label>
              <input
                type="text"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                placeholder="e.g. LIC-CA-884291 or EIN"
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-surface border border-outline-variant rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            <label className="flex items-start gap-2.5 cursor-pointer pt-2 text-xs text-secondary">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary mt-0.5"
              />
              <span className="leading-relaxed">
                I certify that our business holds valid commercial liability insurance and all relevant municipal licenses. I agree to uphold Evinzoo service level standards.
              </span>
            </label>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-outline-variant flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => setCurrentRoute('marketplace')}
              className="px-5 py-3 text-xs font-bold text-secondary bg-surface rounded-xl hover:bg-surface-container"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3 px-6 bg-primary text-on-primary rounded-xl text-xs font-bold hover:bg-primary-container active:scale-95 transition-all shadow-md flex items-center justify-center gap-2"
            >
              {submitting ? (
                <span>Submitting & Verifying...</span>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                  <span>Submit Application & Activate Provider Hub</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};
