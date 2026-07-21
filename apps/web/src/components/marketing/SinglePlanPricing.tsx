/**
 * SinglePlanPricing — Faz 4
 * LANDING_REDESIGN_PLAN.md §4.10
 * LANDING_CONTENT.md §11
 *
 * TODO: Fiyat, deneme süresi ve iptal koşulları yayın öncesi doğrulanmalı.
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';

const FEATURES = [
  'Web yönetim paneli',
  'Mobil teknisyen uygulaması',
  'İş emri yönetimi',
  'Müşteri ve cihaz kayıtları',
  'Fotoğraf ve dosya ekleme',
  'Kontrol listeleri',
  'Dijital imza',
  'PDF servis raporu',
  'Rol ve yetki yönetimi',
  'E-posta desteği',
];

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2.5 7l3 3L11.5 4" stroke="#38d996" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SinglePlanPricing() {
  const [yearly, setYearly] = useState(true);

  // TODO: Verify pricing before publishing
  const monthlyPrice = yearly ? 119 : 149;

  return (
    <section
      id="pricing"
      className="mkt-section"
      style={{ background: 'var(--sf-bg)' }}
      aria-labelledby="pricing-heading"
    >
      <div className="mkt-container">
        <div className="mx-auto max-w-2xl text-center">
          <span
            className="text-xs font-semibold uppercase tracking-[0.18em]"
            style={{ color: '#4f8cff' }}
          >
            Fiyatlandırma
          </span>
          <h2
            id="pricing-heading"
            className="mt-3 text-[clamp(28px,3.5vw,40px)] font-bold leading-tight tracking-tight"
            style={{ color: 'var(--sf-text)' }}
          >
            Ekibiniz büyüdükçe sade kalan fiyatlandırma
          </h2>
        </div>

        {/* Billing toggle */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <span
            className="text-sm"
            style={{ color: yearly ? 'var(--sf-text-muted)' : 'var(--sf-text)' }}
          >
            Aylık
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={yearly}
            aria-label={yearly ? 'Yıllık fatura seçili' : 'Aylık fatura seçili'}
            onClick={() => setYearly(!yearly)}
            className="mkt-focus relative h-7 w-12 rounded-full transition-colors"
            style={{ background: yearly ? '#4f8cff' : 'rgba(255,255,255,0.12)' }}
          >
            <span
              className="absolute left-0.5 top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform"
              style={{ transform: yearly ? 'translateX(20px)' : 'translateX(0)' }}
              aria-hidden="true"
            />
          </button>
          <span
            className="flex items-center gap-2 text-sm"
            style={{ color: yearly ? 'var(--sf-text)' : 'var(--sf-text-muted)' }}
          >
            Yıllık
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
              style={{ background: 'rgba(56,217,150,0.15)', color: '#38d996' }}
            >
              %20 tasarruf
            </span>
          </span>
        </div>

        {/* Plan card + value prop */}
        <div className="mx-auto mt-10 grid max-w-4xl gap-6 lg:grid-cols-[1fr,auto]">
          {/* Pricing card */}
          <div
            className="rounded-3xl border p-8"
            style={{
              background: 'var(--sf-surface)',
              borderColor: 'rgba(79,140,255,0.25)',
              boxShadow: '0 0 0 1px rgba(79,140,255,0.08), 0 4px 32px rgba(0,0,0,0.4)',
            }}
          >
            <h3 className="text-lg font-semibold" style={{ color: 'var(--sf-text)' }}>
              Profesyonel
            </h3>
            {/* TODO: Verify pricing */}
            <div className="mt-5 flex items-baseline gap-1">
              <span className="text-5xl font-bold tracking-tight" style={{ color: 'var(--sf-text)' }}>
                ₺{monthlyPrice}
              </span>
              <span className="text-base" style={{ color: 'var(--sf-text-muted)' }}>
                /kullanıcı/ay
              </span>
            </div>
            <p className="mt-1 text-xs" style={{ color: 'var(--sf-text-muted)' }}>
              {yearly ? 'Yıllık fatura' : 'Aylık fatura'}
            </p>

            {/* Feature list */}
            <ul className="mt-7 space-y-3" role="list">
              {FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-3" role="listitem">
                  <span
                    className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full"
                    style={{ background: 'rgba(56,217,150,0.12)' }}
                  >
                    <CheckIcon />
                  </span>
                  <span className="text-sm" style={{ color: 'var(--sf-text-2)' }}>{f}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div className="mt-8">
              {/* TODO: Verify trial terms */}
              <Link
                href="/login"
                className="mkt-focus flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold text-[#080a0f] transition-opacity hover:opacity-90"
                style={{
                  background: 'linear-gradient(135deg, #f5f7fa 0%, #dde6f5 100%)',
                  boxShadow: '0 2px 16px rgba(255,255,255,0.08)',
                }}
              >
                14 gün ücretsiz başla
                <ArrowRightIcon />
              </Link>
              {/* TODO: Verify commercial policy */}
              <p className="mt-3 text-center text-xs" style={{ color: 'var(--sf-text-muted)' }}>
                Kredi kartı gerekmez · İstediğiniz zaman iptal edebilirsiniz
              </p>
            </div>
          </div>

          {/* Value prop aside */}
          <div
            className="flex flex-col justify-between rounded-3xl border p-8 lg:w-64"
            style={{
              background: 'var(--sf-bg-2)',
              borderColor: 'var(--sf-border)',
            }}
          >
            <div>
              <p
                className="mb-4 text-xs font-semibold uppercase tracking-[0.12em]"
                style={{ color: 'var(--sf-text-muted)' }}
              >
                Neden tek plan?
              </p>
              <div className="space-y-4 text-sm leading-relaxed" style={{ color: 'var(--sf-text-2)' }}>
                <p>Her ekip aynı tam seti kullanır. Özellik sürprizi yok.</p>
                <p>Kullanıcı sayınız arttıkça plan değiştirmenize gerek kalmaz.</p>
                <p>Onboarding ve destek tüm planlara dahildir.</p>
              </div>
            </div>
            <div
              className="mt-6 border-t pt-6"
              style={{ borderColor: 'var(--sf-border)' }}
            >
              <p className="text-xs" style={{ color: 'var(--sf-text-muted)' }}>
                Daha fazla kullanıcı veya kurumsal sözleşme için
              </p>
              {/* TODO: Add contact link */}
              <Link
                href="/login"
                className="mkt-focus mt-2 inline-flex items-center gap-1 text-sm font-medium"
                style={{ color: '#4f8cff' }}
              >
                İletişime geçin
                <ArrowRightIcon />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
      <path d="M2 6.5h9M7.5 3l3.5 3.5L7.5 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
