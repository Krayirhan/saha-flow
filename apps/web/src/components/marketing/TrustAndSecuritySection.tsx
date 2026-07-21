/**
 * TrustAndSecuritySection — Faz 3
 * Marquee ticker — sonsuz yatay akan özellik şeridi.
 */

const TICKER_ITEMS = [
  { label: 'Çevrimdışı çalışmaya devam edin', color: '#4f8cff' },
  { label: 'Web ve mobil aynı iş emrinde', color: '#7d6cff' },
  { label: 'Rol bazlı erişim kontrolü', color: '#38d996' },
  { label: 'İşlem geçmişini izleyin', color: '#ffaa4c' },
  { label: 'Verilerinizi dışa aktarın', color: '#3dd6d0' },
  { label: 'Saha kanıtlarını tek kayıtta tutun', color: '#74b8ff' },
];

function Dot({ color }: { color: string }) {
  return (
    <span
      aria-hidden="true"
      className="inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full"
      style={{ background: color }}
    />
  );
}

export function TrustAndSecuritySection() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS]; // seamless loop için 2x

  return (
    <section
      id="security"
      className="mkt-section"
      style={{ background: 'var(--sf-bg)' }}
      aria-label="Özellikler"
    >
      <div className="mx-auto max-w-2xl px-6 text-center">
        <span
          className="text-xs font-semibold uppercase tracking-[0.18em]"
          style={{ color: '#4f8cff' }}
        >
          Platform
        </span>
        <h2
          className="mt-3 text-[clamp(28px,3.5vw,40px)] font-bold leading-tight tracking-tight"
          style={{ color: 'var(--sf-text)' }}
        >
          Saha operasyonunun ihtiyacı olan her şey
        </h2>
        <p className="mt-4 text-base leading-relaxed" style={{ color: 'var(--sf-text-muted)' }}>
          Kullanıcı erişimlerini rol bazında yönetin, iş emri geçmişini izleyin ve saha kayıtlarını ilgili müşteri ve ekip bağlamında saklayın.
        </p>
      </div>

      {/* Marquee ticker */}
      <div className="relative mt-14 overflow-hidden" aria-hidden="true">
        {/* Sol/sağ edge fade */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24"
          style={{ background: 'linear-gradient(to right, var(--sf-bg), transparent)' }}
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24"
          style={{ background: 'linear-gradient(to left, var(--sf-bg), transparent)' }}
        />

        <div className="ticker-track flex gap-6 w-max">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex flex-shrink-0 items-center gap-3 rounded-full border px-5 py-2.5"
              style={{
                background: 'var(--sf-bg-2)',
                borderColor: 'var(--sf-border)',
              }}
            >
              <Dot color={item.color} />
              <span
                className="whitespace-nowrap text-sm font-medium"
                style={{ color: 'var(--sf-text-2)' }}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
