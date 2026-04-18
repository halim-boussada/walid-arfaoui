'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Admin {
  id: number;
  email: string;
  role: string;
  created_at: string;
}

export default function AdminsPage() {
  const router = useRouter();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  useEffect(() => {
    fetchAdmins();
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch('/api/auth/me');
      const data = await response.json();
      if (data.user) {
        setCurrentUserId(data.user.id);
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };

  const fetchAdmins = async () => {
    try {
      const response = await fetch('/api/admins');
      const data = await response.json();

      if (data.success) {
        setAdmins(data.admins);
      }
    } catch (error) {
      console.error('Error fetching admins:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, email: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer l'admin "${email}" ?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admins/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        setAdmins(admins.filter((admin) => admin.id !== id));
      } else {
        alert(data.error || 'Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Error deleting admin:', error);
      alert('Erreur lors de la suppression');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--gold)]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Administrateurs
          </h1>
          <p className="text-white/60">
            Gérez les utilisateurs administrateurs
          </p>
        </div>
        <Link
          href="/admin/dashboard/admins/new"
          className="px-6 py-3 bg-gradient-to-r from-[var(--gold)] to-[var(--orange)] text-white rounded-lg hover:shadow-lg hover:shadow-[var(--orange)]/20 transition-all font-medium flex items-center"
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          Nouvel Administrateur
        </Link>
      </div>

      {/* Stats Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/5 backdrop-blur-sm border border-[var(--orange-light)]/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm mb-1">Total Admins</p>
              <p className="text-3xl font-bold text-white">{admins.length}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-[var(--gold)]/20 to-[var(--orange)]/20 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-[var(--gold)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Admins List */}
      {admins.length === 0 ? (
        <div className="bg-white/5 backdrop-blur-sm border border-[var(--orange-light)]/20 rounded-xl p-12 text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-[var(--gold)]/20 to-[var(--orange)]/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-[var(--gold)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Aucun administrateur
          </h3>
          <p className="text-white/60 mb-6">
            Commencez par créer un administrateur
          </p>
          <Link
            href="/admin/dashboard/admins/new"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[var(--gold)] to-[var(--orange)] text-white rounded-lg hover:shadow-lg hover:shadow-[var(--orange)]/20 transition-all font-medium"
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            Nouvel Administrateur
          </Link>
        </div>
      ) : (
        <div className="bg-white/5 backdrop-blur-sm border border-[var(--orange-light)]/20 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                  Rôle
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                  Date de création
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {admins.map((admin) => (
                <tr
                  key={admin.id}
                  className="hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-[var(--gold)] to-[var(--orange)] rounded-full flex items-center justify-center mr-3">
                        <span className="text-sm font-bold text-white">
                          {admin.email.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-medium">{admin.email}</p>
                        {admin.id === currentUserId && (
                          <span className="text-xs text-[var(--gold)]">
                            (Vous)
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-[var(--gold)]/10 text-[var(--gold)] rounded-full text-xs font-medium">
                      {admin.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-white/70 text-sm">
                    {new Date(admin.created_at).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {admin.id === currentUserId ? (
                      <span className="text-white/40 text-sm">
                        Compte actuel
                      </span>
                    ) : (
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/dashboard/admins/${admin.id}`}
                          className="px-4 py-2 bg-[var(--gold)]/10 text-[var(--gold)] rounded-lg hover:bg-[var(--gold)]/20 transition-all text-sm font-medium inline-flex items-center"
                        >
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                          Modifier
                        </Link>
                        <button
                          onClick={() => handleDelete(admin.id, admin.email)}
                          className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-all text-sm font-medium inline-flex items-center"
                        >
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          Supprimer
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
