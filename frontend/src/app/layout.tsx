import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ExpenseTracker — Smart Budget Planner',
  description: 'Track expenses, plan budgets, and settle group expenses with friends',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'ExpenseTracker',
    startupImage: '/icons/icon-512.png',
  },
  icons: {
    icon: '/icons/icon-192.png',
    apple: '/icons/icon-192.png',
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': 'ExpenseTracker',
    'application-name': 'ExpenseTracker',
    'msapplication-TileColor': '#7C3AED',
    'msapplication-tap-highlight': 'no',
  },
};

export const viewport: Viewport = {
  themeColor: '#7C3AED',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="ExpenseTracker" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#7C3AED" />
      </head>
      <body className={inter.className}>
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}
