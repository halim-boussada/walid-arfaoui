'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

interface User {
  userId: number;
  email: string;
  role: string;
  can_view_dashboard?: boolean;
  can_view_blogs?: boolean;
  can_view_messages?: boolean;
  can_view_qa?: boolean;
  can_view_external_articles?: boolean;
  can_view_home_content?: boolean;
  can_view_appointments?: boolean;
  can_view_admins?: boolean;
  can_view_settings?: boolean;
}

export default function AdminLayout({
  children,
  user,
}: {
  children: React.ReactNode;
  user: User;
}) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      window.location.href = '/admin/login';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-[var(--navy-dark)] via-[var(--navy)] to-[var(--navy-light)]">
        {/* Animated floating elements */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-[var(--gold)]/10 to-[var(--orange)]/5 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-1/3 left-1/3 w-[500px] h-[500px] bg-gradient-to-r from-[var(--orange)]/8 to-[var(--gold)]/3 rounded-full blur-3xl animate-float-slower"></div>

        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(251, 146, 60, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(251, 146, 60, 0.15) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[var(--navy-dark)]/80 backdrop-blur-xl border-r border-[var(--orange-light)]/20 text-white transform transition-transform duration-200 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-[var(--orange-light)]/20">
            <Link href="/" className="flex items-center group">
              <div className="w-8 h-8 bg-gradient-to-r from-[var(--gold)] to-[var(--orange)] rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-[var(--gold-bright)] to-[var(--orange)] bg-clip-text text-transparent">
                Arfaoui Law
              </h1>
            </Link>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden text-white/60 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {(user.role === 'super_admin' || user.can_view_dashboard !== false) && (
              <Link
                href="/admin/dashboard"
                className="group flex items-center px-4 py-3 text-white/80 rounded-lg hover:bg-gradient-to-r hover:from-[var(--gold)]/20 hover:to-[var(--orange)]/10 hover:text-white transition-all border border-transparent hover:border-[var(--orange-light)]/30"
              >
                <svg className="w-5 h-5 mr-3 text-[var(--gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Dashboard
              </Link>
            )}

            {(user.role === 'super_admin' || user.can_view_blogs !== false) && (
              <Link
                href="/admin/dashboard/blogs"
                className="group flex items-center px-4 py-3 text-white/80 rounded-lg hover:bg-gradient-to-r hover:from-[var(--gold)]/20 hover:to-[var(--orange)]/10 hover:text-white transition-all border border-transparent hover:border-[var(--orange-light)]/30"
              >
                <svg className="w-5 h-5 mr-3 text-[var(--gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                Blogs
              </Link>
            )}

            {(user.role === 'super_admin' || user.can_view_messages !== false) && (
              <Link
                href="/admin/dashboard/contacts"
                className="group flex items-center px-4 py-3 text-white/80 rounded-lg hover:bg-gradient-to-r hover:from-[var(--gold)]/20 hover:to-[var(--orange)]/10 hover:text-white transition-all border border-transparent hover:border-[var(--orange-light)]/30"
              >
                <svg className="w-5 h-5 mr-3 text-[var(--gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Messages
              </Link>
            )}

            {(user.role === 'super_admin' || user.can_view_qa !== false) && (
              <Link
                href="/admin/dashboard/qa"
                className="group flex items-center px-4 py-3 text-white/80 rounded-lg hover:bg-gradient-to-r hover:from-[var(--gold)]/20 hover:to-[var(--orange)]/10 hover:text-white transition-all border border-transparent hover:border-[var(--orange-light)]/30"
              >
                <svg className="w-5 h-5 mr-3 text-[var(--gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Questions & Réponses
              </Link>
            )}

            {(user.role === 'super_admin' || user.can_view_external_articles !== false) && (
              <Link
                href="/admin/dashboard/external-articles"
                className="group flex items-center px-4 py-3 text-white/80 rounded-lg hover:bg-gradient-to-r hover:from-[var(--gold)]/20 hover:to-[var(--orange)]/10 hover:text-white transition-all border border-transparent hover:border-[var(--orange-light)]/30"
              >
                <svg className="w-5 h-5 mr-3 text-[var(--gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                Articles Externes
              </Link>
            )}

            {(user.role === 'super_admin' || user.can_view_home_content !== false) && (
              <Link
                href="/admin/dashboard/home-content"
                className="group flex items-center px-4 py-3 text-white/80 rounded-lg hover:bg-gradient-to-r hover:from-[var(--gold)]/20 hover:to-[var(--orange)]/10 hover:text-white transition-all border border-transparent hover:border-[var(--orange-light)]/30"
              >
                <svg className="w-5 h-5 mr-3 text-[var(--gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Contenu Accueil
              </Link>
            )}

            {(user.role === 'super_admin' || user.can_view_appointments !== false) && (
              <Link
                href="/admin/dashboard/appointments"
                className="group flex items-center px-4 py-3 text-white/80 rounded-lg hover:bg-gradient-to-r hover:from-[var(--gold)]/20 hover:to-[var(--orange)]/10 hover:text-white transition-all border border-transparent hover:border-[var(--orange-light)]/30"
              >
                <svg className="w-5 h-5 mr-3 text-[var(--gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Rendez-vous
              </Link>
            )}

            {(user.role === 'super_admin' || user.can_view_admins === true) && (
              <Link
                href="/admin/dashboard/admins"
                className="group flex items-center px-4 py-3 text-white/80 rounded-lg hover:bg-gradient-to-r hover:from-[var(--gold)]/20 hover:to-[var(--orange)]/10 hover:text-white transition-all border border-transparent hover:border-[var(--orange-light)]/30"
              >
                <svg className="w-5 h-5 mr-3 text-[var(--gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Administrateurs
              </Link>
            )}

            {(user.role === 'super_admin' || user.can_view_settings !== false) && (
              <Link
                href="/admin/dashboard/settings"
                className="group flex items-center px-4 py-3 text-white/80 rounded-lg hover:bg-gradient-to-r hover:from-[var(--gold)]/20 hover:to-[var(--orange)]/10 hover:text-white transition-all border border-transparent hover:border-[var(--orange-light)]/30"
              >
                <svg className="w-5 h-5 mr-3 text-[var(--gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Paramètres
              </Link>
            )}

            {/* <Link
              href="/admin/dashboard/content"
              className="group flex items-center px-4 py-3 text-white/80 rounded-lg hover:bg-gradient-to-r hover:from-[var(--gold)]/20 hover:to-[var(--orange)]/10 hover:text-white transition-all border border-transparent hover:border-[var(--orange-light)]/30"
            >
              <svg className="w-5 h-5 mr-3 text-[var(--gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Content
            </Link> */}

            {/* <Link
              href="/admin/dashboard/settings"
              className="group flex items-center px-4 py-3 text-white/80 rounded-lg hover:bg-gradient-to-r hover:from-[var(--gold)]/20 hover:to-[var(--orange)]/10 hover:text-white transition-all border border-transparent hover:border-[var(--orange-light)]/30"
            >
              <svg className="w-5 h-5 mr-3 text-[var(--gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </Link> */}
          </nav>

          {/* User info and logout */}
          <div className="px-4 py-4 border-t border-[var(--orange-light)]/20 bg-[var(--navy-dark)]/50 backdrop-blur-sm">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-gradient-to-r from-[var(--gold)] to-[var(--orange)] rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-white">
                  {user.email.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user.email}</p>
                <p className="text-xs text-[var(--gold)]">{user.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="group w-full flex items-center justify-center px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-[var(--gold)]/10 to-[var(--orange)]/10 border border-[var(--orange-light)]/30 rounded-lg hover:from-[var(--gold)]/20 hover:to-[var(--orange)]/20 hover:border-[var(--orange-light)]/50 transition-all"
            >
              <svg className="w-4 h-4 mr-2 text-[var(--gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Déconnexion
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div
        className={`relative z-10 transition-all duration-200 ${
          isSidebarOpen ? 'lg:ml-64' : ''
        }`}
      >
        {/* Header */}
        <header className="bg-white/5 backdrop-blur-sm border-b border-[var(--orange-light)]/20">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-white/80 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h2 className="text-xl font-semibold text-white">
              Panneau d&apos;Administration
            </h2>
            <Link
              href="/"
              className="text-sm text-white/70 hover:text-white transition-colors flex items-center"
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Accueil
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
