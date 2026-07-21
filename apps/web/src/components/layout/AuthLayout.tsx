import { cn } from '@/lib/utils/cn';
import { ClipboardList } from 'lucide-react';
import Link from 'next/link';
import { type ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  className?: string;
}

export function AuthLayout({ children, title, subtitle, className }: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-12 sm:px-6 lg:px-8">
      {/* Background matching the landing page */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_30%,transparent_70%)]" />
        <div className="absolute left-1/2 top-0 h-[800px] w-[800px] -translate-x-1/2 rounded-full bg-primary-500/10 blur-[120px]" />
      </div>

      <div className="relative z-10 mb-8 flex flex-col items-center">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 shadow-lg shadow-primary-500/25">
            <ClipboardList className="h-5 w-5 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">Saha Flow</span>
        </Link>
        <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-white">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 text-center text-sm text-white/50">{subtitle}</p>
        )}
      </div>
      <div
        className={cn(
          'relative z-10 w-full max-w-md rounded-xl border border-white/10 bg-white/[0.03] p-8 shadow-2xl backdrop-blur-sm',
          className,
        )}
      >
        {children}
      </div>
      <p className="relative z-10 mt-8 text-center text-xs text-white/30">
        &copy; {new Date().getFullYear()} Saha Flow. Tüm hakları saklıdır.
      </p>
    </div>
  );
}
