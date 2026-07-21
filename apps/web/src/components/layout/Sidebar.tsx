'use client';

import { cn } from '@/lib/utils/cn';
import { Users, Settings, Wrench, LayoutDashboard, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { BrandLogo } from '@/components/brand/BrandLogo';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/work-orders', label: 'İş Emirleri', icon: Wrench },
  { href: '/customers', label: 'Müşteriler', icon: Users },
  { href: '/settings', label: 'Ayarlar', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string) =>
    href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href);

  return (
    <aside
      className={cn(
        'flex h-full flex-col transition-all duration-300',
        collapsed ? 'w-[60px]' : 'w-[220px]',
      )}
      style={{
        background: 'var(--sf-surface)',
        borderRight: '1px solid var(--sf-border)',
      }}
    >
      {/* Logo */}
      <div
        className={cn(
          'flex h-14 items-center px-3',
          collapsed ? 'justify-center' : 'justify-between',
        )}
        style={{ borderBottom: '1px solid var(--sf-border)' }}
      >
        {collapsed ? (
          <BrandLogo href="/dashboard" compact />
        ) : (
          <>
            <BrandLogo href="/dashboard" className="h-8 max-w-[130px] rounded-lg" />
            <button
              onClick={() => setCollapsed(true)}
              className="rounded-md p-1 transition-colors hover:bg-[#ebecf0]"
              style={{ color: 'var(--sf-text-muted)' }}
              aria-label="Menüyü daralt"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      {/* Expand button when collapsed */}
      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          className="mx-auto mt-2 rounded-md p-1.5 transition-colors hover:bg-[#ebecf0]"
          style={{ color: 'var(--sf-text-muted)' }}
          aria-label="Menüyü genişlet"
        >
          <ChevronLeft className="h-4 w-4 rotate-180" />
        </button>
      )}

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 px-2 py-3">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                'relative flex items-center rounded px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:bg-[#ebecf0]',
                collapsed ? 'justify-center' : 'gap-3',
              )}
              style={
                active
                  ? { background: '#deebff', color: 'var(--sf-accent)' }
                  : { color: 'var(--sf-text-2)' }
              }
            >
              {/* Left accent bar */}
              {active && !collapsed && (
                <span
                  className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r"
                  style={{ background: 'var(--sf-accent)' }}
                />
              )}
              <item.icon className="h-4 w-4 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="px-4 py-3" style={{ borderTop: '1px solid var(--sf-border)' }}>
          <p className="font-mono text-[10px]" style={{ color: 'var(--sf-text-muted)' }}>
            v0.1.0
          </p>
        </div>
      )}
    </aside>
  );
}
