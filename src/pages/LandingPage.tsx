import React, { useState } from 'react';
import { PageRoute, Provider, Service, User } from '../types';

interface LandingPageProps {
  user: User | null;
  setCurrentRoute: (route: PageRoute) => void;
  providers: Provider[];
  onSelectServiceToBook: (service: Service) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  user,
  setCurrentRoute,
  providers,
  onSelectServiceToBook,
}) => {
  const [serviceQuery, setServiceQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentRoute('marketplace');
  };

  const categories = [
    { name: 'Catering', icon: 'restaurant' },
    { name: 'Transport', icon: 'local_shipping' },
    { name: 'Staging & AV', icon: 'stadium' },
    { name: 'Security', icon: 'security' },
  ];

  return (
    <main className="max-w-container-max mx-auto md:px-margin-desktop w-full pb-16">
      {/* Hero Section */}
      <section className="px-margin-mobile pt-stack-lg pb-16 md:pt-24 md:pb-24 text-center relative overflow-hidden rounded-b-3xl md:rounded-3xl md:mt-stack-md bg-surface-container-lowest border border-outline-variant shadow-sm">
        <div
          className="absolute inset-0 z-0 opacity-10 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAtWNMBLpluDaeJhIb5ReHkaox-caB4vUrW1jQthRqut6LR-iiisyvX217tleu1E-N0vw-uZS6nwKvLJYtD3IZK6IKWd1CmqY9zUiPJVF_VRDYeG1qDF_oBAQu1u7w0GQe77ZRKddGE7QHolVNXAuFm4oESSPsTaeMyxcqLsigokWACjnnAaE27g6c2VbzeDLnrNBXyMHOzXtcmimO-MK12X1tJHSpK9eruo52enoNLHEsP96eEt8w')",
          }}
        ></div>

        <div className="relative z-10 max-w-2xl mx-auto">
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-display-lg md:text-display-lg font-bold text-primary mb-stack-sm md:mb-stack-md px-4 leading-tight">
            Book Premium Event Services with Ease
          </h1>
          <p className="font-body-lg text-body-lg text-secondary px-6 md:px-0 max-w-xl mx-auto">
            Discover and book top-tier catering, transport, staging, and security for your next corporate event or gala.
          </p>
        </div>
      </section>

      {/* Search Overlapping Bar */}
      <div className="relative z-20 max-w-2xl mx-auto -mt-8 mb-10 px-margin-mobile md:px-0">
        <form
          onSubmit={handleSearch}
          className="flex flex-col md:flex-row gap-2 bg-surface-container-lowest border border-outline-variant rounded-2xl p-2 shadow-lg w-full max-w-lg mx-auto"
        >
          <div className="flex items-center flex-1 bg-surface rounded-xl px-3 py-2">
            <span className="material-symbols-outlined text-secondary mr-2">search</span>
            <input
              className="w-full bg-transparent border-none focus:outline-none text-sm text-primary placeholder:text-secondary p-0"
              placeholder="What service do you need?"
              type="text"
              value={serviceQuery}
              onChange={(e) => setServiceQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center flex-1 bg-surface rounded-xl px-3 py-2 mt-1 md:mt-0">
            <span className="material-symbols-outlined text-secondary mr-2">location_on</span>
            <input
              className="w-full bg-transparent border-none focus:outline-none text-sm text-primary placeholder:text-secondary p-0"
              placeholder="Where? (e.g. San Francisco)"
              type="text"
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="bg-primary text-on-primary rounded-xl px-6 py-2.5 font-label-bold text-sm active:scale-95 transition-transform mt-1 md:mt-0 shadow-md flex items-center justify-center gap-1"
          >
            <span>Search</span>
          </button>
        </form>
      </div>

      {/* Categories Horizontal Scroll */}
      <section className="px-margin-mobile pt-stack-md pb-stack-md">
        <div className="flex justify-between items-center mb-stack-md">
          <h2 className="font-title-md text-xl font-bold text-primary">
            High-Demand Categories
          </h2>
          <button
            onClick={() => setCurrentRoute('marketplace')}
            className="text-xs font-bold text-secondary hover:text-primary transition-colors"
          >
            View All
          </button>
        </div>

        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-margin-mobile px-margin-mobile md:mx-0 md:px-0 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setCurrentRoute('marketplace')}
              className="min-w-[140px] flex-1 snap-center group flex flex-col items-center justify-center bg-surface-container-lowest border border-outline-variant rounded-2xl p-stack-md hover:shadow-md transition-all active:scale-95 hover:border-primary"
            >
              <div className="w-12 h-12 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center mb-stack-sm group-hover:bg-primary group-hover:text-on-primary transition-colors">
                <span className="material-symbols-outlined text-2xl filled">{cat.icon}</span>
              </div>
              <span className="font-label-bold text-xs font-semibold text-primary">
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Providers Staggered Cards */}
      <section className="px-margin-mobile py-stack-md mb-stack-lg">
        <div className="flex justify-between items-end mb-stack-md md:mb-12">
          <div>
            <span className="text-xs font-bold text-secondary uppercase tracking-widest">
              Verified Logistics
            </span>
            <h2 className="font-title-md text-2xl font-bold text-primary">
              Featured Providers
            </h2>
          </div>
          <button
            onClick={() => setCurrentRoute('marketplace')}
            className="font-label-bold text-xs font-bold text-secondary hover:text-primary transition-colors"
          >
            Browse Marketplace →
          </button>
        </div>

        <div className="flex flex-col gap-14 md:gap-20">
          {providers.slice(0, 3).map((provider, index) => {
            const isEven = index % 2 === 0;
            return (
              <div
                key={provider.id}
                className={`relative w-full md:w-[88%] ${isEven ? 'md:mr-auto' : 'md:ml-auto'}`}
              >
                {/* Background Banner Image */}
                <div className="w-full h-[240px] md:h-[380px] bg-surface-variant relative rounded-3xl overflow-hidden shadow-sm">
                  <img
                    className="object-cover w-full h-full hover:scale-105 transition-transform duration-700"
                    alt={provider.name}
                    src={provider.image}
                  />
                  <div className="absolute top-4 right-4 bg-surface-container-lowest/90 backdrop-blur rounded-full px-3 py-1 flex items-center gap-1.5 border border-outline-variant">
                    <span className="material-symbols-outlined text-[16px] text-tertiary-container filled">
                      check_circle
                    </span>
                    <span className="font-mono-data text-xs text-on-surface font-semibold">
                      {provider.available ? 'Available' : 'Booked'}
                    </span>
                  </div>
                </div>

                {/* Overlapping Content Card */}
                <div
                  className={`relative z-10 w-[92%] md:w-[65%] ${
                    isEven ? 'ml-auto' : 'mr-auto'
                  } -mt-12 md:-mt-20 bg-surface-container-lowest rounded-3xl border border-outline-variant p-6 shadow-xl`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-[11px] font-bold text-secondary uppercase tracking-wider">
                        {provider.category}
                      </span>
                      <h3 className="font-title-md text-xl font-bold text-primary">
                        {provider.name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-1 bg-surface-container px-2 py-0.5 rounded-lg border border-outline-variant">
                      <span className="material-symbols-outlined text-[16px] text-primary filled">
                        star
                      </span>
                      <span className="font-label-bold text-xs font-bold text-primary">
                        {provider.rating}
                      </span>
                    </div>
                  </div>

                  <p className="font-body-sm text-sm text-secondary mb-4 leading-relaxed">
                    {provider.description}
                  </p>

                  <div className="flex justify-between items-end border-t border-outline-variant pt-4">
                    <div>
                      <span className="font-body-sm text-xs text-secondary block">Starting at</span>
                      <span className="font-title-md text-xl font-bold text-primary">
                        ${provider.startingPrice}
                        <span className="text-xs font-normal text-secondary ml-0.5">
                          {provider.priceUnit}
                        </span>
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        const serviceItem: Service = {
                          id: provider.id,
                          title: provider.name,
                          description: provider.description,
                          category: provider.category as any,
                          price: provider.startingPrice,
                          priceUnit: provider.priceUnit,
                          image: provider.image,
                          status: 'Active',
                          rating: provider.rating,
                        };
                        onSelectServiceToBook(serviceItem);
                        if (!user) {
                          setCurrentRoute('login');
                        }
                      }}
                      className="bg-primary text-on-primary rounded-xl px-5 py-2.5 font-label-bold text-xs font-bold hover:bg-primary-container transition-colors active:scale-95 shadow-sm flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[16px]">calendar_add_on</span>
                      <span>Reserve Now</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

    </main>
  );
};
