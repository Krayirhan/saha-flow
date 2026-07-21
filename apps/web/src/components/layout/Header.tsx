'use client';

import { cn } from '@/lib/utils/cn';
import { LogOut, User, Bell, Menu } from 'lucide-react';
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

  const title = titleMap[pathname] || (pathname.startsWith('/work-orders/') ? 'İş Emri Detayı' : 'Saha Flow');

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-white/10 bg-[#0A0A0B]/80 px-4 backdrop-blur-xl lg:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="rounded-lg p-1.5 text-white/60 hover:bg-white/10 hover:text-white md:hidden"
          aria-label="Menü"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="hidden text-lg font-semibold text-white md:block">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <button
          className="relative rounded-lg p-2 text-white/60 hover:bg-white/10 hover:text-white disabled:opacity-50"
          aria-label="Bildirimler"
          disabled
          title="Çok yakında"
        >
          <Bell className="h-5 w-5" />
        </button>

        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className={cn(
              'flex items-center gap-2 rounded-lg p-1.5 text-sm text-white/80 hover:bg-white/10 hover:text-white',
            )}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-sm font-semibold text-white">
              {user?.name?.charAt(0).toUpperCase() ?? '?'}
            </div>
            <span className="hidden md:block">{user?.name ?? 'Kullanıcı'}</span>
          </button>

          {userMenuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
              <div className="absolute right-0 z-20 mt-1 w-48 rounded-lg border border-white/10 bg-[#0A0A0B] py-1 shadow-2xl backdrop-blur-sm">
                <div className="border-b border-white/10 px-4 py-2">
                  <p className="text-sm font-medium text-white">{user?.name}</p>
                  <p className="text-xs text-white/50">{user?.email}</p>
                </div>
                <button
                  onClick={() => setUserMenuOpen(false)}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white"
                >
                  <User className="h-4 w-4" />
                  Profil
                </button>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-danger-500 hover:bg-white/10"
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
