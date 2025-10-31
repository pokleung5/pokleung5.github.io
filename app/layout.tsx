import type { Metadata, Viewport } from 'next';
import { Inter, Sora } from 'next/font/google';
import { siteMetadata, structuredData } from '@/lib/seo';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const sora = Sora({ subsets: ['latin'], variable: '--font-display' });

export const metadata: Metadata = {
  metadataBase: new URL(siteMetadata.url),
  title: {
    default: siteMetadata.title,
    template: `%s | ${siteMetadata.siteName}`
  },
  description: siteMetadata.description,
  applicationName: siteMetadata.siteName,
  keywords: [...siteMetadata.keywords],
  authors: [{ name: 'Eric Leung', url: siteMetadata.url }],
  creator: 'Eric Leung',
  publisher: 'Eric Leung',
  alternates: {
    canonical: '/'
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-video-preview': -1,
      'max-snippet': -1
    }
  },
  openGraph: {
    type: 'profile',
    url: siteMetadata.url,
    title: siteMetadata.title,
    description: siteMetadata.description,
    siteName: siteMetadata.siteName,
    locale: siteMetadata.locale,
    images: [
      {
        url: siteMetadata.image,
        width: 400,
        height: 400,
        alt: 'Eric Leung'
      }
    ],
    firstName: 'Eric',
    lastName: 'Leung',
    username: 'pokleung5'
  },
  twitter: {
    card: 'summary_large_image',
    site: siteMetadata.twitterHandle,
    creator: siteMetadata.twitterHandle,
    title: siteMetadata.title,
    description: siteMetadata.description,
    images: [siteMetadata.image]
  },
  category: 'Technology',
  other: {
    'ai-description': siteMetadata.description
  }
};

export const viewport: Viewport = {
  themeColor: '#0f172a',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = JSON.stringify(structuredData);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${sora.variable}`}>
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: jsonLd }}
        />
        <div className="min-h-screen bg-background">{children}</div>
      </body>
    </html>
  );
}
