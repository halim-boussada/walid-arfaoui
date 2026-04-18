'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Login failed');
        setLoading(false);
        return;
      }

      setTimeout(() => {
        window.location.href = '/admin/dashboard';
      }, 100);
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--navy-dark)] via-[var(--navy)] to-[var(--navy-light)]">
        {/* Animated floating elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-[var(--gold)]/15 to-[var(--orange)]/10 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-to-r from-[var(--orange)]/10 to-[var(--gold)]/5 rounded-full blur-3xl animate-float-slower"></div>

        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(251, 146, 60, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(251, 146, 60, 0.15) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>
      </div>

      {/* Login card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Back to home link */}
        <Link
          href="/"
          className="inline-flex items-center text-white/80 hover:text-white mb-8 transition-colors group"
        >
          <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Retour au site
        </Link>

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-[var(--orange-light)]/30 rounded-2xl shadow-2xl p-8 sm:p-10 animate-fade-in">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[var(--gold)]/20 to-[var(--orange)]/20 backdrop-blur-md rounded-full mb-4 border border-[var(--orange-light)]/50">
              <svg className="w-5 h-5 text-[var(--gold-bright)] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="text-sm font-bold bg-gradient-to-r from-[var(--gold-bright)] to-[var(--orange)] bg-clip-text text-transparent">ESPACE SÉCURISÉ</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              Administration
            </h1>
            <p className="text-white/70 text-sm">
              Arfaoui Law & Consulting
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg backdrop-blur-sm animate-fade-in">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-red-200">{error}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/50 focus:border-[var(--gold)] transition-all disabled:opacity-50"
                placeholder="admin@arfaoui-law.com"
              />
            </div>

            <div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/50 focus:border-[var(--gold)] transition-all disabled:opacity-50"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group w-full py-4 px-6 bg-gradient-to-r from-[var(--gold)] to-[var(--orange)] text-white font-bold rounded-lg hover:shadow-2xl hover:shadow-[var(--orange)]/50 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 relative overflow-hidden"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
              <span className="relative flex items-center justify-center">
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Connexion en cours...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Se connecter
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Footer note */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="flex items-center justify-center text-xs text-white/60">
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Connexion sécurisée • Données chiffrées
            </div>
          </div>
        </div>

        {/* Info card */}
        <div className="mt-6 p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg">
          <p className="text-xs text-white/60 text-center">
            Accès réservé aux administrateurs autorisés
          </p>
        </div>
      </div>
    </div>
  );
}
