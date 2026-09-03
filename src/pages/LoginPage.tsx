import React, { useState } from 'react';
import { PageRoute, User } from '../types';
import { authService } from '../services/authService';

interface LoginPageProps {
  setCurrentRoute: (route: PageRoute) => void;
  onLoginSuccess: (user: User) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  setCurrentRoute,
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState('sarah@eliteevents.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const user = authService.login(email, password);
      onLoginSuccess(user);
      setLoading(false);
      setCurrentRoute(user.role === 'provider' ? 'dashboard' : 'marketplace');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Please verify your email and password.');
      setLoading(false);
    }
  };

  const handleQuickFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  return (
    <main className="w-full max-w-md mx-auto px-6 py-12 flex flex-col justify-center min-h-[80vh]">
      <div className="mb-8 text-center">
        <div
          onClick={() => setCurrentRoute('landing')}
          className="font-headline-lg text-2xl tracking-tight font-bold text-primary mb-2 cursor-pointer inline-block"
        >
          EVENTLOGIX
        </div>
        <h1 className="font-headline-lg text-2xl font-bold text-primary mb-1">
          Welcome back
        </h1>
        <p className="text-xs text-secondary">
          Sign in to access your event bookings, catalog, and operations.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3.5 rounded-2xl bg-error-container/40 border border-error/20 text-error text-xs font-bold flex items-center gap-2 animate-fade-in">
          <span className="material-symbols-outlined text-base">error</span>
          <span>{error}</span>
        </div>
      )}

      <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-6 shadow-sm">
        <form onSubmit={handleLogin} className="space-y-4 w-full">
          <div className="space-y-1">
            <label className="text-xs font-bold text-secondary uppercase block" htmlFor="email">
              Email Address
            </label>
            <input
              className="w-full bg-surface border border-outline-variant rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              type="email"
              required
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
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
              className="w-full bg-surface border border-outline-variant rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              type="password"
              required
            />
          </div>

          <button
            className="w-full text-on-primary font-bold text-xs py-3 px-4 rounded-xl hover:bg-primary-container transition-all focus:outline-none active:scale-95 mt-4 bg-primary shadow-md flex items-center justify-center gap-2"
            type="submit"
            disabled={loading}
          >
            {loading ? <span>Authenticating...</span> : <span>Sign In</span>}
          </button>
        </form>

        {/* Quick Demo Pre-fill Links */}
        <div className="mt-6 pt-4 border-t border-outline-variant">
          <span className="text-[10px] font-bold text-secondary uppercase tracking-wider block mb-2 text-center">
            Demo Accounts Available
          </span>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <button
              type="button"
              onClick={() => handleQuickFill('client@eventlogix.com', 'password123')}
              className="px-3 py-1.5 rounded-lg border border-outline-variant bg-surface hover:bg-surface-container text-[11px] font-medium text-primary text-center transition-colors"
            >
              Consumer: <strong>Alex Rivera</strong>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('sarah@eliteevents.com', 'password123')}
              className="px-3 py-1.5 rounded-lg border border-outline-variant bg-surface hover:bg-surface-container text-[11px] font-medium text-primary text-center transition-colors"
            >
              Provider: <strong>Sarah Jenkins</strong>
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-secondary">
          Don't have an account?{' '}
          <button
            onClick={() => setCurrentRoute('signup')}
            className="text-primary font-bold hover:underline ml-1"
          >
            Create an account
          </button>
        </p>
      </div>
    </main>
  );
};
