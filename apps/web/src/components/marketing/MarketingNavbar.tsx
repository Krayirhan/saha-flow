/**
 * MarketingNavbar — Saha Flow marketing navigation
 *
 * LANDING_REDESIGN_PLAN.md §4.1:
 * - transparent at page top
 * - subtle dark blur after scroll
 * - compact mobile menu
 * - visible focus states
 * - CTA remains visually dominant
 *
 * VibeUI referansı: minimal navbar structure
 * Refero referansı: spacing and typography
 * Aceternity: no effect needed here
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

import { cn } from '@/lib/utils/cn';

// ── Navigation links ──────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: 'Ürün',           href: '#product' },
  { label: 'Nasıl çalışır?', href: '#how-it-works' },
  { label: 'Mobil uygulama', href: '#mobile' },
  { label: 'Güvenlik',       href: '#security' },
  { label: 'Fiyatlandırma',  href: '#pricing' },
] as const;

// ── Logo ──────────────────────────────────────────────────────────────────────

function SahaFlowLogo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn('group flex items-center gap-2.5 mkt-focus rounded-lg', className)}
      aria-label="Saha Flow — Ana sayfa"
    >
      {/* Icon mark */}
      <div
        className="flex h-8 w-8 items-center justify-center rounded-[10px] transition-transform duration-200 group-hover:scale-105"
        style={{
          background: 'linear-gradient(135deg, #4f8cff 0%, #7d6cff 100%)',
          boxShadow: '0 2px 12px rgba(79,140,255,0.35)',
        }}
        aria-hidden="true"
      >
        {/* Flow symbol — simplified wave/route */}
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M2 12 C4 12 4 4 8 4 C12 4 12 12 14 12"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </div>
      {/* Wordmark */}
      <span className="text-sm font-bold tracking-tight text-white/95">Saha Flow</span>
    </Link>
  );
}

// ── Mobile menu button ────────────────────────────────────────────────────────

interface MobileMenuButtonProps {
  open: boolean;
  onClick: () => void;
}

function MobileMenuButton({ open, onClick }: MobileMenuButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mkt-focus flex h-9 w-9 items-center justify-center rounded-lg text-white/60 transition-colors hover:bg-white/8 hover:text-white md:hidden"
      aria-label={open ? 'Menüyü kapat' : 'Menüyü aç'}
      aria-expanded={open}
      aria-controls="mobile-nav-menu"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        aria-hidden="true"
      >
        {open ? (
          <>
            <line x1="3" y1="3" x2="15" y2="15" />
            <line x1="15" y1="3" x2="3" y2="15" />
          </>
        ) : (
          <>
            <line x1="3" y1="5" x2="15" y2="5" />
            <line x1="3" y1="9" x2="15" y2="9" />
            <line x1="3" y1="13" x2="15" y2="13" />
          </>
        )}
      </svg>
    </button>
  );
}

// ── MarketingNavbar ───────────────────────────────────────────────────────────

export function MarketingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 16);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Close mobile menu on escape
  useEffect(() => {
    if (!mobileOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [mobileOpen]);

  // Close mobile menu when link is clicked
  const handleNavClick = () => setMobileOpen(false);

  return (
    <header
      className={cn(
        'fixed top-0 z-50 w-full transition-all duration-300',
        scrolled
          ? 'border-b border-white/[0.07] bg-[#080a0f]/90 backdrop-blur-xl'
          : 'bg-transparent',
      )}
      role="banner"
    >
      <div className="mkt-container">
        <nav
          className="flex h-16 items-center justify-between"
          aria-label="Ana navigasyon"
          role="navigation"
        >
          {/* Logo */}
          <SahaFlowLogo />

          {/* Desktop links */}
          <ul
            className="hidden items-center gap-1 md:flex"
            role="list"
          >
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="mkt-focus rounded-lg px-3 py-2 text-sm font-medium text-white/55 transition-colors hover:text-white/90"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Desktop CTAs */}
          <div className="hidden items-center gap-2 md:flex">
            <Link
              href="/login"
              className="mkt-focus rounded-xl px-4 py-2 text-sm font-medium text-white/60 transition-colors hover:bg-white/[0.06] hover:text-white"
            >
              Giriş yap
            </Link>
            {/* TODO: Update href when trial flow is ready */}
            <Link
              href="/login"
              className="mkt-focus inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-[#080a0f] transition-all hover:opacity-90"
              style={{
                background: 'linear-gradient(135deg, #f5f7fa 0%, #e8eef8 100%)',
                boxShadow: '0 1px 8px rgba(255,255,255,0.12)',
              }}
            >
              Ücretsiz dene
            </Link>
          </div>

          {/* Mobile menu button */}
          <MobileMenuButton open={mobileOpen} onClick={() => setMobileOpen(!mobileOpen)} />
        </nav>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-nav-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Navigasyon menüsü"
        className={cn(
          'overflow-hidden border-b border-white/[0.07] bg-[#080a0f]/95 backdrop-blur-xl md:hidden',
          'transition-all duration-300',
          mobileOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0',
        )}
      >
        <div className="mkt-container pb-6 pt-2">
          <ul className="space-y-1" role="list">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={handleNavClick}
                  className="mkt-focus block rounded-lg px-4 py-3 text-base font-medium text-white/60 transition-colors hover:bg-white/[0.04] hover:text-white"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Mobile CTAs */}
          <div className="mt-4 flex flex-col gap-2 border-t border-white/[0.07] pt-4">
            <Link
              href="/login"
              onClick={handleNavClick}
              className="mkt-focus block rounded-xl border border-white/10 px-4 py-3 text-center text-sm font-medium text-white/70 transition-colors hover:bg-white/[0.06] hover:text-white"
            >
              Giriş yap
            </Link>
            {/* TODO: Update href when trial flow is ready */}
            <Link
              href="/login"
              onClick={handleNavClick}
              className="mkt-focus block rounded-xl px-4 py-3 text-center text-sm font-semibold text-[#080a0f] transition-all hover:opacity-90"
              style={{
                background: 'linear-gradient(135deg, #f5f7fa 0%, #e8eef8 100%)',
              }}
            >
              Ücretsiz dene
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
