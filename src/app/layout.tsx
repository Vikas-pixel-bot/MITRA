import type { Metadata, Viewport } from 'next';
import { Inter, Noto_Sans, Noto_Sans_Devanagari } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const notoSans = Noto_Sans({ subsets: ['latin'], variable: '--font-noto-sans' });
const notoSansDevanagari = Noto_Sans_Devanagari({
  subsets: ['devanagari'],
  variable: '--font-noto-sans-devanagari',
});

export const metadata: Metadata = {
  title: 'MITRA — Always by your side',
  description: 'Mentoring Intelligence for Tribal Residential Ashramshala',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'MITRA',
  },
};

export const viewport: Viewport = {
  themeColor: '#faf6ee',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`scroll-smooth ${inter.variable} ${notoSans.variable} ${notoSansDevanagari.variable}`}
    >
      <body className="bg-cloud text-moon antialiased selection:bg-morning-sun selection:text-white">
        {children}
      </body>
    </html>
  );
}
