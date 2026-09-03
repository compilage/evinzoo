import React from 'react';
import { PageRoute } from '../../types';

interface FooterProps {
  setCurrentRoute: (route: PageRoute) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentRoute }) => {
  return (
    <footer className="bg-surface-container-low border-t border-outline-variant pt-12 pb-24 md:pb-12 px-4 md:px-margin-desktop mt-auto">
      <div className="max-w-container-max mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-10">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-on-primary">
                <span className="material-symbols-outlined text-[18px]">event</span>
              </div>
              <span className="font-display-lg text-2xl font-bold text-primary">
                Evinzoo
              </span>
            </div>
            <p className="font-body-sm text-sm text-secondary max-w-md leading-relaxed">
              Evinzoo is the premier marketplace and logistics operating system for high-end event service providers. We connect professional planners with top-tier catering, transport, and staging to ensure seamless execution.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            <div className="flex flex-col gap-3">
              <h4 className="font-label-bold text-xs font-bold text-primary uppercase tracking-wider">
                Platform
              </h4>
              <button
                onClick={() => setCurrentRoute('marketplace')}
                className="text-left font-body-sm text-sm text-secondary hover:text-primary transition-colors"
              >
                Find Services
              </button>
              <button
                onClick={() => setCurrentRoute('dashboard')}
                className="text-left font-body-sm text-sm text-secondary hover:text-primary transition-colors"
              >
                Provider Hub
              </button>
              <button
                onClick={() => setCurrentRoute('bookings')}
                className="text-left font-body-sm text-sm text-secondary hover:text-primary transition-colors"
              >
                Bookings
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="font-label-bold text-xs font-bold text-primary uppercase tracking-wider">
                Company
              </h4>
              <a href="#" className="font-body-sm text-sm text-secondary hover:text-primary transition-colors">
                About Us
              </a>
              <a href="#" className="font-body-sm text-sm text-secondary hover:text-primary transition-colors">
                Careers
              </a>
              <a href="#" className="font-body-sm text-sm text-secondary hover:text-primary transition-colors">
                Contact Support
              </a>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="font-label-bold text-xs font-bold text-primary uppercase tracking-wider">
                Legal
              </h4>
              <a href="#" className="font-body-sm text-sm text-secondary hover:text-primary transition-colors">
                Terms of Service
              </a>
              <a href="#" className="font-body-sm text-sm text-secondary hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="font-body-sm text-sm text-secondary hover:text-primary transition-colors">
                Service Level Agreement
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-outline-variant pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-mono-data text-xs text-secondary">
            © 2026 Evinzoo Logistics Platform. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-secondary">
            <span className="material-symbols-outlined text-[20px] cursor-pointer hover:text-primary transition-colors">
              public
            </span>
            <span className="material-symbols-outlined text-[20px] cursor-pointer hover:text-primary transition-colors">
              mail
            </span>
            <span className="material-symbols-outlined text-[20px] cursor-pointer hover:text-primary transition-colors">
              shield
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
