/**
 * TrustStrip — Faz 2
 * Sonsuz yatay akan özellik şeridi (marquee).
 */

import React from 'react';

const ITEMS = [
  {
    label: 'Çevrimdışı çalışmaya devam edin',
    icon: () => (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M2 8a6 6 0 1 1 12 0A6 6 0 0 1 2 8Z" stroke="currentColor" strokeWidth="1.4" />
        <path d="M8 5v3l2 1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: 'Web ve mobil aynı iş emrinde',
    icon: () => (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <rect x="1" y="3" width="9" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
        <rect x="11" y="5" width="4" height="6" rx="1" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    ),
  },
  {
    label: 'Rol bazlı erişim kontrolü',
    icon: () => (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.4" />
        <path d="M3 13c0-2.761 2.239-4 5-4s5 1.239 5 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M11.5 9l1 1 2-2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: 'İşlem geçmişini izleyin',
    icon: () => (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M2 4h12M2 8h8M2 12h5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: 'Verilerinizi dışa aktarın',
    icon: () => (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M8 2v8M5 7l3 3 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 12h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: 'Saha kanıtlarını tek kayıtta tutun',
    icon: () => (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <rect x="3" y="2" width="10" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
        <path d="M6 6h4M6 9h4M6 12h2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
  },
];

const SEP = () => (
  <span aria-hidden="true" className="flex-shrink-0 text-[var(--sf-border)]">·</span>
);

export function TrustStrip() {
  const doubled = [...ITEMS, ...ITEMS];

  return (
    <div
      className="border-y border-[var(--sf-border)] bg-[var(--sf-bg-2)] overflow-hidden"
      aria-label="Ürün özellikleri"
    >
      {/* edge fades */}
      <div className="relative">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16"
          style={{ background: 'linear-gradient(to right, var(--sf-bg-2), transparent)' }}
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16"
          style={{ background: 'linear-gradient(to left, var(--sf-bg-2), transparent)' }}
        />

        <div className="ticker-track flex items-center gap-8 py-4 w-max" aria-hidden="true">
          {doubled.map((item, i) => (
            <React.Fragment key={i}>
              <span
                className="flex flex-shrink-0 items-center gap-2 text-sm whitespace-nowrap"
                style={{ color: 'var(--sf-text-2)' }}
              >
                <span style={{ color: '#4f8cff' }}>
                  <item.icon />
                </span>
                {item.label}
              </span>
              {i !== doubled.length - 1 && <SEP />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
