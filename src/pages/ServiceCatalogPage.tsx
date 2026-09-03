import React, { useState } from 'react';
import { Service } from '../types';

interface ServiceCatalogPageProps {
  services: Service[];
  onOpenAddModal: () => void;
  onOpenEditModal: (service: Service) => void;
  onToggleServiceStatus: (id: string) => void;
  onDeleteService: (id: string) => void;
}

export const ServiceCatalogPage: React.FC<ServiceCatalogPageProps> = ({
  services,
  onOpenAddModal,
  onOpenEditModal,
  onToggleServiceStatus,
  onDeleteService,
}) => {
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredServices = services.filter((s) => {
    const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
    const matchesQuery =
      s.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(filterQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <main className="max-w-container-max mx-auto px-4 md:px-margin-desktop w-full py-6 md:py-10 pb-28 relative">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-2xl md:text-3xl font-bold text-primary">
            Service Catalog
          </h1>
          <p className="text-xs sm:text-sm text-secondary mt-1">
            Configure packages, pricing models, and public marketplace availability.
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="bg-primary text-on-primary font-label-bold text-xs font-bold px-5 py-2.5 flex items-center gap-1.5 active:opacity-80 transition-opacity rounded-xl shadow-sm self-start sm:self-auto hover:bg-primary-container"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Add Service Package</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-surface-container-lowest p-3 rounded-2xl border border-outline-variant shadow-sm mb-10 flex flex-col sm:flex-row gap-3 items-center">
        <div className="w-full flex-1 flex items-center bg-surface border border-outline-variant rounded-xl px-3 py-2">
          <span className="material-symbols-outlined text-secondary mr-2">filter_list</span>
          <input
            type="text"
            className="w-full bg-transparent border-none focus:outline-none text-xs sm:text-sm text-primary placeholder:text-secondary"
            placeholder="Filter catalog packages..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
          />
          {filterQuery && (
            <button onClick={() => setFilterQuery('')} className="text-secondary hover:text-primary">
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          )}
        </div>

        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {['All', 'Catering', 'Transport', 'Staging & AV'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-primary text-on-primary border-primary'
                  : 'bg-surface text-secondary border-outline-variant hover:bg-surface-container'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Services List matching Home Page Design */}
      {filteredServices.length === 0 ? (
        <div className="text-center py-16 bg-surface-container-lowest rounded-3xl border border-outline-variant p-8">
          <span className="material-symbols-outlined text-4xl text-secondary mb-2">storefront</span>
          <p className="text-sm font-bold text-primary">No service packages found</p>
          <p className="text-xs text-secondary mt-1 mb-4">
            Try adjusting your search filters or create a new package.
          </p>
          <button
            onClick={onOpenAddModal}
            className="px-4 py-2 bg-primary text-on-primary rounded-xl text-xs font-bold"
          >
            Add New Package
          </button>
        </div>
      ) : (
        <div className="space-y-16">
          {filteredServices.map((service, index) => {
            const isEven = index % 2 === 0;
            const isDraft = service.status === 'Draft';

            return (
              <div
                key={service.id}
                className={`relative w-full md:w-[88%] ${isEven ? 'md:mr-auto' : 'md:ml-auto'}`}
              >
                {/* Background Banner Image */}
                <div
                  className={`w-full h-[240px] md:h-[360px] bg-surface-variant relative rounded-3xl overflow-hidden shadow-sm transition-all duration-300 ${
                    isDraft ? 'grayscale opacity-75' : ''
                  }`}
                >
                  <img
                    className="object-cover w-full h-full hover:scale-105 transition-transform duration-700"
                    alt={service.title}
                    src={service.image}
                  />

                  {/* Status Badge in Top-Right */}
                  <div className="absolute top-4 right-4 bg-surface-container-lowest/90 backdrop-blur rounded-full px-3.5 py-1.5 flex items-center gap-1.5 border border-outline-variant shadow-sm">
                    <span
                      className={`material-symbols-outlined text-[16px] ${
                        isDraft ? 'text-secondary' : 'text-emerald-600 filled'
                      }`}
                    >
                      {isDraft ? 'pause_circle' : 'check_circle'}
                    </span>
                    <span
                      className={`font-mono-data text-xs font-semibold ${
                        isDraft ? 'text-secondary' : 'text-emerald-700'
                      }`}
                    >
                      {isDraft ? 'Draft / Hidden' : 'Active on Marketplace'}
                    </span>
                  </div>

                  {/* Category Pill in Top-Left */}
                  <div className="absolute top-4 left-4 bg-primary/80 backdrop-blur-md text-on-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {service.category}
                  </div>
                </div>

                {/* Overlapping Content Card */}
                <div
                  className={`relative z-10 w-[94%] md:w-[68%] ${
                    isEven ? 'ml-auto' : 'mr-auto'
                  } -mt-12 md:-mt-20 bg-surface-container-lowest rounded-3xl border border-outline-variant p-6 shadow-xl`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-[11px] font-bold text-secondary uppercase tracking-wider">
                        {service.category} Specialization
                      </span>
                      <h3 className="font-title-md text-xl font-bold text-primary">
                        {service.title}
                      </h3>
                    </div>

                    {service.rating && (
                      <div className="flex items-center gap-1 bg-surface-container px-2 py-0.5 rounded-lg border border-outline-variant shrink-0">
                        <span className="material-symbols-outlined text-[16px] text-primary filled">
                          star
                        </span>
                        <span className="font-label-bold text-xs font-bold text-primary">
                          {service.rating}
                        </span>
                      </div>
                    )}
                  </div>

                  <p className="font-body-sm text-sm text-secondary mb-4 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Pricing + Action Controls replacing "Reserve Now" */}
                  <div className="flex flex-col sm:flex-row justify-between sm:items-end border-t border-outline-variant pt-4 gap-4">
                    <div>
                      <span className="font-body-sm text-xs text-secondary block">Catalog Price</span>
                      <span className="font-title-md text-xl font-bold text-primary">
                        ${service.price.toLocaleString()}
                        <span className="text-xs font-normal text-secondary ml-0.5">
                          {service.priceUnit}
                        </span>
                      </span>
                    </div>

                    {/* Action Controls: Active Switch + Edit + Delete */}
                    <div className="flex items-center flex-wrap gap-2.5">
                      {/* Active/Disabled Switch */}
                      <div className="flex items-center gap-2 bg-surface px-3 py-1.5 rounded-xl border border-outline-variant">
                        <span className="text-[11px] font-bold text-secondary">
                          {isDraft ? 'Disabled' : 'Active'}
                        </span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={!isDraft}
                            onChange={() => onToggleServiceStatus(service.id)}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                        </label>
                      </div>

                      {/* Edit Button */}
                      <button
                        onClick={() => onOpenEditModal(service)}
                        className="bg-surface hover:bg-surface-container border border-outline-variant text-primary rounded-xl px-3.5 py-2 font-label-bold text-xs font-bold transition-all active:scale-95 shadow-sm flex items-center gap-1.5"
                        title="Edit Package"
                      >
                        <span className="material-symbols-outlined text-[16px]">edit</span>
                        <span>Edit</span>
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => onDeleteService(service.id)}
                        className="w-9 h-9 rounded-xl border border-outline-variant text-secondary hover:text-error hover:bg-error-container/20 flex items-center justify-center transition-colors"
                        title="Delete Package"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Floating Action Button for Mobile / Quick Add */}
      <button
        onClick={onOpenAddModal}
        className="fixed bottom-20 md:bottom-8 right-6 w-14 h-14 bg-primary text-on-primary rounded-full shadow-2xl flex items-center justify-center hover:bg-primary-container transition-all active:scale-90 z-40"
        title="Add New Service Package"
      >
        <span className="material-symbols-outlined text-[28px]">add</span>
      </button>
    </main>
  );
};
