export const siteMetadata = {
  title: 'Eric Leung | Software Architect & Refactorer',
  description:
    'Interactive portfolio for Eric Leung, highlighting commerce platforms, architecture leadership, and refactoring-first delivery across travel, SaaS, and payments.',
  siteName: 'Eric Leung Portfolio',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://pokleung5.github.io',
  locale: 'en_US',
  twitterHandle: '@pokleung5',
  keywords: [
    'Eric Leung',
    'software architect',
    'refactoring specialist',
    'commerce engineering',
    'Next.js developer',
    'payments platforms',
    'technical leadership'
  ],
  sameAs: [
    'https://github.com/pokleung5',
    'https://www.linkedin.com/in/eric-leung-in-ca/',
    'mailto:ericleung.pok@gmail.com'
  ],
  email: 'ericleung.pok@gmail.com',
  jobTitle: 'Software Architect & Refactorer',
  image: 'https://github.com/pokleung5.png'
} as const;

export const structuredData = [
  {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Eric Leung',
    jobTitle: siteMetadata.jobTitle,
    description: siteMetadata.description,
    url: siteMetadata.url,
    email: siteMetadata.email,
    sameAs: siteMetadata.sameAs,
    image: siteMetadata.image
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteMetadata.siteName,
    url: siteMetadata.url,
    description: siteMetadata.description,
    publisher: {
      '@type': 'Person',
      name: 'Eric Leung',
      url: siteMetadata.url
    }
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: siteMetadata.title,
    url: siteMetadata.url,
    description: siteMetadata.description,
     image: siteMetadata.image,
    isPartOf: {
      '@type': 'WebSite',
      name: siteMetadata.siteName,
      url: siteMetadata.url
    },
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: siteMetadata.image
    },
    about: {
      '@type': 'Person',
      name: 'Eric Leung'
    }
  }
] as const;

export const absoluteUrl = (path: string) => {
  const base = siteMetadata.url.replace(/\/+$/, '');
  const relative = path.startsWith('/') ? path : `/${path}`;
  return `${base}${relative}`;
};
