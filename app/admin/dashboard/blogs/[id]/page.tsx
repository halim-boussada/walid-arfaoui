'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [blogId, setBlogId] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    author: '',
    image_url: '',
    published: false,
  });

  useEffect(() => {
    const loadParams = async () => {
      const resolvedParams = await params;
      setBlogId(resolvedParams.id);
    };
    loadParams();
  }, [params]);

  useEffect(() => {
    if (blogId) {
      fetchBlog();
    }
  }, [blogId]);

  const fetchBlog = async () => {
    try {
      const response = await fetch(`/api/blogs/${blogId}`);
      const data = await response.json();

      if (data.success) {
        const blog = data.blog;
        setFormData({
          title: blog.title,
          slug: blog.slug,
          excerpt: blog.excerpt || '',
          content: blog.content,
          author: blog.author || '',
          image_url: blog.image_url || '',
          published: blog.published,
        });
        // Set existing image as preview
        if (blog.image_url) {
          setImagePreview(blog.image_url);
        }
      } else {
        setError('Failed to fetch blog');
      }
    } catch (err) {
      setError('An error occurred while fetching the blog');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return formData.image_url || null;

    setUploading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('image', imageFile);

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: uploadFormData,
      });

      const data = await response.json();

      if (data.success) {
        return data.imageUrl;
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (err) {
      console.error('Image upload error:', err);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      // Upload new image if there's a file
      let imageUrl = formData.image_url;
      if (imageFile) {
        const uploadedUrl = await uploadImage();
        if (!uploadedUrl) {
          setError('Failed to upload image');
          setSaving(false);
          return;
        }
        imageUrl = uploadedUrl;
      }

      const response = await fetch(`/api/blogs/${blogId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, image_url: imageUrl }),
      });

      const data = await response.json();

      if (data.success) {
        router.push('/admin/dashboard/blogs');
      } else {
        setError(data.error || 'Failed to update blog');
        setSaving(false);
      }
    } catch (err) {
      setError('An error occurred while updating the blog');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-[var(--orange)] border-t-transparent rounded-full animate-spin mb-4"></div>
          <div className="text-white/70">Chargement de l'article...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Modifier l'Article</h1>
          <p className="text-white/70">Modifiez et mettez à jour votre article de blog</p>
        </div>
        <button
          onClick={() => router.back()}
          className="px-4 py-2.5 text-white bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-colors"
        >
          Annuler
        </button>
      </div>

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

      <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-xl border border-[var(--orange-light)]/30 rounded-xl shadow-2xl p-8 space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-white mb-2">
            Titre * <span className="text-[var(--gold)]">•</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/50 focus:border-[var(--gold)] transition-all"
            placeholder="Entrez le titre de l'article"
          />
        </div>

        <div>
          <label htmlFor="slug" className="block text-sm font-semibold text-white mb-2">
            Slug * <span className="text-white/50 text-xs font-normal">(Version URL-friendly)</span>
          </label>
          <input
            type="text"
            id="slug"
            name="slug"
            required
            value={formData.slug}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/50 focus:border-[var(--gold)] transition-all font-mono text-sm"
            placeholder="titre-de-l-article"
          />
        </div>

        <div>
          <label htmlFor="excerpt" className="block text-sm font-semibold text-white mb-2">
            Extrait
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            rows={3}
            value={formData.excerpt}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/50 focus:border-[var(--gold)] transition-all resize-none"
            placeholder="Courte description de l'article"
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-semibold text-white mb-2">
            Contenu * <span className="text-[var(--gold)]">•</span>
          </label>
          <textarea
            id="content"
            name="content"
            rows={12}
            required
            value={formData.content}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/50 focus:border-[var(--gold)] transition-all resize-none"
            placeholder="Rédigez le contenu de votre article ici..."
          />
          <p className="text-xs text-white/50 mt-2">Supports Markdown formatting</p>
        </div>

        <div>
          <label htmlFor="author" className="block text-sm font-semibold text-white mb-2">
            Auteur
          </label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/50 focus:border-[var(--gold)] transition-all"
            placeholder="Nom de l'auteur"
          />
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-semibold text-white mb-2">
            Image à la Une
          </label>
          <div className="relative">
            <input
              type="file"
              id="image"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              onChange={handleImageChange}
              className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gradient-to-r file:from-[var(--gold)] file:to-[var(--orange)] file:text-white file:font-semibold file:cursor-pointer hover:file:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/50"
            />
          </div>
          {imagePreview && (
            <div className="mt-4 p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg">
              <p className="text-xs text-white/70 mb-3 font-semibold">Image actuelle/Aperçu:</p>
              <img
                src={imagePreview}
                alt="Preview"
                className="max-w-full h-auto rounded-lg border border-[var(--orange-light)]/30 shadow-lg"
              />
            </div>
          )}
        </div>

        <div className="flex items-center p-4 bg-white/5 backdrop-blur-sm border border-white/20 rounded-lg">
          <input
            type="checkbox"
            id="published"
            name="published"
            checked={formData.published}
            onChange={handleChange}
            className="h-5 w-5 text-[var(--gold)] bg-white/10 border-white/30 rounded focus:ring-2 focus:ring-[var(--gold)]/50 cursor-pointer"
          />
          <label htmlFor="published" className="ml-3 block text-sm font-medium text-white cursor-pointer">
            Publier cet article immédiatement
          </label>
        </div>

        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-white/10">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 text-white bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-all font-medium"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={saving || uploading}
            className="group px-6 py-3 bg-gradient-to-r from-[var(--gold)] to-[var(--orange)] text-white font-semibold rounded-lg hover:shadow-xl hover:shadow-[var(--orange)]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none relative overflow-hidden"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
            <span className="relative flex items-center">
              {uploading ? (
                <>
                  <svg className="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Envoi de l'image...
                </>
              ) : saving ? (
                <>
                  <svg className="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enregistrement...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Enregistrer les Modifications
                </>
              )}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
