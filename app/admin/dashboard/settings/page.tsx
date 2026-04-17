'use client';

import { useEffect, useState } from 'react';

interface SectionVisibility {
  hero: boolean;
  expertise: boolean;
  publications: boolean;
  about: boolean;
  timeline: boolean;
  mediaPresence: boolean;
  testimonials: boolean;
  contact: boolean;
  blogs: boolean;
  qa: boolean;
  externalArticles: boolean;
}

const sectionLabels: Record<keyof SectionVisibility, string> = {
  hero: 'Section Hero (Bannière principale)',
  expertise: 'Domaines d\'Expertise',
  publications: 'Publications',
  about: 'À Propos du Cabinet',
  timeline: 'Chronologie / Timeline',
  mediaPresence: 'Présence Médias',
  testimonials: 'Témoignages Clients',
  contact: 'Formulaire de Contact',
  blogs: 'Articles du Blog',
  qa: 'Questions & Réponses',
  externalArticles: 'Articles Externes',
};

const sectionDescriptions: Record<keyof SectionVisibility, string> = {
  hero: 'Afficher la bannière d\'accueil avec les informations principales de l\'avocat',
  expertise: 'Afficher la section des domaines juridiques et expertises',
  publications: 'Afficher la liste des publications légales',
  about: 'Afficher la section de présentation du cabinet',
  timeline: 'Afficher la chronologie des événements et jalons importants',
  mediaPresence: 'Afficher la section des apparitions médias',
  testimonials: 'Afficher les témoignages et avis des clients',
  contact: 'Afficher le formulaire de contact sur la page d\'accueil',
  blogs: 'Afficher la section des articles de blog',
  qa: 'Afficher la section Questions & Réponses',
  externalArticles: 'Afficher les articles externes et publications',
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<SectionVisibility | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/section-visibility');
      const data = await response.json();

      if (data.success) {
        setSettings(data.settings);
      } else {
        setMessage({ type: 'error', text: 'Échec du chargement des paramètres' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors du chargement des paramètres' });
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (section: keyof SectionVisibility) => {
    if (!settings) return;
    setSettings({
      ...settings,
      [section]: !settings[section],
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage(null);

      const response = await fetch('/api/section-visibility', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Paramètres sauvegardés avec succès!' });
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ type: 'error', text: 'Échec de la sauvegarde des paramètres' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la sauvegarde' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-[var(--orange)] border-t-transparent rounded-full animate-spin mb-4"></div>
          <div className="text-white/70">Chargement des paramètres...</div>
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 text-red-200 px-6 py-4 rounded-lg">
        Erreur lors du chargement des paramètres
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Paramètres de Visibilité</h1>
          <p className="text-white/70">Contrôlez quelles sections apparaissent sur la page d'accueil</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[var(--gold)] to-[var(--orange)] text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-[var(--orange)]/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Enregistrement...
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Sauvegarder
            </>
          )}
        </button>
      </div>

      {/* Success/Error Message */}
      {message && (
        <div
          className={`px-6 py-4 rounded-lg backdrop-blur-sm animate-fade-in ${
            message.type === 'success'
              ? 'bg-green-500/10 border border-green-500/30 text-green-200'
              : 'bg-red-500/10 border border-red-500/30 text-red-200'
          }`}
        >
          <div className="flex items-center">
            {message.type === 'success' ? (
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            {message.text}
          </div>
        </div>
      )}

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(Object.keys(settings) as Array<keyof SectionVisibility>).map((section) => (
          <div
            key={section}
            className="bg-white/10 backdrop-blur-xl border border-[var(--orange-light)]/30 rounded-xl p-6 hover:border-[var(--gold)]/50 transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 mr-4">
                <h3 className="text-lg font-bold text-white mb-2">
                  {sectionLabels[section]}
                </h3>
                <p className="text-sm text-white/60 leading-relaxed">
                  {sectionDescriptions[section]}
                </p>
              </div>
              <button
                onClick={() => handleToggle(section)}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:ring-offset-2 focus:ring-offset-[#0a0a1a] ${
                  settings[section]
                    ? 'bg-gradient-to-r from-[var(--gold)] to-[var(--orange)]'
                    : 'bg-white/20'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    settings[section] ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <div className="mt-4 pt-4 border-t border-white/10">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  settings[section]
                    ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                    : 'bg-red-500/20 text-red-300 border border-red-500/30'
                }`}
              >
                {settings[section] ? (
                  <>
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Visible
                  </>
                ) : (
                  <>
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    Masqué
                  </>
                )}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Info Box */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
        <div className="flex items-start">
          <svg className="w-6 h-6 text-blue-400 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="text-blue-200 font-semibold mb-2">Information</h4>
            <p className="text-blue-200/80 text-sm leading-relaxed">
              Les modifications apportées ici affecteront immédiatement l'affichage de la page d'accueil.
              Les sections masquées ne seront plus visibles pour les visiteurs, mais leurs données seront conservées.
              N'oubliez pas de cliquer sur "Sauvegarder" pour appliquer vos modifications.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
