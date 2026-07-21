'use client';

import { PermissionGuard } from '@/components/guard/PermissionGuard';
import { PERMISSIONS } from '@/lib/validation/formats';
import { useEffect, useState } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  User,
  Shield,
  Bell,
  Building,
  Globe,
  Save,
} from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <PermissionGuard permission={PERMISSIONS.SETTINGS_READ}>
      <div className="mx-auto max-w-3xl space-y-6">
        <h1 className="text-2xl font-bold text-white">Ayarlar</h1>

        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5">
              <User className="h-4 w-4 text-primary-400" />
            </div>
            <h2 className="text-lg font-semibold text-white">Profil Bilgileri</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Ad Soyad" defaultValue={user?.name ?? ''} readOnly />
            <Input label="E-posta" defaultValue={user?.email ?? ''} readOnly />
            <Input label="Rol" defaultValue={user?.role ?? ''} readOnly />
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5">
              <Bell className="h-4 w-4 text-primary-400" />
            </div>
            <h2 className="text-lg font-semibold text-white">Bildirim Tercihleri</h2>
          </div>
          <div className="space-y-3">
            {[
              { id: 'email_notify', label: 'E-posta bildirimleri' },
              { id: 'push_notify', label: 'Anlık bildirimler' },
              { id: 'sms_notify', label: 'SMS bildirimleri' },
            ].map((item) => (
              <label key={item.id} className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  id={item.id}
                  className="h-4 w-4 rounded border-white/20 bg-white/5 text-primary-500 focus:ring-primary-500 focus:ring-offset-0"
                />
                <span className="text-sm text-white/70">{item.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5">
              <Building className="h-4 w-4 text-primary-400" />
            </div>
            <h2 className="text-lg font-semibold text-white">Firma Bilgileri</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Firma Adı" defaultValue="" placeholder="Firma adınız" />
            <Input label="Vergi Numarası" defaultValue="" placeholder="Vergi numaranız" />
            <Input label="Vergi Dairesi" defaultValue="" placeholder="Vergi dairesi" />
            <Input label="Telefon" defaultValue="" placeholder="Firma telefonu" />
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5">
              <Shield className="h-4 w-4 text-primary-400" />
            </div>
            <h2 className="text-lg font-semibold text-white">Yetkiler</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {user?.permissions.map((perm) => (
              <span
                key={perm}
                className="inline-flex items-center rounded-full bg-primary-500/10 px-3 py-1 text-xs font-medium text-primary-400"
              >
                {perm}
              </span>
            )) ?? <p className="text-sm text-white/50">Yetki listesi yüklenemedi.</p>}
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled>
            {saved ? (
              <>Kaydedildi (demo)</>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Kaydet (API entegrasyonu bekleniyor)
              </>
            )}
          </Button>
        </div>
      </div>
    </PermissionGuard>
  );
}
