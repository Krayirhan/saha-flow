import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@/lib/utils/cn';

interface BrandLogoProps {
  className?: string;
  compact?: boolean;
  href?: string;
}

export function BrandLogo({ className, compact = false, href = '/' }: BrandLogoProps) {
  const image = (
    <Image
      src="/brand/isakis-logo.png"
      alt="İşAkış"
      width={compact ? 40 : 190}
      height={compact ? 40 : 64}
      priority
      unoptimized
      className={cn(
        compact
          ? 'h-8 w-8 object-cover object-left'
          : 'h-10 w-auto object-contain',
        className,
      )}
    />
  );

  return href ? (
    <Link href={href} aria-label="İşAkış — Ana sayfa" className="inline-flex items-center">
      {image}
    </Link>
  ) : image;
}
