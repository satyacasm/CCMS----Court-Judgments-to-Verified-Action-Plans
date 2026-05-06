import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/shared/Sidebar';
import Topbar from '@/components/shared/Topbar';
import Providers from './providers';

export const metadata: Metadata = {
  title: 'JudgmentOS — Court Compliance Management System',
  description:
    'Transform raw court judgment PDFs into structured, verified, department-wise action plans with real-time compliance tracking.',
  keywords: ['court compliance', 'judgment management', 'legal tech', 'CCMS', 'India judiciary'],
  openGraph: {
    title: 'JudgmentOS — CCMS',
    description: 'AI-powered court compliance management for the Indian judiciary',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <Providers>
          <Sidebar />
          <div className="main-content">
            <Topbar />
            <main className="p-6 max-w-[1280px] mx-auto page-enter">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
