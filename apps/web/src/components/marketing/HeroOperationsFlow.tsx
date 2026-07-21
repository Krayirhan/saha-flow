/**
 * HeroOperationsFlow — Landing page hero bölümü
 *
 * LANDING_REDESIGN_PLAN.md §4.2 — Split Hero: Live Operation
 *
 * Sol: Eyebrow + heading + supporting copy + CTAs + trust line
 * Sağ: OperationTimeline — #SF-1842 canlı iş emri akışı
 *
 * DESIGN.md:
 * - §2.1 Decorasyon değil, operasyonu göster
 * - §2.3 Editorial clarity
 * - §6  Heading: 56–68px desktop
 * - §13 Mobile: one-column hero
 *
 * VibeUI referansı: split hero kompozisyonu
 * Refero referansı: operasyonel yoğunluk, screenshot sunumu
 * Aceternity: timeline reveal davranışı (OperationTimeline içinde)
 */

import Link from 'next/link';

import { OperationTimeline } from './OperationTimeline';

// ── Trust line items ──────────────────────────────────────────────────────────
// TODO: Verify all three claims before publishing (LANDING_CONTENT.md §2)
const TRUST_ITEMS = [
  'Kredi kartı gerekmez',
  'Kurulum görüşmesi dahil',   // TODO: Verify scope
  'CSV veri aktarımı',          // TODO: Verify implementation
] as const;

// ── Hero ──────────────────────────────────────────────────────────────────────

export function HeroOperationsFlow() {
  return (
    <section
      id="product"
      className="relative overflow-hidden bg-[#080a0f] pt-[96px] lg:pt-[112px]"
      aria-label="Saha Flow — Saha operasyonu yönetimi"
    >
      {/* Minimal background — single subtle grid, no radial blobs */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          backgroundImage:
            'linear-gradient(rgba(79,140,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(79,140,255,0.03) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Very subtle top gradient — brand grounding, not decoration */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[320px] w-[600px] -translate-x-1/2"
        aria-hidden="true"
        style={{
          background: 'radial-gradient(ellipse at center top, rgba(79,140,255,0.08) 0%, transparent 70%)',
        }}
      />

      <div className="mkt-container relative">
        <div className="grid gap-12 pb-20 pt-12 lg:grid-cols-[1fr,1fr] lg:gap-16 lg:pb-28 lg:pt-20">
          {/* ── Left: Copy ── */}
          <div className="flex flex-col justify-center lg:max-w-[560px]">
            {/* Eyebrow */}
            <p
              className="mb-5 text-xs font-semibold uppercase tracking-[0.18em]"
              style={{ color: '#4f8cff' }}
            >
              Teknik servis ekipleri için uçtan uca saha yönetimi
            </p>

            {/* Primary heading — DESIGN.md §6: 56–68px desktop */}
            <h1
              className="text-[clamp(36px,5vw,60px)] font-bold leading-[1.04] tracking-tight text-white"
            >
              İş emrinden imzalı servis raporuna kadar tüm saha operasyonu tek akışta.
            </h1>

            {/* Supporting copy */}
            <p
              className="mt-6 max-w-[52ch] text-base leading-relaxed"
              style={{ color: '#a8b0bf' }}
            >
              Müşteri taleplerini iş emrine dönüştürün, uygun teknisyeni atayın, sahadaki süreci
              anlık takip edin ve iş tamamlandığında imzalı servis raporunu oluşturun.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              {/* Primary CTA — TODO: Link when trial is configured */}
              <Link
                href="/login"
                className="mkt-focus inline-flex items-center justify-center gap-2.5 rounded-xl px-6 py-3.5 text-sm font-semibold text-[#080a0f] transition-all hover:opacity-90 sm:justify-start"
                style={{
                  background: 'linear-gradient(135deg, #f5f7fa 0%, #dde6f5 100%)',
                  boxShadow: '0 2px 16px rgba(255,255,255,0.10)',
                }}
              >
                14 gün ücretsiz dene
                <ArrowRightIcon />
              </Link>

              {/* Secondary CTA — TODO: Link to demo/video when available */}
              <Link
                href="/login"
                className="mkt-focus inline-flex items-center justify-center gap-2 rounded-xl border px-6 py-3.5 text-sm font-semibold transition-all hover:border-white/20 hover:text-white sm:justify-start"
                style={{
                  borderColor: 'rgba(255,255,255,0.10)',
                  color: '#a8b0bf',
                }}
              >
                <PlayIcon />
                Canlı ürünü incele
              </Link>
            </div>

            {/* Trust line — compact, high contrast */}
            {/* TODO: Verify all items before publishing */}
            <div
              className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1.5"
              aria-label="Ürün güvenceleri"
            >
              {TRUST_ITEMS.map((item, i) => (
                <span
                  key={item}
                  className="flex items-center gap-1.5 text-xs"
                  style={{ color: '#747d8d' }}
                >
                  {i > 0 && (
                    <span
                      aria-hidden="true"
                      className="hidden sm:inline"
                      style={{ color: 'rgba(255,255,255,0.12)' }}
                    >
                      ·
                    </span>
                  )}
                  <span
                    aria-hidden="true"
                    className="h-1 w-1 rounded-full"
                    style={{ backgroundColor: '#38d996' }}
                  />
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* ── Right: Operation panel ── */}
          <div className="flex items-center justify-center lg:justify-end">
            <div
              className="relative w-full max-w-[420px]"
              aria-label="Canlı operasyon simülasyonu"
            >
              {/* Panel glow — subtle, tied to brand color, not decorative */}
              <div
                className="pointer-events-none absolute -inset-4 rounded-3xl"
                aria-hidden="true"
                style={{
                  background: 'radial-gradient(ellipse at 50% 0%, rgba(79,140,255,0.09) 0%, transparent 70%)',
                }}
              />

              {/* Operation card */}
              <div
                className="relative rounded-2xl p-6"
                style={{
                  background: '#0d1118',
                  border: '1px solid rgba(255,255,255,0.08)',
                  boxShadow: '0 4px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)',
                }}
              >
                {/* Card header bar */}
                <div
                  className="mb-5 flex items-center justify-between border-b pb-3"
                  style={{ borderColor: 'rgba(255,255,255,0.06)' }}
                >
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: '#38d996' }} aria-hidden="true" />
                    <p className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.4)' }}>
                      Operasyon akışı
                    </p>
                  </div>
                  <p className="font-mono text-[10px]" style={{ color: 'rgba(255,255,255,0.2)' }}>
                    bugün
                  </p>
                </div>

                <OperationTimeline animated={true} />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom fade — transition to next section */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-24"
          aria-hidden="true"
          style={{
            background: 'linear-gradient(to bottom, transparent, #080a0f)',
          }}
        />
      </div>
    </section>
  );
}

// ── Icon primitives ───────────────────────────────────────────────────────────

function ArrowRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6 5l3.5 2L6 9V5z" fill="currentColor" />
    </svg>
  );
}
