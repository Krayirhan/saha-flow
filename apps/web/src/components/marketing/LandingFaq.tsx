/**
 * LandingFaq — Faz 4
 * LANDING_REDESIGN_PLAN.md §4.11
 * LANDING_CONTENT.md §12
 *
 * 10 soru. Cevaplar LANDING_CONTENT.md §12'den.
 * TODO: Cevaplar yayın öncesi doğrulanmalı.
 */

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
    // TODO: Verify commercial policy
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
    // TODO: Define support channels and SLA
    a: 'Profesyonel planda e-posta desteği planlanmaktadır. Destek kanalları ve yanıt süreleri yakında açıklanacaktır.',
  },
];

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
      style={{
        transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
        transition: 'transform 0.25s ease',
        flexShrink: 0,
        color: 'var(--sf-text-muted)',
      }}
    >
      <path d="M4.5 6.75L9 11.25l4.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function LandingFaq() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section
      id="faq"
      className="mkt-section"
      style={{ background: 'var(--sf-bg-2)' }}
      aria-labelledby="faq-heading"
    >
      <div className="mkt-container">
        <div className="mx-auto max-w-2xl">
          <div className="text-center">
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

          <dl className="mt-10 space-y-2">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className="rounded-2xl border transition-colors"
                style={{
                  background: 'var(--sf-surface)',
                  borderColor: open === i ? 'rgba(79,140,255,0.2)' : 'var(--sf-border)',
                }}
              >
                <dt>
                  <button
                    type="button"
                    className="mkt-focus flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                    aria-expanded={open === i}
                    aria-controls={`faq-answer-${i}`}
                    onClick={() => setOpen(open === i ? null : i)}
                  >
                    <span className="text-sm font-semibold" style={{ color: 'var(--sf-text)' }}>
                      {faq.q}
                    </span>
                    <ChevronIcon open={open === i} />
                  </button>
                </dt>
                <dd
                  id={`faq-answer-${i}`}
                  role="region"
                  aria-labelledby={`faq-question-${i}`}
                  className="overflow-hidden"
                  style={{
                    maxHeight: open === i ? '200px' : '0',
                    transition: 'max-height 0.3s ease',
                  }}
                >
                  <p
                    className="px-6 pb-5 text-sm leading-relaxed"
                    style={{ color: 'var(--sf-text-muted)' }}
                  >
                    {faq.a}
                  </p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
