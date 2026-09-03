import React, { useState } from 'react';
import { Booking, Service } from '../../types';

interface BookingModalProps {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmBooking: (newBooking: Booking) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  service,
  isOpen,
  onClose,
  onConfirmBooking,
}) => {
  if (!isOpen || !service) return null;

  const [clientName, setClientName] = useState('Innovate Corp');
  const [eventDate, setEventDate] = useState('2024-11-15');
  const [eventTime, setEventTime] = useState('14:00');
  const [units, setUnits] = useState(1);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalValue = service.price * units;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newBooking: Booking = {
      id: `bk-${Date.now()}`,
      code: `#BK-${randomSuffix}-X`,
      serviceTitle: service.title,
      clientName: clientName || 'Executive Client',
      clientType: clientName.toLowerCase().includes('corp') || clientName.toLowerCase().includes('inc') ? 'business' : 'person',
      date: new Date(eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: eventTime,
      value: totalValue,
      status: 'Pending',
      notes: notes || 'Standard reservation requested online.'
    };

    setTimeout(() => {
      onConfirmBooking(newBooking);
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full border border-outline-variant shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface">
          <div>
            <span className="text-[11px] font-bold text-secondary uppercase tracking-wider">
              Reserve Service
            </span>
            <h3 className="font-title-md text-lg font-bold text-primary">
              {service.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center text-secondary hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          <div className="flex gap-4 p-3 bg-surface-container-low rounded-xl border border-outline-variant">
            <img
              src={service.image}
              alt={service.title}
              className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
            />
            <div className="flex flex-col justify-center">
              <span className="text-xs text-secondary">{service.category}</span>
              <span className="font-semibold text-primary">{service.title}</span>
              <span className="text-sm font-bold text-primary mt-1">
                ${service.price.toLocaleString()} <span className="text-xs font-normal text-secondary">{service.priceUnit}</span>
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-secondary uppercase mb-1">
              Client / Company Name
            </label>
            <input
              type="text"
              required
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-surface border border-outline-variant rounded-xl focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="e.g. Apex Global or Sarah Jenkins"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-secondary uppercase mb-1">
                Event Date
              </label>
              <input
                type="date"
                required
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-surface border border-outline-variant rounded-xl focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-secondary uppercase mb-1">
                Start Time
              </label>
              <input
                type="time"
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-surface border border-outline-variant rounded-xl focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-secondary uppercase mb-1">
              Quantity / Headcount Factor
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="1"
                max="50"
                value={units}
                onChange={(e) => setUnits(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-24 px-3 py-2 text-sm bg-surface border border-outline-variant rounded-xl focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <span className="text-xs text-secondary">
                Total Estimate: <strong className="text-primary text-sm">${totalValue.toLocaleString()}</strong>
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-secondary uppercase mb-1">
              Event Logistics Notes & Requirements
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-surface border border-outline-variant rounded-xl focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Access windows, loading dock instructions, dietary constraints..."
            ></textarea>
          </div>

          <div className="pt-2 border-t border-outline-variant flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 text-xs font-bold text-secondary bg-surface-container rounded-xl hover:bg-surface-container-high transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 px-4 text-xs font-bold text-on-primary bg-primary rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-md flex items-center justify-center gap-1.5"
            >
              {isSubmitting ? (
                <span>Confirming...</span>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  <span>Confirm Booking</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
