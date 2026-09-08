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

  // Form states - clean empty initial inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBackNavigation = () => {
    if (window.history.state?.route && window.history.length > 1) {
      window.history.back();
    } else {
      setCurrentRoute('landing');
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const user = await authService.login(email, password);
      onLoginSuccess(user);
      setLoading(false);
      // Consumer -> landing; Business Owner -> dashboard
      setCurrentRoute(user.role === 'provider' ? 'dashboard' : 'landing');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Please verify your email and password.');
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
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
      const user = await authService.signup(name, email, password);
      onLoginSuccess(user);
      setLoading(false);
      // All signups start as Consumer -> landing
      setCurrentRoute('landing');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center items-center px-4 py-12">
      {/* Main Authentication Card */}
      <div className="relative w-full max-w-md bg-surface-container-lowest border border-outline-variant rounded-3xl p-6 sm:p-8 shadow-xl">
        {/* Sleek Icon Back Button */}
        <button
          type="button"
          onClick={handleBackNavigation}
          title="Back to website"
          aria-label="Back to website"
          className="absolute top-5 left-5 w-9 h-9 rounded-2xl bg-surface border border-outline-variant flex items-center justify-center text-secondary hover:text-primary hover:bg-surface-container active:scale-95 transition-all shadow-xs"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6 pt-2">
          <div className="w-12 h-12 rounded-2xl bg-primary text-on-primary flex items-center justify-center mx-auto mb-3 shadow-md">
            <span className="material-symbols-outlined text-2xl">
              {mode === 'login' ? 'lock' : 'person_add'}
            </span>
          </div>
          <h2 className="font-headline-lg text-2xl font-bold text-primary">
            {mode === 'login' ? 'Welcome Back' : 'Create an Account'}
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
                  onClick={() => alert('Password reset link will be sent to your registered email address.')}
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
                placeholder="Enter your full name"
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

        {/* Alternative Sign-In Options (Google & Phone) */}
        <div className="mt-6 pt-5 border-t border-outline-variant">
          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline-variant"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold text-secondary tracking-wider">
              <span className="bg-surface-container-lowest px-2.5">
                Or continue with
              </span>
            </div>
          </div>

          <div className="space-y-2.5">
            <button
              type="button"
              onClick={() => {}}
              className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-2xl border border-outline-variant bg-surface hover:bg-surface-container/80 active:scale-[0.99] transition-all text-xs font-semibold text-primary shadow-xs"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <button
              type="button"
              onClick={() => {}}
              className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-2xl border border-outline-variant bg-surface hover:bg-surface-container/80 active:scale-[0.99] transition-all text-xs font-semibold text-primary shadow-xs"
            >
              <span className="material-symbols-outlined text-[18px] text-secondary">
                phone_iphone
              </span>
              <span>Continue with Phone</span>
            </button>
          </div>
        </div>

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
                Sign Up
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
