import React from 'react';
import { Booking, PageRoute, User } from '../types';
import { useVerifiedRole } from '../hooks/useVerifiedRole';
import { ConsumerBookingsPage } from './consumer/ConsumerBookingsPage';
import { ProviderBookingsPage } from './provider/ProviderBookingsPage';

export interface BookingsPageProps {
  user?: User | null;
  bookings: Booking[];
  onUpdateBookingStatus: (id: string, newStatus: Booking['status']) => void;
  onOpenNewBookingModal: () => void;
  setCurrentRoute?: (route: PageRoute) => void;
  onUpdateUser?: (updatedUser: User) => void;
}

/**
 * Main Bookings Page Controller.
 * Authoritatively inspects user_role via signed JWT claim:
 * - Providers see their incoming client dispatch queue, acceptance actions & invoices.
 * - Consumers see their personal event reservations, fulfillment status & receipts.
 */
export const BookingsPage: React.FC<BookingsPageProps> = ({
  user = null,
  bookings,
  onUpdateBookingStatus,
  onOpenNewBookingModal,
  setCurrentRoute,
  onUpdateUser,
}) => {
  const { role } = useVerifiedRole({
    user,
    onUpdateUser,
  });

  if (role === 'provider') {
    return (
      <ProviderBookingsPage
        bookings={bookings}
        onUpdateBookingStatus={onUpdateBookingStatus}
        onOpenNewBookingModal={onOpenNewBookingModal}
      />
    );
  }

  return (
    <ConsumerBookingsPage
      bookings={bookings}
      setCurrentRoute={setCurrentRoute}
    />
  );
};

export default BookingsPage;
