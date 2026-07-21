import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'İşAkış - Saha Yönetim Sistemi',
  description: 'İşAkış ile iş emirlerinizi ve müşterilerinizi kolayca yönetin.',
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${inter.variable} h-full dark`}>
      <body className="h-full bg-[#0A0A0B] font-sans text-white antialiased">
        {children}
      </body>
    </html>
  );
}
