'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewAdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'admin',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    // Validate password length
    if (formData.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/admins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/admin/dashboard/admins');
        router.refresh();
      } else {
        const errorMsg = data.details
          ? `${data.error}: ${data.details}`
          : data.error || 'Erreur lors de la création';
        setError(errorMsg);
        console.error('Server error:', data);
      }
    } catch (error) {
      console.error('Error creating admin:', error);
      setError('Erreur lors de la création de l\'administrateur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/dashboard/admins"
          className="inline-flex items-center text-white/60 hover:text-white transition-colors mb-4"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Retour aux administrateurs
        </Link>
        <h1 className="text-3xl font-bold text-white mb-2">
          Nouvel Administrateur
        </h1>
        <p className="text-white/60">
          Créez un nouveau compte administrateur
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="bg-white/5 backdrop-blur-sm border border-[var(--orange-light)]/20 rounded-xl p-8 space-y-6">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-white mb-2"
            >
              Email <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-3 bg-white/5 border border-[var(--orange-light)]/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent transition-all"
              placeholder="admin@example.com"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-white mb-2"
            >
              Mot de passe <span className="text-red-400">*</span>
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full px-4 py-3 bg-white/5 border border-[var(--orange-light)]/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent transition-all"
              placeholder="••••••••"
              required
              minLength={8}
            />
            <p className="text-xs text-white/50 mt-2">
              Le mot de passe doit contenir au moins 8 caractères
            </p>
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-white mb-2"
            >
              Confirmer le mot de passe <span className="text-red-400">*</span>
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              className="w-full px-4 py-3 bg-white/5 border border-[var(--orange-light)]/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent transition-all"
              placeholder="••••••••"
              required
              minLength={8}
            />
          </div>

          {/* Role */}
          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-white mb-2"
            >
              Rôle
            </label>
            <select
              id="role"
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              className="w-full px-4 py-3 bg-white/5 border border-[var(--orange-light)]/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent transition-all"
            >
              <option value="admin" className="bg-[var(--navy-dark)]">
                Admin
              </option>
              <option value="super_admin" className="bg-[var(--navy-dark)]">
                Super Admin
              </option>
            </select>
            <p className="text-xs text-white/50 mt-2">
              Les administrateurs ont accès à toutes les fonctionnalités du tableau de bord
            </p>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center gap-4 pt-6 border-t border-white/10">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-[var(--gold)] to-[var(--orange)] text-white rounded-lg hover:shadow-lg hover:shadow-[var(--orange)]/20 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Création en cours...
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Créer l'administrateur
                </>
              )}
            </button>
            <Link
              href="/admin/dashboard/admins"
              className="px-8 py-3 bg-white/5 text-white rounded-lg hover:bg-white/10 transition-all font-medium"
            >
              Annuler
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
