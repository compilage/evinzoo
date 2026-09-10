import React, { useState } from 'react';
import { Booking, PageRoute } from '../../types';

interface ConsumerBookingsPageProps {
  bookings: Booking[];
  setCurrentRoute?: (route: PageRoute) => void;
}

export const ConsumerBookingsPage: React.FC<ConsumerBookingsPageProps> = ({
  bookings,
  setCurrentRoute,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeInvoiceBooking, setActiveInvoiceBooking] = useState<Booking | null>(null);

  const pendingCount = bookings.filter((b) => b.status === 'Pending').length;
  const confirmedCount = bookings.filter((b) => b.status === 'Confirmed').length;
  const inProgressCount = bookings.filter((b) => b.status === 'In-Progress').length;

  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = selectedStatus === 'All' || b.status === selectedStatus;
    const matchesSearch =
      b.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.serviceTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <main className="max-w-container-max mx-auto px-4 sm:px-6 w-full py-6 md:py-10 pb-28">
      {/* Header (Mobile-First) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold font-display-lg text-primary tracking-tight">
            My Event Bookings
          </h1>
          <p className="text-xs sm:text-sm text-secondary mt-1">
            Track confirmed reservations, dispatch statuses, and payment receipts.
          </p>
        </div>

        {setCurrentRoute && (
          <button
            onClick={() => setCurrentRoute('marketplace')}
            className="w-full sm:w-auto bg-primary text-on-primary font-bold text-xs px-4 py-2.5 flex items-center justify-center gap-1.5 active:scale-95 transition-transform rounded-xl shadow-sm min-h-[42px]"
          >
            <span className="material-symbols-outlined text-[18px]">search</span>
            <span>Explore Services</span>
          </button>
        )}
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-surface-container-lowest p-3.5 sm:p-4 rounded-2xl border border-outline-variant shadow-sm mb-5 space-y-3">
        {/* Search */}
        <div className="flex items-center bg-surface border border-outline-variant rounded-xl px-3 py-2 min-h-[42px]">
          <span className="material-symbols-outlined text-secondary mr-2 text-[20px]">search</span>
          <input
            type="text"
            className="w-full bg-transparent border-none focus:outline-none text-xs sm:text-sm text-primary placeholder:text-secondary"
            placeholder="Search by package, booking code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-secondary hover:text-primary p-1"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          )}
        </div>

        {/* Filter Pills (Horizontal scroll on mobile) */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <button
            onClick={() => setSelectedStatus('All')}
            className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border min-h-[36px] ${
              selectedStatus === 'All'
                ? 'bg-primary text-on-primary border-primary shadow-sm'
                : 'bg-surface text-secondary border-outline-variant hover:bg-surface-container'
            }`}
          >
            All ({bookings.length})
          </button>
          <button
            onClick={() => setSelectedStatus('Confirmed')}
            className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border min-h-[36px] ${
              selectedStatus === 'Confirmed'
                ? 'bg-primary text-on-primary border-primary shadow-sm'
                : 'bg-surface text-secondary border-outline-variant hover:bg-surface-container'
            }`}
          >
            Confirmed ({confirmedCount})
          </button>
          <button
            onClick={() => setSelectedStatus('In-Progress')}
            className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border min-h-[36px] ${
              selectedStatus === 'In-Progress'
                ? 'bg-primary text-on-primary border-primary shadow-sm'
                : 'bg-surface text-secondary border-outline-variant hover:bg-surface-container'
            }`}
          >
            In-Progress ({inProgressCount})
          </button>
          <button
            onClick={() => setSelectedStatus('Pending')}
            className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border min-h-[36px] ${
              selectedStatus === 'Pending'
                ? 'bg-primary text-on-primary border-primary shadow-sm'
                : 'bg-surface text-secondary border-outline-variant hover:bg-surface-container'
            }`}
          >
            Pending ({pendingCount})
          </button>
        </div>
      </div>

      {/* Bookings Feed */}
      {filteredBookings.length === 0 ? (
        <div className="text-center py-16 bg-surface-container-lowest rounded-3xl border border-outline-variant p-6 sm:p-8">
          <span className="material-symbols-outlined text-4xl text-secondary mb-2">event_busy</span>
          <p className="text-base font-bold text-primary">No reservations found</p>
          <p className="text-xs text-secondary mt-1 max-w-sm mx-auto">
            You don't have any bookings matching this filter. Explore available caterers, venues, and DJ services.
          </p>
          {setCurrentRoute && (
            <button
              onClick={() => setCurrentRoute('marketplace')}
              className="mt-4 px-5 py-2.5 bg-primary text-on-primary rounded-xl text-xs font-bold shadow-sm"
            >
              Browse Event Services
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {filteredBookings.map((booking) => (
            <article
              key={booking.id}
              className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-4 sm:p-5 flex flex-col justify-between gap-3 shadow-sm hover:border-primary/40 transition-colors"
            >
              <div>
                <div className="flex justify-between items-start gap-2">
                  <div className="flex flex-col min-w-0">
                    <span className="font-mono text-xs text-secondary font-bold">
                      {booking.code}
                    </span>
                    <h3 className="text-base font-bold text-primary mt-0.5 leading-snug">
                      {booking.serviceTitle}
                    </h3>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider shrink-0 ${
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
                      Event Date
                    </span>
                    <span className="font-medium text-primary mt-0.5">{booking.date}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-secondary uppercase">
                      Amount Paid (Escrow)
                    </span>
                    <span className="font-mono text-primary font-bold text-sm mt-0.5">
                      ${booking.value.toLocaleString()}
                    </span>
                  </div>
                </div>

                {booking.notes && (
                  <p className="text-[11px] text-secondary mt-2 bg-surface p-2.5 rounded-xl border border-outline-variant/60 line-clamp-2">
                    {booking.notes}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-outline-variant mt-1">
                <button
                  onClick={() => setActiveInvoiceBooking(booking)}
                  className="w-full bg-surface-container text-primary text-xs py-2.5 border border-outline-variant hover:bg-surface-container-high transition-colors rounded-xl font-bold flex items-center justify-center gap-1.5 min-h-[40px]"
                >
                  <span className="material-symbols-outlined text-[16px]">receipt_long</span>
                  <span>View Receipt & Invoice</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Invoice Modal Preview */}
      {activeInvoiceBooking && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface-container-lowest rounded-t-3xl sm:rounded-2xl max-w-md w-full border border-outline-variant p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-outline-variant pb-3">
              <div>
                <span className="text-[10px] font-bold text-secondary uppercase">
                  Event Service Receipt
                </span>
                <h3 className="text-lg font-bold text-primary">
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

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-outline-variant/50">
                <span className="text-secondary">Service Package</span>
                <span className="font-semibold text-primary">{activeInvoiceBooking.serviceTitle}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-outline-variant/50">
                <span className="text-secondary">Scheduled Date</span>
                <span className="font-medium text-primary">{activeInvoiceBooking.date}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-outline-variant/50">
                <span className="text-secondary">Payment Escrow</span>
                <span className="font-bold text-on-tertiary-container">Secured in Escrow</span>
              </div>
              <div className="flex justify-between py-2 text-sm font-bold pt-3">
                <span className="text-primary">Total Amount</span>
                <span className="font-mono text-primary text-base">
                  ${activeInvoiceBooking.value.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  alert(`Receipt for ${activeInvoiceBooking.code} saved!`);
                  setActiveInvoiceBooking(null);
                }}
                className="w-full py-2.5 bg-primary text-on-primary rounded-xl text-xs font-bold hover:opacity-95 transition-opacity flex items-center justify-center gap-1.5 min-h-[44px]"
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
