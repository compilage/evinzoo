import React, { useState } from 'react';
import { PageRoute, Provider, Service } from '../types';

interface MarketplacePageProps {
  setCurrentRoute: (route: PageRoute) => void;
  providers: Provider[];
  onSelectServiceToBook: (service: Service) => void;
}

export const MarketplacePage: React.FC<MarketplacePageProps> = ({
  providers,
  onSelectServiceToBook,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'All', label: 'All Services', icon: 'apps' },
    { id: 'Catering', label: 'Catering', icon: 'restaurant' },
    { id: 'Transport', label: 'Transport', icon: 'local_shipping' },
    { id: 'Staging & AV', label: 'Staging & AV', icon: 'speaker' },
    { id: 'Security', label: 'Security', icon: 'security' },
  ];

  const filteredProviders = providers.filter((p) => {
    const matchesCategory =
      selectedCategory === 'All' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="max-w-container-max mx-auto px-4 md:px-margin-desktop w-full py-6 md:py-10">
      {/* Header & Search */}
      <section className="mb-8">
        <h1 className="font-headline-lg-mobile md:font-display-lg text-2xl md:text-4xl font-bold text-primary mb-2">
          Find Event Services
        </h1>
        <p className="font-body-sm text-sm md:text-base text-secondary mb-6">
          Source top-tier logistics, catering, staging, and executive transport professionals.
        </p>

        {/* Search Bar */}
        <div className="bg-surface-container-lowest p-2 border border-outline-variant flex items-center shadow-sm rounded-2xl mb-6 max-w-2xl">
          <span className="material-symbols-outlined text-secondary ml-2 mr-2">search</span>
          <input
            className="flex-grow bg-transparent border-none focus:outline-none font-body-sm text-sm text-on-surface placeholder:text-secondary"
            placeholder="Search by keyword, e.g. AV Equipment, Catering, Sprinter..."
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-secondary hover:text-primary mr-2"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          )}
          <button className="bg-primary text-on-primary w-10 h-10 rounded-xl flex items-center justify-center active:opacity-80 transition-opacity shadow-sm">
            <span className="material-symbols-outlined text-[18px]">tune</span>
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all active:scale-95 border ${
                selectedCategory === cat.id
                  ? 'bg-primary text-on-primary border-primary shadow-sm'
                  : 'bg-surface-container-lowest text-secondary border-outline-variant hover:bg-surface-container hover:text-primary'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Listings Feed */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-title-md text-lg font-bold text-primary">
            Available Verified Providers ({filteredProviders.length})
          </h2>
          <span className="text-xs text-secondary">
            Showing results for <strong>{selectedCategory}</strong>
          </span>
        </div>

        {filteredProviders.length === 0 ? (
          <div className="text-center py-16 bg-surface-container-lowest rounded-3xl border border-outline-variant p-8">
            <span className="material-symbols-outlined text-4xl text-secondary mb-2">search_off</span>
            <p className="font-title-md text-base font-semibold text-primary">No providers found</p>
            <p className="text-xs text-secondary mt-1">Try relaxing your search terms or filter.</p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 bg-surface-container rounded-xl text-xs font-bold text-primary hover:bg-surface-container-high"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredProviders.map((provider) => (
              <div
                key={provider.id}
                className="bg-surface-container-lowest rounded-3xl border border-outline-variant overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group"
              >
                {/* Image */}
                <div className="w-full h-56 bg-surface-variant relative overflow-hidden">
                  <img
                    alt={provider.name}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    src={provider.image}
                  />
                  <div className="absolute top-3 right-3 bg-surface-container-lowest/90 backdrop-blur rounded-full px-3 py-1 flex items-center gap-1.5 border border-outline-variant">
                    <span className="material-symbols-outlined text-[14px] text-tertiary-container filled">
                      check_circle
                    </span>
                    <span className="font-mono-data text-[11px] text-on-surface font-semibold">
                      Verified
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 bg-primary/90 text-on-primary backdrop-blur px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                    {provider.category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-title-md text-lg font-bold text-primary">
                        {provider.name}
                      </h3>
                      <div className="flex items-center gap-1 bg-surface px-2 py-0.5 rounded-lg border border-outline-variant">
                        <span className="material-symbols-outlined text-[14px] text-primary filled">
                          star
                        </span>
                        <span className="font-label-bold text-xs font-bold text-primary">
                          {provider.rating}
                        </span>
                      </div>
                    </div>

                    <p className="font-body-sm text-xs text-secondary mb-4 leading-relaxed line-clamp-2">
                      {provider.description}
                    </p>
                  </div>

                  <div className="flex justify-between items-center border-t border-outline-variant pt-3 mt-2">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-secondary block">
                        Starting at
                      </span>
                      <span className="font-title-md text-base font-bold text-primary">
                        ${provider.startingPrice}{' '}
                        <span className="text-xs font-normal text-secondary">
                          {provider.priceUnit}
                        </span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          onSelectServiceToBook({
                            id: provider.id,
                            title: provider.name,
                            description: provider.description,
                            category: provider.category as any,
                            price: provider.startingPrice,
                            priceUnit: provider.priceUnit,
                            image: provider.image,
                            status: 'Active',
                            rating: provider.rating,
                          });
                        }}
                        className="bg-primary text-on-primary rounded-xl px-4 py-2 text-xs font-bold hover:bg-primary-container active:scale-95 transition-all shadow-sm flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[16px]">add_circle</span>
                        <span>Book Now</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};
