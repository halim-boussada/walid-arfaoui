'use client';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useState, useEffect } from 'react';

interface Blog {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  image_url: string;
  published: boolean;
  created_at: string;
}

export default function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const [slug, setSlug] = useState<string>('');
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const loadParams = async () => {
      const resolvedParams = await params;
      setSlug(resolvedParams.slug);
    };
    loadParams();
  }, [params]);

  useEffect(() => {
    if (!slug) return;

    const fetchBlog = async () => {
      try {
        const response = await fetch(`/api/blogs?published=true`);
        const data = await response.json();
        if (data.success) {
          const foundBlog = data.blogs.find((b: Blog) => b.slug === slug);
          if (foundBlog) {
            setBlog(foundBlog);
          } else {
            notFound();
          }
        }
      } catch (error) {
        console.error('Error fetching blog:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[var(--orange)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de l'article...</p>
        </div>
      </div>
    );
  }

  if (!blog) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
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
      <div className="bg-gradient-to-r from-[var(--navy-dark)] to-[var(--navy)] pt-32 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/blogs"
            className="inline-flex items-center text-[var(--gold-bright)] hover:text-[var(--orange-light)] transition-colors mb-8 group"
          >
            <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour aux articles
          </Link>

          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">
            {blog.title}
          </h1>

          <div className="flex items-center gap-6 text-gray-300">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[var(--gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-sm">{blog.author || 'Maître Arfaoui'}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[var(--gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm">{new Date(blog.created_at).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      {blog.image_url && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-12">
          <div className="aspect-video rounded-2xl shadow-2xl relative overflow-hidden">
            <img
              src={blog.image_url}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="prose prose-lg max-w-none">
          <div className="bg-gradient-to-br from-[var(--cream)] to-white p-8 rounded-xl border border-[var(--orange-light)]/20 mb-8">
            <p className="text-xl text-gray-700 leading-relaxed font-medium">
              {blog.excerpt}
            </p>
          </div>

          <div className="text-gray-800 leading-relaxed space-y-6">
            {blog.content.split('\n').map((paragraph, index) => {
              // Handle headings
              if (paragraph.startsWith('# ')) {
                return <h1 key={index} className="text-4xl font-bold text-[var(--navy-dark)] mt-12 mb-6">{paragraph.replace('# ', '')}</h1>;
              }
              if (paragraph.startsWith('## ')) {
                return <h2 key={index} className="text-3xl font-bold bg-gradient-to-r from-[var(--navy-dark)] to-[var(--navy)] bg-clip-text text-transparent mt-10 mb-5">{paragraph.replace('## ', '')}</h2>;
              }
              if (paragraph.startsWith('### ')) {
                return <h3 key={index} className="text-2xl font-bold text-[var(--navy-dark)] mt-8 mb-4">{paragraph.replace('### ', '')}</h3>;
              }
              // Handle list items
              if (paragraph.startsWith('- ')) {
                return (
                  <li key={index} className="ml-6 text-gray-700 leading-relaxed flex items-start gap-3">
                    <span className="text-[var(--orange)] mt-2">•</span>
                    <span>{paragraph.replace('- ', '')}</span>
                  </li>
                );
              }
              // Handle numbered lists
              if (/^\d+\./.test(paragraph)) {
                return <li key={index} className="ml-6 text-gray-700 leading-relaxed">{paragraph.replace(/^\d+\.\s/, '')}</li>;
              }
              // Handle regular paragraphs
              if (paragraph.trim()) {
                return <p key={index} className="text-gray-700 leading-relaxed text-lg">{paragraph}</p>;
              }
              return null;
            })}
          </div>
        </div>

        {/* Author Bio */}
        <div className="mt-16 p-8 bg-gradient-to-br from-[var(--navy-dark)] to-[var(--navy)] rounded-2xl">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-[var(--gold)] to-[var(--orange)] rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-3xl font-bold text-white">MA</span>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white mb-2">{blog.author || 'Maître Walid Arfaoui'}</h3>
              <p className="text-gray-300 leading-relaxed">
                Avocat au Barreau de Tunis, spécialisé en droit pénal financier et réconciliation pénale. Plus de 250 dossiers traités avec succès.
              </p>
              <Link
                href="/#contact"
                className="inline-flex items-center mt-4 text-[var(--gold-bright)] hover:text-[var(--orange-light)] font-semibold transition-colors group"
              >
                Prendre rendez-vous
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-[var(--navy-dark)] mb-4">Partager cet article</h3>
          <div className="flex gap-4">
            <button className="px-6 py-3 bg-gradient-to-r from-[var(--gold)]/10 to-[var(--orange)]/10 border border-[var(--orange-light)]/30 rounded-lg hover:from-[var(--gold)]/20 hover:to-[var(--orange)]/20 transition-all flex items-center gap-2">
              <svg className="w-5 h-5 text-[var(--orange)]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </button>
            <button className="px-6 py-3 bg-gradient-to-r from-[var(--gold)]/10 to-[var(--orange)]/10 border border-[var(--orange-light)]/30 rounded-lg hover:from-[var(--gold)]/20 hover:to-[var(--orange)]/20 transition-all flex items-center gap-2">
              <svg className="w-5 h-5 text-[var(--orange)]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
              Twitter
            </button>
            <button className="px-6 py-3 bg-gradient-to-r from-[var(--gold)]/10 to-[var(--orange)]/10 border border-[var(--orange-light)]/30 rounded-lg hover:from-[var(--gold)]/20 hover:to-[var(--orange)]/20 transition-all flex items-center gap-2">
              <svg className="w-5 h-5 text-[var(--orange)]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              LinkedIn
            </button>
          </div>
        </div> */}
      </article>

      {/* Related Articles CTA */}
      <div className="bg-gradient-to-br from-[var(--cream)] to-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[var(--navy-dark)] to-[var(--navy)] bg-clip-text text-transparent mb-4">
            Explorez plus d'articles
          </h2>
          <p className="text-gray-600 mb-8">
            Découvrez d'autres analyses juridiques et conseils d'experts
          </p>
          <Link
            href="/blogs"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[var(--gold)] to-[var(--orange)] text-white font-bold rounded-lg hover:shadow-2xl hover:shadow-[var(--orange)]/60 transition-all transform hover:scale-105"
          >
            Voir tous les articles
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
