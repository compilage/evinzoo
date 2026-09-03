import React, { useState } from 'react';
import { Booking } from '../types';

interface BookingsPageProps {
  bookings: Booking[];
  onUpdateBookingStatus: (id: string, newStatus: Booking['status']) => void;
  onOpenNewBookingModal: () => void;
}

export const BookingsPage: React.FC<BookingsPageProps> = ({
  bookings,
  onUpdateBookingStatus,
  onOpenNewBookingModal,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeInvoiceBooking, setActiveInvoiceBooking] = useState<Booking | null>(null);

  // Filter counts
  const pendingCount = bookings.filter((b) => b.status === 'Pending').length;
  const confirmedCount = bookings.filter((b) => b.status === 'Confirmed').length;
  const inProgressCount = bookings.filter((b) => b.status === 'In-Progress').length;

  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = selectedStatus === 'All' || b.status === selectedStatus;
    const matchesSearch =
      b.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.serviceTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <main className="max-w-container-max mx-auto px-4 md:px-margin-desktop w-full py-6 md:py-10 pb-28">
      {/* Header & New Booking Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-2xl md:text-3xl font-bold text-primary">
            Booking Management
          </h1>
          <p className="text-xs sm:text-sm text-secondary mt-1">
            Track confirmed contracts, incoming requests, and dispatch schedules.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenNewBookingModal}
            className="bg-primary text-on-primary font-label-bold text-xs font-bold px-4 py-2.5 flex items-center gap-1.5 active:opacity-80 transition-opacity rounded-xl shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>New Booking</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant shadow-sm mb-6 space-y-4">
        {/* Search */}
        <div className="flex items-center bg-surface border border-outline-variant rounded-xl px-3 py-2">
          <span className="material-symbols-outlined text-secondary mr-2">search</span>
          <input
            type="text"
            className="w-full bg-transparent border-none focus:outline-none text-xs sm:text-sm text-primary placeholder:text-secondary"
            placeholder="Search bookings by reference #, client name, or service..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-secondary hover:text-primary">
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          )}
        </div>

        {/* Filter Pills (Exact from Stitch Screen cb044b63) */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <button
            onClick={() => setSelectedStatus('All')}
            className={`shrink-0 px-4 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              selectedStatus === 'All'
                ? 'bg-primary text-on-primary border-primary shadow-sm'
                : 'bg-surface text-secondary border-outline-variant hover:bg-surface-container'
            }`}
          >
            All ({bookings.length})
          </button>
          <button
            onClick={() => setSelectedStatus('Pending')}
            className={`shrink-0 px-4 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              selectedStatus === 'Pending'
                ? 'bg-primary text-on-primary border-primary shadow-sm'
                : 'bg-surface text-secondary border-outline-variant hover:bg-surface-container'
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setSelectedStatus('Confirmed')}
            className={`shrink-0 px-4 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              selectedStatus === 'Confirmed'
                ? 'bg-primary text-on-primary border-primary shadow-sm'
                : 'bg-surface text-secondary border-outline-variant hover:bg-surface-container'
            }`}
          >
            Confirmed ({confirmedCount})
          </button>
          <button
            onClick={() => setSelectedStatus('In-Progress')}
            className={`shrink-0 px-4 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              selectedStatus === 'In-Progress'
                ? 'bg-primary text-on-primary border-primary shadow-sm'
                : 'bg-surface text-secondary border-outline-variant hover:bg-surface-container'
            }`}
          >
            In-Progress ({inProgressCount})
          </button>
        </div>
      </div>

      {/* Bookings Feed Grid */}
      {filteredBookings.length === 0 ? (
        <div className="text-center py-16 bg-surface-container-lowest rounded-3xl border border-outline-variant p-8">
          <span className="material-symbols-outlined text-4xl text-secondary mb-2">event_busy</span>
          <p className="font-title-md text-base font-semibold text-primary">No bookings match filter</p>
          <p className="text-xs text-secondary mt-1">Try switching tabs or clear your search input.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBookings.map((booking) => (
            <article
              key={booking.id}
              className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 flex flex-col justify-between gap-3 shadow-sm hover:border-primary/40 transition-colors"
            >
              <div>
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-mono-data text-xs text-secondary font-bold">
                      {booking.code}
                    </span>
                    <h3 className="font-title-md text-base font-bold text-primary mt-0.5">
                      {booking.serviceTitle}
                    </h3>
                    <p className="text-xs text-secondary flex items-center gap-1 mt-0.5">
                      <span className="material-symbols-outlined text-[15px]">
                        {booking.clientType === 'business' ? 'business' : 'person'}
                      </span>
                      <span>{booking.clientName}</span>
                    </p>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                      booking.status === 'Confirmed'
                        ? 'bg-secondary-container text-on-secondary-container'
                        : booking.status === 'In-Progress'
                        ? 'bg-tertiary-fixed text-on-tertiary-fixed'
                        : booking.status === 'Pending'
                        ? 'bg-surface-variant text-on-surface-variant'
                        : 'bg-error-container text-error'
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>

                <div className="h-px bg-outline-variant w-full my-3"></div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-secondary uppercase">
                      Scheduled Date
                    </span>
                    <span className="font-medium text-primary mt-0.5">{booking.date}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-secondary uppercase">
                      Contract Value
                    </span>
                    <span className="font-mono-data text-primary font-bold text-sm mt-0.5">
                      ${booking.value.toLocaleString()}
                    </span>
                  </div>
                </div>

                {booking.notes && (
                  <p className="text-[11px] text-secondary mt-2 bg-surface p-2 rounded-xl border border-outline-variant/60 line-clamp-2">
                    {booking.notes}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2 border-t border-outline-variant mt-2">
                {booking.status === 'Pending' ? (
                  <>
                    <button
                      onClick={() => onUpdateBookingStatus(booking.id, 'Confirmed')}
                      className="flex-1 bg-primary text-on-primary font-label-bold text-xs py-2 border border-primary active:opacity-80 transition-opacity rounded-xl font-bold shadow-sm"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => onUpdateBookingStatus(booking.id, 'Cancelled')}
                      className="px-3 py-2 bg-surface text-error border border-outline-variant rounded-xl text-xs font-bold hover:bg-error-container/20"
                    >
                      Decline
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setActiveInvoiceBooking(booking)}
                      className="flex-1 bg-surface-container text-primary font-label-bold text-xs py-2 border border-outline-variant hover:bg-surface-container-high transition-colors rounded-xl font-bold flex items-center justify-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[15px]">receipt_long</span>
                      <span>Invoice</span>
                    </button>
                    {booking.status === 'Confirmed' && (
                      <button
                        onClick={() => onUpdateBookingStatus(booking.id, 'In-Progress')}
                        className="flex-1 bg-primary text-on-primary font-label-bold text-xs py-2 active:opacity-80 transition-opacity rounded-xl font-bold"
                      >
                        Start Service
                      </button>
                    )}
                  </>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Invoice Modal Preview */}
      {activeInvoiceBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full border border-outline-variant p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-start border-b border-outline-variant pb-3">
              <div>
                <span className="text-[10px] font-bold text-secondary uppercase">
                  Service Invoice
                </span>
                <h3 className="font-title-md text-lg font-bold text-primary">
                  {activeInvoiceBooking.code}
                </h3>
              </div>
              <button
                onClick={() => setActiveInvoiceBooking(null)}
                className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center text-secondary"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-outline-variant/50">
                <span className="text-secondary">Client</span>
                <span className="font-bold text-primary">{activeInvoiceBooking.clientName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-outline-variant/50">
                <span className="text-secondary">Package</span>
                <span className="font-semibold text-primary">{activeInvoiceBooking.serviceTitle}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-outline-variant/50">
                <span className="text-secondary">Date Scheduled</span>
                <span className="font-medium text-primary">{activeInvoiceBooking.date}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-outline-variant/50">
                <span className="text-secondary">Payment Status</span>
                <span className="font-bold text-on-tertiary-container">Authorized (Escrow)</span>
              </div>
              <div className="flex justify-between py-2 text-sm font-bold pt-3">
                <span className="text-primary">Total Amount Due</span>
                <span className="font-mono-data text-primary text-base">
                  ${activeInvoiceBooking.value.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => {
                  alert(`Invoice receipt for ${activeInvoiceBooking.code} downloaded!`);
                  setActiveInvoiceBooking(null);
                }}
                className="w-full py-2.5 bg-primary text-on-primary rounded-xl text-xs font-bold hover:bg-primary-container transition-colors flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">download</span>
                <span>Download PDF Receipt</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
