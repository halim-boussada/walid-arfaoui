'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface Blog {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  image_url: string;
  published: boolean;
  created_at: string;
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [blogsLoading, setBlogsLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch('/api/blogs?published=true');
        const data = await response.json();
        if (data.success) {
          setBlogs(data.blogs);
        }
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setBlogsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--cream)] to-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex-shrink-0">
              <Link href="/" className="text-2xl font-semibold tracking-tight">
                <span className="text-[var(--navy-dark)]">Maître Arfaoui</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              <Link href="/#expertise" className="text-gray-700 hover:bg-gradient-to-r hover:from-[var(--gold)] hover:to-[var(--orange)] hover:bg-clip-text hover:text-transparent transition-all text-sm font-medium">
                Expertise
              </Link>
              <Link href="/#publications" className="text-gray-700 hover:bg-gradient-to-r hover:from-[var(--gold)] hover:to-[var(--orange)] hover:bg-clip-text hover:text-transparent transition-all text-sm font-medium">
                Publications
              </Link>
              <Link href="/blogs" className="bg-gradient-to-r from-[var(--gold)] to-[var(--orange)] bg-clip-text text-transparent transition-all text-sm font-bold">
                Blog
              </Link>
              <Link href="/#parcours" className="text-gray-700 hover:bg-gradient-to-r hover:from-[var(--gold)] hover:to-[var(--orange)] hover:bg-clip-text hover:text-transparent transition-all text-sm font-medium">
                Parcours
              </Link>
              <Link href="/#contact" className="text-gray-700 hover:bg-gradient-to-r hover:from-[var(--gold)] hover:to-[var(--orange)] hover:bg-clip-text hover:text-transparent transition-all text-sm font-medium">
                Contact
              </Link>
            </div>

            {/* CTA Button */}
            <div className="hidden md:block">
              <Link
                href="/#contact"
                className="inline-flex items-center px-6 py-2.5 bg-gradient-to-r from-[var(--gold)] to-[var(--orange)] text-white text-sm font-bold rounded-md hover:shadow-lg hover:shadow-[var(--orange)]/40 transition-all"
              >
                Prendre rendez-vous
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-4 space-y-3">
              <Link href="/#expertise" className="block text-gray-700 hover:text-[var(--gold)] transition-colors text-sm font-medium">
                Expertise
              </Link>
              <Link href="/#publications" className="block text-gray-700 hover:text-[var(--gold)] transition-colors text-sm font-medium">
                Publications
              </Link>
              <Link href="/blogs" className="block bg-gradient-to-r from-[var(--gold)] to-[var(--orange)] bg-clip-text text-transparent text-sm font-bold">
                Blog
              </Link>
              <Link href="/#parcours" className="block text-gray-700 hover:text-[var(--gold)] transition-colors text-sm font-medium">
                Parcours
              </Link>
              <Link href="/#contact" className="block text-gray-700 hover:text-[var(--gold)] transition-colors text-sm font-medium">
                Contact
              </Link>
              <Link
                href="/#contact"
                className="block w-full text-center px-6 py-2.5 bg-gradient-to-r from-[var(--gold)] to-[var(--orange)] text-white text-sm font-bold rounded-md hover:shadow-lg hover:shadow-[var(--orange)]/40 transition-all"
              >
                Prendre rendez-vous
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Header */}
      <div className="bg-gradient-to-r from-[var(--navy-dark)] to-[var(--navy)] pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-white mb-6">
            Actualités & Analyses Juridiques
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Découvrez nos articles d'expertise sur le droit pénal financier, la réconciliation pénale, et bien plus encore
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Blogs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogsLoading ? (
            // Loading skeletons
            [1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-lg border border-[var(--orange-light)]/20 animate-pulse">
                <div className="aspect-video bg-gradient-to-br from-[var(--gold)]/10 to-[var(--orange)]/10"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-4 w-1/3"></div>
                  <div className="h-6 bg-gray-200 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4 w-2/3"></div>
                </div>
              </div>
            ))
          ) : blogs.length > 0 ? (
            blogs.map((blog) => (
              <Link
                key={blog.id}
                href={`/blogs/${blog.slug}`}
                className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all border border-[var(--orange-light)]/20 hover:border-[var(--orange)]/40"
              >
                <div className="aspect-video bg-gradient-to-br from-[var(--gold)]/20 to-[var(--orange)]/20 relative overflow-hidden">
                  {blog.image_url ? (
                    <img
                      src={blog.image_url}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="w-20 h-20 text-[var(--orange)]/40 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-gradient-to-r from-[var(--gold)]/10 to-[var(--orange)]/10 border border-[var(--orange-light)]/30 rounded-full text-xs font-semibold bg-gradient-to-r from-[var(--gold)] to-[var(--orange)] bg-clip-text text-transparent">
                      Article
                    </span>
                    <span className="text-xs text-gray-500">{new Date(blog.created_at).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <h2 className="text-xl font-bold text-[var(--navy-dark)] mb-3 group-hover:bg-gradient-to-r group-hover:from-[var(--gold)] group-hover:to-[var(--orange)] group-hover:bg-clip-text group-hover:text-transparent transition-all leading-tight">
                    {blog.title}
                  </h2>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                    {blog.excerpt}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div>
                      <p className="text-xs text-gray-500">{blog.author || 'Maître Arfaoui'}</p>
                    </div>
                    <span className="text-sm font-semibold bg-gradient-to-r from-[var(--gold)] to-[var(--orange)] bg-clip-text text-transparent group-hover:translate-x-1 transition-transform inline-flex items-center">
                      Lire
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            // Empty state
            <div className="col-span-full text-center py-20">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-[var(--gold)]/20 to-[var(--orange)]/20 rounded-full mb-6">
                <svg className="w-10 h-10 text-[var(--orange)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[var(--navy-dark)] mb-3">Aucun article disponible</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Revenez bientôt pour découvrir nos analyses juridiques et nos articles d'expertise
              </p>
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="mt-20 bg-gradient-to-r from-[var(--navy-dark)] to-[var(--navy)] rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Besoin de conseils juridiques personnalisés ?
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Notre équipe d'experts est à votre disposition pour analyser votre situation et vous proposer une stratégie adaptée
          </p>
          <Link
            href="/#contact"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[var(--gold)] to-[var(--orange)] text-white font-bold rounded-lg hover:shadow-2xl hover:shadow-[var(--orange)]/60 transition-all transform hover:scale-105"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Prendre rendez-vous
          </Link>
        </div>
      </div>
    </div>
  );
}
