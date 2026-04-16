'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface QAItem {
  id: number;
  question: string;
  answer: string;
  category: string | null;
  display_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export default function QAPage() {
  const router = useRouter();
  const [qaItems, setQaItems] = useState<QAItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQAItems();
  }, []);

  const fetchQAItems = async () => {
    try {
      const response = await fetch('/api/qa');
      const data = await response.json();

      if (data.success) {
        setQaItems(data.qa);
      }
    } catch (error) {
      console.error('Error fetching Q&A items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette question ?')) {
      return;
    }

    try {
      const response = await fetch(`/api/qa/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setQaItems(qaItems.filter((item) => item.id !== id));
      } else {
        alert('Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Error deleting Q&A item:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const togglePublished = async (id: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/qa/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ published: !currentStatus }),
      });

      if (response.ok) {
        setQaItems(
          qaItems.map((item) =>
            item.id === id ? { ...item, published: !currentStatus } : item
          )
        );
      }
    } catch (error) {
      console.error('Error toggling published status:', error);
    }
  };

  const publishedCount = qaItems.filter((item) => item.published).length;
  const draftCount = qaItems.filter((item) => !item.published).length;

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
            Questions & Réponses
          </h1>
          <p className="text-white/60">
            Gérez les questions fréquemment posées
          </p>
        </div>
        <Link
          href="/admin/dashboard/qa/new"
          className="group px-6 py-3 bg-gradient-to-r from-[var(--gold)] to-[var(--orange)] text-white rounded-lg hover:shadow-lg hover:shadow-[var(--orange)]/20 transition-all font-medium flex items-center"
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
          Nouvelle Question
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/5 backdrop-blur-sm border border-[var(--orange-light)]/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm mb-1">Total</p>
              <p className="text-3xl font-bold text-white">{qaItems.length}</p>
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
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-[var(--orange-light)]/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm mb-1">Publiées</p>
              <p className="text-3xl font-bold text-white">{publishedCount}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-[var(--orange-light)]/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm mb-1">Brouillons</p>
              <p className="text-3xl font-bold text-white">{draftCount}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-gray-500/20 to-slate-500/20 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Q&A Items */}
      {qaItems.length === 0 ? (
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
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Aucune question
          </h3>
          <p className="text-white/60 mb-6">
            Commencez par créer votre première question
          </p>
          <Link
            href="/admin/dashboard/qa/new"
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
            Nouvelle Question
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {qaItems.map((item) => (
            <div
              key={item.id}
              className="group bg-white/5 backdrop-blur-sm border border-[var(--orange-light)]/20 rounded-xl p-6 hover:border-[var(--orange-light)]/40 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-[var(--gold)] group-hover:to-[var(--orange)] group-hover:bg-clip-text transition-all">
                      {item.question}
                    </h3>
                    {item.published ? (
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium flex items-center">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                        Publié
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs font-medium">
                        Brouillon
                      </span>
                    )}
                    {item.category && (
                      <span className="px-3 py-1 bg-[var(--gold)]/10 text-[var(--gold)] rounded-full text-xs font-medium">
                        {item.category}
                      </span>
                    )}
                  </div>
                  <p className="text-white/70 text-sm line-clamp-2 mb-3">
                    {item.answer}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-white/50">
                    <span>Ordre: {item.display_order}</span>
                    <span>•</span>
                    <span>
                      Créé le{' '}
                      {new Date(item.created_at).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <Link
                  href={`/admin/dashboard/qa/${item.id}`}
                  className="px-4 py-2 bg-[var(--gold)]/10 text-[var(--gold)] rounded-lg hover:bg-[var(--gold)]/20 transition-all text-sm font-medium flex items-center"
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
                  onClick={() => togglePublished(item.id, item.published)}
                  className="px-4 py-2 bg-white/5 text-white/80 rounded-lg hover:bg-white/10 transition-all text-sm font-medium flex items-center"
                >
                  {item.published ? (
                    <>
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
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                      Dépublier
                    </>
                  ) : (
                    <>
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
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      Publier
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="ml-auto px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-all text-sm font-medium flex items-center"
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
