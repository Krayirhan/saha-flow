/**
 * WebMobileSyncShowcase — Faz 3
 * LANDING_REDESIGN_PLAN.md §4.6
 * LANDING_CONTENT.md §7
 *
 * Ofis (web panel) ve saha (mobil uygulama) aynı iş emrinde buluşur.
 * Gerçek ürün state'leri — #SF-1842 hikayesi devam eder.
 */

function SyncArrow() {
  return (
    <div
      className="flex items-center justify-center py-4 lg:py-0"
      aria-hidden="true"
    >
      {/* Vertical on mobile, horizontal on desktop */}
      <div className="flex flex-col items-center gap-1 lg:flex-row lg:gap-2">
        <div className="h-8 w-px bg-gradient-to-b from-transparent via-[rgba(79,140,255,0.4)] to-transparent lg:h-px lg:w-16 lg:bg-gradient-to-r" />
        <div
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border text-[10px] font-bold"
          style={{
            background: 'rgba(79,140,255,0.1)',
            borderColor: 'rgba(79,140,255,0.3)',
            color: '#4f8cff',
          }}
        >
          ⟷
        </div>
        <div className="h-8 w-px bg-gradient-to-b from-transparent via-[rgba(79,140,255,0.4)] to-transparent lg:h-px lg:w-16 lg:bg-gradient-to-r" />
      </div>
    </div>
  );
}

function WebPanelMock() {
  return (
    <div
      className="overflow-hidden rounded-2xl border"
      style={{
        background: 'var(--sf-bg-2)',
        borderColor: 'var(--sf-border)',
        boxShadow: '0 4px 32px rgba(0,0,0,0.5)',
      }}
    >
      {/* Window bar */}
      <div
        className="flex items-center justify-between border-b px-4 py-3"
        style={{ borderColor: 'var(--sf-border)' }}
      >
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <div className="h-2.5 w-2.5 rounded-full" style={{ background: '#ff5f6d' }} />
          <div className="h-2.5 w-2.5 rounded-full" style={{ background: '#ffaa4c' }} />
          <div className="h-2.5 w-2.5 rounded-full" style={{ background: '#38d996' }} />
        </div>
        <p className="text-[10px] font-medium" style={{ color: 'var(--sf-text-muted)' }}>
          İşAkış — Operasyon Paneli
        </p>
        <div className="w-12" />
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <h4 className="text-sm font-semibold" style={{ color: 'var(--sf-text)' }}>
            İş Emri #SF-1842
          </h4>
          <span
            className="rounded-full px-2.5 py-1 text-[10px] font-semibold"
            style={{ background: 'rgba(255,170,76,0.15)', color: '#ffaa4c' }}
          >
            Devam Ediyor
          </span>
        </div>

        <div className="space-y-2.5 text-xs">
          {[
            { label: 'Müşteri', value: 'ABC Plaza — İ. Yılmaz' },
            { label: 'Teknisyen', value: 'Mehmet Kaya' },
            { label: 'Konu', value: 'Klima Arızası' },
            { label: 'Konum', value: '3. Kat, Teknik Oda' },
          ].map((row) => (
            <div key={row.label} className="flex items-center justify-between">
              <span style={{ color: 'var(--sf-text-muted)' }}>{row.label}</span>
              <span style={{ color: 'var(--sf-text-2)' }}>{row.value}</span>
            </div>
          ))}
        </div>

        <div
          className="mt-4 space-y-1.5 border-t pt-4"
          style={{ borderColor: 'var(--sf-border)' }}
        >
          <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--sf-text-muted)' }}>
            İşlem Geçmişi
          </p>
          {[
            { text: 'İş emri oluşturuldu', time: '09:13' },
            { text: 'Mehmet Kaya atandı', time: '09:15' },
            { text: 'Teknisyen yola çıktı', time: '09:38' },
            { text: 'Çalışma başladı', time: '09:50' },
          ].map((entry) => (
            <div key={entry.time} className="flex items-center justify-between py-0.5">
              <span className="text-[10px]" style={{ color: 'var(--sf-text-muted)' }}>{entry.text}</span>
              <span className="font-mono text-[9px]" style={{ color: 'var(--sf-text-muted)' }}>{entry.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MobileMock() {
  return (
    <div
      className="mx-auto max-w-[240px] overflow-hidden rounded-[28px] border-[6px]"
      style={{
        background: 'var(--sf-bg-2)',
        borderColor: 'rgba(255,255,255,0.12)',
        boxShadow: '0 8px 48px rgba(0,0,0,0.7)',
      }}
    >
      {/* Notch */}
      <div className="flex items-center justify-center pt-2 pb-1" aria-hidden="true">
        <div className="h-1 w-12 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }} />
      </div>

      {/* Status bar */}
      <div className="px-4 pb-2 pt-1">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-medium" style={{ color: 'var(--sf-text-muted)' }}>10:18</span>
          <div className="flex items-center gap-1" aria-hidden="true">
            <div className="h-1.5 w-3 rounded-sm" style={{ background: '#38d996' }} />
            <div className="h-1.5 w-1" style={{ background: 'var(--sf-text-muted)' }} />
          </div>
        </div>
      </div>

      {/* App header */}
      <div
        className="border-b px-4 pb-3"
        style={{ borderColor: 'var(--sf-border)' }}
      >
        <p className="font-mono text-[9px] font-bold tracking-widest" style={{ color: '#4f8cff' }}>#SF-1842</p>
        <p className="text-xs font-semibold" style={{ color: 'var(--sf-text)' }}>Klima Arızası</p>
        <p className="text-[9px]" style={{ color: 'var(--sf-text-muted)' }}>ABC Plaza</p>
      </div>

      {/* Actions */}
      <div className="space-y-2 p-4">
        {[
          { label: 'Fotoğraf Ekle', done: true, color: '#38d996' },
          { label: 'Kontrol Listesi', done: true, color: '#38d996' },
          { label: 'Müşteri İmzası', done: false, color: '#4f8cff' },
          { label: 'İşi Tamamla', done: false, color: '#4f8cff' },
        ].map((action) => (
          <div
            key={action.label}
            className="flex items-center justify-between rounded-lg px-3 py-2.5"
            style={{
              background: action.done ? 'rgba(56,217,150,0.08)' : 'rgba(79,140,255,0.08)',
              border: `1px solid ${action.done ? 'rgba(56,217,150,0.2)' : 'rgba(79,140,255,0.2)'}`,
            }}
          >
            <span className="text-[10px] font-medium" style={{ color: action.color }}>{action.label}</span>
            {action.done && (
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                <path d="M2 5l2.5 2.5L8 3" stroke="#38d996" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function WebMobileSyncShowcase() {
  return (
    <section
      id="mobile"
      className="mkt-section"
      aria-labelledby="sync-heading"
    >
      <div className="mkt-container">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2
            id="sync-heading"
            className="text-[clamp(28px,3.5vw,40px)] font-bold leading-tight tracking-tight"
            style={{ color: 'var(--sf-text)' }}
          >
            Ofis ve saha aynı iş emrinde buluşur
          </h2>
          <p className="mt-4 text-base leading-relaxed" style={{ color: 'var(--sf-text-muted)' }}>
            Ofiste yapılan atama teknisyenin telefonunda görünür. Sahada güncellenen durum, fotoğraf ve notlar operasyon ekibine geri döner.
          </p>
        </div>

        {/* Showcase */}
        <div className="mt-14 flex flex-col items-center gap-6 lg:flex-row lg:items-center lg:justify-center lg:gap-0">
          {/* Web panel */}
          <div className="w-full max-w-lg lg:flex-1">
            <p className="mb-3 text-center text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--sf-text-muted)' }}>
              Operasyon paneli
            </p>
            <WebPanelMock />
          </div>

          <SyncArrow />

          {/* Mobile */}
          <div className="w-full max-w-[280px] lg:flex-shrink-0">
            <p className="mb-3 text-center text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--sf-text-muted)' }}>
              Teknisyen uygulaması
            </p>
            <MobileMock />
          </div>
        </div>

        {/* Caption */}
        <p className="mt-8 text-center text-sm" style={{ color: 'var(--sf-text-muted)' }}>
          Ofiste oluşturulan iş emri sahada tamamlanır — ikisi de aynı kayıttan çalışır.
        </p>
      </div>
    </section>
  );
}
