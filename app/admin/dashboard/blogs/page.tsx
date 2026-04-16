'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Blog {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  published: boolean;
  created_at: string;
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await fetch('/api/blogs');
      const data = await response.json();

      if (data.success) {
        setBlogs(data.blogs);
      } else {
        setError('Failed to fetch blogs');
      }
    } catch (err) {
      setError('An error occurred while fetching blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      return;
    }

    try {
      const response = await fetch(`/api/blogs/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setBlogs(blogs.filter((blog) => blog.id !== id));
      } else {
        alert('Échec de la suppression de l\'article');
      }
    } catch (err) {
      alert('Une erreur s\'est produite lors de la suppression');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-[var(--orange)] border-t-transparent rounded-full animate-spin mb-4"></div>
          <div className="text-white/70">Chargement des articles...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Articles du Blog</h1>
          <p className="text-white/70">Gérez vos publications et articles juridiques</p>
        </div>
        <Link
          href="/admin/dashboard/blogs/new"
          className="group inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-[var(--gold)] to-[var(--orange)] text-white font-semibold rounded-lg hover:shadow-xl hover:shadow-[var(--orange)]/30 transition-all hover:scale-105"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nouvel Article
        </Link>
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
      {blogs.length === 0 ? (
        <div className="bg-white/10 backdrop-blur-xl border border-[var(--orange-light)]/30 rounded-xl shadow-2xl p-12 text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-[var(--gold)]/20 to-[var(--orange)]/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-[var(--gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Aucun article</h3>
          <p className="text-white/70 mb-8 max-w-md mx-auto">
            Commencez par créer votre premier article de blog pour partager votre expertise juridique.
          </p>
          <Link
            href="/admin/dashboard/blogs/new"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[var(--gold)] to-[var(--orange)] text-white font-semibold rounded-lg hover:shadow-xl hover:shadow-[var(--orange)]/30 transition-all hover:scale-105"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Créer un Article
          </Link>
        </div>
      ) : (
        /* Blog Cards Grid */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="group bg-white/10 backdrop-blur-xl border border-[var(--orange-light)]/30 rounded-xl shadow-lg hover:shadow-2xl hover:shadow-[var(--orange)]/20 transition-all hover:border-[var(--gold)]/50 p-6"
            >
              {/* Blog Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-white mb-1 group-hover:bg-gradient-to-r group-hover:from-[var(--gold-bright)] group-hover:to-[var(--orange)] group-hover:bg-clip-text group-hover:text-transparent transition-all line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="text-sm text-white/50 font-mono">{blog.slug}</p>
                </div>
                <div className="ml-4">
                  {blog.published ? (
                    <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-full text-xs font-semibold text-green-300">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                      Publié
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-400/30 rounded-full text-xs font-semibold text-yellow-300">
                      <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                      Brouillon
                    </span>
                  )}
                </div>
              </div>

              {/* Blog Excerpt */}
              {blog.excerpt && (
                <p className="text-white/70 text-sm leading-relaxed mb-4 line-clamp-2">
                  {blog.excerpt}
                </p>
              )}

              {/* Blog Meta */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
                <div className="flex items-center text-sm text-white/60">
                  <svg className="w-4 h-4 mr-2 text-[var(--gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {blog.author || 'Anonyme'}
                </div>
                <div className="flex items-center text-sm text-white/60">
                  <svg className="w-4 h-4 mr-2 text-[var(--gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {new Date(blog.created_at).toLocaleDateString('fr-FR')}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <Link
                  href={`/admin/dashboard/blogs/${blog.id}`}
                  className="flex-1 flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-[var(--gold)]/10 to-[var(--orange)]/10 border border-[var(--orange-light)]/30 text-white font-medium rounded-lg hover:from-[var(--gold)]/20 hover:to-[var(--orange)]/20 hover:border-[var(--gold)]/50 transition-all group/edit"
                >
                  <svg className="w-4 h-4 mr-2 text-[var(--gold)] group-hover/edit:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Modifier
                </Link>
                <button
                  onClick={() => handleDelete(blog.id)}
                  className="px-4 py-2.5 bg-red-500/10 border border-red-500/30 text-red-300 font-medium rounded-lg hover:bg-red-500/20 hover:border-red-400/50 transition-all group/delete"
                >
                  <svg className="w-5 h-5 group-hover/delete:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats Summary */}
      {blogs.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
          <div className="bg-white/10 backdrop-blur-xl border border-[var(--orange-light)]/30 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm mb-1">Total Articles</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-[var(--gold-bright)] to-[var(--orange)] bg-clip-text text-transparent">
                  {blogs.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-[var(--gold)]/20 to-[var(--orange)]/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-[var(--gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl border border-[var(--orange-light)]/30 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm mb-1">Publiés</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-[var(--gold-bright)] to-[var(--orange)] bg-clip-text text-transparent">
                  {blogs.filter(b => b.published).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl border border-[var(--orange-light)]/30 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm mb-1">Brouillons</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-[var(--gold-bright)] to-[var(--orange)] bg-clip-text text-transparent">
                  {blogs.filter(b => !b.published).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
