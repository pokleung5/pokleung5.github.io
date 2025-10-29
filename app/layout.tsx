import type { Metadata } from 'next';
import { Inter, Sora } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const sora = Sora({ subsets: ['latin'], variable: '--font-display' });

export const metadata: Metadata = {
  title: 'Eric Leung | Software Architect & Refactorer',
  description:
    'Interactive portfolio for Eric, showcasing a love for refactoring, architecture design, and emerging technologies.',
  keywords: [
    'Eric Leung',
    'software engineer',
    'portfolio',
    'refactoring',
    'architecture design',
    'Next.js',
    'Framer Motion'
  ]
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${sora.variable}`}>
        <div className="min-h-screen bg-background">{children}</div>
      </body>
    </html>
  );
}
