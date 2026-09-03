import { useState, useEffect } from 'react';
import { PageRoute, Service, Booking, User, UserRole } from './types';
import {
  storage,
  INITIAL_PROVIDERS,
  INITIAL_ACTIVITIES,
} from './data/mockData';
import { authService } from './services/authService';
import { Navbar } from './components/layout/Navbar';
import { MobileNav } from './components/layout/MobileNav';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './pages/LandingPage';
import { MarketplacePage } from './pages/MarketplacePage';
import { DashboardPage } from './pages/DashboardPage';
import { BookingsPage } from './pages/BookingsPage';
import { ServiceCatalogPage } from './pages/ServiceCatalogPage';
import { AccountPage } from './pages/AccountPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { ProviderApplicationPage } from './pages/ProviderApplicationPage';
import { BookingModal } from './components/modals/BookingModal';
import { AddServiceModal } from './components/modals/AddServiceModal';
import { NotificationsModal } from './components/modals/NotificationsModal';

export function App() {
  const [currentRoute, setCurrentRoute] = useState<PageRoute>('landing');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // User session loaded from authService / storage
  const [user, setUser] = useState<User | null>(() => authService.getCurrentUser());
  const [services, setServices] = useState<Service[]>(() => storage.getServices());
  const [bookings, setBookings] = useState<Booking[]>(() => storage.getBookings());
  const [providers] = useState(INITIAL_PROVIDERS);
  const [activities, setActivities] = useState(INITIAL_ACTIVITIES);

  // Modals state
  const [serviceToBook, setServiceToBook] = useState<Service | null>(null);
  const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false);
  const [serviceToEdit, setServiceToEdit] = useState<Service | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Show temporary toast notification
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Sync services and bookings to LocalStorage
  useEffect(() => {
    storage.saveServices(services);
  }, [services]);

  useEffect(() => {
    storage.saveBookings(bookings);
  }, [bookings]);

  // Auth actions
  const handleLogin = (newUser: User) => {
    setUser(newUser);
    showToast(`Welcome back, ${newUser.name}!`);
  };

  const handleSignup = (newUser: User) => {
    setUser(newUser);
    showToast(`Welcome to EventLogix, ${newUser.name}! You are registered as an Event Planner.`);
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    showToast('Signed out successfully.');
    setCurrentRoute('landing');
  };

  const handleUpdateUser = (updatedUser: User) => {
    const saved = authService.updateUser(updatedUser);
    setUser(saved);
    showToast('Profile settings updated.');
  };

  const handleToggleRole = () => {
    if (!user) {
      setCurrentRoute('login');
      return;
    }
    if (user.role === 'client') {
      setCurrentRoute('apply-provider');
      return;
    }
    // For providers, allow toggling view perspective between provider dashboard and marketplace
    const newRole: UserRole = user.role === 'provider' ? 'client' : 'provider';
    const updated: User = { ...user, role: newRole };
    authService.updateUser(updated);
    setUser(updated);
    showToast(`Switched view to ${newRole === 'provider' ? 'Provider Dashboard' : 'Client Marketplace'}.`);
    if (newRole === 'provider') {
      setCurrentRoute('dashboard');
    } else {
      setCurrentRoute('marketplace');
    }
  };

  const handleApplicationApproved = (updatedUser: User, initialService?: Service) => {
    setUser(updatedUser);
    if (initialService) {
      setServices((prev) => [initialService, ...prev]);
    }
    showToast(`Congratulations, ${updatedUser.companyName}! Your provider account is now active.`);
    setCurrentRoute('dashboard');
  };

  // Booking actions
  const handleConfirmBooking = (newBooking: Booking) => {
    setBookings((prev) => [newBooking, ...prev]);
    // Add to activity stream
    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        title: `New booking: ${newBooking.clientName}`,
        subtitle: `${newBooking.serviceTitle} • $${newBooking.value.toLocaleString()}`,
        time: 'Just now',
        type: 'booking',
      },
      ...prev,
    ]);
    showToast(`Booking ${newBooking.code} reserved successfully!`);
    setCurrentRoute('bookings');
  };

  const handleUpdateBookingStatus = (id: string, newStatus: Booking['status']) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    );
    showToast(`Booking status updated to ${newStatus}.`);
  };

  // Service catalog actions
  const handleSaveService = (savedService: Service) => {
    setServices((prev) => {
      const exists = prev.some((s) => s.id === savedService.id);
      if (exists) {
        return prev.map((s) => (s.id === savedService.id ? savedService : s));
      } else {
        return [savedService, ...prev];
      }
    });
    showToast(`Service package "${savedService.title}" saved!`);
  };

  const handleToggleServiceStatus = (id: string) => {
    setServices((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: s.status === 'Active' ? 'Draft' : 'Active' } : s
      )
    );
  };

  const handleDeleteService = (id: string) => {
    if (confirm('Are you sure you want to remove this service from catalog?')) {
      setServices((prev) => prev.filter((s) => s.id !== id));
      showToast('Service package removed.');
    }
  };

  // Route protection for provider-only pages
  const checkProviderRoute = (component: React.ReactNode) => {
    if (!user) {
      return (
        <div className="max-w-md mx-auto px-6 py-16 text-center">
          <h2 className="text-xl font-bold text-primary mb-2">Provider Access Required</h2>
          <p className="text-xs text-secondary mb-6">
            Please sign in to access the provider operations dashboard.
          </p>
          <button
            onClick={() => setCurrentRoute('login')}
            className="px-6 py-2.5 bg-primary text-on-primary rounded-xl text-xs font-bold"
          >
            Sign In
          </button>
        </div>
      );
    }
    if (user.role !== 'provider') {
      return (
        <div className="max-w-md mx-auto px-6 py-16 text-center">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
            <span className="material-symbols-outlined text-2xl">verified</span>
          </div>
          <h2 className="text-xl font-bold text-primary mb-2">Provider Account Needed</h2>
          <p className="text-xs text-secondary mb-6 leading-relaxed">
            You are currently signed in as an Event Planner. To manage a catalog and receive bookings, submit a Provider Application.
          </p>
          <button
            onClick={() => setCurrentRoute('apply-provider')}
            className="px-6 py-3 bg-primary text-on-primary rounded-xl text-xs font-bold shadow-sm hover:bg-primary-container"
          >
            Apply to Become a Provider
          </button>
        </div>
      );
    }
    return component;
  };

  // Render current page
  const renderPage = () => {
    switch (currentRoute) {
      case 'landing':
        return (
          <LandingPage
            setCurrentRoute={setCurrentRoute}
            providers={providers}
            onSelectServiceToBook={(srv) => setServiceToBook(srv)}
          />
        );
      case 'marketplace':
        return (
          <MarketplacePage
            setCurrentRoute={setCurrentRoute}
            providers={providers}
            onSelectServiceToBook={(srv) => setServiceToBook(srv)}
          />
        );
      case 'dashboard':
        return checkProviderRoute(
          <DashboardPage
            setCurrentRoute={setCurrentRoute}
            bookings={bookings}
            activities={activities}
            onUpdateBookingStatus={handleUpdateBookingStatus}
          />
        );
      case 'bookings':
        return (
          <BookingsPage
            bookings={bookings}
            onUpdateBookingStatus={handleUpdateBookingStatus}
            onOpenNewBookingModal={() => setServiceToBook(services[0] || null)}
          />
        );
      case 'services':
        return checkProviderRoute(
          <ServiceCatalogPage
            services={services}
            onOpenAddModal={() => {
              setServiceToEdit(null);
              setIsAddServiceModalOpen(true);
            }}
            onOpenEditModal={(srv) => {
              setServiceToEdit(srv);
              setIsAddServiceModalOpen(true);
            }}
            onToggleServiceStatus={handleToggleServiceStatus}
            onDeleteService={handleDeleteService}
          />
        );
      case 'apply-provider':
        return (
          <ProviderApplicationPage
            user={user}
            setCurrentRoute={setCurrentRoute}
            onApplicationApproved={handleApplicationApproved}
          />
        );
      case 'account':
        return (
          <AccountPage
            user={user}
            setCurrentRoute={setCurrentRoute}
            onUpdateUser={handleUpdateUser}
            onLogout={handleLogout}
          />
        );
      case 'login':
        return (
          <LoginPage
            setCurrentRoute={setCurrentRoute}
            onLoginSuccess={handleLogin}
          />
        );
      case 'signup':
        return (
          <SignupPage
            setCurrentRoute={setCurrentRoute}
            onSignupSuccess={handleSignup}
          />
        );
      default:
        return (
          <LandingPage
            setCurrentRoute={setCurrentRoute}
            providers={providers}
            onSelectServiceToBook={(srv) => setServiceToBook(srv)}
          />
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-surface text-on-surface">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-primary text-on-primary text-xs font-bold px-4 py-2.5 rounded-2xl shadow-2xl border border-white/20 flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-[16px] text-tertiary-fixed">
            check_circle
          </span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        currentRoute={currentRoute}
        setCurrentRoute={setCurrentRoute}
        user={user}
        onLogout={handleLogout}
        onToggleRole={handleToggleRole}
      />

      {/* Page Content */}
      <div className="flex-1">{renderPage()}</div>

      {/* Footer - Placed strategically on Landing Page only */}
      {currentRoute === 'landing' && (
        <Footer setCurrentRoute={setCurrentRoute} />
      )}

      {/* Mobile Bottom Navigation - Only visible when logged in */}
      <MobileNav
        currentRoute={currentRoute}
        setCurrentRoute={setCurrentRoute}
        user={user}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        unreadNotificationsCount={activities.length}
      />

      {/* Partner Notifications Modal */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        activities={activities}
      />

      {/* Booking Modal */}
      <BookingModal
        isOpen={Boolean(serviceToBook)}
        service={serviceToBook}
        onClose={() => setServiceToBook(null)}
        onConfirmBooking={handleConfirmBooking}
      />

      {/* Add / Edit Service Modal */}
      <AddServiceModal
        isOpen={isAddServiceModalOpen}
        serviceToEdit={serviceToEdit}
        onClose={() => {
          setIsAddServiceModalOpen(false);
          setServiceToEdit(null);
        }}
        onSaveService={handleSaveService}
      />
    </div>
  );
}

export default App;
