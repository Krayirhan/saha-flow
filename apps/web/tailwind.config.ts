import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        success: {
          50: '#f0fdf4',
          500: '#22c55e',
          700: '#15803d',
        },
        warning: {
          50: '#fffbeb',
          500: '#f59e0b',
          700: '#b45309',
        },
        danger: {
          50: '#fef2f2',
          500: '#ef4444',
          700: '#b91c1c',
        },
        // Flow Line state colors — DESIGN.md §5
        // Use only for operational states. Not for decoration.
        'sf-open':        '#4f8cff',
        'sf-assigned':    '#7d6cff',
        'sf-on-the-way':  '#74b8ff',
        'sf-in-progress': '#ffaa4c',
        'sf-completed':   '#38d996',
        'sf-sla-risk':    '#ff5f6d',
        'sf-offline':     '#747d8d',
        'sf-synced':      '#3dd6d0',
        // Surface tokens
        'sf-bg':          '#080a0f',
        'sf-bg-2':        '#0d1118',
        'sf-surface':     '#111722',
        'sf-surface-2':   '#151d2a',
        'sf-surface-3':   '#0f141d',
        // Text tokens
        'sf-text':        '#f5f7fa',
        'sf-text-2':      '#a8b0bf',
        'sf-text-muted':  '#747d8d',
        'sf-text-dim':    '#515865',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        // Flow Line reveal — used only for timeline sequential reveal
        // Controlled via JS, not autoplay. Reduced-motion: instant show.
        'flow-reveal': 'flow-reveal 0.4s ease forwards',
        'node-pulse':  'node-pulse 2s ease-in-out infinite',
      },
      keyframes: {
        'flow-reveal': {
          '0%':   { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'node-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.5' },
        },
      },
      maxWidth: {
        'marketing': '1280px',
        'marketing-wide': '1360px',
      },
    },
  },
  plugins: [],
};

export default config;
