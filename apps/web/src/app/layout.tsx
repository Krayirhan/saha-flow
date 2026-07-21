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
    <html lang="tr" className={`${inter.variable} h-full`}>
      <head>
        {/* No-flash theme init: runs before paint */}
        <script dangerouslySetInnerHTML={{ __html: `
(function(){
  try {
    var t = localStorage.getItem('sf-theme');
    if (!t) t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', t);
  } catch(e){}
})();
        `}} />
      </head>
      <body className="h-full font-sans antialiased" style={{ background: 'var(--sf-bg)', color: 'var(--sf-text)' }}>
        {children}
      </body>
    </html>
  );
}
