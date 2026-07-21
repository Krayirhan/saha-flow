'use client';

import { useState } from 'react';

const FAQS = [
  {
    q: 'Kurulum ne kadar sürüyor?',
    a: 'Firmanız, kullanıcılarınız ve temel iş akışınız hazır olduğunda ilk iş emrini kısa sürede oluşturabilirsiniz. Kurulum desteğinin kapsamı paket koşullarına göre netleştirilecektir.',
  },
  {
    q: 'Mevcut müşteri verilerimi aktarabilir miyim?',
    a: 'Müşteri verilerinin CSV üzerinden aktarılması planlanmaktadır. Desteklenen alanlar ve aktarım yöntemi yakında açıklanacaktır.',
  },
  {
    q: 'Mobil uygulama internetsiz çalışıyor mu?',
    a: 'Mobil uygulama çevrimdışı işlemleri kuyruklayacak şekilde tasarlanmıştır. Desteklenen çevrimdışı işlemler ürün sürümüne göre açıkça belirtilecektir.',
  },
  {
    q: 'Teknisyenler birbirlerinin işlerini görebilir mi?',
    a: 'Görünürlük rol ve yetki kurallarına göre sınırlandırılabilir. Her rol yalnızca kendine atanan iş emirlerini görecek şekilde yapılandırılabilir.',
  },
  {
    q: 'Servis raporuna fotoğraf ve imza eklenebilir mi?',
    a: 'Saha kayıtlarının fotoğraf ve müşteri imzasıyla ilişkilendirilmesi ürün kapsamındadır. PDF çıktısındaki destek durumu ürün sürümüyle birlikte açıklanacaktır.',
  },
  {
    q: 'Verilerim nerede saklanıyor?',
    a: 'Barındırma ve veri lokasyonu bilgisi üretim altyapı kararına bağlı olarak paylaşılacaktır.',
  },
  {
    q: 'Ücretsiz deneme için kredi kartı gerekiyor mu?',
    a: 'Deneme koşulları yakında netleştirilecektir. Güncel bilgiler için iletişime geçebilirsiniz.',
  },
  {
    q: 'Kullanıcı sayımı sonradan artırabilir miyim?',
    a: 'Kullanıcı sayısının yönetim panelinden veya destek üzerinden artırılması planlanmaktadır.',
  },
  {
    q: 'Telefon ve tabletlerde çalışıyor mu?',
    a: 'Mobil uygulama Flutter ile Android ve iOS hedeflenerek geliştirilmektedir. Desteklenen minimum işletim sistemi sürümleri ürün sürümüyle birlikte belirtilecektir.',
  },
  {
    q: 'Destek pakete dahil mi?',
    a: 'Profesyonel planda e-posta desteği planlanmaktadır. Destek kanalları ve yanıt süreleri yakında açıklanacaktır.',
  },
];

export function LandingFaq() {
  const [active, setActive] = useState(0);

  return (
    <section
      id="faq"
      className="mkt-section"
      style={{ background: 'var(--sf-bg-2)' }}
      aria-labelledby="faq-heading"
    >
      <div className="mkt-container">
        {/* Header */}
        <div className="mb-12 flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span
              className="text-xs font-semibold uppercase tracking-[0.18em]"
              style={{ color: '#4f8cff' }}
            >
              SSS
            </span>
            <h2
              id="faq-heading"
              className="mt-3 text-[clamp(28px,3.5vw,40px)] font-bold leading-tight tracking-tight"
              style={{ color: 'var(--sf-text)' }}
            >
              Sıkça sorulanlar
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed lg:text-right" style={{ color: 'var(--sf-text-muted)' }}>
            Başka sorunuz varsa iletişime geçin, yanıtlayalım.
          </p>
        </div>

        {/* Desktop: 2-col */}
        <div className="hidden lg:grid lg:grid-cols-[1fr,1fr] lg:gap-8">
          {/* Left — soru listesi */}
          <div
            className="overflow-hidden rounded-2xl border"
            style={{ background: 'var(--sf-surface)', borderColor: 'var(--sf-border)' }}
          >
            {FAQS.map((faq, i) => {
              const isActive = i === active;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActive(i)}
                  className="flex w-full items-start gap-4 border-b px-6 py-4 text-left transition-colors duration-150"
                  style={{
                    borderColor: 'var(--sf-border)',
                    background: isActive ? 'rgba(79,140,255,0.06)' : 'transparent',
                    borderBottom: i === FAQS.length - 1 ? 'none' : undefined,
                  }}
                  aria-pressed={isActive}
                >
                  <span
                    className="mt-0.5 font-mono text-[11px] font-bold tabular-nums"
                    style={{ color: isActive ? '#4f8cff' : 'var(--sf-text-muted)' }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span
                    className="text-sm leading-snug"
                    style={{
                      color: isActive ? 'var(--sf-text)' : 'var(--sf-text-2)',
                      fontWeight: isActive ? 600 : 400,
                    }}
                  >
                    {faq.q}
                  </span>
                  {isActive && (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      className="ml-auto mt-0.5 flex-shrink-0"
                      aria-hidden="true"
                    >
                      <path d="M2 7h10M8 3l4 4-4 4" stroke="#4f8cff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right — cevap paneli */}
          <div className="sticky top-28 self-start">
            <div
              key={active}
              className="faq-panel-enter overflow-hidden rounded-2xl border p-8"
              style={{
                background: 'var(--sf-surface)',
                borderColor: 'rgba(79,140,255,0.2)',
                minHeight: '220px',
              }}
            >
              <span
                className="font-mono text-[11px] font-bold"
                style={{ color: '#4f8cff' }}
              >
                {String(active + 1).padStart(2, '0')} / {FAQS.length}
              </span>
              <h3
                className="mt-4 text-xl font-bold leading-snug tracking-tight"
                style={{ color: 'var(--sf-text)' }}
              >
                {FAQS[active].q}
              </h3>
              <p
                className="mt-5 text-base leading-relaxed"
                style={{ color: 'var(--sf-text-muted)' }}
              >
                {FAQS[active].a}
              </p>
            </div>
          </div>
        </div>

        {/* Mobile: accordion */}
        <dl className="space-y-2 lg:hidden">
          {FAQS.map((faq, i) => {
            const isOpen = i === active;
            return (
              <div
                key={i}
                className="overflow-hidden rounded-2xl border transition-colors"
                style={{
                  background: 'var(--sf-surface)',
                  borderColor: isOpen ? 'rgba(79,140,255,0.2)' : 'var(--sf-border)',
                }}
              >
                <dt>
                  <button
                    type="button"
                    className="flex w-full items-center gap-4 px-5 py-4 text-left"
                    aria-expanded={isOpen}
                    onClick={() => setActive(isOpen ? -1 : i)}
                  >
                    <span
                      className="font-mono text-[11px] font-bold"
                      style={{ color: isOpen ? '#4f8cff' : 'var(--sf-text-muted)' }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span
                      className="flex-1 text-sm font-medium leading-snug"
                      style={{ color: 'var(--sf-text)' }}
                    >
                      {faq.q}
                    </span>
                    <span
                      className="flex-shrink-0 text-lg leading-none transition-transform duration-200"
                      style={{
                        color: 'var(--sf-text-muted)',
                        transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                      }}
                    >
                      +
                    </span>
                  </button>
                </dt>
                <dd
                  style={{
                    maxHeight: isOpen ? '500px' : '0',
                    overflow: 'hidden',
                    transition: 'max-height 0.3s ease',
                  }}
                >
                  <p className="px-5 pb-5 pt-1 text-sm leading-relaxed" style={{ color: 'var(--sf-text-muted)' }}>
                    {faq.a}
                  </p>
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}
