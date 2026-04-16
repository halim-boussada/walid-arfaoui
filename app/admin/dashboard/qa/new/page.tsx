'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewQAPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: '',
    display_order: 0,
    published: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/qa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/admin/dashboard/qa');
        router.refresh();
      } else {
        const data = await response.json();
        alert(data.error || 'Erreur lors de la création');
      }
    } catch (error) {
      console.error('Error creating Q&A:', error);
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
          href="/admin/dashboard/qa"
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
          Retour aux questions
        </Link>
        <h1 className="text-3xl font-bold text-white mb-2">
          Nouvelle Question
        </h1>
        <p className="text-white/60">
          Ajoutez une nouvelle question fréquemment posée
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="bg-white/5 backdrop-blur-sm border border-[var(--orange-light)]/20 rounded-xl p-8 space-y-6">
          {/* Question */}
          <div>
            <label
              htmlFor="question"
              className="block text-sm font-medium text-white mb-2"
            >
              Question <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="question"
              value={formData.question}
              onChange={(e) =>
                setFormData({ ...formData, question: e.target.value })
              }
              className="w-full px-4 py-3 bg-white/5 border border-[var(--orange-light)]/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent transition-all"
              placeholder="Quelle est votre question ?"
              required
            />
          </div>

          {/* Answer */}
          <div>
            <label
              htmlFor="answer"
              className="block text-sm font-medium text-white mb-2"
            >
              Réponse <span className="text-red-400">*</span>
            </label>
            <textarea
              id="answer"
              value={formData.answer}
              onChange={(e) =>
                setFormData({ ...formData, answer: e.target.value })
              }
              rows={6}
              className="w-full px-4 py-3 bg-white/5 border border-[var(--orange-light)]/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent transition-all resize-none"
              placeholder="Répondez à la question..."
              required
            />
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-white mb-2"
            >
              Catégorie
            </label>
            <input
              type="text"
              id="category"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full px-4 py-3 bg-white/5 border border-[var(--orange-light)]/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent transition-all"
              placeholder="Ex: Droit de la famille, Droit commercial..."
            />
          </div>

          {/* Display Order */}
          <div>
            <label
              htmlFor="display_order"
              className="block text-sm font-medium text-white mb-2"
            >
              Ordre d'affichage
            </label>
            <input
              type="number"
              id="display_order"
              value={formData.display_order}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  display_order: parseInt(e.target.value),
                })
              }
              className="w-full px-4 py-3 bg-white/5 border border-[var(--orange-light)]/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent transition-all"
              placeholder="0"
            />
            <p className="text-xs text-white/50 mt-2">
              Les questions avec un ordre plus petit apparaissent en premier
            </p>
          </div>

          {/* Published */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="published"
              checked={formData.published}
              onChange={(e) =>
                setFormData({ ...formData, published: e.target.checked })
              }
              className="w-5 h-5 bg-white/5 border-[var(--orange-light)]/30 rounded text-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)] focus:ring-offset-0"
            />
            <label
              htmlFor="published"
              className="ml-3 text-sm font-medium text-white"
            >
              Publier cette question
            </label>
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
                  Créer la question
                </>
              )}
            </button>
            <Link
              href="/admin/dashboard/qa"
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
