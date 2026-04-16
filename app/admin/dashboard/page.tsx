import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Card */}
      <div className="relative bg-white/10 backdrop-blur-xl border border-[var(--orange-light)]/30 rounded-2xl shadow-2xl p-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[var(--gold)]/10 to-[var(--orange)]/5 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Bienvenue sur le Panneau d'Administration
              </h2>
              <p className="text-white/70 text-lg">
                Centre de contrôle pour gérer le site Arfaoui Law
              </p>
            </div>
            <div className="hidden sm:block p-3 bg-gradient-to-r from-[var(--gold)]/20 to-[var(--orange)]/20 rounded-xl border border-[var(--orange-light)]/30">
              <svg className="w-8 h-8 text-[var(--gold-bright)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stat Card 1 */}
        <div className="group bg-white/10 backdrop-blur-xl border border-[var(--orange-light)]/30 rounded-xl shadow-lg p-6 hover:border-[var(--gold)]/50 transition-all duration-300 hover:shadow-2xl hover:shadow-[var(--orange)]/20">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-gradient-to-r from-[var(--gold)] to-[var(--orange)] rounded-lg p-3 group-hover:scale-110 transition-transform">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-white/70 truncate">
                  Contenu Total
                </dt>
                <dd className="text-3xl font-bold bg-gradient-to-r from-[var(--gold-bright)] to-[var(--orange)] bg-clip-text text-transparent">0</dd>
              </dl>
            </div>
          </div>
        </div>

        {/* Stat Card 2 */}
        <div className="group bg-white/10 backdrop-blur-xl border border-[var(--orange-light)]/30 rounded-xl shadow-lg p-6 hover:border-[var(--gold)]/50 transition-all duration-300 hover:shadow-2xl hover:shadow-[var(--orange)]/20">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-gradient-to-r from-[var(--gold)] to-[var(--orange)] rounded-lg p-3 group-hover:scale-110 transition-transform">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-white/70 truncate">
                  Visiteurs
                </dt>
                <dd className="text-3xl font-bold bg-gradient-to-r from-[var(--gold-bright)] to-[var(--orange)] bg-clip-text text-transparent">0</dd>
              </dl>
            </div>
          </div>
        </div>

        {/* Stat Card 3 */}
        <div className="group bg-white/10 backdrop-blur-xl border border-[var(--orange-light)]/30 rounded-xl shadow-lg p-6 hover:border-[var(--gold)]/50 transition-all duration-300 hover:shadow-2xl hover:shadow-[var(--orange)]/20">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-gradient-to-r from-[var(--gold)] to-[var(--orange)] rounded-lg p-3 group-hover:scale-110 transition-transform">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-white/70 truncate">
                  Messages
                </dt>
                <dd className="text-3xl font-bold bg-gradient-to-r from-[var(--gold-bright)] to-[var(--orange)] bg-clip-text text-transparent">0</dd>
              </dl>
            </div>
          </div>
        </div>

        {/* Stat Card 4 */}
        <div className="group bg-white/10 backdrop-blur-xl border border-[var(--orange-light)]/30 rounded-xl shadow-lg p-6 hover:border-[var(--gold)]/50 transition-all duration-300 hover:shadow-2xl hover:shadow-[var(--orange)]/20">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-gradient-to-r from-[var(--gold)] to-[var(--orange)] rounded-lg p-3 group-hover:scale-110 transition-transform">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-white/70 truncate">
                  Performance
                </dt>
                <dd className="text-3xl font-bold bg-gradient-to-r from-[var(--gold-bright)] to-[var(--orange)] bg-clip-text text-transparent">100%</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white/10 backdrop-blur-xl border border-[var(--orange-light)]/30 rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--orange-light)]/20 bg-gradient-to-r from-[var(--gold)]/5 to-[var(--orange)]/5">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <svg className="w-5 h-5 mr-2 text-[var(--gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Activité Récente
          </h3>
        </div>
        <div className="p-6">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-gradient-to-r from-[var(--gold)]/20 to-[var(--orange)]/20 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-[var(--gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="text-white/60 text-center">
              Aucune activité récente à afficher
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white/10 backdrop-blur-xl border border-[var(--orange-light)]/30 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
          <svg className="w-5 h-5 mr-2 text-[var(--gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Actions Rapides
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/dashboard/blogs/new"
            className="group flex items-center justify-center px-6 py-4 bg-gradient-to-r from-[var(--gold)]/10 to-[var(--orange)]/10 border border-[var(--orange-light)]/30 rounded-lg hover:from-[var(--gold)]/20 hover:to-[var(--orange)]/20 hover:border-[var(--gold)]/50 transition-all hover:shadow-xl hover:shadow-[var(--orange)]/20 hover:scale-105"
          >
            <svg className="w-5 h-5 mr-3 text-[var(--gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="font-medium text-white">Nouveau Contenu</span>
          </Link>

          <Link
            href="/"
            target="_blank"
            className="group flex items-center justify-center px-6 py-4 bg-gradient-to-r from-[var(--gold)]/10 to-[var(--orange)]/10 border border-[var(--orange-light)]/30 rounded-lg hover:from-[var(--gold)]/20 hover:to-[var(--orange)]/20 hover:border-[var(--gold)]/50 transition-all hover:shadow-xl hover:shadow-[var(--orange)]/20 hover:scale-105"
          >
            <svg className="w-5 h-5 mr-3 text-[var(--gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span className="font-medium text-white">Voir le Site</span>
          </Link>

          <Link
            href="/admin/dashboard/settings"
            className="group flex items-center justify-center px-6 py-4 bg-gradient-to-r from-[var(--gold)]/10 to-[var(--orange)]/10 border border-[var(--orange-light)]/30 rounded-lg hover:from-[var(--gold)]/20 hover:to-[var(--orange)]/20 hover:border-[var(--gold)]/50 transition-all hover:shadow-xl hover:shadow-[var(--orange)]/20 hover:scale-105"
          >
            <svg className="w-5 h-5 mr-3 text-[var(--gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="font-medium text-white">Paramètres</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
