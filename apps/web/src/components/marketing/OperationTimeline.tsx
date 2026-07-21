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
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!shouldAnimate) {
      setCurrentIndex(TIMELINE_EVENTS.length - 1);
      return;
    }

    const advance = (idx: number) => {
      const isLast = idx === TIMELINE_EVENTS.length - 1;
      timerRef.current = window.setTimeout(() => {
        const next = isLast ? 0 : idx + 1;
        setCurrentIndex(next);
        advance(next);
      }, isLast ? 1800 : 750);
    };

    advance(0);
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, [shouldAnimate]);

  const isCompleted = currentIndex === TIMELINE_EVENTS.length - 1;

  return (
    <div
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
          state={isCompleted ? 'completed' : TIMELINE_EVENTS[currentIndex].state ?? 'open'}
        />
      </div>

      {/* Timeline steps */}
      <div className="space-y-0" role="list">
        {TIMELINE_EVENTS.map((event, i) => {
          const isCurrent = i === currentIndex;
          const isPast = i < currentIndex;

          return (
            <div
              key={i}
              role="listitem"
              style={{
                opacity: isCurrent || isPast || isCompleted ? 1 : 0.42,
                transform: 'translateY(0)',
                transition: shouldAnimate ? 'opacity 0.35s ease' : 'none',
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
                    style={{ color: 'rgba(255,255,255,0.35)' }}
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
                  {event.detail && (
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
