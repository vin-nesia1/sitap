import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SITEMAP VIN NESIA - Generator Sitemap Profesional',
  description: 'Tool gratis untuk mengekstrak semua link internal dari website. Generate sitemap lengkap dengan satu klik. SEO friendly dan mudah digunakan.',
  keywords: [
    'sitemap generator',
    'extract links',
    'website crawler',
    'SEO tools',
    'link extractor',
    'sitemap creator',
    'website analyzer',
    'internal links',
    'VIN NESIA',
    'free tools'
  ],
  authors: [{ name: 'VIN NESIA' }],
  creator: 'VIN NESIA',
  publisher: 'VIN NESIA',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://sitemap.vinnesia.my.id'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'SITEMAP VIN NESIA - Generator Sitemap Profesional',
    description: 'Tool gratis untuk mengekstrak semua link internal dari website. Generate sitemap lengkap dengan satu klik.',
    url: 'https://sitemap.vinnesia.my.id',
    siteName: 'SITEMAP VIN NESIA',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'SITEMAP VIN NESIA - Generator Sitemap Profesional',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SITEMAP VIN NESIA - Generator Sitemap Profesional',
    description: 'Tool gratis untuk mengekstrak semua link internal dari website. Generate sitemap lengkap dengan satu klik.',
    images: ['/og-image.jpg'],
    creator: '@vinnesia',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  other: {
    'google-site-verification': 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <link rel="canonical" href="https://sitemap.vinnesia.my.id" />
        <meta name="theme-color" content="#7c3aed" />
        <meta name="msapplication-TileColor" content="#7c3aed" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'SITEMAP VIN NESIA',
              description: 'Tool gratis untuk mengekstrak semua link internal dari website. Generate sitemap lengkap dengan satu klik.',
              url: 'https://sitemap.vinnesia.my.id',
              applicationCategory: 'DeveloperApplication',
              operatingSystem: 'Web Browser',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
              creator: {
                '@type': 'Organization',
                name: 'VIN NESIA',
                url: 'https://vinnesia.my.id',
              },
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
