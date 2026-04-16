import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cabinet Arfaoui Law & Consulting — Avocat au Barreau de Tunis",
  description: "Cabinet d'avocats spécialisé en droit pénal financier, réconciliation pénale, droits de la défense et droit du sport. Plus de 250 dossiers traités, 35M de dinars de valeur traitée. Maître Walid Arfaoui, avocat au Barreau de Tunis.",
  keywords: ["avocat Tunis", "droit pénal financier", "réconciliation pénale", "cabinet d'avocats Tunisie", "Walid Arfaoui", "droits de la défense", "droit du sport"],
  authors: [{ name: "Cabinet Arfaoui Law & Consulting" }],
  openGraph: {
    title: "Cabinet Arfaoui Law & Consulting — Tunis",
    description: "Faire valoir vos droits, avec une stratégie implacable. Spécialisé en droit pénal financier, réconciliation pénale, droits de la défense et droit du sport.",
    url: "https://maitrearfaoui.com",
    siteName: "Cabinet Arfaoui Law & Consulting",
    locale: "fr_TN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cabinet Arfaoui Law & Consulting — Avocat au Barreau de Tunis",
    description: "Faire valoir vos droits, avec une stratégie implacable",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
