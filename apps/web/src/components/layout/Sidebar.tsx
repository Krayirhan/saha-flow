'use client';

import { cn } from '@/lib/utils/cn';
import { ClipboardList, Users, Settings, Wrench, ChevronLeft, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/work-orders', label: 'İş Emirleri', icon: Wrench },
  { href: '/customers', label: 'Müşteriler', icon: Users },
  { href: '/settings', label: 'Ayarlar', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={cn(
        'flex h-full flex-col border-r border-white/10 bg-[#0A0A0B] transition-all duration-300',
        collapsed ? 'w-16' : 'w-64',
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 shadow-lg shadow-primary-500/25">
              <ClipboardList className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">Saha Flow</span>
          </Link>
        )}
        {collapsed && (
          <Link href="/dashboard" className="mx-auto">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary-400 to-primary-600">
              <ClipboardList className="h-4 w-4 text-white" />
            </div>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden rounded-lg p-1 text-white/40 hover:bg-white/10 hover:text-white md:block"
          aria-label={collapsed ? 'Menüyü genişlet' : 'Menüyü daralt'}
        >
          <ChevronLeft className={cn('h-5 w-5 transition-transform', collapsed && 'rotate-180')} />
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-2 py-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
              isActive(item.href)
                ? 'bg-white/10 text-primary-400'
                : 'text-white/60 hover:bg-white/10 hover:text-white',
            )}
            title={collapsed ? item.label : undefined}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>

      {!collapsed && (
        <div className="border-t border-white/10 px-4 py-3">
          <p className="text-xs text-white/30">v0.1.0</p>
        </div>
      )}
    </aside>
  );
}
