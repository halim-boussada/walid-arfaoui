'use client';

import { useState, useEffect } from 'react';

interface HomeContent {
  hero: {
    badge: string;
    mainHeading: string;
    highlightedWord: string;
    subheading: string;
    highlightedSubheading: string;
    lawyerName: string;
    lawyerTitle: string;
    practiceAreas: string[];
    statistics: Array<{ value: string; label: string }>;
  };
  expertise: {
    title: string;
    subtitle: string;
    domains: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
  };
  publications: {
    title: string;
    subtitle: string;
    articles: Array<{
      number: string;
      badge: string;
      title: string;
      description: string;
      link: string;
    }>;
  };
  about: {
    title: string;
    highlightedTitle: string;
    description: string;
    motto: string;
    commitments: string[];
  };
  timeline: {
    title: string;
    subtitle: string;
    events: Array<{
      year: string;
      title: string;
      description: string;
    }>;
  };
  mediaPresence: {
    title: string;
    subtitle: string;
    items: Array<{
      year: string;
      title: string;
      description: string;
    }>;
  };
  testimonials: {
    title: string;
    subtitle: string;
    items: Array<{
      rating: number;
      text: string;
      author: string;
      details: string;
    }>;
  };
  contact: {
    title: string;
    subtitle: string;
    description: string;
    location: string;
    email: string;
    hours: string;
    subjects: string[];
  };
  seo: {
    siteName: string;
    description: string;
    url: string;
    phone: string;
    openingHours: string;
  };
}

export default function HomeContentPage() {
  const [activeTab, setActiveTab] = useState<string>('hero');
  const [content, setContent] = useState<HomeContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/home-content');
      const data = await response.json();

      if (data.success) {
        setContent(data.content);
      } else {
        setError('Erreur lors du chargement du contenu');
      }
    } catch (error) {
      console.error('Error fetching content:', error);
      setError('Erreur lors du chargement du contenu');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!content) return;

    setSaving(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('/api/home-content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(content),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(data.error || 'Erreur lors de la sauvegarde');
      }
    } catch (error) {
      console.error('Error saving content:', error);
      setError('Erreur lors de la sauvegarde du contenu');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--gold)]"></div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-8 text-center">
        <p className="text-red-400">{error || 'Contenu non trouvé'}</p>
      </div>
    );
  }

  const tabs = [
    { id: 'hero', label: 'Section Hero', icon: '🏠' },
    { id: 'expertise', label: 'Expertise', icon: '⚖️' },
    { id: 'publications', label: 'Publications', icon: '📰' },
    { id: 'about', label: 'À propos', icon: '👤' },
    { id: 'timeline', label: 'Chronologie', icon: '📅' },
    { id: 'media', label: 'Médias', icon: '📺' },
    { id: 'testimonials', label: 'Témoignages', icon: '💬' },
    { id: 'contact', label: 'Contact', icon: '📧' },
    { id: 'seo', label: 'SEO', icon: '🔍' },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Contenu de la Page d&apos;Accueil
        </h1>
        <p className="text-white/60">
          Gérez tout le contenu statique de la page d&apos;accueil
        </p>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
          <p className="text-green-400 text-sm flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Contenu sauvegardé avec succès
          </p>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-[var(--gold)] to-[var(--orange)] text-white'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Form */}
      <div className="bg-white/5 backdrop-blur-sm border border-[var(--orange-light)]/20 rounded-xl p-8">
        {/* Hero Section */}
        {activeTab === 'hero' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Section Hero</h2>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Badge</label>
              <input
                type="text"
                value={content.hero.badge}
                onChange={(e) =>
                  setContent({
                    ...content,
                    hero: { ...content.hero, badge: e.target.value },
                  })
                }
                className="w-full px-4 py-3 bg-white/5 border border-[var(--orange-light)]/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Titre principal</label>
                <input
                  type="text"
                  value={content.hero.mainHeading}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      hero: { ...content.hero, mainHeading: e.target.value },
                    })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-[var(--orange-light)]/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Mot en surbrillance</label>
                <input
                  type="text"
                  value={content.hero.highlightedWord}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      hero: { ...content.hero, highlightedWord: e.target.value },
                    })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-[var(--orange-light)]/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Sous-titre</label>
                <input
                  type="text"
                  value={content.hero.subheading}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      hero: { ...content.hero, subheading: e.target.value },
                    })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-[var(--orange-light)]/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Sous-titre en surbrillance</label>
                <input
                  type="text"
                  value={content.hero.highlightedSubheading}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      hero: { ...content.hero, highlightedSubheading: e.target.value },
                    })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-[var(--orange-light)]/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Nom de l&apos;avocat</label>
                <input
                  type="text"
                  value={content.hero.lawyerName}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      hero: { ...content.hero, lawyerName: e.target.value },
                    })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-[var(--orange-light)]/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Titre de l&apos;avocat</label>
                <input
                  type="text"
                  value={content.hero.lawyerTitle}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      hero: { ...content.hero, lawyerTitle: e.target.value },
                    })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-[var(--orange-light)]/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Domaines de pratique</label>
              {content.hero.practiceAreas.map((area, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={area}
                    onChange={(e) => {
                      const newAreas = [...content.hero.practiceAreas];
                      newAreas[index] = e.target.value;
                      setContent({
                        ...content,
                        hero: { ...content.hero, practiceAreas: newAreas },
                      });
                    }}
                    className="flex-1 px-4 py-3 bg-white/5 border border-[var(--orange-light)]/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent transition-all"
                  />
                  <button
                    onClick={() => {
                      const newAreas = content.hero.practiceAreas.filter((_, i) => i !== index);
                      setContent({
                        ...content,
                        hero: { ...content.hero, practiceAreas: newAreas },
                      });
                    }}
                    className="px-4 py-3 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
              <button
                onClick={() => {
                  setContent({
                    ...content,
                    hero: {
                      ...content.hero,
                      practiceAreas: [...content.hero.practiceAreas, ''],
                    },
                  });
                }}
                className="mt-2 px-4 py-2 bg-white/5 text-white/60 rounded-lg hover:bg-white/10 transition-colors text-sm"
              >
                + Ajouter un domaine
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-4">Statistiques</label>
              {content.hero.statistics.map((stat, index) => (
                <div key={index} className="flex gap-2 mb-4 p-4 bg-white/5 rounded-lg">
                  <input
                    type="text"
                    value={stat.value}
                    onChange={(e) => {
                      const newStats = [...content.hero.statistics];
                      newStats[index] = { ...newStats[index], value: e.target.value };
                      setContent({
                        ...content,
                        hero: { ...content.hero, statistics: newStats },
                      });
                    }}
                    placeholder="Valeur"
                    className="w-32 px-4 py-3 bg-white/5 border border-[var(--orange-light)]/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent transition-all"
                  />
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => {
                      const newStats = [...content.hero.statistics];
                      newStats[index] = { ...newStats[index], label: e.target.value };
                      setContent({
                        ...content,
                        hero: { ...content.hero, statistics: newStats },
                      });
                    }}
                    placeholder="Label"
                    className="flex-1 px-4 py-3 bg-white/5 border border-[var(--orange-light)]/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent transition-all"
                  />
                  <button
                    onClick={() => {
                      const newStats = content.hero.statistics.filter((_, i) => i !== index);
                      setContent({
                        ...content,
                        hero: { ...content.hero, statistics: newStats },
                      });
                    }}
                    className="px-4 py-3 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
              <button
                onClick={() => {
                  setContent({
                    ...content,
                    hero: {
                      ...content.hero,
                      statistics: [...content.hero.statistics, { value: '', label: '' }],
                    },
                  });
                }}
                className="mt-2 px-4 py-2 bg-white/5 text-white/60 rounded-lg hover:bg-white/10 transition-colors text-sm"
              >
                + Ajouter une statistique
              </button>
            </div>
          </div>
        )}

        {/* Expertise Section */}
        {activeTab === 'expertise' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Section Expertise</h2>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Titre</label>
              <input
                type="text"
                value={content.expertise.title}
                onChange={(e) =>
                  setContent({
                    ...content,
                    expertise: { ...content.expertise, title: e.target.value },
                  })
                }
                className="w-full px-4 py-3 bg-white/5 border border-[var(--orange-light)]/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Sous-titre</label>
              <input
                type="text"
                value={content.expertise.subtitle}
                onChange={(e) =>
                  setContent({
                    ...content,
                    expertise: { ...content.expertise, subtitle: e.target.value },
                  })
                }
                className="w-full px-4 py-3 bg-white/5 border border-[var(--orange-light)]/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-4">Domaines d&apos;expertise</label>
              {content.expertise.domains.map((domain, index) => (
                <div key={index} className="mb-4 p-4 bg-white/5 rounded-lg border border-[var(--orange-light)]/20">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-xs font-medium text-white/60 mb-2">Icône</label>
                      <input
                        type="text"
                        value={domain.icon}
                        onChange={(e) => {
                          const newDomains = [...content.expertise.domains];
                          newDomains[index] = { ...newDomains[index], icon: e.target.value };
                          setContent({
                            ...content,
                            expertise: { ...content.expertise, domains: newDomains },
                          });
                        }}
                        placeholder="shield, money, balance, bolt"
                        className="w-full px-4 py-3 bg-white/5 border border-[var(--orange-light)]/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-white/60 mb-2">Titre</label>
                      <input
                        type="text"
                        value={domain.title}
                        onChange={(e) => {
                          const newDomains = [...content.expertise.domains];
                          newDomains[index] = { ...newDomains[index], title: e.target.value };
                          setContent({
                            ...content,
                            expertise: { ...content.expertise, domains: newDomains },
                          });
                        }}
                        className="w-full px-4 py-3 bg-white/5 border border-[var(--orange-light)]/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-xs font-medium text-white/60 mb-2">Description</label>
                    <textarea
                      value={domain.description}
                      onChange={(e) => {
                        const newDomains = [...content.expertise.domains];
                        newDomains[index] = { ...newDomains[index], description: e.target.value };
                        setContent({
                          ...content,
                          expertise: { ...content.expertise, domains: newDomains },
                        });
                      }}
                      rows={3}
                      className="w-full px-4 py-3 bg-white/5 border border-[var(--orange-light)]/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent transition-all resize-none"
                    />
                  </div>
                  <button
                    onClick={() => {
                      const newDomains = content.expertise.domains.filter((_, i) => i !== index);
                      setContent({
                        ...content,
                        expertise: { ...content.expertise, domains: newDomains },
                      });
                    }}
                    className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm"
                  >
                    Supprimer ce domaine
                  </button>
                </div>
              ))}
              <button
                onClick={() => {
                  setContent({
                    ...content,
                    expertise: {
                      ...content.expertise,
                      domains: [
                        ...content.expertise.domains,
                        { icon: '', title: '', description: '' },
                      ],
                    },
                  });
                }}
                className="mt-2 px-4 py-2 bg-white/5 text-white/60 rounded-lg hover:bg-white/10 transition-colors text-sm"
              >
                + Ajouter un domaine
              </button>
            </div>
          </div>
        )}

        {/* Publications Section */}
        {activeTab === 'publications' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Section Publications</h2>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Titre</label>
              <input
                type="text"
                value={content.publications.title}
                onChange={(e) =>
                  setContent({
                    ...content,
                    publications: { ...content.publications, title: e.target.value },
                  })
                }
                className="w-full px-4 py-3 bg-white/5 border border-[var(--orange-light)]/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Sous-titre</label>
              <input
                type="text"
                value={content.publications.subtitle}
                onChange={(e) =>
                  setContent({
                    ...content,
                    publications: { ...content.publications, subtitle: e.target.value },
                  })
                }
                className="w-full px-4 py-3 bg-white/5 border border-[var(--orange-light)]/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-4">Articles</label>
              {content.publications.articles.map((article, index) => (
                <div key={index} className="mb-4 p-4 bg-white/5 rounded-lg border border-[var(--orange-light)]/20">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-xs font-medium text-white/60 mb-2">Numéro</label>
                      <input
                        type="text"
                        value={article.number}
                        onChange={(e) => {
                          const newArticles = [...content.publications.articles];
                          newArticles[index] = { ...newArticles[index], number: e.target.value };
                          setContent({
                            ...content,
                            publications: { ...content.publications, articles: newArticles },
                          });
                        }}
                        className="w-full px-4 py-3 bg-white/5 border border-[var(--orange-light)]/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-white/60 mb-2">Badge</label>
                      <input
                        type="text"
                        value={article.badge}
                        onChange={(e) => {
                          const newArticles = [...content.publications.articles];
                          newArticles[index] = { ...newArticles[index], badge: e.target.value };
                          setContent({
                            ...content,
                            publications: { ...content.publications, articles: newArticles },
                          });
                        }}
                        className="w-full px-4 py-3 bg-white/5 border border-[var(--orange-light)]/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-white/60 mb-2">Lien</label>
                      <input
                        type="text"
                        value={article.link}
                        onChange={(e) => {
                          const newArticles = [...content.publications.articles];
                          newArticles[index] = { ...newArticles[index], link: e.target.value };
                          setContent({
                            ...content,
                            publications: { ...content.publications, articles: newArticles },
                          });
                        }}
                        className="w-full px-4 py-3 bg-white/5 border border-[var(--orange-light)]/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-xs font-medium text-white/60 mb-2">Titre</label>
                    <input
                      type="text"
                      value={article.title}
                      onChange={(e) => {
                        const newArticles = [...content.publications.articles];
                        newArticles[index] = { ...newArticles[index], title: e.target.value };
                        setContent({
                          ...content,
                          publications: { ...content.publications, articles: newArticles },
                        });
                      }}
                      className="w-full px-4 py-3 bg-white/5 border border-[var(--orange-light)]/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent transition-all"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-xs font-medium text-white/60 mb-2">Description</label>
                    <textarea
                      value={article.description}
                      onChange={(e) => {
                        const newArticles = [...content.publications.articles];
                        newArticles[index] = { ...newArticles[index], description: e.target.value };
                        setContent({
                          ...content,
                          publications: { ...content.publications, articles: newArticles },
                        });
                      }}
                      rows={3}
                      className="w-full px-4 py-3 bg-white/5 border border-[var(--orange-light)]/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent transition-all resize-none"
                    />
                  </div>
                  <button
                    onClick={() => {
                      const newArticles = content.publications.articles.filter((_, i) => i !== index);
                      setContent({
                        ...content,
                        publications: { ...content.publications, articles: newArticles },
                      });
                    }}
                    className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm"
                  >
                    Supprimer cet article
                  </button>
                </div>
              ))}
              <button
                onClick={() => {
                  setContent({
                    ...content,
                    publications: {
                      ...content.publications,
                      articles: [
                        ...content.publications.articles,
                        { number: '', badge: '', title: '', description: '', link: '#' },
                      ],
                    },
                  });
                }}
                className="mt-2 px-4 py-2 bg-white/5 text-white/60 rounded-lg hover:bg-white/10 transition-colors text-sm"
              >
                + Ajouter un article
              </button>
            </div>
          </div>
        )}

        {/* About Section */}
        {activeTab === 'about' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Section À propos</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Titre</label>
                <input
                  type="text"
                  value={content.about.title}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      about: { ...content.about, title: e.target.value },
                    })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-[var(--orange-light)]/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Titre en surbrillance</label>
                <input
                  type="text"
                  value={content.about.highlightedTitle}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      about: { ...content.about, highlightedTitle: e.target.value },
                    })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-[var(--orange-light)]/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Description</label>
              <textarea
                value={content.about.description}
                onChange={(e) =>
                  setContent({
                    ...content,
                    about: { ...content.about, description: e.target.value },
                  })
                }
                rows={4}
                className="w-full px-4 py-3 bg-white/5 border border-[var(--orange-light)]/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent transition-all resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Devise</label>
              <input
                type="text"
                value={content.about.motto}
                onChange={(e) =>
                  setContent({
                    ...content,
                    about: { ...content.about, motto: e.target.value },
                  })
                }
                className="w-full px-4 py-3 bg-white/5 border border-[var(--orange-light)]/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Engagements</label>
              {content.about.commitments.map((commitment, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={commitment}
                    onChange={(e) => {
                      const newCommitments = [...content.about.commitments];
                      newCommitments[index] = e.target.value;
                      setContent({
                        ...content,
                        about: { ...content.about, commitments: newCommitments },
                      });
                    }}
                    className="flex-1 px-4 py-3 bg-white/5 border border-[var(--orange-light)]/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent transition-all"
                  />
                  <button
                    onClick={() => {
                      const newCommitments = content.about.commitments.filter((_, i) => i !== index);
                      setContent({
                        ...content,
                        about: { ...content.about, commitments: newCommitments },
                      });
                    }}
                    className="px-4 py-3 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
              <button
                onClick={() => {
                  setContent({
                    ...content,
                    about: {
                      ...content.about,
                      commitments: [...content.about.commitments, ''],
                    },
                  });
                }}
                className="mt-2 px-4 py-2 bg-white/5 text-white/60 rounded-lg hover:bg-white/10 transition-colors text-sm"
              >
                + Ajouter un engagement
              </button>
            </div>
          </div>
        )}

        {/* Timeline Section */}
        {activeTab === 'timeline' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Section Chronologie</h2>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Titre</label>
              <input
                type="text"
                value={content.timeline.title}
                onChange={(e) =>
                  setContent({
                    ...content,
                    timeline: { ...content.timeline, title: e.target.value },
                  })
                }
                className="w-full px-4 py-3 bg-white/5 border border-[var(--orange-light)]/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Sous-titre</label>
              <input
                type="text"
                value={content.timeline.subtitle}
                onChange={(e) =>
                  setContent({
                    ...content,
                    timeline: { ...content.timeline, subtitle: e.target.value },
                  })
                }
                className="w-full px-4 py-3 bg-white/5 border border-[var(--orange-light)]/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-4">Événements</label>
              {content.timeline.events.map((event, index) => (
                <div key={index} className="mb-4 p-4 bg-white/5 rounded-lg border border-[var(--orange-light)]/20">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-xs font-medium text-white/60 mb-2">Année</label>
                      <input
                        type="text"
                        value={event.year}
                        onChange={(e) => {
                          const newEvents = [...content.timeline.events];
                          newEvents[index] = { ...newEvents[index], year: e.target.value };
                          setContent({
                            ...content,
                            timeline: { ...content.timeline, events: newEvents },
                          });
                        }}
                        className="w-full px-4 py-3 bg-white/5 border border-[var(--orange-light)]/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-white/60 mb-2">Titre</label>
                      <input
                        type="text"
                        value={event.title}
                        onChange={(e) => {
                          const newEvents = [...content.timeline.events];
                          newEvents[index] = { ...newEvents[index], title: e.target.value };
                          setContent({
                            ...content,
                            timeline: { ...content.timeline, events: newEvents },
                          });
                        }}
                        className="w-full px-4 py-3 bg-white/5 border border-[var(--orange-light)]/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-xs font-medium text-white/60 mb-2">Description</label>
                    <textarea
                      value={event.description}
                      onChange={(e) => {
                        const newEvents = [...content.timeline.events];
                        newEvents[index] = { ...newEvents[index], description: e.target.value };
                        setContent({
                          ...content,
                          timeline: { ...content.timeline, events: newEvents },
                        });
                      }}
                      rows={2}
                      className="w-full px-4 py-3 bg-white/5 border border-[var(--orange-light)]/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent transition-all resize-none"
                    />
                  </div>
                  <button
                    onClick={() => {
                      const newEvents = content.timeline.events.filter((_, i) => i !== index);
                      setContent({
                        ...content,
                        timeline: { ...content.timeline, events: newEvents },
                      });
                    }}
                    className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm"
                  >
                    Supprimer cet événement
                  </button>
                </div>
              ))}
              <button
                onClick={() => {
                  setContent({
                    ...content,
                    timeline: {
                      ...content.timeline,
                      events: [...content.timeline.events, { year: '', title: '', description: '' }],
                    },
                  });
                }}
                className="mt-2 px-4 py-2 bg-white/5 text-white/60 rounded-lg hover:bg-white/10 transition-colors text-sm"
              >
                + Ajouter un événement
              </button>
            </div>
          </div>
        )}

        {/* Media Presence Section */}
        {activeTab === 'media' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Section Présence Médiatique</h2>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Titre</label>
              <input
                type="text"
                value={content.mediaPresence.title}
                onChange={(e) =>
                  setContent({
                    ...content,
                    mediaPresence: { ...content.mediaPresence, title: e.target.value },
                  })
                }
                className="w-full px-4 py-3 bg-white/5 border border-[var(--orange-light)]/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Sous-titre</label>
              <input
                type="text"
                value={content.mediaPresence.subtitle}
                onChange={(e) =>
                  setContent({
                    ...content,
                    mediaPresence: { ...content.mediaPresence, subtitle: e.target.value },
                  })
                }
                className="w-full px-4 py-3 bg-white/5 border border-[var(--orange-light)]/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-4">Apparitions médiatiques</label>
              {content.mediaPresence.items.map((item, index) => (
                <div key={index} className="mb-4 p-4 bg-white/5 rounded-lg border border-[var(--orange-light)]/20">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-xs font-medium text-white/60 mb-2">Année</label>
                      <input
                        type="text"
                        value={item.year}
                        onChange={(e) => {
                          const newItems = [...content.mediaPresence.items];
                          newItems[index] = { ...newItems[index], year: e.target.value };
                          setContent({
                            ...content,
                            mediaPresence: { ...content.mediaPresence, items: newItems },
                          });
                        }}
                        className="w-full px-4 py-3 bg-white/5 border border-[var(--orange-light)]/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-white/60 mb-2">Média</label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => {
                          const newItems = [...content.mediaPresence.items];
                          newItems[index] = { ...newItems[index], title: e.target.value };
                          setContent({
                            ...content,
                            mediaPresence: { ...content.mediaPresence, items: newItems },
                          });
                        }}
                        className="w-full px-4 py-3 bg-white/5 border border-[var(--orange-light)]/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-xs font-medium text-white/60 mb-2">Description</label>
                    <textarea
                      value={item.description}
                      onChange={(e) => {
                        const newItems = [...content.mediaPresence.items];
                        newItems[index] = { ...newItems[index], description: e.target.value };
                        setContent({
                          ...content,
                          mediaPresence: { ...content.mediaPresence, items: newItems },
                        });
                      }}
                      rows={2}
                      className="w-full px-4 py-3 bg-white/5 border border-[var(--orange-light)]/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent transition-all resize-none"
                    />
                  </div>
                  <button
                    onClick={() => {
                      const newItems = content.mediaPresence.items.filter((_, i) => i !== index);
                      setContent({
                        ...content,
                        mediaPresence: { ...content.mediaPresence, items: newItems },
                      });
                    }}
                    className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm"
                  >
                    Supprimer cette apparition
                  </button>
                </div>
              ))}
              <button
                onClick={() => {
                  setContent({
                    ...content,
                    mediaPresence: {
                      ...content.mediaPresence,
                      items: [...content.mediaPresence.items, { year: '', title: '', description: '' }],
                    },
                  });
                }}
                className="mt-2 px-4 py-2 bg-white/5 text-white/60 rounded-lg hover:bg-white/10 transition-colors text-sm"
              >
                + Ajouter une apparition
              </button>
            </div>
          </div>
        )}

        {/* Testimonials Section */}
        {activeTab === 'testimonials' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Section Témoignages</h2>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Titre</label>
              <input
                type="text"
                value={content.testimonials.title}
                onChange={(e) =>
                  setContent({
                    ...content,
                    testimonials: { ...content.testimonials, title: e.target.value },
                  })
                }
                className="w-full px-4 py-3 bg-white/5 border border-[var(--orange-light)]/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Sous-titre</label>
              <input
                type="text"
                value={content.testimonials.subtitle}
                onChange={(e) =>
                  setContent({
                    ...content,
                    testimonials: { ...content.testimonials, subtitle: e.target.value },
                  })
                }
                className="w-full px-4 py-3 bg-white/5 border border-[var(--orange-light)]/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-4">Témoignages</label>
              {content.testimonials.items.map((testimonial, index) => (
                <div key={index} className="mb-4 p-4 bg-white/5 rounded-lg border border-[var(--orange-light)]/20">
                  <div className="mb-4">
                    <label className="block text-xs font-medium text-white/60 mb-2">Note (1-5)</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={testimonial.rating}
                      onChange={(e) => {
                        const newTestimonials = [...content.testimonials.items];
                        newTestimonials[index] = {
                          ...newTestimonials[index],
                          rating: parseInt(e.target.value) || 5,
                        };
                        setContent({
                          ...content,
                          testimonials: { ...content.testimonials, items: newTestimonials },
                        });
                      }}
                      className="w-32 px-4 py-3 bg-white/5 border border-[var(--orange-light)]/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent transition-all"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-xs font-medium text-white/60 mb-2">Témoignage</label>
                    <textarea
                      value={testimonial.text}
                      onChange={(e) => {
                        const newTestimonials = [...content.testimonials.items];
                        newTestimonials[index] = { ...newTestimonials[index], text: e.target.value };
                        setContent({
                          ...content,
                          testimonials: { ...content.testimonials, items: newTestimonials },
                        });
                      }}
                      rows={3}
                      className="w-full px-4 py-3 bg-white/5 border border-[var(--orange-light)]/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent transition-all resize-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-xs font-medium text-white/60 mb-2">Auteur</label>
                      <input
                        type="text"
                        value={testimonial.author}
                        onChange={(e) => {
                          const newTestimonials = [...content.testimonials.items];
                          newTestimonials[index] = { ...newTestimonials[index], author: e.target.value };
                          setContent({
                            ...content,
                            testimonials: { ...content.testimonials, items: newTestimonials },
                          });
                        }}
                        className="w-full px-4 py-3 bg-white/5 border border-[var(--orange-light)]/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-white/60 mb-2">Détails</label>
                      <input
                        type="text"
                        value={testimonial.details}
                        onChange={(e) => {
                          const newTestimonials = [...content.testimonials.items];
                          newTestimonials[index] = { ...newTestimonials[index], details: e.target.value };
                          setContent({
                            ...content,
                            testimonials: { ...content.testimonials, items: newTestimonials },
                          });
                        }}
                        className="w-full px-4 py-3 bg-white/5 border border-[var(--orange-light)]/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const newTestimonials = content.testimonials.items.filter((_, i) => i !== index);
                      setContent({
                        ...content,
                        testimonials: { ...content.testimonials, items: newTestimonials },
                      });
                    }}
                    className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm"
                  >
                    Supprimer ce témoignage
                  </button>
                </div>
              ))}
              <button
                onClick={() => {
                  setContent({
                    ...content,
                    testimonials: {
                      ...content.testimonials,
                      items: [
                        ...content.testimonials.items,
                        { rating: 5, text: '', author: '', details: '' },
                      ],
                    },
                  });
                }}
                className="mt-2 px-4 py-2 bg-white/5 text-white/60 rounded-lg hover:bg-white/10 transition-colors text-sm"
              >
                + Ajouter un témoignage
              </button>
            </div>
          </div>
        )}

        {/* Contact Section */}
        {activeTab === 'contact' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Section Contact</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Titre</label>
                <input
                  type="text"
                  value={content.contact.title}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contact: { ...content.contact, title: e.target.value },
                    })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-[var(--orange-light)]/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Sous-titre</label>
                <input
                  type="text"
                  value={content.contact.subtitle}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contact: { ...content.contact, subtitle: e.target.value },
                    })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-[var(--orange-light)]/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Description</label>
              <textarea
                value={content.contact.description}
                onChange={(e) =>
                  setContent({
                    ...content,
                    contact: { ...content.contact, description: e.target.value },
                  })
                }
                rows={3}
                className="w-full px-4 py-3 bg-white/5 border border-[var(--orange-light)]/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent transition-all resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Localisation</label>
                <input
                  type="text"
                  value={content.contact.location}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contact: { ...content.contact, location: e.target.value },
                    })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-[var(--orange-light)]/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Email</label>
                <input
                  type="email"
                  value={content.contact.email}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contact: { ...content.contact, email: e.target.value },
                    })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-[var(--orange-light)]/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Horaires</label>
                <input
                  type="text"
                  value={content.contact.hours}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contact: { ...content.contact, hours: e.target.value },
                    })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-[var(--orange-light)]/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Sujets de contact</label>
              {content.contact.subjects.map((subject, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => {
                      const newSubjects = [...content.contact.subjects];
                      newSubjects[index] = e.target.value;
                      setContent({
                        ...content,
                        contact: { ...content.contact, subjects: newSubjects },
                      });
                    }}
                    className="flex-1 px-4 py-3 bg-white/5 border border-[var(--orange-light)]/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent transition-all"
                  />
                  <button
                    onClick={() => {
                      const newSubjects = content.contact.subjects.filter((_, i) => i !== index);
                      setContent({
                        ...content,
                        contact: { ...content.contact, subjects: newSubjects },
                      });
                    }}
                    className="px-4 py-3 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
              <button
                onClick={() => {
                  setContent({
                    ...content,
                    contact: {
                      ...content.contact,
                      subjects: [...content.contact.subjects, ''],
                    },
                  });
                }}
                className="mt-2 px-4 py-2 bg-white/5 text-white/60 rounded-lg hover:bg-white/10 transition-colors text-sm"
              >
                + Ajouter un sujet
              </button>
            </div>
          </div>
        )}

        {/* SEO Section */}
        {activeTab === 'seo' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">SEO & Métadonnées</h2>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Nom du site</label>
              <input
                type="text"
                value={content.seo.siteName}
                onChange={(e) =>
                  setContent({
                    ...content,
                    seo: { ...content.seo, siteName: e.target.value },
                  })
                }
                className="w-full px-4 py-3 bg-white/5 border border-[var(--orange-light)]/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Description</label>
              <textarea
                value={content.seo.description}
                onChange={(e) =>
                  setContent({
                    ...content,
                    seo: { ...content.seo, description: e.target.value },
                  })
                }
                rows={3}
                className="w-full px-4 py-3 bg-white/5 border border-[var(--orange-light)]/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent transition-all resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">URL du site</label>
                <input
                  type="url"
                  value={content.seo.url}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      seo: { ...content.seo, url: e.target.value },
                    })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-[var(--orange-light)]/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Téléphone</label>
                <input
                  type="tel"
                  value={content.seo.phone}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      seo: { ...content.seo, phone: e.target.value },
                    })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-[var(--orange-light)]/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Heures d&apos;ouverture</label>
                <input
                  type="text"
                  value={content.seo.openingHours}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      seo: { ...content.seo, openingHours: e.target.value },
                    })
                  }
                  placeholder="Mo-Fr 09:00-17:00"
                  className="w-full px-4 py-3 bg-white/5 border border-[var(--orange-light)]/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="flex items-center justify-end gap-4 pt-6 mt-8 border-t border-white/10">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-8 py-3 bg-gradient-to-r from-[var(--gold)] to-[var(--orange)] text-white rounded-lg hover:shadow-lg hover:shadow-[var(--orange)]/20 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {saving ? (
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
                Enregistrement...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Enregistrer les modifications
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
