/**
 * OperationTimeline — Hero sağ panel
 *
 * #SF-1842 iş emrinin zaman damgalı operasyonel akışını gösterir.
 * LANDING_CONTENT.md §3 içeriğini kullanır.
 *
 * Animasyon 1 (Aceternity timeline davranışından uyarlandı):
 * - Adımlar sırayla IntersectionObserver ile reveal olur.
 * - prefers-reduced-motion: tüm adımlar anında görünür.
 * - Akış, gerçek bir iş emri hikayesini anlatır (#SF-1842).
 */

'use client';

import { useEffect, useRef, useState } from 'react';

import { WorkflowNode, StateChip } from './WorkflowNode';
import { FlowConnector } from './FlowLine';
import type { FlowState } from './FlowLine';

// ── Timeline data — LANDING_CONTENT.md §3 ────────────────────────────────────

interface TimelineEvent {
  time: string;
  label: string;
  detail?: string;
  state?: FlowState;
  isCurrent?: boolean;
}

const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    time: '09:12',
    label: 'Yeni müşteri talebi alındı',
    detail: 'ABC Plaza — Klima arızası',
    state: 'open',
  },
  {
    time: '09:13',
    label: 'İş emri #SF-1842 oluşturuldu',
    detail: 'Müşteri, cihaz ve öncelik belirlendi',
    state: 'open',
  },
  {
    time: '09:15',
    label: 'Teknisyen atandı',
    detail: 'Mehmet Kaya — müsait durumda',
    state: 'assigned',
  },
  {
    time: '09:42',
    label: 'Konuma ulaşıldı',
    detail: 'ABC Plaza, 3. kat',
    state: 'on-the-way',
  },
  {
    time: '10:18',
    label: 'Kontrol listesi tamamlandı',
    detail: '12/12 madde · 4 fotoğraf eklendi',
    state: 'in-progress',
    isCurrent: true,
  },
  {
    time: '10:24',
    label: 'Müşteri imzası alındı',
    state: 'completed',
  },
  {
    time: '10:25',
    label: 'Servis raporu oluşturuldu',
    state: 'completed',
  },
];

// ── useReducedMotion hook ─────────────────────────────────────────────────────

function useReducedMotion(): boolean {
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

// ── OperationTimeline ─────────────────────────────────────────────────────────

interface OperationTimelineProps {
  /** Auto-advance through steps. false = show all statically */
  animated?: boolean;
  className?: string;
}

export function OperationTimeline({ animated = true, className }: OperationTimelineProps) {
  const reducedMotion = useReducedMotion();
  const shouldAnimate = animated && !reducedMotion;

  // Reveal steps one-by-one with a small delay
  const [visibleCount, setVisibleCount] = useState(shouldAnimate ? 0 : TIMELINE_EVENTS.length);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasStarted = useRef(false);

  useEffect(() => {
    if (!shouldAnimate || hasStarted.current) return;

    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted.current) {
          hasStarted.current = true;

          // Reveal each step with staggered delay
          TIMELINE_EVENTS.forEach((_, i) => {
            const delay = i === 0 ? 200 : 200 + i * 420;
            setTimeout(() => {
              setVisibleCount((prev) => Math.min(prev + 1, TIMELINE_EVENTS.length));
            }, delay);
          });
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [shouldAnimate]);

  // If not animated, show all immediately
  useEffect(() => {
    if (!shouldAnimate) {
      setVisibleCount(TIMELINE_EVENTS.length);
    }
  }, [shouldAnimate]);

  // Determine which state each step is in relative to visibleCount
  const currentVisibleIndex = visibleCount - 1;

  return (
    <div
      ref={containerRef}
      className={className}
      aria-label="İş emri #SF-1842 operasyon akışı"
      role="list"
    >
      {/* Work order header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="font-mono text-xs font-bold tracking-widest" style={{ color: '#4f8cff' }}>
            #SF-1842
          </p>
          <p className="mt-0.5 text-sm font-semibold text-white/90">Klima Arızası — ABC Plaza</p>
        </div>
        <StateChip
          state={
            visibleCount >= TIMELINE_EVENTS.length
              ? 'completed'
              : visibleCount >= 5
                ? 'in-progress'
                : visibleCount >= 3
                  ? 'on-the-way'
                  : visibleCount >= 2
                    ? 'assigned'
                    : 'open'
          }
        />
      </div>

      {/* Timeline steps */}
      <div className="space-y-0" role="list">
        {TIMELINE_EVENTS.map((event, i) => {
          const isVisible = i < visibleCount;
          const isCurrent = i === currentVisibleIndex && visibleCount < TIMELINE_EVENTS.length;
          const isPast = i < currentVisibleIndex;
          const isCompleted = visibleCount >= TIMELINE_EVENTS.length;

          return (
            <div
              key={i}
              role="listitem"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(6px)',
                transition: shouldAnimate ? 'opacity 0.35s ease, transform 0.35s ease' : 'none',
              }}
            >
              <div className="flex gap-3">
                {/* Left: connector + node */}
                <div className="flex flex-col items-center">
                  <WorkflowNode
                    state={event.state ?? 'open'}
                    active={isPast || isCompleted}
                    current={isCurrent}
                    layout="vertical"
                  />
                  {i < TIMELINE_EVENTS.length - 1 && (
                    <FlowConnector active={isPast || isCompleted} />
                  )}
                </div>

                {/* Right: content */}
                <div className="pb-1 pt-1" style={{ minHeight: '40px' }}>
                  {/* Timestamp */}
                  <p
                    className="mb-0.5 font-mono text-[10px] font-semibold tracking-wider"
                    style={{ color: isVisible ? 'rgba(255,255,255,0.35)' : 'transparent' }}
                  >
                    {event.time}
                  </p>
                  {/* Label */}
                  <p
                    className="text-sm font-semibold leading-tight"
                    style={{
                      color:
                        isCompleted || isPast
                          ? 'rgba(255,255,255,0.75)'
                          : isCurrent
                            ? '#f5f7fa'
                            : 'rgba(255,255,255,0.4)',
                    }}
                  >
                    {event.label}
                  </p>
                  {/* Detail */}
                  {event.detail && isVisible && (
                    <p className="mt-0.5 text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.3)' }}>
                      {event.detail}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
