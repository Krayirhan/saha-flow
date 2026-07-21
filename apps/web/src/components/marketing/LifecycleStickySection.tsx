/**
 * LifecycleStickySection — Faz 2
 *
 * Desktop: sticky product panel sol, scroll adımları sağ.
 * Scroll pozisyonu bazlı aktif adım hesaplama (IntersectionObserver yerine).
 * Her adım py-14 → section ~1900px → scroll alanı ~1100px → adım başı ~220px.
 *
 * Mobile: dikey adım kartları, her adımın altında panel.
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

import { FlowConnector } from './FlowLine';
import { WorkflowNode } from './WorkflowNode';
import type { FlowState } from './FlowLine';

const STEPS = [
  {
    number: '01',
    state: 'open' as FlowState,
    title: 'Talebi iş emrine dönüştürün',
    copy: 'Telefon, e-posta veya WhatsApp üzerinden gelen servis talebini müşteri, cihaz, öncelik ve planlanan tarih bilgileriyle standart bir iş emrine dönüştürün.',
    panel: <StepPanel01 />,
  },
  {
    number: '02',
    state: 'assigned' as FlowState,
    title: 'Doğru teknisyeni atayın',
    copy: 'Teknisyenlerin mevcut işlerini ve günlük planını görerek iş emrini uygun ekip üyesine atayın.',
    panel: <StepPanel02 />,
  },
  {
    number: '03',
    state: 'in-progress' as FlowState,
    title: 'Sahadaki ilerlemeyi görün',
    copy: 'İş emrinin atandı, yolda, işlemde veya tamamlandı durumlarını tek ekrandan takip edin.',
    panel: <StepPanel03 />,
  },
  {
    number: '04',
    state: 'in-progress' as FlowState,
    title: 'Saha kanıtlarını tek kayıtta toplayın',
    copy: 'Fotoğrafları, kontrol listesi sonuçlarını, kullanılan malzemeleri ve müşteri notlarını iş emri altında saklayın.',
    panel: <StepPanel04 />,
  },
  {
    number: '05',
    state: 'completed' as FlowState,
    title: 'İmzalı servis raporunu oluşturun',
    copy: 'İş tamamlandığında saha bilgilerini, fotoğrafları ve müşteri imzasını servis raporunda bir araya getirin.',
    panel: <StepPanel05 />,
  },
];

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return reduced;
}

export function LifecycleStickySection() {
  const [activeStep, setActiveStep] = useState(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => {
      // Viewport'ta hangi step içeriği en yakın? → onu aktif yap
      const focal = window.innerHeight * 0.42; // viewport'un üst yarısına yakın nokta
      let best = 0;
      let bestDist = Infinity;
      stepRefs.current.forEach((el, i) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const dist = Math.abs(rect.top - focal);
        if (dist < bestDist) { bestDist = dist; best = i; }
      });
      setActiveStep(best);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    const raf = requestAnimationFrame(onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const currentStep = STEPS[activeStep];

  return (
    <section
      id="how-it-works"
      className="mkt-section"
      aria-labelledby="lifecycle-heading"
    >
      <div className="mkt-container">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <span
            className="text-xs font-semibold uppercase tracking-[0.18em]"
            style={{ color: 'var(--sf-open)' }}
          >
            Nasıl çalışır?
          </span>
          <h2
            id="lifecycle-heading"
            className="mt-3 text-[clamp(28px,3.5vw,40px)] font-bold leading-tight tracking-tight"
            style={{ color: 'var(--sf-text)' }}
          >
            Bir iş emrinin tüm yaşam döngüsü
          </h2>
          <p className="mt-4 text-base leading-relaxed" style={{ color: 'var(--sf-text-muted)' }}>
            Ofiste açılan iş emrinin sahada tamamlanmasına kadar her adım aynı sistemde ilerler.
          </p>
        </div>

        {/* Desktop sticky layout */}
        <div className="mt-16 hidden lg:grid lg:grid-cols-2 lg:gap-16">
          {/* Left: sticky panel */}
          <div className="relative">
            <div className="sticky top-28">
              <div
                className="overflow-hidden rounded-2xl border"
                style={{
                  background: 'var(--sf-bg-2)',
                  borderColor: 'var(--sf-border)',
                  boxShadow: '0 4px 32px rgba(0,0,0,0.5)',
                  minHeight: '340px',
                }}
              >
                {/* Panel header */}
                <div
                  className="border-b px-5 py-3.5"
                  style={{ borderColor: 'var(--sf-border)' }}
                >
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full" style={{ background: '#38d996' }} aria-hidden="true" />
                    <span className="font-mono text-[10px] font-semibold tracking-widest" style={{ color: '#4f8cff' }}>
                      #SF-1842
                    </span>
                    <span className="text-xs" style={{ color: 'var(--sf-text-muted)' }}>
                      — Klima Arızası — ABC Plaza
                    </span>
                  </div>
                </div>
                {/* key triggers re-mount → CSS animation fires on step change */}
                <div key={activeStep} className="lc-panel-enter p-6">
                  {currentStep.panel}
                </div>
              </div>

              {/* Step indicator dots */}
              <div className="mt-5 flex items-center justify-center gap-2" aria-hidden="true">
                {STEPS.map((_, i) => (
                  <div
                    key={i}
                    className="rounded-full transition-all duration-300"
                    style={{
                      width:  i === activeStep ? '20px' : '6px',
                      height: '6px',
                      background: i === activeStep ? '#4f8cff' : 'rgba(255,255,255,0.15)',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right: scrollable steps */}
          <div className="space-y-0">
            {STEPS.map((step, i) => (
              <div
                key={step.number}
                ref={(el) => { stepRefs.current[i] = el; }}
              >
                <div
                  role="button"
                  tabIndex={0}
                  aria-current={i === activeStep ? 'step' : undefined}
                  onClick={() => {
                    stepRefs.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      stepRefs.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                  }}
                  className="flex gap-5 py-24 transition-opacity duration-300"
                  style={{
                    opacity: reducedMotion ? 1 : i === activeStep ? 1 : 0.35,
                    cursor: 'pointer',
                  }}
                >
                  {/* Flow node + connector */}
                  <div className="flex flex-col items-center">
                    <WorkflowNode
                      state={step.state}
                      active={i < activeStep}
                      current={i === activeStep}
                      layout="vertical"
                    />
                    {i < STEPS.length - 1 && (
                      <FlowConnector active={i < activeStep} className="flex-1" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="pb-4 pt-0.5">
                    <span
                      className="font-mono text-xs font-bold tracking-widest transition-colors duration-300"
                      style={{ color: i === activeStep ? '#4f8cff' : 'var(--sf-text-muted)' }}
                    >
                      {step.number}
                    </span>
                    <h3
                      className="mt-1 text-lg font-semibold leading-tight"
                      style={{
                        color: i === activeStep ? 'var(--sf-text)' : 'var(--sf-text-muted)',
                        transition: reducedMotion ? 'none' : 'color 0.3s ease',
                      }}
                    >
                      {step.title}
                    </h3>
                    <p
                      className="mt-2 text-sm leading-relaxed"
                      style={{ color: 'var(--sf-text-muted)' }}
                    >
                      {step.copy}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* CTA */}
            <div className="pb-4 pt-2">
              <Link
                href="/login"
                className="mkt-focus inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-[#080a0f] transition-opacity hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #dde6f5 100%)' }}
              >
                14 gün ücretsiz dene
                <ArrowRightIcon />
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile: stacked cards */}
        <div className="mt-10 space-y-6 lg:hidden">
          {STEPS.map((step, i) => (
            <div key={step.number} className="flex gap-4">
              <div className="flex flex-col items-center">
                <WorkflowNode state={step.state} active current={false} layout="vertical" />
                {i < STEPS.length - 1 && <FlowConnector active className="flex-1" />}
              </div>
              <div className="pb-4 pt-0.5 flex-1 min-w-0">
                <span
                  className="font-mono text-xs font-bold tracking-widest"
                  style={{ color: '#4f8cff' }}
                >
                  {step.number}
                </span>
                <h3
                  className="mt-1 text-base font-semibold leading-tight"
                  style={{ color: 'var(--sf-text)' }}
                >
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--sf-text-muted)' }}>
                  {step.copy}
                </p>
                <div
                  className="mt-4 overflow-hidden rounded-xl border"
                  style={{ background: 'var(--sf-bg-2)', borderColor: 'var(--sf-border)' }}
                >
                  <div className="p-4">{step.panel}</div>
                </div>
              </div>
            </div>
          ))}
          <Link
            href="/login"
            className="mkt-focus mt-4 flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold text-[#080a0f]"
            style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #dde6f5 100%)' }}
          >
            14 gün ücretsiz dene
            <ArrowRightIcon />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ── Step panels ───────────────────────────────────────────────────────────────

function PanelRow({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-xs" style={{ color: 'var(--sf-text-muted)' }}>{label}</span>
      <span
        className="text-xs font-medium"
        style={{ color: accent ? '#4f8cff' : 'var(--sf-text-2)' }}
      >
        {value}
      </span>
    </div>
  );
}

function StepPanel01() {
  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--sf-text-muted)' }}>
        Yeni İş Emri
      </p>
      <div className="space-y-0 divide-y" style={{ borderColor: 'var(--sf-border)' }}>
        <PanelRow label="Müşteri" value="ABC Plaza — İ. Yılmaz" />
        <PanelRow label="Konu" value="Klima Arızası" />
        <PanelRow label="Öncelik" value="Yüksek" accent />
        <PanelRow label="Planlanan" value="Bugün 10:00" />
        <PanelRow label="Durum" value="Açık" accent />
      </div>
    </div>
  );
}

function StepPanel02() {
  const techs = [
    { name: 'Mehmet Kaya', status: 'Müsait', active: true },
    { name: 'Ali Demir', status: '2 aktif iş', active: false },
    { name: 'Can Şahin', status: 'İzinde', active: false },
  ];
  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--sf-text-muted)' }}>
        Teknisyen Seç
      </p>
      <div className="space-y-2">
        {techs.map((t) => (
          <div
            key={t.name}
            className="flex items-center justify-between rounded-lg px-3 py-2.5"
            style={{
              background: t.active ? 'rgba(79,140,255,0.1)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${t.active ? 'rgba(79,140,255,0.3)' : 'rgba(255,255,255,0.06)'}`,
            }}
          >
            <span className="text-xs font-medium" style={{ color: t.active ? '#f5f7fa' : 'var(--sf-text-muted)' }}>
              {t.name}
            </span>
            <span className="text-[10px]" style={{ color: t.active ? '#38d996' : 'var(--sf-text-muted)' }}>
              {t.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusChip({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="rounded-full px-2.5 py-1 text-[10px] font-semibold"
      style={{ background: `${color}20`, color }}
    >
      {label}
    </span>
  );
}

function StepPanel03() {
  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--sf-text-muted)' }}>
        Canlı Durum
      </p>
      <div className="space-y-2.5">
        {[
          { label: 'İş emri atandı', time: '09:15', color: '#7d6cff', done: true },
          { label: 'Yola çıktı', time: '09:38', color: '#74b8ff', done: true },
          { label: 'Konuma ulaştı', time: '09:42', color: '#74b8ff', done: true },
          { label: 'Çalışma başladı', time: '09:50', color: '#ffaa4c', done: false },
        ].map((row) => (
          <div key={row.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full" style={{ background: row.color }} aria-hidden="true" />
              <span className="text-xs" style={{ color: row.done ? 'var(--sf-text-2)' : 'var(--sf-text)' }}>
                {row.label}
              </span>
            </div>
            <span className="font-mono text-[10px]" style={{ color: 'var(--sf-text-muted)' }}>
              {row.time}
            </span>
          </div>
        ))}
        <div className="pt-1">
          <StatusChip label="Devam Ediyor" color="#ffaa4c" />
        </div>
      </div>
    </div>
  );
}

function StepPanel04() {
  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--sf-text-muted)' }}>
        Saha Kanıtları
      </p>
      <div className="space-y-2">
        <div className="flex items-center justify-between rounded-lg px-3 py-2" style={{ background: 'rgba(56,217,150,0.08)', border: '1px solid rgba(56,217,150,0.2)' }}>
          <span className="text-xs" style={{ color: 'var(--sf-text-2)' }}>Kontrol listesi</span>
          <span className="text-xs font-semibold" style={{ color: '#38d996' }}>12 / 12 ✓</span>
        </div>
        <div className="flex items-center justify-between rounded-lg px-3 py-2" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <span className="text-xs" style={{ color: 'var(--sf-text-2)' }}>Fotoğraflar</span>
          <span className="text-xs font-semibold" style={{ color: 'var(--sf-text-2)' }}>4 adet</span>
        </div>
        <div className="flex items-center justify-between rounded-lg px-3 py-2" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <span className="text-xs" style={{ color: 'var(--sf-text-2)' }}>Müşteri notu</span>
          <span className="text-xs font-semibold" style={{ color: '#38d996' }}>Eklendi</span>
        </div>
      </div>
    </div>
  );
}

function StepPanel05() {
  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--sf-text-muted)' }}>
        Servis Raporu
      </p>
      <div
        className="rounded-lg border px-4 py-4"
        style={{ background: 'rgba(56,217,150,0.06)', borderColor: 'rgba(56,217,150,0.2)' }}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="font-mono text-[10px] font-bold tracking-widest" style={{ color: '#4f8cff' }}>#SF-1842</p>
            <p className="mt-0.5 text-xs font-semibold" style={{ color: 'var(--sf-text)' }}>Klima Arızası</p>
            <p className="text-[10px]" style={{ color: 'var(--sf-text-muted)' }}>ABC Plaza — 10:25</p>
          </div>
          <span className="rounded-full px-2.5 py-1 text-[10px] font-semibold" style={{ background: 'rgba(56,217,150,0.15)', color: '#38d996' }}>
            Tamamlandı
          </span>
        </div>
        <div className="mt-3 space-y-1 border-t pt-3" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          {['Müşteri imzası alındı', '4 fotoğraf eklendi', 'Kontrol listesi tamamlandı'].map((item) => (
            <div key={item} className="flex items-center gap-1.5">
              <div className="h-1 w-1 rounded-full" style={{ background: '#38d996' }} aria-hidden="true" />
              <span className="text-[10px]" style={{ color: 'var(--sf-text-muted)' }}>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
