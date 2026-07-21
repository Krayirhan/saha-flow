'use client';

import { type ReactNode } from 'react';
import { CardSpotlight } from '@/components/ui/CardSpotlight';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  accentColor?: string;
  gradientClass?: string;
  trend?: { value: number; label: string };
}

const spotlightColors: Record<string, string> = {
  '#0052cc': 'rgba(0,82,204,0.06)',
  '#ff8b00': 'rgba(255,139,0,0.08)',
  '#00875a': 'rgba(0,135,90,0.08)',
  '#5243aa': 'rgba(82,67,170,0.08)',
};

export function StatsCard({
  title,
  value,
  subtitle,
  icon,
  accentColor = '#0052cc',
  gradientClass = 'sf-gradient-card',
  trend,
}: StatsCardProps) {
  const spotlight = spotlightColors[accentColor] ?? 'rgba(0,82,204,0.06)';

  return (
    <CardSpotlight
      className={`${gradientClass} p-4`}
      spotlightColor={spotlight}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p
            className="text-[11px] font-semibold uppercase tracking-widest"
            style={{ color: 'var(--sf-text-muted)' }}
          >
            {title}
          </p>
          <p
            className="mt-2 font-mono text-[1.75rem] font-bold tabular-nums leading-none"
            style={{ color: 'var(--sf-text)' }}
          >
            {value}
          </p>
          {subtitle && (
            <p className="mt-1.5 text-xs" style={{ color: 'var(--sf-text-muted)' }}>
              {subtitle}
            </p>
          )}
        </div>
        {icon && (
          <div
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg"
            style={{ background: `${accentColor}15`, color: accentColor }}
          >
            {icon}
          </div>
        )}
      </div>
      {trend && (
        <div className="mt-4 flex items-center gap-1.5 text-xs">
          <span
            className="font-mono font-bold"
            style={{ color: trend.value >= 0 ? 'var(--sf-completed)' : 'var(--sf-sla-risk)' }}
          >
            {trend.value >= 0 ? '+' : ''}{trend.value}%
          </span>
          <span style={{ color: 'var(--sf-text-muted)' }}>{trend.label}</span>
        </div>
      )}
    </CardSpotlight>
  );
}
