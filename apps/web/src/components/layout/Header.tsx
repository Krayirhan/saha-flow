'use client';

import { LogOut, Bell, Menu, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/features/auth/hooks/useAuth';

interface HeaderProps {
  onMenuToggle?: () => void;
}

const titleMap: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/work-orders': 'İş Emirleri',
  '/work-orders/new': 'Yeni İş Emri',
  '/customers': 'Müşteriler',
  '/settings': 'Ayarlar',
};

export function Header({ onMenuToggle }: HeaderProps) {
  const { user, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();

  const title = titleMap[pathname] ?? (pathname.startsWith('/work-orders/') ? 'İş Emri Detayı' : 'İşAkış');

  return (
    <header
      className="flex h-14 flex-shrink-0 items-center justify-between px-5"
      style={{
        background: 'var(--sf-surface)',
        borderBottom: '1px solid var(--sf-border)',
      }}
    >
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="rounded-lg p-1.5 transition-colors hover:bg-[#ebecf0] md:hidden"
          style={{ color: 'var(--sf-text-muted)' }}
          aria-label="Menü"
        >
          <Menu className="h-4 w-4" />
        </button>
        <h1
          className="hidden text-sm font-semibold tracking-tight md:block"
          style={{ color: 'var(--sf-text)' }}
        >
          {title}
        </h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1">
        {/* Bell */}
        <button
          className="rounded-lg p-2 transition-colors hover:bg-[#ebecf0] disabled:opacity-30"
          style={{ color: 'var(--sf-text-muted)' }}
          aria-label="Bildirimler"
          disabled
          title="Çok yakında"
        >
          <Bell className="h-4 w-4" />
        </button>

        {/* Divider */}
        <div className="mx-1 h-5 w-px" style={{ background: 'var(--sf-border)' }} />

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-[#ebecf0]"
          >
            <div
              className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold"
              style={{ background: 'var(--sf-accent-bg)', color: 'var(--sf-accent)' }}
            >
              {user?.name?.charAt(0).toUpperCase() ?? '?'}
            </div>
            <span className="hidden text-sm font-medium md:block" style={{ color: 'var(--sf-text-2)' }}>
              {user?.name ?? 'Kullanıcı'}
            </span>
            <ChevronDown className="hidden h-3 w-3 md:block" style={{ color: 'var(--sf-text-muted)' }} />
          </button>

          {userMenuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
              <div
                className="absolute right-0 z-20 mt-1 w-52 overflow-hidden rounded-xl shadow-2xl"
                style={{
                  background: 'var(--sf-surface)',
                  border: '1px solid var(--sf-border-strong)',
                }}
              >
                {/* User info */}
                <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--sf-border)' }}>
                  <p className="text-sm font-semibold" style={{ color: 'var(--sf-text)' }}>
                    {user?.name}
                  </p>
                  <p className="mt-0.5 truncate text-xs" style={{ color: 'var(--sf-text-muted)' }}>
                    {user?.email}
                  </p>
                </div>

                {/* Logout */}
                <button
                  onClick={async () => { setUserMenuOpen(false); await logout(); }}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm transition-colors hover:bg-[#fff0ee]"
                  style={{ color: 'var(--sf-sla-risk)' }}
                >
                  <LogOut className="h-4 w-4" />
                  Çıkış Yap
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
