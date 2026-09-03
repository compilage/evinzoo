import React, { useState } from 'react';
import { PageRoute, User } from '../types';
import { authService } from '../services/authService';

interface LoginPageProps {
  setCurrentRoute: (route: PageRoute) => void;
  onLoginSuccess: (user: User) => void;
  hasPendingBooking?: boolean;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  setCurrentRoute,
  onLoginSuccess,
  hasPendingBooking,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('sarah@eliteevents.com');
  const [password, setPassword] = useState('password123');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const user = authService.login(email, password);
      onLoginSuccess(user);
      setLoading(false);
      // Consumer -> landing; Business Owner -> dashboard
      setCurrentRoute(user.role === 'provider' ? 'dashboard' : 'landing');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Please verify your email and password.');
      setLoading(false);
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter your password.');
      return;
    }

    setLoading(true);

    try {
      const user = authService.signup(name, email, password);
      onLoginSuccess(user);
      setLoading(false);
      // All signups start as Consumer -> landing
      setCurrentRoute('landing');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
      setLoading(false);
    }
  };

  const handleQuickFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center items-center px-4 py-12">
      {/* Return to website button */}
      <button
        onClick={() => setCurrentRoute('landing')}
        className="mb-8 flex items-center gap-1.5 text-xs font-bold text-secondary hover:text-primary transition-colors px-3 py-1.5 rounded-full hover:bg-surface-container"
      >
        <span className="material-symbols-outlined text-[16px]">arrow_back</span>
        <span>Back to Website</span>
      </button>

      {/* Main Card */}
      <div className="w-full max-w-md bg-surface-container-lowest border border-outline-variant rounded-3xl p-6 sm:p-8 shadow-xl">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-primary text-on-primary flex items-center justify-center mx-auto mb-3 shadow-md">
            <span className="material-symbols-outlined text-2xl">
              {mode === 'login' ? 'lock' : 'person_add'}
            </span>
          </div>
          <h2 className="font-headline-lg text-2xl font-bold text-primary">
            {mode === 'login' ? 'Welcome Back' : 'Create Consumer Account'}
          </h2>
          <p className="text-xs text-secondary mt-1">
            {hasPendingBooking
              ? 'Sign in or register to complete your service reservation.'
              : mode === 'login'
              ? 'Sign in to access your event dashboard or bookings.'
              : 'Register to discover, book, and coordinate event logistics.'}
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-2xl bg-error-container/40 border border-error/20 text-error text-xs font-bold flex items-center gap-2 animate-fade-in">
            <span className="material-symbols-outlined text-base">error</span>
            <span>{error}</span>
          </div>
        )}

        {mode === 'login' ? (
          /* Sign In Form */
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-secondary uppercase block mb-1" htmlFor="email">
                Email Address
              </label>
              <input
                className="w-full bg-surface border border-outline-variant rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                type="email"
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-secondary uppercase block" htmlFor="password">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => alert('For testing, pre-seeded accounts use password: password123')}
                  className="text-primary text-[11px] hover:underline font-medium"
                >
                  Forgot password?
                </button>
              </div>
              <input
                className="w-full bg-surface border border-outline-variant rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                type="password"
                required
              />
            </div>

            <button
              className="w-full text-on-primary font-bold text-xs py-3.5 px-4 rounded-2xl hover:bg-primary-container transition-all active:scale-95 mt-4 bg-primary shadow-md flex items-center justify-center gap-2"
              type="submit"
              disabled={loading}
            >
              {loading ? <span>Authenticating...</span> : <span>Sign In</span>}
            </button>
          </form>
        ) : (
          /* Sign Up Form */
          <form onSubmit={handleSignupSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-secondary uppercase block mb-1" htmlFor="name">
                Full Name
              </label>
              <input
                className="w-full bg-surface border border-outline-variant rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Jordan Rivera"
                type="text"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-secondary uppercase block mb-1" htmlFor="email">
                Email Address
              </label>
              <input
                className="w-full bg-surface border border-outline-variant rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                type="email"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-secondary uppercase block mb-1" htmlFor="password">
                Password (min. 6 characters)
              </label>
              <input
                className="w-full bg-surface border border-outline-variant rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                type="password"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-secondary uppercase block mb-1" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                className="w-full bg-surface border border-outline-variant rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                type="password"
                required
              />
            </div>

            <button
              className="w-full text-on-primary font-bold text-xs py-3.5 px-4 rounded-2xl hover:bg-primary-container transition-all active:scale-95 mt-4 bg-primary shadow-md flex items-center justify-center gap-2"
              type="submit"
              disabled={loading}
            >
              {loading ? <span>Creating Account...</span> : <span>Create Account</span>}
            </button>
          </form>
        )}

        {/* Quick Demo Pre-fill for Testing */}
        {mode === 'login' && (
          <div className="mt-6 pt-4 border-t border-outline-variant">
            <span className="text-[10px] font-bold text-secondary uppercase tracking-wider block mb-2 text-center">
              Quick Test Accounts
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('client@evinzoo.com', 'password123')}
                className="p-2 rounded-xl border border-outline-variant bg-surface hover:bg-surface-container text-[11px] font-medium text-primary text-center transition-colors"
              >
                Consumer: <strong className="block">Alex Rivera</strong>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('sarah@eliteevents.com', 'password123')}
                className="p-2 rounded-xl border border-outline-variant bg-surface hover:bg-surface-container text-[11px] font-medium text-primary text-center transition-colors"
              >
                Business: <strong className="block">Sarah Jenkins</strong>
              </button>
            </div>
          </div>
        )}

        {/* Toggle Switch between Login and Signup */}
        <div className="mt-6 text-center border-t border-outline-variant pt-4">
          {mode === 'login' ? (
            <p className="text-xs text-secondary">
              Don't have an account?{' '}
              <button
                onClick={() => {
                  setMode('signup');
                  setError(null);
                }}
                className="text-primary font-bold hover:underline ml-1"
              >
                Sign up as Consumer
              </button>
            </p>
          ) : (
            <p className="text-xs text-secondary">
              Already have an account?{' '}
              <button
                onClick={() => {
                  setMode('login');
                  setError(null);
                }}
                className="text-primary font-bold hover:underline ml-1"
              >
                Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
