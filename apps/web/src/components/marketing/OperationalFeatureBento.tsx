/**
 * OperationalFeatureBento — Faz 3
 * LANDING_REDESIGN_PLAN.md §4.7
 * LANDING_CONTENT.md §8
 *
 * Asimetrik bento grid.
 * Hover: hafif yükseklik — sürekli animasyon yok (DESIGN.md §11).
 */

import { cn } from '@/lib/utils/cn';

type BentoItem = {
  title: string;
  copy: string;
  large?: boolean;
  icon: () => React.ReactElement;
  accent?: string;
};

const ITEMS: BentoItem[] = [
  {
    title: 'İş emirleri kaybolmasın',
    copy: 'Tüm servis taleplerini tek yerde kaydedin, atayın ve durum bazlı takip edin.',
    large: true,
    accent: '#4f8cff',
    icon: () => (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <rect x="3" y="2" width="14" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M7 7h6M7 10h6M7 13h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Teknisyen planı çakışmasın',
    copy: 'Günlük iş yükünü görün ve yeni atamaları mevcut planla birlikte değerlendirin.',
    accent: '#7d6cff',
    icon: () => (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <rect x="3" y="4" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M7 2v3M13 2v3M3 8h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'İnternet kesilince iş durmasın',
    copy: 'Mobil uygulamada saha işlemlerini çevrimdışı sürdürün ve bağlantı geldiğinde senkronize edin.',
    large: true,
    accent: '#3dd6d0',
    icon: () => (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M10 14a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10 2v3M10 15v3M2 10h3M15 10h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M4.22 4.22l2.12 2.12M13.66 13.66l2.12 2.12M4.22 15.78l2.12-2.12M13.66 6.34l2.12-2.12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Servis formları eksik kalmasın',
    copy: 'Checklist, fotoğraf, not ve imza alanlarıyla her iş için standart bir kayıt oluşturun.',
    accent: '#38d996',
    icon: () => (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M5 10l3 3 7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="3" y="3" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    title: 'Müşteri tekrar aranmasın',
    copy: 'İş tamamlandığında yapılan işlemleri ve müşteri onayını tek raporda toplayın.',
    accent: '#ffaa4c',
    icon: () => (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <rect x="4" y="2" width="12" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M7 7h6M7 10h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M7 14l1.5 1.5L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Saha ile ofis aynı bilgiyi görsün',
    copy: 'Web paneli ve mobil uygulama aynı iş emri verisi üzerinden ilerler.',
    accent: '#74b8ff',
    icon: () => (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <rect x="2" y="5" width="11" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="14" y="7" width="4" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <path d="M7 16h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

interface BentoCardProps {
  item: BentoItem;
}

function BentoCard({ item }: BentoCardProps) {
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-[18px] border p-6 transition-all duration-200',
        'hover:border-[rgba(255,255,255,0.12)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]',
        item.large ? 'sm:col-span-2' : '',
      )}
      style={{
        background: 'var(--sf-surface)',
        borderColor: 'var(--sf-border)',
      }}
    >
      {/* Icon */}
      <div
        className="mb-4 inline-flex items-center justify-center rounded-xl p-2.5 transition-colors"
        style={{
          background: `${item.accent ?? '#4f8cff'}14`,
          color: item.accent ?? '#4f8cff',
        }}
      >
        <item.icon />
      </div>

      <h3
        className="mb-2 text-base font-semibold leading-snug"
        style={{ color: 'var(--sf-text)' }}
      >
        {item.title}
      </h3>
      <p className="text-sm leading-relaxed" style={{ color: 'var(--sf-text-muted)' }}>
        {item.copy}
      </p>

      {/* Subtle hover glow — only on hover, not continuous */}
      <div
        className="pointer-events-none absolute -bottom-8 -right-8 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden="true"
        style={{ background: `${item.accent ?? '#4f8cff'}18` }}
      />
    </div>
  );
}

export function OperationalFeatureBento() {
  return (
    <section
      className="mkt-section"
      style={{ background: 'var(--sf-bg-2)' }}
      aria-labelledby="bento-heading"
    >
      <div className="mkt-container">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2
            id="bento-heading"
            className="text-[clamp(28px,3.5vw,40px)] font-bold leading-tight tracking-tight"
            style={{ color: 'var(--sf-text)' }}
          >
            Saha ekiplerinin her gün yaşadığı sorunlar için
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ITEMS.map((item) => (
            <BentoCard key={item.title} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
