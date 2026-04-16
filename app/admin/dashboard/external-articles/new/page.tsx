'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function NewExternalArticlePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    external_link: '',
    publication_name: '',
    published_date: '',
    published: true,
  });
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Veuillez sélectionner une image valide');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('L\'image ne doit pas dépasser 5MB');
      return;
    }

    setUploading(true);
    setError('');

    const uploadFormData = new FormData();
    uploadFormData.append('image', file);

    try {
      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: uploadFormData,
      });

      const data = await response.json();

      if (response.ok) {
        setFormData({ ...formData, image_url: data.url });
        setImagePreview(data.url);
      } else {
        const errorMsg = data.details
          ? `${data.error}: ${data.details}`
          : data.error || 'Erreur lors du téléchargement de l\'image';
        setError(errorMsg);
        console.error('Upload error:', data);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Erreur lors du téléchargement de l\'image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate required fields
    if (!formData.title || !formData.description || !formData.external_link) {
      setError('Le titre, la description et le lien sont requis');
      return;
    }

    // Validate URL format
    try {
      new URL(formData.external_link);
    } catch {
      setError('Le lien externe n\'est pas valide');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/external-articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/admin/dashboard/external-articles');
        router.refresh();
      } else {
        const errorMsg = data.details
          ? `${data.error}: ${data.details}`
          : data.error || 'Erreur lors de la création';
        setError(errorMsg);
        console.error('Server error:', data);
      }
    } catch (error) {
      console.error('Error creating external article:', error);
      setError('Erreur lors de la création de l\'article');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/dashboard/external-articles"
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
          Retour aux articles externes
        </Link>
        <h1 className="text-3xl font-bold text-white mb-2">
          Nouvel Article Externe
        </h1>
        <p className="text-white/60">
          Ajoutez une publication externe mentionnant votre cabinet
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

          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-white mb-2"
            >
              Titre <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-4 py-3 bg-white/5 border border-[var(--orange-light)]/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent transition-all"
              placeholder="Titre de l'article"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-white mb-2"
            >
              Description <span className="text-red-400">*</span>
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              className="w-full px-4 py-3 bg-white/5 border border-[var(--orange-light)]/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent transition-all resize-none"
              placeholder="Description de l'article"
              required
            />
          </div>

          {/* External Link */}
          <div>
            <label
              htmlFor="external_link"
              className="block text-sm font-medium text-white mb-2"
            >
              Lien externe <span className="text-red-400">*</span>
            </label>
            <input
              type="url"
              id="external_link"
              value={formData.external_link}
              onChange={(e) =>
                setFormData({ ...formData, external_link: e.target.value })
              }
              className="w-full px-4 py-3 bg-white/5 border border-[var(--orange-light)]/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent transition-all"
              placeholder="https://example.com/article"
              required
            />
            <p className="text-xs text-white/50 mt-2">
              Le lien vers l&apos;article externe
            </p>
          </div>

          {/* Publication Name */}
          <div>
            <label
              htmlFor="publication_name"
              className="block text-sm font-medium text-white mb-2"
            >
              Nom de la publication
            </label>
            <input
              type="text"
              id="publication_name"
              value={formData.publication_name}
              onChange={(e) =>
                setFormData({ ...formData, publication_name: e.target.value })
              }
              className="w-full px-4 py-3 bg-white/5 border border-[var(--orange-light)]/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent transition-all"
              placeholder="Ex: Le Monde, Le Figaro..."
            />
          </div>

          {/* Published Date */}
          <div>
            <label
              htmlFor="published_date"
              className="block text-sm font-medium text-white mb-2"
            >
              Date de publication
            </label>
            <input
              type="date"
              id="published_date"
              value={formData.published_date}
              onChange={(e) =>
                setFormData({ ...formData, published_date: e.target.value })
              }
              className="w-full px-4 py-3 bg-white/5 border border-[var(--orange-light)]/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent transition-all"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Image de l&apos;article
            </label>

            {imagePreview ? (
              <div className="relative w-full h-64 rounded-lg overflow-hidden mb-4">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, image_url: '' });
                    setImagePreview('');
                  }}
                  className="absolute top-2 right-2 p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-lg transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="relative">
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="hidden"
                />
                <label
                  htmlFor="image"
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-[var(--orange-light)]/30 rounded-lg cursor-pointer hover:border-[var(--orange-light)]/50 transition-colors bg-white/5"
                >
                  {uploading ? (
                    <div className="flex flex-col items-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--gold)] mb-4"></div>
                      <p className="text-white/60">Téléchargement...</p>
                    </div>
                  ) : (
                    <>
                      <svg
                        className="w-12 h-12 text-white/40 mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="text-white/60 mb-2">
                        Cliquez pour télécharger une image
                      </p>
                      <p className="text-xs text-white/40">
                        PNG, JPG, WEBP (max 5MB)
                      </p>
                    </>
                  )}
                </label>
              </div>
            )}
          </div>

          {/* Published Status */}
          <div>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.published}
                onChange={(e) =>
                  setFormData({ ...formData, published: e.target.checked })
                }
                className="w-5 h-5 rounded border-[var(--orange-light)]/30 bg-white/5 text-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)] focus:ring-offset-0 transition-all"
              />
              <span className="ml-3 text-white">Publier immédiatement</span>
            </label>
            <p className="text-xs text-white/50 mt-2 ml-8">
              Décochez pour enregistrer comme brouillon
            </p>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center gap-4 pt-6 border-t border-white/10">
            <button
              type="submit"
              disabled={loading || uploading}
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
                  Créer l&apos;article
                </>
              )}
            </button>
            <Link
              href="/admin/dashboard/external-articles"
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
