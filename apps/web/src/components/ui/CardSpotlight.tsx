'use client';

import { type ReactNode, type CSSProperties } from 'react';
import { cn } from '@/lib/utils/cn';

interface CardSpotlightProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  spotlightColor?: string;
  radius?: number;
}

export function CardSpotlight({ children, className, style }: CardSpotlightProps) {
  return (
    <div className={cn('sf-card sf-card-hover', className)} style={style}>
      {children}
    </div>
  );
}
