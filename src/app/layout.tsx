import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ball Blast — Neon Arcade Shooter',
  description:
    'Shoot cannon balls upward to break numbered balls before they crush you. ' +
    'Neon arcade shooter built with Next.js + TypeScript.',
  keywords: ['ball blast', 'arcade', 'shooter', 'game', 'nextjs'],
  icons: { icon: '/favicon.svg' },
  openGraph: {
    title: 'Ball Blast — Neon Arcade Shooter',
    description: 'Destroy numbered balls before they reach your cannon!',
    type: 'website',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#080818',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to Google Fonts for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Orbitron – the retro-futuristic font perfect for an arcade game */}
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-[#040410] overflow-hidden">
        {children}
      </body>
    </html>
  );
}
