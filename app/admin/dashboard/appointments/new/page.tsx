'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewAppointmentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    reason: '',
    status: 'approved',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/admin/dashboard/appointments');
        router.refresh();
      } else {
        alert(data.error || 'Erreur lors de la création');
      }
    } catch (error) {
      console.error('Error creating appointment:', error);
      alert('Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/dashboard/appointments"
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
          Retour aux rendez-vous
        </Link>
        <h1 className="text-3xl font-bold text-white mb-2">
          Nouveau Rendez-vous
        </h1>
        <p className="text-white/60">
          Créez un rendez-vous pour un client
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="bg-white/5 backdrop-blur-sm border border-[var(--orange-light)]/20 rounded-xl p-8 space-y-6">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-white mb-2"
            >
              Nom complet <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-3 bg-white/5 border border-[var(--orange-light)]/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent transition-all"
              placeholder="Jean Dupont"
              required
            />
          </div>

          {/* Email and Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                placeholder="jean.dupont@email.com"
                required
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-white mb-2"
              >
                Téléphone
              </label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-4 py-3 bg-white/5 border border-[var(--orange-light)]/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent transition-all"
                placeholder="+33 1 23 45 67 89"
              />
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium text-white mb-2"
              >
                Date <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                id="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="w-full px-4 py-3 bg-white/5 border border-[var(--orange-light)]/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label
                htmlFor="time"
                className="block text-sm font-medium text-white mb-2"
              >
                Heure <span className="text-red-400">*</span>
              </label>
              <input
                type="time"
                id="time"
                value={formData.time}
                onChange={(e) =>
                  setFormData({ ...formData, time: e.target.value })
                }
                className="w-full px-4 py-3 bg-white/5 border border-[var(--orange-light)]/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          {/* Reason */}
          <div>
            <label
              htmlFor="reason"
              className="block text-sm font-medium text-white mb-2"
            >
              Motif de la consultation
            </label>
            <textarea
              id="reason"
              value={formData.reason}
              onChange={(e) =>
                setFormData({ ...formData, reason: e.target.value })
              }
              rows={3}
              className="w-full px-4 py-3 bg-white/5 border border-[var(--orange-light)]/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent transition-all resize-none"
              placeholder="Décrivez brièvement le motif de la consultation..."
            />
          </div>

          {/* Notes */}
          <div>
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-white mb-2"
            >
              Notes internes
            </label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows={3}
              className="w-full px-4 py-3 bg-white/5 border border-[var(--orange-light)]/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent transition-all resize-none"
              placeholder="Notes pour usage interne uniquement..."
            />
          </div>

          {/* Status */}
          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-white mb-2"
            >
              Statut
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className="w-full px-4 py-3 bg-white/5 border border-[var(--orange-light)]/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent transition-all"
            >
              <option value="approved" className="bg-[var(--navy-dark)]">
                Approuvé
              </option>
              <option value="pending" className="bg-[var(--navy-dark)]">
                En attente
              </option>
              <option value="rejected" className="bg-[var(--navy-dark)]">
                Refusé
              </option>
            </select>
            <p className="text-xs text-white/50 mt-2">
              Les rendez-vous créés par l'admin sont approuvés par défaut
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
                  Créer le rendez-vous
                </>
              )}
            </button>
            <Link
              href="/admin/dashboard/appointments"
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
