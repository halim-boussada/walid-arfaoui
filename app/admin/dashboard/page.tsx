'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Stats {
  blogs: { total: number; published: number; draft: number };
  contacts: { total: number; unread: number; read: number };
  appointments: { total: number; pending: number; confirmed: number; cancelled: number };
  qa: { total: number; published: number; draft: number };
  externalArticles: { total: number; published: number; draft: number };
  admins: { total: number };
}

interface Activity {
  type: string;
  name: string;
  created_at: string;
  published: boolean;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats');
      const data = await response.json();

      if (data.success) {
        setStats(data.stats);
        setRecentActivity(data.recentActivity || []);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'blog':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
        );
      case 'contact':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case 'appointment':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'qa':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'external_article':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getActivityLabel = (type: string) => {
    switch (type) {
      case 'blog':
        return 'Blog';
      case 'contact':
        return 'Message';
      case 'appointment':
        return 'Rendez-vous';
      case 'qa':
        return 'Q&A';
      case 'external_article':
        return 'Article Externe';
      default:
        return type;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) {
      return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
    } else if (hours < 24) {
      return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
    } else if (days < 7) {
      return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
    } else {
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
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
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Card */}
      <div className="relative bg-white/10 backdrop-blur-xl border border-[var(--orange-light)]/30 rounded-2xl shadow-2xl p-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[var(--gold)]/10 to-[var(--orange)]/5 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Bienvenue sur le Panneau d&apos;Administration
              </h2>
              <p className="text-white/70 text-lg">
                Centre de contrôle pour gérer le site Arfaoui Law
              </p>
            </div>
            <div className="hidden sm:block p-3 bg-gradient-to-r from-[var(--gold)]/20 to-[var(--orange)]/20 rounded-xl border border-[var(--orange-light)]/30">
              <svg
                className="w-8 h-8 text-[var(--gold-bright)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Blogs */}
        <Link
          href="/admin/dashboard/blogs"
          className="group bg-white/10 backdrop-blur-xl border border-[var(--orange-light)]/30 rounded-xl shadow-lg p-6 hover:border-[var(--gold)]/50 transition-all duration-300 hover:shadow-2xl hover:shadow-[var(--orange)]/20 cursor-pointer"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex-shrink-0 bg-gradient-to-r from-[var(--gold)] to-[var(--orange)] rounded-lg p-3 group-hover:scale-110 transition-transform">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-white/70">Blogs</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-[var(--gold-bright)] to-[var(--orange)] bg-clip-text text-transparent">
                {stats?.blogs.total || 0}
              </p>
            </div>
          </div>
          <div className="flex gap-2 text-xs">
            <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded">
              {stats?.blogs.published || 0} publiés
            </span>
            <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded">
              {stats?.blogs.draft || 0} brouillons
            </span>
          </div>
        </Link>

        {/* Messages */}
        <Link
          href="/admin/dashboard/contacts"
          className="group bg-white/10 backdrop-blur-xl border border-[var(--orange-light)]/30 rounded-xl shadow-lg p-6 hover:border-[var(--gold)]/50 transition-all duration-300 hover:shadow-2xl hover:shadow-[var(--orange)]/20 cursor-pointer"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex-shrink-0 bg-gradient-to-r from-[var(--gold)] to-[var(--orange)] rounded-lg p-3 group-hover:scale-110 transition-transform">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-white/70">Messages</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-[var(--gold-bright)] to-[var(--orange)] bg-clip-text text-transparent">
                {stats?.contacts.total || 0}
              </p>
            </div>
          </div>
          <div className="flex gap-2 text-xs">
            <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded">
              {stats?.contacts.unread || 0} non lus
            </span>
            <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded">
              {stats?.contacts.read || 0} lus
            </span>
          </div>
        </Link>

        {/* Appointments */}
        <Link
          href="/admin/dashboard/appointments"
          className="group bg-white/10 backdrop-blur-xl border border-[var(--orange-light)]/30 rounded-xl shadow-lg p-6 hover:border-[var(--gold)]/50 transition-all duration-300 hover:shadow-2xl hover:shadow-[var(--orange)]/20 cursor-pointer"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex-shrink-0 bg-gradient-to-r from-[var(--gold)] to-[var(--orange)] rounded-lg p-3 group-hover:scale-110 transition-transform">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-white/70">Rendez-vous</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-[var(--gold-bright)] to-[var(--orange)] bg-clip-text text-transparent">
                {stats?.appointments.total || 0}
              </p>
            </div>
          </div>
          <div className="flex gap-2 text-xs">
            <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded">
              {stats?.appointments.pending || 0} en attente
            </span>
            <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded">
              {stats?.appointments.confirmed || 0} confirmés
            </span>
          </div>
        </Link>

        {/* Q&A */}
        <Link
          href="/admin/dashboard/qa"
          className="group bg-white/10 backdrop-blur-xl border border-[var(--orange-light)]/30 rounded-xl shadow-lg p-6 hover:border-[var(--gold)]/50 transition-all duration-300 hover:shadow-2xl hover:shadow-[var(--orange)]/20 cursor-pointer"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex-shrink-0 bg-gradient-to-r from-[var(--gold)] to-[var(--orange)] rounded-lg p-3 group-hover:scale-110 transition-transform">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-white/70">Questions & Réponses</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-[var(--gold-bright)] to-[var(--orange)] bg-clip-text text-transparent">
                {stats?.qa.total || 0}
              </p>
            </div>
          </div>
          <div className="flex gap-2 text-xs">
            <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded">
              {stats?.qa.published || 0} publiées
            </span>
            <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded">
              {stats?.qa.draft || 0} brouillons
            </span>
          </div>
        </Link>
      </div>

      {/* Secondary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* External Articles */}
        <Link
          href="/admin/dashboard/external-articles"
          className="group bg-white/10 backdrop-blur-xl border border-[var(--orange-light)]/30 rounded-xl shadow-lg p-6 hover:border-[var(--gold)]/50 transition-all duration-300 hover:shadow-2xl hover:shadow-[var(--orange)]/20 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-gradient-to-r from-[var(--gold)] to-[var(--orange)] rounded-lg p-3 group-hover:scale-110 transition-transform mr-4">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-white/70">Articles Externes</p>
                <p className="text-2xl font-bold text-white">{stats?.externalArticles.total || 0}</p>
                <div className="flex gap-2 text-xs mt-1">
                  <span className="text-green-400">{stats?.externalArticles.published || 0} publiés</span>
                  <span className="text-white/40">·</span>
                  <span className="text-yellow-400">{stats?.externalArticles.draft || 0} brouillons</span>
                </div>
              </div>
            </div>
          </div>
        </Link>

        {/* Admins */}
        <Link
          href="/admin/dashboard/admins"
          className="group bg-white/10 backdrop-blur-xl border border-[var(--orange-light)]/30 rounded-xl shadow-lg p-6 hover:border-[var(--gold)]/50 transition-all duration-300 hover:shadow-2xl hover:shadow-[var(--orange)]/20 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-gradient-to-r from-[var(--gold)] to-[var(--orange)] rounded-lg p-3 group-hover:scale-110 transition-transform mr-4">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-white/70">Administrateurs</p>
                <p className="text-2xl font-bold text-white">{stats?.admins.total || 0}</p>
                <p className="text-xs text-white/50 mt-1">Comptes actifs</p>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="bg-white/10 backdrop-blur-xl border border-[var(--orange-light)]/30 rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--orange-light)]/20 bg-gradient-to-r from-[var(--gold)]/5 to-[var(--orange)]/5">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <svg
              className="w-5 h-5 mr-2 text-[var(--gold)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Activité Récente
          </h3>
        </div>
        <div className="p-6">
          {recentActivity.length > 0 ? (
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 bg-white/5 rounded-lg border border-[var(--orange-light)]/10 hover:border-[var(--orange-light)]/30 transition-colors"
                >
                  <div className="flex-shrink-0 p-2 bg-gradient-to-r from-[var(--gold)]/20 to-[var(--orange)]/20 rounded-lg text-[var(--gold)]">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium px-2 py-0.5 bg-[var(--gold)]/20 text-[var(--gold-bright)] rounded">
                        {getActivityLabel(activity.type)}
                      </span>
                      {activity.published ? (
                        <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-400 rounded">
                          Publié
                        </span>
                      ) : (
                        <span className="text-xs px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded">
                          Brouillon
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-white font-medium truncate">{activity.name}</p>
                    <p className="text-xs text-white/50 mt-1">{formatDate(activity.created_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-gradient-to-r from-[var(--gold)]/20 to-[var(--orange)]/20 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-[var(--gold)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
              </div>
              <p className="text-white/60 text-center">Aucune activité récente à afficher</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white/10 backdrop-blur-xl border border-[var(--orange-light)]/30 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
          <svg
            className="w-5 h-5 mr-2 text-[var(--gold)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          Actions Rapides
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/dashboard/blogs/new"
            className="group flex items-center justify-center px-6 py-4 bg-gradient-to-r from-[var(--gold)]/10 to-[var(--orange)]/10 border border-[var(--orange-light)]/30 rounded-lg hover:from-[var(--gold)]/20 hover:to-[var(--orange)]/20 hover:border-[var(--gold)]/50 transition-all hover:shadow-xl hover:shadow-[var(--orange)]/20 hover:scale-105"
          >
            <svg
              className="w-5 h-5 mr-3 text-[var(--gold)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="font-medium text-white">Nouveau Blog</span>
          </Link>

          <Link
            href="/admin/dashboard/home-content"
            className="group flex items-center justify-center px-6 py-4 bg-gradient-to-r from-[var(--gold)]/10 to-[var(--orange)]/10 border border-[var(--orange-light)]/30 rounded-lg hover:from-[var(--gold)]/20 hover:to-[var(--orange)]/20 hover:border-[var(--gold)]/50 transition-all hover:shadow-xl hover:shadow-[var(--orange)]/20 hover:scale-105"
          >
            <svg
              className="w-5 h-5 mr-3 text-[var(--gold)]"
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
            <span className="font-medium text-white">Éditer Accueil</span>
          </Link>

          <Link
            href="/"
            target="_blank"
            className="group flex items-center justify-center px-6 py-4 bg-gradient-to-r from-[var(--gold)]/10 to-[var(--orange)]/10 border border-[var(--orange-light)]/30 rounded-lg hover:from-[var(--gold)]/20 hover:to-[var(--orange)]/20 hover:border-[var(--gold)]/50 transition-all hover:shadow-xl hover:shadow-[var(--orange)]/20 hover:scale-105"
          >
            <svg
              className="w-5 h-5 mr-3 text-[var(--gold)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            <span className="font-medium text-white">Voir le Site</span>
          </Link>

          <Link
            href="/admin/dashboard/settings"
            className="group flex items-center justify-center px-6 py-4 bg-gradient-to-r from-[var(--gold)]/10 to-[var(--orange)]/10 border border-[var(--orange-light)]/30 rounded-lg hover:from-[var(--gold)]/20 hover:to-[var(--orange)]/20 hover:border-[var(--gold)]/50 transition-all hover:shadow-xl hover:shadow-[var(--orange)]/20 hover:scale-105"
          >
            <svg
              className="w-5 h-5 mr-3 text-[var(--gold)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="font-medium text-white">Paramètres</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
