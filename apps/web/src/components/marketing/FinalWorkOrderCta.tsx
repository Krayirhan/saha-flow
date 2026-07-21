/**
 * FinalWorkOrderCta — Faz 4
 * LANDING_REDESIGN_PLAN.md §4.12
 * LANDING_CONTENT.md §13
 *
 * Flow Line ile kapanıyor: iş emri tamamlandı → imza → rapor.
 * Büyük dekoratif glow yok — ürün görselinden güçlü efekt yok.
 */

import Link from 'next/link';

import { WorkflowNode, StateChip } from './WorkflowNode';
import { FlowConnector } from './FlowLine';

const FINAL_STATES = [
  { label: 'İş emri tamamlandı', state: 'completed' as const },
  { label: 'Müşteri imzası alındı', state: 'completed' as const },
  { label: 'Servis raporu oluşturuldu', state: 'synced' as const },
] as const;

export function FinalWorkOrderCta() {
  return (
    <section
      className="mkt-section"
      aria-labelledby="final-cta-heading"
    >
      <div className="mkt-container">
        <div
          className="overflow-hidden rounded-3xl border"
          style={{
            background: 'var(--sf-surface)',
            borderColor: 'var(--sf-border)',
          }}
        >
          <div className="grid gap-12 p-8 sm:p-12 lg:grid-cols-[1fr,auto] lg:gap-16 lg:items-center">
            {/* Left: copy + CTAs */}
            <div>
              <h2
                id="final-cta-heading"
                className="text-[clamp(26px,3vw,38px)] font-bold leading-tight tracking-tight"
                style={{ color: 'var(--sf-text)' }}
              >
                Bir sonraki iş emrinizi WhatsApp&apos;tan değil, Saha Flow&apos;dan yönetin.
              </h2>
              <p className="mt-4 text-base leading-relaxed" style={{ color: 'var(--sf-text-muted)' }}>
                Ekibinizi oluşturun, ilk müşterinizi ekleyin ve saha operasyonunuzu tek panelden takip etmeye başlayın.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                {/* TODO: Update href when trial flow is ready */}
                <Link
                  href="/login"
                  className="mkt-focus inline-flex items-center justify-center gap-2 rounded-xl px-7 py-4 text-sm font-semibold text-[#080a0f] transition-opacity hover:opacity-90"
                  style={{
                    background: 'linear-gradient(135deg, #f5f7fa 0%, #dde6f5 100%)',
                    boxShadow: '0 2px 16px rgba(255,255,255,0.08)',
                  }}
                >
                  14 gün ücretsiz dene
                  <ArrowRightIcon />
                </Link>
                {/* TODO: Add demo request link */}
                <Link
                  href="/login"
                  className="mkt-focus inline-flex items-center justify-center gap-2 rounded-xl border px-7 py-4 text-sm font-semibold transition-colors hover:border-[rgba(255,255,255,0.2)] hover:text-white"
                  style={{ borderColor: 'var(--sf-border)', color: 'var(--sf-text-2)' }}
                >
                  Demo talep et
                </Link>
              </div>

              {/* TODO: Verify all three claims */}
              <p className="mt-4 text-xs" style={{ color: 'var(--sf-text-muted)' }}>
                Kredi kartı gerekmez · Kurulum görüşmesi · CSV veri aktarımı
              </p>
            </div>

            {/* Right: Flow Line completion visual */}
            <div
              className="hidden rounded-2xl border p-6 lg:block lg:w-72"
              style={{
                background: 'var(--sf-bg-2)',
                borderColor: 'var(--sf-border)',
              }}
              aria-label="İş emri tamamlanma akışı"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="font-mono text-xs font-bold tracking-widest" style={{ color: '#4f8cff' }}>
                  #SF-1842
                </span>
                <StateChip state="completed" />
              </div>

              <div className="space-y-0">
                {FINAL_STATES.map((step, i) => (
                  <div key={step.label}>
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <WorkflowNode
                          state={step.state}
                          active
                          layout="vertical"
                        />
                        {i < FINAL_STATES.length - 1 && <FlowConnector active />}
                      </div>
                      <div className="pb-1 pt-1">
                        <p className="text-sm font-medium" style={{ color: 'var(--sf-text-2)' }}>
                          {step.label}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
