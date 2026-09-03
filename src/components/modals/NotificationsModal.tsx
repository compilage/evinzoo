import React from 'react';
import { Activity } from '../../types';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  activities: Activity[];
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  activities,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface-container-lowest w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl border border-outline-variant shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-outline-variant flex items-center justify-between bg-surface">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">
              notifications
            </span>
            <h3 className="font-title-md text-base font-bold text-primary">
              Partner Notifications
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center text-secondary hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Notifications List */}
        <div className="p-4 overflow-y-auto divide-y divide-outline-variant">
          {activities.length === 0 ? (
            <div className="text-center py-8 text-secondary text-xs">
              No new notifications.
            </div>
          ) : (
            activities.map((act) => (
              <div
                key={act.id}
                className="py-3 flex items-start gap-3 hover:bg-surface/50 transition-colors"
              >
                <div
                  className={`size-9 rounded-xl flex items-center justify-center shrink-0 ${
                    act.type === 'booking'
                      ? 'bg-secondary-container text-on-secondary-container'
                      : act.type === 'payment'
                      ? 'bg-on-tertiary-container/10 text-on-tertiary-container'
                      : 'bg-error-container text-error'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {act.type === 'booking'
                      ? 'event_available'
                      : act.type === 'payment'
                      ? 'payments'
                      : 'cancel'}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline gap-1">
                    <p className="text-xs font-bold text-primary truncate">{act.title}</p>
                    <span className="text-[10px] text-secondary shrink-0">{act.time}</span>
                  </div>
                  <p className="text-[11px] text-secondary mt-0.5 leading-snug">
                    {act.subtitle}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-outline-variant bg-surface text-center">
          <button
            onClick={onClose}
            className="w-full py-2 bg-surface-container hover:bg-surface-container-high rounded-xl text-xs font-bold text-primary transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
