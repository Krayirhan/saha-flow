/**
 * TrustAndSecuritySection — Faz 3
 * LANDING_REDESIGN_PLAN.md §4.8
 * LANDING_CONTENT.md §9
 *
 * B2B güven. Yalnızca repository'de doğrulanmış özellikler.
 * Hukuki uyum iddiası yok — KVKK wording dikkatli.
 */

const SECURITY_ITEMS = [
  {
    title: 'Rol bazlı yetkilendirme',
    copy: 'ADMIN, MANAGER, DISPATCHER ve TECHNICIAN rolleriyle her kullanıcının erişim kapsamını belirleyin.',
    color: '#4f8cff',
    icon: () => (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <circle cx="10" cy="7" r="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M4 17c0-3.314 2.686-5 6-5s6 1.686 6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M13 11.5l1.5 1.5 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Tenant bazlı veri ayrımı',
    copy: 'Her firma verisi diğerlerinden tamamen izole edilir. Ortak şema üzerinde güçlü tenant bağlamı uygulanır.',
    color: '#7d6cff',
    icon: () => (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M10 2L3 6v4c0 4 3.2 7.4 7 8 3.8-.6 7-4 7-8V6l-7-4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'İşlem geçmişi',
    copy: 'İş emrindeki her durum değişikliği, atama ve güncelleme zaman damgasıyla kayıt altına alınır.',
    color: '#38d996',
    icon: () => (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10 6v4l2.5 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Güvenli dosya erişimi',
    copy: 'Saha fotoğrafları ve eklere yalnızca aynı tenant içindeki yetkili kullanıcılar erişebilir.',
    color: '#ffaa4c',
    icon: () => (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <rect x="5" y="9" width="10" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M7 9V7a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Veri dışa aktarma',
    copy: 'Müşteri ve iş emri verilerinizi CSV formatında her zaman dışa aktarabilirsiniz.',
    color: '#3dd6d0',
    icon: () => (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M10 3v10M7 10l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 15h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'İstek korelasyonu',
    copy: 'Her API isteği benzersiz correlationId ile izlenir. Hata takibi ve destek süreçleri hızlanır.',
    color: '#74b8ff',
    icon: () => (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M3 6h14M3 10h14M3 14h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

export function TrustAndSecuritySection() {
  return (
    <section
      id="security"
      className="mkt-section"
      style={{ background: 'var(--sf-bg)' }}
      aria-labelledby="security-heading"
    >
      <div className="mkt-container">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            id="security-heading"
            className="text-[clamp(28px,3.5vw,40px)] font-bold leading-tight tracking-tight"
            style={{ color: 'var(--sf-text)' }}
          >
            Operasyon büyürken kontrol sizde kalsın
          </h2>
          <p className="mt-4 text-base leading-relaxed" style={{ color: 'var(--sf-text-muted)' }}>
            Kullanıcı erişimlerini rol bazında yönetin, iş emri geçmişini izleyin ve saha kayıtlarını ilgili müşteri ve ekip bağlamında saklayın.
          </p>
          {/* Careful KVKK wording — not claiming full compliance */}
          <p className="mt-2 text-sm" style={{ color: 'var(--sf-text-muted)' }}>
            KVKK süreçlerini destekleyecek şekilde tasarlanmıştır.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SECURITY_ITEMS.map((item) => (
            <div
              key={item.title}
              className="rounded-[18px] border p-6 transition-all duration-200 hover:border-[rgba(255,255,255,0.10)]"
              style={{
                background: 'var(--sf-bg-2)',
                borderColor: 'var(--sf-border)',
              }}
            >
              <div
                className="mb-4 inline-flex items-center justify-center rounded-xl p-2.5"
                style={{
                  background: `${item.color}14`,
                  color: item.color,
                }}
              >
                <item.icon />
              </div>
              <h3
                className="mb-2 text-sm font-semibold"
                style={{ color: 'var(--sf-text)' }}
              >
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--sf-text-muted)' }}>
                {item.copy}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
