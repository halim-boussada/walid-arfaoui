'use client';

import { useEffect, useState } from 'react';

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: string;
  archived: boolean;
  created_at: string;
}

interface Pagination {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}

export default function ContactsPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    totalCount: 0,
    totalPages: 0,
  });
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  useEffect(() => {
    fetchMessages();
  }, [pagination.page, showArchived]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/contact?page=${pagination.page}&limit=${pagination.limit}&archived=${showArchived}`
      );
      const data = await response.json();

      if (data.success) {
        setMessages(data.messages);
        setPagination(data.pagination);
      } else {
        setError('Failed to fetch messages');
      }
    } catch (err) {
      setError('An error occurred while fetching messages');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) {
      return;
    }

    try {
      const response = await fetch(`/api/contact/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setMessages(messages.filter((msg) => msg.id !== id));
        if (selectedMessage?.id === id) {
          setSelectedMessage(null);
        }
      } else {
        alert('Échec de la suppression du message');
      }
    } catch (err) {
      alert('Une erreur s\'est produite lors de la suppression');
    }
  };

  const handleArchive = async (id: number, archived: boolean) => {
    try {
      const response = await fetch(`/api/contact/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ archived }),
      });

      const data = await response.json();

      if (data.success) {
        setMessages(messages.filter((msg) => msg.id !== id));
        if (selectedMessage?.id === id) {
          setSelectedMessage(null);
        }
      } else {
        alert('Échec de l\'archivage du message');
      }
    } catch (err) {
      alert('Une erreur s\'est produite lors de l\'archivage');
    }
  };

  const handlePageChange = (newPage: number) => {
    setPagination({ ...pagination, page: newPage });
  };

  if (loading && messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-[var(--orange)] border-t-transparent rounded-full animate-spin mb-4"></div>
          <div className="text-white/70">Chargement des messages...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Messages de Contact</h1>
          <p className="text-white/70">Gérez les demandes de vos clients</p>
        </div>
        <button
          onClick={() => setShowArchived(!showArchived)}
          className="inline-flex items-center px-4 py-2.5 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
          {showArchived ? 'Voir les actifs' : 'Voir les archivés'}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-200 px-6 py-4 rounded-lg backdrop-blur-sm animate-fade-in">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        </div>
      )}

      {/* Empty State */}
      {messages.length === 0 ? (
        <div className="bg-white/10 backdrop-blur-xl border border-[var(--orange-light)]/30 rounded-xl shadow-2xl p-12 text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-[var(--gold)]/20 to-[var(--orange)]/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-[var(--gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            {showArchived ? 'Aucun message archivé' : 'Aucun message'}
          </h3>
          <p className="text-white/70 max-w-md mx-auto">
            {showArchived
              ? 'Vous n\'avez aucun message archivé pour le moment.'
              : 'Vous n\'avez reçu aucun message pour le moment. Les nouveaux messages apparaîtront ici.'}
          </p>
        </div>
      ) : (
        <>
          {/* Messages Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  onClick={() => setSelectedMessage(message)}
                  className={`group cursor-pointer bg-white/10 backdrop-blur-xl border rounded-xl p-6 transition-all hover:shadow-xl hover:shadow-[var(--orange)]/20 ${
                    selectedMessage?.id === message.id
                      ? 'border-[var(--gold)] shadow-xl shadow-[var(--orange)]/20'
                      : 'border-[var(--orange-light)]/30 hover:border-[var(--gold)]/50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-white mb-1 truncate">
                        {message.name}
                      </h3>
                      <p className="text-sm text-white/60">{message.email}</p>
                    </div>
                    <span className="ml-3 text-xs text-white/50">
                      {new Date(message.created_at).toLocaleDateString('fr-FR')}
                    </span>
                  </div>

                  {message.subject && (
                    <div className="mb-3">
                      <span className="inline-block px-3 py-1 bg-gradient-to-r from-[var(--gold)]/20 to-[var(--orange)]/20 border border-[var(--orange-light)]/30 rounded-full text-xs font-medium text-[var(--gold)]">
                        {message.subject}
                      </span>
                    </div>
                  )}

                  <p className="text-white/70 text-sm line-clamp-2 leading-relaxed">
                    {message.message}
                  </p>

                  {message.phone && (
                    <div className="flex items-center mt-3 text-sm text-white/60">
                      <svg className="w-4 h-4 mr-2 text-[var(--gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {message.phone}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Message Detail */}
            <div className="sticky top-6">
              {selectedMessage ? (
                <div className="bg-white/10 backdrop-blur-xl border border-[var(--orange-light)]/30 rounded-xl shadow-2xl p-8 space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-4">Détails du Message</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-semibold text-white/70">Nom</label>
                        <p className="text-white text-lg">{selectedMessage.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-white/70">Email</label>
                        <a
                          href={`mailto:${selectedMessage.email}`}
                          className="text-[var(--gold)] hover:text-[var(--gold-bright)] transition-colors"
                        >
                          {selectedMessage.email}
                        </a>
                      </div>
                      {selectedMessage.phone && (
                        <div>
                          <label className="text-sm font-semibold text-white/70">Téléphone</label>
                          <a
                            href={`tel:${selectedMessage.phone}`}
                            className="text-[var(--gold)] hover:text-[var(--gold-bright)] transition-colors"
                          >
                            {selectedMessage.phone}
                          </a>
                        </div>
                      )}
                      {selectedMessage.subject && (
                        <div>
                          <label className="text-sm font-semibold text-white/70">Domaine juridique</label>
                          <p className="text-white">{selectedMessage.subject}</p>
                        </div>
                      )}
                      <div>
                        <label className="text-sm font-semibold text-white/70">Message</label>
                        <div className="mt-2 p-4 bg-white/5 border border-white/10 rounded-lg">
                          <p className="text-white leading-relaxed whitespace-pre-wrap">
                            {selectedMessage.message}
                          </p>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-white/70">Reçu le</label>
                        <p className="text-white">
                          {new Date(selectedMessage.created_at).toLocaleDateString('fr-FR', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-6 border-t border-white/10">
                    <button
                      onClick={() => handleArchive(selectedMessage.id, !showArchived)}
                      className="flex-1 flex items-center justify-center px-4 py-3 bg-gradient-to-r from-[var(--gold)]/10 to-[var(--orange)]/10 border border-[var(--orange-light)]/30 text-white font-medium rounded-lg hover:from-[var(--gold)]/20 hover:to-[var(--orange)]/20 hover:border-[var(--gold)]/50 transition-all"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                      </svg>
                      {showArchived ? 'Désarchiver' : 'Archiver'}
                    </button>
                    <button
                      onClick={() => handleDelete(selectedMessage.id)}
                      className="px-4 py-3 bg-red-500/10 border border-red-500/30 text-red-300 font-medium rounded-lg hover:bg-red-500/20 hover:border-red-400/50 transition-all"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white/10 backdrop-blur-xl border border-[var(--orange-light)]/30 rounded-xl shadow-2xl p-12 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-[var(--gold)]/20 to-[var(--orange)]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-[var(--gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                    </svg>
                  </div>
                  <p className="text-white/70">Sélectionnez un message pour voir les détails</p>
                </div>
              )}
            </div>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Précédent
              </button>

              <div className="flex items-center gap-2">
                {[...Array(pagination.totalPages)].map((_, i) => {
                  const page = i + 1;
                  // Show first page, last page, current page, and pages around current
                  if (
                    page === 1 ||
                    page === pagination.totalPages ||
                    (page >= pagination.page - 1 && page <= pagination.page + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          page === pagination.page
                            ? 'bg-gradient-to-r from-[var(--gold)] to-[var(--orange)] text-white shadow-lg'
                            : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (page === pagination.page - 2 || page === pagination.page + 2) {
                    return <span key={page} className="text-white/50">...</span>;
                  }
                  return null;
                })}
              </div>

              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Suivant
              </button>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-xl border border-[var(--orange-light)]/30 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm mb-1">Total Messages</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-[var(--gold-bright)] to-[var(--orange)] bg-clip-text text-transparent">
                    {pagination.totalCount}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-[var(--gold)]/20 to-[var(--orange)]/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-[var(--gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xl border border-[var(--orange-light)]/30 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm mb-1">Page Actuelle</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-[var(--gold-bright)] to-[var(--orange)] bg-clip-text text-transparent">
                    {pagination.page}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-[var(--gold)]/20 to-[var(--orange)]/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-[var(--gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xl border border-[var(--orange-light)]/30 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm mb-1">Pages Totales</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-[var(--gold-bright)] to-[var(--orange)] bg-clip-text text-transparent">
                    {pagination.totalPages}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-[var(--gold)]/20 to-[var(--orange)]/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-[var(--gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
