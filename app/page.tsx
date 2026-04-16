'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

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

interface ExternalArticle {
  id: number;
  title: string;
  description: string;
  image_url: string | null;
  external_link: string;
  publication_name: string | null;
  published_date: string | null;
  published: boolean;
  created_at: string;
}

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);
  const [recentBlogs, setRecentBlogs] = useState<Blog[]>([]);
  const [blogsLoading, setBlogsLoading] = useState(true);
  const [externalArticles, setExternalArticles] = useState<ExternalArticle[]>([]);
  const [articlesLoading, setArticlesLoading] = useState(true);
  const [qaItems, setQaItems] = useState<QAItem[]>([]);
  const [qaLoading, setQaLoading] = useState(true);

  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [contactLoading, setContactLoading] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);
  const [contactError, setContactError] = useState('');

  // Appointment form state
  const [appointmentForm, setAppointmentForm] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    reason: '',
  });
  const [appointmentLoading, setAppointmentLoading] = useState(false);
  const [appointmentSuccess, setAppointmentSuccess] = useState(false);
  const [appointmentError, setAppointmentError] = useState('');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch('/api/blogs?published=true&limit=3');
        const data = await response.json();
        if (data.success) {
          setRecentBlogs(data.blogs);
        }
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setBlogsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  useEffect(() => {
    const fetchExternalArticles = async () => {
      try {
        const response = await fetch('/api/external-articles?published=true');
        const data = await response.json();
        if (data.success) {
          // Limit to 3 most recent articles
          setExternalArticles(data.articles.slice(0, 3));
        }
      } catch (error) {
        console.error('Error fetching external articles:', error);
      } finally {
        setArticlesLoading(false);
      }
    };

    fetchExternalArticles();
  }, []);

  useEffect(() => {
    const fetchQA = async () => {
      try {
        const response = await fetch('/api/qa?published=true');
        const data = await response.json();
        if (data.success) {
          setQaItems(data.qa);
        }
      } catch (error) {
        console.error('Error fetching Q&A:', error);
      } finally {
        setQaLoading(false);
      }
    };

    fetchQA();
  }, []);

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactLoading(true);
    setContactError('');
    setContactSuccess(false);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactForm),
      });

      const data = await response.json();

      if (response.ok) {
        setContactSuccess(true);
        setContactForm({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        });
        // Reset success message after 5 seconds
        setTimeout(() => setContactSuccess(false), 5000);
      } else {
        setContactError(data.error || 'Une erreur est survenue');
      }
    } catch (error) {
      setContactError('Une erreur est survenue lors de l\'envoi du message');
    } finally {
      setContactLoading(false);
    }
  };

  const handleAppointmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAppointmentLoading(true);
    setAppointmentError('');
    setAppointmentSuccess(false);

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentForm),
      });

      const data = await response.json();

      if (response.ok) {
        setAppointmentSuccess(true);
        setAppointmentForm({
          name: '',
          email: '',
          phone: '',
          date: '',
          time: '',
          reason: '',
        });
        // Reset success message after 5 seconds
        setTimeout(() => setAppointmentSuccess(false), 5000);
      } else {
        setAppointmentError(data.error || 'Une erreur est survenue');
      }
    } catch (error) {
      setAppointmentError('Une erreur est survenue lors de la prise de rendez-vous');
    } finally {
      setAppointmentLoading(false);
    }
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LegalService',
            name: 'Cabinet Arfaoui Law & Consulting',
            description:
              'Cabinet d\'avocats spécialisé en droit pénal financier, réconciliation pénale, droits de la défense et droit du sport à Tunis',
            url: 'https://maitrearfaoui.com',
            logo: 'https://maitrearfaoui.com/logo.png',
            image: 'https://maitrearfaoui.com/og-image.png',
            telephone: '+216',
            email: 'contact@maitrearfaoui.com',
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Tunis',
              addressCountry: 'TN',
            },
            geo: {
              '@type': 'GeoCoordinates',
              latitude: '36.8065',
              longitude: '10.1815',
            },
            openingHours: 'Mo-Fr 09:00-17:00',
            priceRange: '$$',
            founder: {
              '@type': 'Person',
              name: 'Walid Arfaoui',
              jobTitle: 'Avocat au Barreau de Tunis',
            },
            areaServed: {
              '@type': 'Country',
              name: 'Tunisia',
            },
          }),
        }}
      />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex-shrink-0">
              <a href="#" className="text-2xl font-semibold tracking-tight">
                <span className="text-[var(--navy-dark)]">Maître Arfaoui</span>
              </a>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              <a href="#expertise" className="text-gray-700 hover:bg-gradient-to-r hover:from-[var(--gold)] hover:to-[var(--orange)] hover:bg-clip-text hover:text-transparent transition-all text-sm font-medium">
                Expertise
              </a>
              <a href="#publications" className="text-gray-700 hover:bg-gradient-to-r hover:from-[var(--gold)] hover:to-[var(--orange)] hover:bg-clip-text hover:text-transparent transition-all text-sm font-medium">
                Publications
              </a>
              <Link href="/blogs" className="text-gray-700 hover:bg-gradient-to-r hover:from-[var(--gold)] hover:to-[var(--orange)] hover:bg-clip-text hover:text-transparent transition-all text-sm font-medium">
                Blog
              </Link>
              <a href="#parcours" className="text-gray-700 hover:bg-gradient-to-r hover:from-[var(--gold)] hover:to-[var(--orange)] hover:bg-clip-text hover:text-transparent transition-all text-sm font-medium">
                Parcours
              </a>
              <a href="#contact" className="text-gray-700 hover:bg-gradient-to-r hover:from-[var(--gold)] hover:to-[var(--orange)] hover:bg-clip-text hover:text-transparent transition-all text-sm font-medium">
                Contact
              </a>
            </div>

            {/* CTA Button */}
            <div className="hidden md:block">
              <button
                onClick={() => setAppointmentModalOpen(true)}
                className="inline-flex items-center px-6 py-2.5 bg-gradient-to-r from-[var(--gold)] to-[var(--orange)] text-white text-sm font-bold rounded-md hover:shadow-lg hover:shadow-[var(--orange)]/40 transition-all"
              >
                Prendre rendez-vous
              </button>
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
              <a href="#expertise" className="block text-gray-700 hover:text-[var(--gold)] transition-colors text-sm font-medium">
                Expertise
              </a>
              <a href="#publications" className="block text-gray-700 hover:text-[var(--gold)] transition-colors text-sm font-medium">
                Publications
              </a>
              <Link href="/blogs" className="block text-gray-700 hover:text-[var(--gold)] transition-colors text-sm font-medium">
                Blog
              </Link>
              <a href="#parcours" className="block text-gray-700 hover:text-[var(--gold)] transition-colors text-sm font-medium">
                Parcours
              </a>
              <a href="#contact" className="block text-gray-700 hover:text-[var(--gold)] transition-colors text-sm font-medium">
                Contact
              </a>
              <button
                onClick={() => {
                  setAppointmentModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-center px-6 py-2.5 bg-gradient-to-r from-[var(--gold)] to-[var(--orange)] text-white text-sm font-bold rounded-md hover:shadow-lg hover:shadow-[var(--orange)]/40 transition-all"
              >
                Prendre rendez-vous
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Image with Parallax Effect */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'url(/maitre.jpg)',
              transform: 'scale(1.1)',
            }}
          ></div>
          {/* Dark overlay gradient - darker on left (bookshelf), lighter on right (lawyer) */}
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--navy-dark)]/95 via-[var(--navy-dark)]/70 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--navy-dark)]/40 via-transparent to-[var(--navy-dark)]/60"></div>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-[var(--gold)]/15 to-[var(--orange)]/10 rounded-full blur-3xl animate-float-slow"></div>
          <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-gradient-to-r from-[var(--orange)]/10 to-[var(--gold)]/5 rounded-full blur-3xl animate-float-slower"></div>
          <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-[var(--orange-light)]/10 rounded-full blur-3xl animate-float"></div>
        </div>

        {/* Professional grid overlay */}
        <div className="absolute inset-0 z-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(251, 146, 60, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(251, 146, 60, 0.15) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        {/* Floating legal elements - more subtle */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <svg className="absolute top-32 right-16 w-20 h-20 text-[var(--orange-light)]/15 animate-float" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          <svg className="absolute bottom-40 left-20 w-16 h-16 text-[var(--gold-bright)]/15 animate-float-slower" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm3 1h6v4H7V5zm6 6H7v2h6v-2z" clipRule="evenodd" />
          </svg>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto relative z-10 w-full py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className="text-left">
              {/* Professional Badge */}
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[var(--gold)]/20 to-[var(--orange)]/20 backdrop-blur-md rounded-full mb-6 border border-[var(--orange-light)]/50 animate-fade-in-down shadow-lg shadow-[var(--gold)]/20">
                <div className="w-2 h-2 bg-gradient-to-r from-[var(--gold-bright)] to-[var(--orange)] rounded-full mr-3 animate-pulse"></div>
                <span className="bg-gradient-to-r from-[var(--gold-bright)] to-[var(--orange-light)] bg-clip-text text-transparent text-sm font-bold tracking-wide">CABINET D'AVOCATS — TUNIS</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-[1.1] animate-fade-in-up">
                Faire valoir<br />
                vos <span className="bg-gradient-to-r from-[var(--gold-bright)] via-[var(--orange-light)] to-[var(--orange)] bg-clip-text text-transparent relative inline-block">
                  droits
                  <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 200 8" preserveAspectRatio="none">
                    <path d="M0,4 Q50,0 100,4 T200,4" stroke="url(#gradient-underline)" strokeWidth="3" fill="none"/>
                    <defs>
                      <linearGradient id="gradient-underline" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="var(--gold-bright)" stopOpacity="0.6"/>
                        <stop offset="100%" stopColor="var(--orange)" stopOpacity="0.6"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
              </h1>

              <div className="mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <p className="text-2xl text-white/90 font-semibold mb-2">
                  avec une stratégie <span className="animate-text-shimmer bg-gradient-to-r from-[var(--gold-bright)] via-[var(--orange-light)] to-[var(--orange-bright)] bg-clip-text text-transparent bg-[length:200%_auto] font-bold">implacable</span>
                </p>
              </div>

              {/* Firm Name */}
              <div className="mb-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <p className="text-xl text-white/80 font-light mb-2">Maître Walid Arfaoui</p>
                <p className="text-lg text-white/60">Avocat au Barreau de Tunis</p>
              </div>

              {/* Practice Areas */}
              <div className="flex flex-wrap gap-3 mb-10 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                {['Droit pénal financier', 'Réconciliation pénale', 'Droits de la défense', 'Droit du sport'].map((area, idx) => (
                  <span key={idx} className="px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg text-white/80 text-sm hover:bg-gradient-to-r hover:from-[var(--gold)]/10 hover:to-[var(--orange)]/10 hover:border-[var(--orange-light)]/50 transition-all">
                    {area}
                  </span>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: '0.5s' }}>
                <button
                  onClick={() => setAppointmentModalOpen(true)}
                  className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-[var(--gold)] to-[var(--orange)] text-white text-base font-bold rounded-lg transition-all transform hover:scale-105 hover:shadow-2xl hover:shadow-[var(--orange)]/60 relative overflow-hidden"
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                  <svg className="w-5 h-5 mr-2 relative" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="relative">Prendre rendez-vous</span>
                </button>
                <a
                  href="#expertise"
                  className="group inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-md text-white text-base font-semibold rounded-lg hover:bg-gradient-to-r hover:from-[var(--gold)]/20 hover:to-[var(--orange)]/20 transition-all border border-[var(--orange-light)]/30 hover:border-[var(--orange-bright)]/70 relative overflow-hidden"
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                  <span className="relative">Nos domaines d'expertise</span>
                  <svg className="w-5 h-5 ml-2 relative group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Right Column - Statistics Cards */}
            <div className="grid grid-cols-2 gap-6 animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-[var(--orange-light)]/30 rounded-2xl p-6 hover:bg-gradient-to-br hover:from-[var(--gold)]/20 hover:to-[var(--orange)]/20 hover:border-[var(--orange-bright)]/60 transition-all transform hover:scale-105 hover:shadow-2xl hover:shadow-[var(--orange)]/30">
                <div className="text-5xl font-bold bg-gradient-to-r from-[var(--gold-bright)] to-[var(--orange)] bg-clip-text text-transparent mb-2">250+</div>
                <div className="text-white/90 font-medium text-sm leading-tight">Dossiers de réconciliation traités</div>
              </div>
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-[var(--orange-light)]/30 rounded-2xl p-6 hover:bg-gradient-to-br hover:from-[var(--gold)]/20 hover:to-[var(--orange)]/20 hover:border-[var(--orange-bright)]/60 transition-all transform hover:scale-105 hover:shadow-2xl hover:shadow-[var(--orange)]/30">
                <div className="text-5xl font-bold bg-gradient-to-r from-[var(--gold-bright)] to-[var(--orange)] bg-clip-text text-transparent mb-2">35M</div>
                <div className="text-white/90 font-medium text-sm leading-tight">Dinars tunisiens de valeur traitée</div>
              </div>
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-[var(--orange-light)]/30 rounded-2xl p-6 hover:bg-gradient-to-br hover:from-[var(--gold)]/20 hover:to-[var(--orange)]/20 hover:border-[var(--orange-bright)]/60 transition-all transform hover:scale-105 hover:shadow-2xl hover:shadow-[var(--orange)]/30">
                <div className="text-5xl font-bold bg-gradient-to-r from-[var(--gold-bright)] to-[var(--orange)] bg-clip-text text-transparent mb-2">40%</div>
                <div className="text-white/90 font-medium text-sm leading-tight">De procédures finalisées</div>
              </div>
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-[var(--orange-light)]/30 rounded-2xl p-6 hover:bg-gradient-to-br hover:from-[var(--gold)]/20 hover:to-[var(--orange)]/20 hover:border-[var(--orange-bright)]/60 transition-all transform hover:scale-105 hover:shadow-2xl hover:shadow-[var(--orange)]/30">
                <div className="text-5xl font-bold bg-gradient-to-r from-[var(--gold-bright)] to-[var(--orange)] bg-clip-text text-transparent mb-2">2018</div>
                <div className="text-white/90 font-medium text-sm leading-tight">Début d'activité juridique</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
          <a href="#expertise" className="flex flex-col items-center text-white/60 hover:text-[var(--orange-bright)] transition-colors group">
            <span className="text-xs mb-2 font-medium tracking-wider group-hover:bg-gradient-to-r group-hover:from-[var(--gold-bright)] group-hover:to-[var(--orange)] group-hover:bg-clip-text group-hover:text-transparent">DÉCOUVRIR</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </a>
        </div>

        {/* Bottom elegant wave */}
        <div className="absolute bottom-0 left-0 right-0 z-0">
          <svg className="w-full h-24" viewBox="0 0 1440 120" preserveAspectRatio="none">
            <path fill="white" fillOpacity="1" d="M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,58.7C672,53,768,43,864,48C960,53,1056,75,1152,80C1248,85,1344,75,1392,69.3L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      {/* Expertise Section */}
      <section id="expertise" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[var(--cream)] to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-[var(--navy-dark)] to-[var(--navy)] bg-clip-text text-transparent mb-4">Domaines d'intervention</h2>
            <p className="text-xl bg-gradient-to-r from-[var(--gold)] to-[var(--orange)] bg-clip-text text-transparent font-semibold">Une expertise qui change l'issue des dossiers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all border border-[var(--orange-light)]/20 hover:border-[var(--orange)]/40 group">
              <div className="w-12 h-12 bg-gradient-to-br from-[var(--gold)]/20 to-[var(--orange)]/20 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-[var(--orange)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[var(--navy-dark)] mb-4">Droit pénal financier</h3>
              <p className="text-gray-600 leading-relaxed">
                Fraude, blanchiment d'argent, criminalité financière. Défense et conseil dans les affaires complexes impliquant des flux financiers illicites.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all border border-[var(--orange-light)]/20 hover:border-[var(--orange)]/40 group">
              <div className="w-12 h-12 bg-gradient-to-br from-[var(--gold)]/20 to-[var(--orange)]/20 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-[var(--orange)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[var(--navy-dark)] mb-4">Réconciliation pénale</h3>
              <p className="text-gray-600 leading-relaxed">
                Accompagnement dans le processus de conciliation avec l'État. Négociation, constitution de dossiers, suivi de procédures devant la Commission nationale.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all border border-[var(--orange-light)]/20 hover:border-[var(--orange)]/40 group">
              <div className="w-12 h-12 bg-gradient-to-br from-[var(--gold)]/20 to-[var(--orange)]/20 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-[var(--orange)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[var(--navy-dark)] mb-4">Droits de la défense</h3>
              <p className="text-gray-600 leading-relaxed">
                Président de l'association Procès Équitables. Défense du droit à un procès équitable et lutte contre les détentions arbitraires.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all border border-[var(--orange-light)]/20 hover:border-[var(--orange)]/40 group">
              <div className="w-12 h-12 bg-gradient-to-br from-[var(--gold)]/20 to-[var(--orange)]/20 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-[var(--orange)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[var(--navy-dark)] mb-4">Droit du sport</h3>
              <p className="text-gray-600 leading-relaxed">
                Conseil aux athlètes, clubs et fédérations. Résolution de litiges liés aux contrats, transferts, questions disciplinaires et dopage.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Publications Section */}
      <section id="publications" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-[var(--navy-dark)] mb-4">Analyses & positions</h2>
            <p className="text-xl text-gray-600">Publications récentes</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-8">
                <div className="text-6xl font-bold text-[var(--gold)]/20 mb-4">01</div>
                <div className="inline-block px-3 py-1 bg-[var(--navy-dark)] text-white text-xs font-semibold rounded-full mb-4">
                  Analyse juridique
                </div>
                <h3 className="text-2xl font-bold text-[var(--navy-dark)] mb-4 leading-tight">
                  Réconciliation pénale en Tunisie : où en est-on ?
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  La Commission nationale de conciliation pénale, créée en 2022, devait permettre à l'État tunisien de récupérer des fonds issus de la corruption. Bilan des avancées et des blocages.
                </p>
                <a href="#" className="inline-flex items-center text-[var(--gold)] font-semibold hover:text-[var(--gold-dark)] transition-colors">
                  Lire l'article
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-8">
                <div className="text-6xl font-bold text-[var(--gold)]/20 mb-4">02</div>
                <div className="inline-block px-3 py-1 bg-[var(--navy-dark)] text-white text-xs font-semibold rounded-full mb-4">
                  Interventions publiques
                </div>
                <h3 className="text-2xl font-bold text-[var(--navy-dark)] mb-4 leading-tight">
                  Le combat public de Maître Arfaoui : ce que révèlent ses interventions
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Depuis 2022, l'avocat tunisien s'est imposé comme l'une des voix les plus audibles sur la réconciliation pénale. Ses interventions dessinent un positionnement clair.
                </p>
                <a href="#" className="inline-flex items-center text-[var(--gold)] font-semibold hover:text-[var(--gold-dark)] transition-colors">
                  Lire l'article
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-8">
                <div className="text-6xl font-bold text-[var(--gold)]/20 mb-4">03</div>
                <div className="inline-block px-3 py-1 bg-[var(--navy-dark)] text-white text-xs font-semibold rounded-full mb-4">
                  Portrait
                </div>
                <h3 className="text-2xl font-bold text-[var(--navy-dark)] mb-4 leading-tight">
                  Qui est Maître Walid Arfaoui ? Portrait d'un avocat engagé
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Inscrit au barreau de Tunisie, retour sur un parcours marqué par le droit pénal financier, la société civile et l'engagement pour un procès équitable.
                </p>
                <a href="#" className="inline-flex items-center text-[var(--gold)] font-semibold hover:text-[var(--gold-dark)] transition-colors">
                  Lire l'article
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blogs Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-[var(--navy-dark)] to-[var(--navy)] bg-clip-text text-transparent mb-4">
                Actualités Juridiques
              </h2>
              <p className="text-xl bg-gradient-to-r from-[var(--gold)] to-[var(--orange)] bg-clip-text text-transparent font-semibold">
                Nos derniers articles et analyses
              </p>
            </div>
            <Link
              href="/blogs"
              className="hidden md:inline-flex items-center px-6 py-3 bg-gradient-to-r from-[var(--gold)] to-[var(--orange)] text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-[var(--orange)]/40 transition-all group"
            >
              Voir tous les articles
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogsLoading ? (
              // Loading skeletons
              [1, 2, 3].map((i) => (
                <div key={i} className="bg-gradient-to-br from-white to-[var(--cream)] rounded-xl overflow-hidden shadow-lg border border-[var(--orange-light)]/20 animate-pulse">
                  <div className="aspect-video bg-gradient-to-br from-[var(--gold)]/10 to-[var(--orange)]/10"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-4 w-1/3"></div>
                    <div className="h-6 bg-gray-200 rounded mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4 w-2/3"></div>
                  </div>
                </div>
              ))
            ) : recentBlogs.length > 0 ? (
              recentBlogs.map((blog) => (
                <Link
                  key={blog.id}
                  href={`/blogs/${blog.slug}`}
                  className="group bg-gradient-to-br from-white to-[var(--cream)] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all border border-[var(--orange-light)]/20 hover:border-[var(--orange)]/40"
                >
                  <div className="aspect-video bg-gradient-to-br from-[var(--gold)]/20 to-[var(--orange)]/20 relative overflow-hidden">
                    {blog.image_url ? (
                      <img
                        src={blog.image_url}
                        alt={blog.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="w-16 h-16 text-[var(--orange)]/40" fill="currentColor" viewBox="0 0 20 20">
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
                    <h3 className="text-xl font-bold text-[var(--navy-dark)] mb-3 group-hover:bg-gradient-to-r group-hover:from-[var(--gold)] group-hover:to-[var(--orange)] group-hover:bg-clip-text group-hover:text-transparent transition-all leading-tight">
                      {blog.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                      {blog.excerpt}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <span className="text-sm text-gray-500">{blog.author || 'Maître Arfaoui'}</span>
                      <span className="text-sm font-semibold bg-gradient-to-r from-[var(--gold)] to-[var(--orange)] bg-clip-text text-transparent group-hover:translate-x-1 transition-transform inline-flex items-center">
                        Lire l'article
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
              <div className="col-span-full text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[var(--gold)]/20 to-[var(--orange)]/20 rounded-full mb-4">
                  <svg className="w-8 h-8 text-[var(--orange)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-[var(--navy-dark)] mb-2">Aucun article pour le moment</h3>
                <p className="text-gray-600">Revenez bientôt pour découvrir nos analyses juridiques</p>
              </div>
            )}
          </div>

          <div className="mt-12 text-center md:hidden">
            <Link
              href="/blogs"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[var(--gold)] to-[var(--orange)] text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-[var(--orange)]/40 transition-all"
            >
              Voir tous les articles
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* External Articles Section (Press Mentions) */}
      {externalArticles.length > 0 && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[var(--cream)] to-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-[var(--navy-dark)] to-[var(--navy)] bg-clip-text text-transparent mb-4">
                Ils parlent de nous
              </h2>
              <p className="text-xl bg-gradient-to-r from-[var(--gold)] to-[var(--orange)] bg-clip-text text-transparent font-semibold">
                Publications et mentions dans la presse
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articlesLoading ? (
                // Loading skeletons
                [1, 2, 3].map((i) => (
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
              ) : (
                externalArticles.map((article) => (
                  <a
                    key={article.id}
                    href={article.external_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all border border-[var(--orange-light)]/20 hover:border-[var(--orange)]/40"
                  >
                    <div className="aspect-video bg-gradient-to-br from-[var(--gold)]/20 to-[var(--orange)]/20 relative overflow-hidden">
                      {article.image_url ? (
                        <img
                          src={article.image_url}
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg className="w-16 h-16 text-[var(--orange)]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                          </svg>
                        </div>
                      )}
                      {/* External link indicator */}
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2">
                        <svg className="w-4 h-4 text-[var(--navy-dark)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        {article.publication_name && (
                          <span className="px-3 py-1 bg-gradient-to-r from-[var(--gold)]/10 to-[var(--orange)]/10 border border-[var(--orange-light)]/30 rounded-full text-xs font-semibold bg-gradient-to-r from-[var(--gold)] to-[var(--orange)] bg-clip-text text-transparent">
                            {article.publication_name}
                          </span>
                        )}
                        {article.published_date && (
                          <span className="text-xs text-gray-500">
                            {new Date(article.published_date).toLocaleDateString('fr-FR')}
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-[var(--navy-dark)] mb-3 group-hover:bg-gradient-to-r group-hover:from-[var(--gold)] group-hover:to-[var(--orange)] group-hover:bg-clip-text group-hover:text-transparent transition-all leading-tight">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                        {article.description}
                      </p>
                      <div className="flex items-center justify-end pt-4 border-t border-gray-200">
                        <span className="text-sm font-semibold bg-gradient-to-r from-[var(--gold)] to-[var(--orange)] bg-clip-text text-transparent group-hover:translate-x-1 transition-transform inline-flex items-center">
                          Lire l&apos;article
                          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </a>
                ))
              )}
            </div>
          </div>
        </section>
      )}

      {/* About Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[var(--cream)]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-[var(--navy-dark)] mb-6">
                Le cabinet<br />
                <span className="text-[var(--gold)]">Arfaoui Law<br />& Consulting</span>
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Depuis 2018, nous pratiquons le droit avec une rigueur sans compromis. Notre cabinet est le garant de votre confidentialité face aux enjeux les plus sensibles.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed font-semibold">
                Stratégie, rigueur, résultats.
              </p>
            </div>
            <div className="bg-[var(--navy-dark)] rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">Notre engagement</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-[var(--gold)] mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Confidentialité absolue et protection des données clients</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-[var(--gold)] mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Expertise reconnue en droit pénal financier et réconciliation</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-[var(--gold)] mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Stratégie personnalisée pour chaque dossier</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-[var(--gold)] mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Disponibilité et réactivité face aux urgences</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section id="parcours" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-[var(--navy-dark)] mb-4">Chronologie</h2>
            <p className="text-xl text-gray-600">Un parcours forgé par le terrain</p>
          </div>

          <div className="space-y-12">
            <div className="flex gap-8 items-start">
              <div className="flex-shrink-0 w-32">
                <div className="text-4xl font-bold text-[var(--gold)]">2018</div>
              </div>
              <div className="flex-1 pt-2">
                <h3 className="text-2xl font-bold text-[var(--navy-dark)] mb-3">Forum des Jeunes Juristes</h3>
                <p className="text-gray-600 leading-relaxed">
                  Intégration dans la réflexion juridique collective en Tunisie.
                </p>
              </div>
            </div>

            <div className="flex gap-8 items-start">
              <div className="flex-shrink-0 w-32">
                <div className="text-4xl font-bold text-[var(--gold)]">2022</div>
              </div>
              <div className="flex-1 pt-2">
                <h3 className="text-2xl font-bold text-[var(--navy-dark)] mb-3">Commission de conciliation pénale</h3>
                <p className="text-gray-600 leading-relaxed">
                  Création de la commission. Début du travail de terrain sur la réconciliation pénale.
                </p>
              </div>
            </div>

            <div className="flex gap-8 items-start">
              <div className="flex-shrink-0 w-32">
                <div className="text-4xl font-bold text-[var(--gold)]">2023</div>
              </div>
              <div className="flex-1 pt-2">
                <h3 className="text-2xl font-bold text-[var(--navy-dark)] mb-3">Interventions médiatiques</h3>
                <p className="text-gray-600 leading-relaxed">
                  Business News, Mosaïque FM, Arabesque. 250 dossiers, 35M de dinars traités.
                </p>
              </div>
            </div>

            <div className="flex gap-8 items-start">
              <div className="flex-shrink-0 w-32">
                <div className="text-4xl font-bold text-[var(--gold)]">2024</div>
              </div>
              <div className="flex-1 pt-2">
                <h3 className="text-2xl font-bold text-[var(--navy-dark)] mb-3">Défense Al-Aqrabi & analyses publiques</h3>
                <p className="text-gray-600 leading-relaxed">
                  Défense publique, publications sur le blanchiment et les comptes de passage.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Media Presence Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-[var(--navy-dark)] mb-4">Présence publique</h2>
            <p className="text-xl text-gray-600">Reconnu et cité par les médias</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="text-[var(--gold)] font-bold text-lg mb-3">2023</div>
              <h3 className="text-xl font-bold text-[var(--navy-dark)] mb-3">Business News</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Analyse approfondie sur le bilan de la réconciliation pénale et le rôle de la Commission nationale.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="text-[var(--gold)] font-bold text-lg mb-3">2023</div>
              <h3 className="text-xl font-bold text-[var(--navy-dark)] mb-3">Mosaïque FM</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Interview sur les droits de la défense et les enjeux du procès équitable en Tunisie.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="text-[var(--gold)] font-bold text-lg mb-3">2024</div>
              <h3 className="text-xl font-bold text-[var(--navy-dark)] mb-3">Arabesque FM</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Décryptage des mécanismes de blanchiment et des comptes de passage dans le système financier.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="text-[var(--gold)] font-bold text-lg mb-3">2024</div>
              <h3 className="text-xl font-bold text-[var(--navy-dark)] mb-3">Forum des Juristes</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Intervention sur la défense publique et les évolutions du droit pénal financier.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-[var(--navy-dark)] mb-4">Témoignages</h2>
            <p className="text-xl text-gray-600">La confiance de nos clients</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[var(--cream)] p-8 rounded-xl">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-[var(--gold)]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed italic">
                "Maître Arfaoui a su naviguer un dossier de réconciliation complexe avec une rigueur et une discrétion exceptionnelles. Résultat obtenu en moins d'un an."
              </p>
              <div>
                <div className="font-bold text-[var(--navy-dark)]">Ahmed B.</div>
                <div className="text-sm text-gray-600">Réconciliation pénale, 2023</div>
              </div>
            </div>

            <div className="bg-[var(--cream)] p-8 rounded-xl">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-[var(--gold)]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed italic">
                "L'expertise en droit pénal financier est rare en Tunisie. Maître Arfaoui explique chaque étape et défend vos droits avec conviction."
              </p>
              <div>
                <div className="font-bold text-[var(--navy-dark)]">Fatma D.</div>
                <div className="text-sm text-gray-600">Défense pénale financière, 2024</div>
              </div>
            </div>

            <div className="bg-[var(--cream)] p-8 rounded-xl">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-[var(--gold)]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed italic">
                "Un cabinet professionnel où la confidentialité est absolue. Recommandé pour toute question pénale ou financière de premier plan."
              </p>
              <div>
                <div className="font-bold text-[var(--navy-dark)]">Dr. Khalil T.</div>
                <div className="text-sm text-gray-600">Conseil juridique, 2024</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[var(--navy-dark)] mb-4">Questions fréquentes</h2>
            <p className="text-xl text-gray-600">Vos questions, nos réponses</p>
          </div>

          {qaLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--gold)]"></div>
            </div>
          ) : qaItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Aucune question disponible pour le moment.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {qaItems.map((item, index) => (
                <div key={item.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-8 py-6 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-lg font-semibold text-[var(--navy-dark)]">
                      {item.question}
                    </span>
                    <svg
                      className={`w-6 h-6 text-[var(--gold)] transform transition-transform flex-shrink-0 ml-4 ${openFaq === index ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openFaq === index && (
                    <div className="px-8 pb-6 text-gray-600 leading-relaxed">
                      {item.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-[var(--navy-dark)] mb-4">Contact</h2>
            <p className="text-xl text-gray-600">Discutons de votre situation</p>
            <p className="text-base text-gray-500 mt-4">
              Chaque dossier est unique et délicat. Une consultation confidentielle avec Maître Arfaoui permet de définir la stratégie adaptée à votre situation.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold text-[var(--navy-dark)] mb-2">Localisation</h3>
                  <p className="text-gray-600">Tunis, Tunisie</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[var(--navy-dark)] mb-2">Email</h3>
                  <a href="mailto:contact@maitrearfaoui.com" className="text-[var(--gold)] hover:text-[var(--gold-dark)]">
                    contact@maitrearfaoui.com
                  </a>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[var(--navy-dark)] mb-2">Horaires</h3>
                  <p className="text-gray-600">Lundi — Vendredi, 9h — 17h</p>
                </div>
              </div>
            </div>

            <div>
              <form onSubmit={handleContactSubmit} className="space-y-6">
                {contactSuccess && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg animate-fade-in">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Message envoyé avec succès ! Nous vous répondrons sous 24h.
                    </div>
                  </div>
                )}

                {contactError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg animate-fade-in">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {contactError}
                    </div>
                  </div>
                )}

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Votre nom complet *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={contactForm.name}
                    onChange={handleContactChange}
                    disabled={contactLoading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent outline-none transition-all disabled:opacity-50"
                    placeholder="Prénom Nom"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={contactForm.email}
                    onChange={handleContactChange}
                    disabled={contactLoading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent outline-none transition-all disabled:opacity-50"
                    placeholder="votre@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={contactForm.phone}
                    onChange={handleContactChange}
                    disabled={contactLoading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent outline-none transition-all disabled:opacity-50"
                    placeholder="+216..."
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Domaine juridique
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={contactForm.subject}
                    onChange={handleContactChange}
                    disabled={contactLoading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent outline-none transition-all disabled:opacity-50"
                  >
                    <option value="">Sélectionnez un domaine</option>
                    <option value="Droit pénal financier">Droit pénal financier</option>
                    <option value="Réconciliation pénale">Réconciliation pénale</option>
                    <option value="Droits de la défense">Droits de la défense</option>
                    <option value="Droit du sport">Droit du sport</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Décrivez brièvement votre situation *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    value={contactForm.message}
                    onChange={handleContactChange}
                    disabled={contactLoading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent outline-none transition-all resize-none disabled:opacity-50"
                    placeholder="Décrivez votre situation juridique..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={contactLoading}
                  className="w-full px-8 py-4 bg-[var(--navy-dark)] text-white text-base font-semibold rounded-lg hover:bg-[var(--navy-light)] transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center"
                >
                  {contactLoading ? (
                    <>
                      <svg className="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Envoi en cours...
                    </>
                  ) : (
                    'Envoyer ma demande'
                  )}
                </button>

                <p className="text-sm text-gray-500 text-center">
                  Confidentialité garantie — Réponse sous 24h
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[var(--navy-dark)] text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">
                <span className="text-[var(--gold)]">Maître Arfaoui</span>
              </h3>
              <p className="text-gray-400 text-sm">
                Avocat au Barreau de Tunis
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Navigation</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#expertise" className="text-gray-400 hover:text-[var(--gold)] transition-colors">
                    Expertise
                  </a>
                </li>
                <li>
                  <a href="#publications" className="text-gray-400 hover:text-[var(--gold)] transition-colors">
                    Publications
                  </a>
                </li>
                <li>
                  <a href="#parcours" className="text-gray-400 hover:text-[var(--gold)] transition-colors">
                    Parcours
                  </a>
                </li>
                <li>
                  <a href="#contact" className="text-gray-400 hover:text-[var(--gold)] transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Tunis, Tunisie</li>
                <li>
                  <a href="mailto:contact@maitrearfaoui.com" className="hover:text-[var(--gold)] transition-colors">
                    contact@maitrearfaoui.com
                  </a>
                </li>
                <li>Lundi — Vendredi</li>
                <li>9h — 17h</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
            <p>© 2024 Cabinet Arfaoui Law & Consulting. Tous droits réservés.</p>
          </div>
        </div>
      </footer>

      {/* Appointment Modal */}
      {appointmentModalOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto"
          onClick={() => setAppointmentModalOpen(false)}
        >
          {/* Backdrop */}
          <div className="fixed inset-0 bg-[var(--navy-dark)]/80 backdrop-blur-sm transition-opacity"></div>

          {/* Modal Content */}
          <div className="flex min-h-full items-center justify-center p-4">
            <div
              className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl transform transition-all"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setAppointmentModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors z-10"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Modal Header */}
              <div className="px-8 pt-8 pb-6 border-b border-gray-200">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-[var(--navy-dark)] to-[var(--navy)] bg-clip-text text-transparent">
                  Prendre Rendez-vous
                </h2>
                <p className="text-gray-600 mt-2">
                  Remplissez ce formulaire et nous vous contacterons sous 24h
                </p>
              </div>

              {/* Modal Body */}
              <div className="px-8 py-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                <form onSubmit={handleAppointmentSubmit} className="space-y-6">
                  {appointmentSuccess && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg animate-fade-in">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Demande de rendez-vous envoyée ! Nous vous contacterons sous 24h.
                      </div>
                    </div>
                  )}

                  {appointmentError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg animate-fade-in">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {appointmentError}
                      </div>
                    </div>
                  )}

                  <div>
                    <label htmlFor="appointment-name" className="block text-sm font-medium text-gray-700 mb-2">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      id="appointment-name"
                      name="name"
                      required
                      value={appointmentForm.name}
                      onChange={(e) => setAppointmentForm({ ...appointmentForm, name: e.target.value })}
                      disabled={appointmentLoading}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent outline-none transition-all disabled:opacity-50"
                      placeholder="Prénom Nom"
                    />
                  </div>

                  <div>
                    <label htmlFor="appointment-email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="appointment-email"
                      name="email"
                      required
                      value={appointmentForm.email}
                      onChange={(e) => setAppointmentForm({ ...appointmentForm, email: e.target.value })}
                      disabled={appointmentLoading}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent outline-none transition-all disabled:opacity-50"
                      placeholder="votre@email.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="appointment-phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone *
                    </label>
                    <input
                      type="tel"
                      id="appointment-phone"
                      name="phone"
                      required
                      value={appointmentForm.phone}
                      onChange={(e) => setAppointmentForm({ ...appointmentForm, phone: e.target.value })}
                      disabled={appointmentLoading}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent outline-none transition-all disabled:opacity-50"
                      placeholder="+216..."
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="appointment-date" className="block text-sm font-medium text-gray-700 mb-2">
                        Date souhaitée *
                      </label>
                      <input
                        type="date"
                        id="appointment-date"
                        name="date"
                        required
                        value={appointmentForm.date}
                        onChange={(e) => setAppointmentForm({ ...appointmentForm, date: e.target.value })}
                        disabled={appointmentLoading}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent outline-none transition-all disabled:opacity-50"
                      />
                    </div>

                    <div>
                      <label htmlFor="appointment-time" className="block text-sm font-medium text-gray-700 mb-2">
                        Heure souhaitée *
                      </label>
                      <input
                        type="time"
                        id="appointment-time"
                        name="time"
                        required
                        value={appointmentForm.time}
                        onChange={(e) => setAppointmentForm({ ...appointmentForm, time: e.target.value })}
                        disabled={appointmentLoading}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent outline-none transition-all disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="appointment-reason" className="block text-sm font-medium text-gray-700 mb-2">
                      Motif du rendez-vous *
                    </label>
                    <textarea
                      id="appointment-reason"
                      name="reason"
                      rows={4}
                      required
                      value={appointmentForm.reason}
                      onChange={(e) => setAppointmentForm({ ...appointmentForm, reason: e.target.value })}
                      disabled={appointmentLoading}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent outline-none transition-all resize-none disabled:opacity-50"
                      placeholder="Décrivez brièvement la raison de votre demande de rendez-vous..."
                    ></textarea>
                  </div>

                  <div className="flex items-center gap-4 pt-4">
                    <button
                      type="submit"
                      disabled={appointmentLoading}
                      className="flex-1 px-8 py-4 bg-gradient-to-r from-[var(--gold)] to-[var(--orange)] text-white text-base font-bold rounded-lg hover:shadow-lg hover:shadow-[var(--orange)]/40 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center"
                    >
                      {appointmentLoading ? (
                        <>
                          <svg className="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Envoi en cours...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Confirmer le rendez-vous
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setAppointmentModalOpen(false)}
                      disabled={appointmentLoading}
                      className="px-8 py-4 bg-gray-100 text-gray-700 text-base font-semibold rounded-lg hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Annuler
                    </button>
                  </div>

                  <p className="text-sm text-gray-500 text-center">
                    Confidentialité garantie — Réponse sous 24h
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
