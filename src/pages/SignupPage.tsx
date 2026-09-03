import React, { useState } from 'react';
import { PageRoute, User } from '../types';
import { authService } from '../services/authService';

interface SignupPageProps {
  setCurrentRoute: (route: PageRoute) => void;
  onSignupSuccess: (user: User) => void;
}

export const SignupPage: React.FC<SignupPageProps> = ({
  setCurrentRoute,
  onSignupSuccess,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreed, setAgreed] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = (e: React.FormEvent) => {
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
    if (!agreed) {
      setError('Please accept the Terms of Service to create your account.');
      return;
    }

    setLoading(true);

    try {
      const user = authService.signup(name, email, password);
      onSignupSuccess(user);
      setLoading(false);
      setCurrentRoute('marketplace');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <main className="w-full max-w-md mx-auto px-6 py-10 flex flex-col justify-center min-h-[85vh]">
      <div className="mb-6 text-center">
        <div
          onClick={() => setCurrentRoute('landing')}
          className="font-headline-lg text-2xl tracking-tight font-bold text-primary mb-2 cursor-pointer inline-block"
        >
          EVINZOO
        </div>
        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
          <span className="material-symbols-outlined text-[20px]">person_add</span>
        </div>
        <h1 className="font-headline-lg text-2xl font-bold text-primary mb-1">
          Create Consumer Account
        </h1>
        <p className="text-xs text-secondary">
          Join Evinzoo to discover, reserve, and manage top-tier event services.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3.5 rounded-2xl bg-error-container/40 border border-error/20 text-error text-xs font-bold flex items-center gap-2 animate-fade-in">
          <span className="material-symbols-outlined text-base">error</span>
          <span>{error}</span>
        </div>
      )}

      <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-6 shadow-sm">
        <form onSubmit={handleSignup} className="space-y-4 w-full">
          <div className="space-y-1">
            <label className="text-xs font-bold text-secondary uppercase block" htmlFor="name">
              Full Name
            </label>
            <input
              className="w-full bg-surface border border-outline-variant rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Jordan Miller"
              type="text"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-secondary uppercase block" htmlFor="email">
              Work Email Address
            </label>
            <input
              className="w-full bg-surface border border-outline-variant rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jordan@company.com"
              type="email"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-secondary uppercase block" htmlFor="password">
              Password (min. 6 characters)
            </label>
            <input
              className="w-full bg-surface border border-outline-variant rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              type="password"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-secondary uppercase block" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              className="w-full bg-surface border border-outline-variant rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              type="password"
              required
            />
          </div>

          <div className="space-y-2 pt-1 text-xs">
            <label className="flex items-start gap-2.5 cursor-pointer text-secondary">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary mt-0.5"
              />
              <span className="leading-relaxed">
                I agree to the <a href="#" className="text-primary underline">Terms of Service</a> and <a href="#" className="text-primary underline">Privacy Policy</a>
              </span>
            </label>
          </div>

          <button
            className="w-full text-on-primary font-bold text-xs py-3 px-4 rounded-xl hover:bg-primary-container transition-all focus:outline-none active:scale-95 mt-2 bg-primary shadow-md flex items-center justify-center gap-2"
            type="submit"
            disabled={loading}
          >
            {loading ? <span>Creating Account...</span> : <span>Create Account</span>}
          </button>
        </form>

        <div className="mt-5 p-3 rounded-xl bg-surface border border-outline-variant/60 text-center">
          <p className="text-[11px] text-secondary">
            Looking to list your catering, fleet, or staging service?{' '}
            <span className="text-primary font-bold">
              Sign up as a consumer first, then click "Become a Provider" to apply.
            </span>
          </p>
        </div>

        <p className="mt-5 text-center text-xs text-secondary">
          Already have an account?{' '}
          <button
            onClick={() => setCurrentRoute('login')}
            className="text-primary font-bold hover:underline ml-1"
          >
            Sign in
          </button>
        </p>
      </div>
    </main>
  );
};
