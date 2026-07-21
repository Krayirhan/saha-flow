/**
 * PilotProgramSection — Faz 4
 * LANDING_REDESIGN_PLAN.md §4.9
 * LANDING_CONTENT.md §10
 *
 * Doğrulanmış testimonial yok — pilot program sunuluyor.
 * Pilot koşulları TODO olarak işaretli.
 */

import Link from 'next/link';

const BENEFITS = [
  'Kurulum görüşmesi',
  'CSV veri aktarımı desteği',
  'Doğrudan geri bildirim kanalı',
  'Öncelikli onboarding',
];

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2.5 7l3 3L11.5 4" stroke="#38d996" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PilotProgramSection() {
  return (
    <section
      className="mkt-section"
      aria-labelledby="pilot-heading"
    >
      <div className="mkt-container">
        <div
          className="overflow-hidden rounded-3xl border"
          style={{
            background: 'linear-gradient(135deg, var(--sf-surface) 0%, var(--sf-bg-2) 100%)',
            borderColor: 'var(--sf-border)',
          }}
        >
          <div className="grid gap-10 p-8 sm:p-12 lg:grid-cols-2 lg:gap-16 lg:items-center">
            {/* Left */}
            <div>
              <span
                className="text-xs font-semibold uppercase tracking-[0.18em]"
                style={{ color: '#4f8cff' }}
              >
                Pilot Program
              </span>
              <h2
                id="pilot-heading"
                className="mt-3 text-[clamp(26px,3vw,36px)] font-bold leading-tight tracking-tight"
                style={{ color: 'var(--sf-text)' }}
              >
                İlk pilot ekiplerden biri olun
              </h2>
              <p className="mt-4 text-base leading-relaxed" style={{ color: 'var(--sf-text-muted)' }}>
                Saha Flow&apos;u gerçek operasyonunuzda deneyin. Kurulum, veri taşıma ve ilk iş emri akışı için ürün ekibiyle birlikte ilerleyin.
              </p>

              {/* TODO: Update href when pilot form is ready */}
              <Link
                href="/login"
                className="mkt-focus mt-8 inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold transition-opacity hover:opacity-90"
                style={{
                  background: 'linear-gradient(135deg, #f5f7fa 0%, #dde6f5 100%)',
                  color: '#080a0f',
                }}
              >
                Pilot programına başvur
                <ArrowRightIcon />
              </Link>
            </div>

            {/* Right: benefits */}
            <div>
              <p
                className="mb-5 text-xs font-semibold uppercase tracking-[0.12em]"
                style={{ color: 'var(--sf-text-muted)' }}
              >
                Pilot kapsamı
              </p>
              <ul className="space-y-3.5" role="list">
                {BENEFITS.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-3" role="listitem">
                    <span
                      className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full"
                      style={{ background: 'rgba(56,217,150,0.12)' }}
                    >
                      <CheckIcon />
                    </span>
                    <span className="text-sm" style={{ color: 'var(--sf-text-2)' }}>
                      {benefit}
                    </span>
                  </li>
                ))}
                <li className="flex items-center gap-3" role="listitem">
                  <span
                    className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full"
                    style={{ background: 'rgba(255,255,255,0.06)' }}
                    aria-hidden="true"
                  >
                    <span className="h-1 w-1 rounded-full" style={{ background: 'var(--sf-text-muted)' }} />
                  </span>
                  {/* TODO: Define pilot pricing */}
                  <span className="text-sm" style={{ color: 'var(--sf-text-muted)' }}>
                    Pilot koşulları — yakında açıklanacak
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
