'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface Admin {
  id: number;
  email: string;
  role: string;
  can_view_dashboard: boolean;
  can_view_blogs: boolean;
  can_view_messages: boolean;
  can_view_qa: boolean;
  can_view_external_articles: boolean;
  can_view_home_content: boolean;
  can_view_appointments: boolean;
  can_view_admins: boolean;
  can_view_settings: boolean;
}

export default function EditAdminPage() {
  const router = useRouter();
  const params = useParams();
  const adminId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [role, setRole] = useState('admin');
  const [permissions, setPermissions] = useState({
    can_view_dashboard: true,
    can_view_blogs: true,
    can_view_messages: true,
    can_view_qa: true,
    can_view_external_articles: true,
    can_view_home_content: true,
    can_view_appointments: true,
    can_view_admins: false,
    can_view_settings: true,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchAdmin();
  }, [adminId]);

  // Auto-update permissions when role changes
  useEffect(() => {
    if (role === 'super_admin') {
      setPermissions({
        can_view_dashboard: true,
        can_view_blogs: true,
        can_view_messages: true,
        can_view_qa: true,
        can_view_external_articles: true,
        can_view_home_content: true,
        can_view_appointments: true,
        can_view_admins: true,
        can_view_settings: true,
      });
    } else if (admin && role !== admin.role) {
      // Only reset if role is changing from what was loaded
      setPermissions({
        can_view_dashboard: true,
        can_view_blogs: true,
        can_view_messages: true,
        can_view_qa: true,
        can_view_external_articles: true,
        can_view_home_content: true,
        can_view_appointments: true,
        can_view_admins: false,
        can_view_settings: true,
      });
    }
  }, [role]);

  const fetchAdmin = async () => {
    try {
      const response = await fetch(`/api/admins/${adminId}`);
      const data = await response.json();

      if (data.success) {
        setAdmin(data.admin);
        setRole(data.admin.role);
        setPermissions({
          can_view_dashboard: data.admin.can_view_dashboard,
          can_view_blogs: data.admin.can_view_blogs,
          can_view_messages: data.admin.can_view_messages,
          can_view_qa: data.admin.can_view_qa,
          can_view_external_articles: data.admin.can_view_external_articles,
          can_view_home_content: data.admin.can_view_home_content,
          can_view_appointments: data.admin.can_view_appointments,
          can_view_admins: data.admin.can_view_admins,
          can_view_settings: data.admin.can_view_settings,
        });
      } else {
        setError('Admin introuvable');
      }
    } catch (error) {
      console.error('Error fetching admin:', error);
      setError('Erreur lors du chargement de l\'administrateur');
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionChange = (permission: keyof typeof permissions) => {
    setPermissions(prev => ({
      ...prev,
      [permission]: !prev[permission],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const response = await fetch(`/api/admins/${adminId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: role,
          permissions: permissions,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Administrateur modifié avec succès');
        setTimeout(() => {
          router.push('/admin/dashboard/admins');
          router.refresh();
        }, 1500);
      } else {
        const errorMsg = data.error || 'Erreur lors de la modification';
        setError(errorMsg);
        console.error('Server error:', data);
      }
    } catch (error) {
      console.error('Error updating admin:', error);
      setError('Erreur lors de la modification de l\'administrateur');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--gold)]"></div>
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
          <p className="text-red-400">{error || 'Administrateur introuvable'}</p>
        </div>
      </div>
    );
  }

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
          Modifier Administrateur
        </h1>
        <p className="text-white/60">
          Modifiez le rôle et les permissions de {admin.email}
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

          {success && (
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <p className="text-green-400 text-sm">{success}</p>
            </div>
          )}

          {/* Email (read-only) */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-white mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={admin.email}
              disabled
              className="w-full px-4 py-3 bg-white/5 border border-[var(--orange-light)]/30 rounded-lg text-white/50 cursor-not-allowed"
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
              value={role}
              onChange={(e) => setRole(e.target.value)}
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
              Super Admin peut voir toutes les sections y compris Administrateurs
            </p>
          </div>

          {/* Permissions */}
          <div>
            <label className="block text-sm font-medium text-white mb-3">
              Permissions d'accès
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex items-center p-3 bg-white/5 border border-[var(--orange-light)]/20 rounded-lg cursor-pointer hover:bg-white/10 transition-all">
                <input
                  type="checkbox"
                  checked={permissions.can_view_dashboard}
                  onChange={() => handlePermissionChange('can_view_dashboard')}
                  className="w-4 h-4 text-[var(--gold)] bg-white/10 border-[var(--orange-light)]/30 rounded focus:ring-[var(--gold)] focus:ring-2"
                />
                <span className="ml-3 text-sm text-white">Dashboard</span>
              </label>

              <label className="flex items-center p-3 bg-white/5 border border-[var(--orange-light)]/20 rounded-lg cursor-pointer hover:bg-white/10 transition-all">
                <input
                  type="checkbox"
                  checked={permissions.can_view_blogs}
                  onChange={() => handlePermissionChange('can_view_blogs')}
                  className="w-4 h-4 text-[var(--gold)] bg-white/10 border-[var(--orange-light)]/30 rounded focus:ring-[var(--gold)] focus:ring-2"
                />
                <span className="ml-3 text-sm text-white">Blogs</span>
              </label>

              <label className="flex items-center p-3 bg-white/5 border border-[var(--orange-light)]/20 rounded-lg cursor-pointer hover:bg-white/10 transition-all">
                <input
                  type="checkbox"
                  checked={permissions.can_view_messages}
                  onChange={() => handlePermissionChange('can_view_messages')}
                  className="w-4 h-4 text-[var(--gold)] bg-white/10 border-[var(--orange-light)]/30 rounded focus:ring-[var(--gold)] focus:ring-2"
                />
                <span className="ml-3 text-sm text-white">Messages</span>
              </label>

              <label className="flex items-center p-3 bg-white/5 border border-[var(--orange-light)]/20 rounded-lg cursor-pointer hover:bg-white/10 transition-all">
                <input
                  type="checkbox"
                  checked={permissions.can_view_qa}
                  onChange={() => handlePermissionChange('can_view_qa')}
                  className="w-4 h-4 text-[var(--gold)] bg-white/10 border-[var(--orange-light)]/30 rounded focus:ring-[var(--gold)] focus:ring-2"
                />
                <span className="ml-3 text-sm text-white">Questions & Réponses</span>
              </label>

              <label className="flex items-center p-3 bg-white/5 border border-[var(--orange-light)]/20 rounded-lg cursor-pointer hover:bg-white/10 transition-all">
                <input
                  type="checkbox"
                  checked={permissions.can_view_external_articles}
                  onChange={() => handlePermissionChange('can_view_external_articles')}
                  className="w-4 h-4 text-[var(--gold)] bg-white/10 border-[var(--orange-light)]/30 rounded focus:ring-[var(--gold)] focus:ring-2"
                />
                <span className="ml-3 text-sm text-white">Articles Externes</span>
              </label>

              <label className="flex items-center p-3 bg-white/5 border border-[var(--orange-light)]/20 rounded-lg cursor-pointer hover:bg-white/10 transition-all">
                <input
                  type="checkbox"
                  checked={permissions.can_view_home_content}
                  onChange={() => handlePermissionChange('can_view_home_content')}
                  className="w-4 h-4 text-[var(--gold)] bg-white/10 border-[var(--orange-light)]/30 rounded focus:ring-[var(--gold)] focus:ring-2"
                />
                <span className="ml-3 text-sm text-white">Contenu Accueil</span>
              </label>

              <label className="flex items-center p-3 bg-white/5 border border-[var(--orange-light)]/20 rounded-lg cursor-pointer hover:bg-white/10 transition-all">
                <input
                  type="checkbox"
                  checked={permissions.can_view_appointments}
                  onChange={() => handlePermissionChange('can_view_appointments')}
                  className="w-4 h-4 text-[var(--gold)] bg-white/10 border-[var(--orange-light)]/30 rounded focus:ring-[var(--gold)] focus:ring-2"
                />
                <span className="ml-3 text-sm text-white">Rendez-vous</span>
              </label>

              <label className="flex items-center p-3 bg-white/5 border border-[var(--orange-light)]/20 rounded-lg cursor-pointer hover:bg-white/10 transition-all">
                <input
                  type="checkbox"
                  checked={permissions.can_view_admins}
                  onChange={() => handlePermissionChange('can_view_admins')}
                  disabled={role !== 'super_admin'}
                  className="w-4 h-4 text-[var(--gold)] bg-white/10 border-[var(--orange-light)]/30 rounded focus:ring-[var(--gold)] focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <span className={`ml-3 text-sm ${role !== 'super_admin' ? 'text-white/50' : 'text-white'}`}>
                  Administrateurs {role !== 'super_admin' && '(Super Admin uniquement)'}
                </span>
              </label>

              <label className="flex items-center p-3 bg-white/5 border border-[var(--orange-light)]/20 rounded-lg cursor-pointer hover:bg-white/10 transition-all">
                <input
                  type="checkbox"
                  checked={permissions.can_view_settings}
                  onChange={() => handlePermissionChange('can_view_settings')}
                  className="w-4 h-4 text-[var(--gold)] bg-white/10 border-[var(--orange-light)]/30 rounded focus:ring-[var(--gold)] focus:ring-2"
                />
                <span className="ml-3 text-sm text-white">Paramètres</span>
              </label>
            </div>
            <p className="text-xs text-white/50 mt-3">
              Sélectionnez les sections auxquelles cet administrateur aura accès
            </p>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center gap-4 pt-6 border-t border-white/10">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-gradient-to-r from-[var(--gold)] to-[var(--orange)] text-white rounded-lg hover:shadow-lg hover:shadow-[var(--orange)]/20 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {saving ? (
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
                  Enregistrement...
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
                  Enregistrer les modifications
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
