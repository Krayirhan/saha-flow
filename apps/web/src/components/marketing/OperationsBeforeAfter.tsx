/**
 * OperationsBeforeAfter — Faz 2
 * LANDING_REDESIGN_PLAN.md §4.4
 * LANDING_CONTENT.md §5
 */

import { cn } from '@/lib/utils/cn';

const BEFORE_ITEMS = [
  'WhatsApp mesajlarında kalan talepler',
  'Excel üzerinde teknisyen planı',
  'Telefonla durum sorma',
  'Kaybolan saha fotoğrafları',
  'Eksik müşteri imzası',
  'Geç hazırlanan servis raporları',
];

const AFTER_ITEMS = [
  'Standart iş emri kaydı',
  'Teknisyen atama geçmişi',
  'Anlık iş durumu',
  'Fotoğraf ve checklist kanıtı',
  'Dijital müşteri imzası',
  'Düzenli servis raporu',
];

function XIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

interface SideProps {
  title: string;
  items: string[];
  variant: 'before' | 'after';
}

function Side({ title, items, variant }: SideProps) {
  const isBefore = variant === 'before';
  return (
    <div
      className={cn(
        'rounded-2xl border p-6 sm:p-8',
        isBefore
          ? 'border-[rgba(255,95,109,0.2)] bg-[rgba(255,95,109,0.04)]'
          : 'border-[rgba(56,217,150,0.2)] bg-[rgba(56,217,150,0.04)]',
      )}
    >
      <div className="mb-5 flex items-center gap-2.5">
        <div
          className="flex h-7 w-7 items-center justify-center rounded-full"
          style={{
            backgroundColor: isBefore ? 'rgba(255,95,109,0.15)' : 'rgba(56,217,150,0.15)',
            color: isBefore ? '#ff5f6d' : '#38d996',
          }}
        >
          {isBefore ? <XIcon /> : <CheckIcon />}
        </div>
        <h3
          className="text-sm font-semibold uppercase tracking-[0.12em]"
          style={{ color: isBefore ? '#ff5f6d' : '#38d996' }}
        >
          {title}
        </h3>
      </div>

      <ul className="space-y-3" role="list">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3" role="listitem">
            <span
              className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full"
              style={{
                backgroundColor: isBefore ? 'rgba(255,95,109,0.12)' : 'rgba(56,217,150,0.12)',
                color: isBefore ? '#ff5f6d' : '#38d996',
              }}
              aria-hidden="true"
            >
              {isBefore ? <XIcon /> : <CheckIcon />}
            </span>
            <span className="text-sm leading-relaxed" style={{ color: 'var(--sf-text-2)' }}>
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function OperationsBeforeAfter() {
  return (
    <section
      id="before-after"
      className="mkt-section"
      style={{ background: 'var(--sf-bg-2)' }}
      aria-labelledby="before-after-heading"
    >
      <div className="mkt-container">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            id="before-after-heading"
            className="text-[clamp(28px,3.5vw,40px)] font-bold leading-tight tracking-tight"
            style={{ color: 'var(--sf-text)' }}
          >
            WhatsApp ve kâğıt formlardan izlenebilir saha operasyonuna
          </h2>
          <p className="mt-4 text-base leading-relaxed" style={{ color: 'var(--sf-text-muted)' }}>
            Dağınık mesajları, telefon trafiğini ve eksik servis formlarını tek bir iş emri akışında birleştirin.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:gap-6">
          <Side title="Dağınık operasyon" items={BEFORE_ITEMS} variant="before" />
          <Side title="Tek akışta izlenebilir süreç" items={AFTER_ITEMS} variant="after" />
        </div>
      </div>
    </section>
  );
}
