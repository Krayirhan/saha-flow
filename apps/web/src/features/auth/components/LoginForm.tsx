'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginInput } from '@/lib/validation/schemas';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { AlertCircle } from 'lucide-react';
import { useState } from 'react';

export function LoginForm() {
  const { login, loginDemo } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  const onSubmit = async (data: LoginInput) => {
    setServerError(null);
    try {
      await login(data.email, data.password);
    } catch {
      setServerError('E-posta veya şifre hatalı. Lütfen tekrar deneyin.');
    }
  };

  const onDemoLogin = async () => {
    setServerError(null);
    try {
      await loginDemo();
    } catch {
      setServerError('Demo girişi başlatılamadı.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {serverError && (
        <div className="flex items-center gap-2 rounded-lg border border-danger-500 bg-danger-500/10 p-3 text-sm text-danger-400">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      <Input
        label="E-posta"
        type="email"
        placeholder="ornek@sirket.com"
        autoComplete="email"
        error={errors.email?.message}
        {...register('email')}
      />

      <Input
        label="Şifre"
        type="password"
        placeholder="••••••••"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register('password')}
      />

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="rememberMe"
          className="h-4 w-4 rounded border-white/20 bg-white/5 text-primary-500 focus:ring-primary-500 focus:ring-offset-0"
          {...register('rememberMe')}
        />
        <label htmlFor="rememberMe" className="text-sm text-white/70">
          Beni hatırla
        </label>
      </div>

      <Button type="submit" className="w-full" size="lg" loading={isSubmitting} loadingText="Giriş yapılıyor...">
        Giriş Yap
      </Button>

      <div className="relative flex items-center justify-center py-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10" />
        </div>
        <span className="relative px-3 text-xs" style={{ background: 'var(--sf-surface)', color: 'var(--sf-text-muted)' }}>veya</span>
      </div>

      <Button
        type="button"
        variant="secondary"
        className="w-full"
        size="lg"
        onClick={onDemoLogin}
        loading={isSubmitting}
        loadingText="Demo başlatılıyor..."
      >
        Demo Girişi (Backend Yok)
      </Button>

      <p className="text-center text-xs text-white/40">
        Demo modu sadece arayüz gezintisi içindir. Veriler tarayıcıda kalıcı olmaz.
      </p>
    </form>
  );
}
