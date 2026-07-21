/**
 * MarketingFooter — Faz 4
 * LANDING_REDESIGN_PLAN.md §4.13
 * LANDING_CONTENT.md §14
 *
 * 4 kolon. Doğrulanmamış route'lar href="#" ile işaretli.
 */

import Link from 'next/link';

const FOOTER_LINKS = {
  Ürün: [
    { label: 'Özellikler', href: '#product' },
    { label: 'Mobil uygulama', href: '#mobile' },
    { label: 'Fiyatlandırma', href: '#pricing' },
    { label: 'Güvenlik', href: '#security' },
    { label: 'Sürüm notları', href: '#' }, // TODO: Add release notes page
  ],
  Kaynaklar: [
    { label: 'Dokümantasyon', href: '#' }, // TODO: Add docs
    { label: 'Yardım merkezi', href: '#' }, // TODO: Add help center
    { label: 'API', href: '#' },            // TODO: Add API docs
    { label: 'Durum sayfası', href: '#' }, // TODO: Add status page
  ],
  Şirket: [
    { label: 'Hakkımızda', href: '#' },   // TODO: Add about page
    { label: 'İletişim', href: '#' },      // TODO: Add contact page
    { label: 'Kariyer', href: '#' },       // TODO: Add careers page
  ],
  Hukuki: [
    { label: 'KVKK Aydınlatma Metni', href: '#' }, // TODO: Add legal pages
    { label: 'Gizlilik Politikası', href: '#' },
    { label: 'Kullanım Şartları', href: '#' },
    { label: 'Çerez Politikası', href: '#' },
  ],
} as const;

function SahaFlowLogo() {
  return (
    <Link
      href="/"
      className="mkt-focus group inline-flex items-center gap-2.5 rounded-lg"
      aria-label="Saha Flow — Ana sayfa"
    >
      <div
        className="flex h-8 w-8 items-center justify-center rounded-[10px] transition-transform duration-200 group-hover:scale-105"
        style={{
          background: 'linear-gradient(135deg, #4f8cff 0%, #7d6cff 100%)',
          boxShadow: '0 2px 12px rgba(79,140,255,0.3)',
        }}
        aria-hidden="true"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M2 12 C4 12 4 4 8 4 C12 4 12 12 14 12"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </div>
      <span className="text-sm font-bold tracking-tight" style={{ color: 'var(--sf-text)' }}>
        Saha Flow
      </span>
    </Link>
  );
}

export function MarketingFooter() {
  return (
    <footer
      className="border-t"
      style={{ borderColor: 'var(--sf-border)', background: 'var(--sf-bg-2)' }}
      role="contentinfo"
    >
      <div className="mkt-container py-12 lg:py-16">
        {/* Top row: logo + columns */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[200px,1fr,1fr,1fr,1fr]">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <SahaFlowLogo />
            <p className="mt-3 max-w-[220px] text-sm leading-relaxed" style={{ color: 'var(--sf-text-muted)' }}>
              Teknik servis ekipleri için uçtan uca saha operasyonu yönetimi.
            </p>
          </div>

          {/* Link columns */}
          {(Object.entries(FOOTER_LINKS) as [string, readonly { label: string; href: string }[]][]).map(([group, links]) => (
            <div key={group}>
              <p
                className="mb-4 text-xs font-semibold uppercase tracking-[0.12em]"
                style={{ color: 'var(--sf-text-muted)' }}
              >
                {group}
              </p>
              <ul className="space-y-2.5" role="list">
                {links.map((link) => (
                  <li key={link.label} role="listitem">
                    <Link
                      href={link.href}
                      className="mkt-focus rounded text-sm transition-colors hover:text-white"
                      style={{ color: 'var(--sf-text-muted)' }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div
          className="mt-10 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row"
          style={{ borderColor: 'var(--sf-border)' }}
        >
          <p className="text-xs" style={{ color: 'var(--sf-text-muted)' }}>
            &copy; 2026 Saha Flow. Tüm hakları saklıdır.
          </p>
          <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--sf-text-muted)' }}>
            <span>Türkiye</span>
            <span aria-hidden="true">·</span>
            <span>Türkçe</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
