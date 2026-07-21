'use client';

import { PermissionGuard } from '@/components/guard/PermissionGuard';
import { PERMISSIONS } from '@/lib/validation/formats';
import { useState } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CardSpotlight } from '@/components/ui/CardSpotlight';
import { User, Shield, Bell, Building, Save, CheckCheck } from 'lucide-react';

function SettingSection({
  icon: Icon,
  title,
  accentColor = 'var(--sf-accent)',
  children,
}: {
  icon: React.ElementType;
  title: string;
  accentColor?: string;
  children: React.ReactNode;
}) {
  return (
    <CardSpotlight
      className="sf-gradient-card p-6"
      spotlightColor={`${accentColor}10`}
    >
      <div className="mb-5 flex items-center gap-3">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-xl"
          style={{ background: `${accentColor}18`, boxShadow: `0 0 12px ${accentColor}25` }}
        >
          <Icon className="h-4 w-4" style={{ color: accentColor }} />
        </div>
        <h2 className="text-sm font-semibold" style={{ color: 'var(--sf-text)' }}>{title}</h2>
      </div>
      {children}
    </CardSpotlight>
  );
}

export default function SettingsPage() {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <PermissionGuard permission={PERMISSIONS.SETTINGS_READ}>
      <div className="mx-auto max-w-3xl space-y-5 sf-fade-up">
        <div>
          <h1 className="text-xl font-bold tracking-tight sf-gradient-text">Ayarlar</h1>
          <p className="mt-0.5 text-sm" style={{ color: 'var(--sf-text-muted)' }}>Hesap ve uygulama tercihleri</p>
        </div>

        <SettingSection icon={User} title="Profil Bilgileri" accentColor="var(--sf-accent)">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Ad Soyad" defaultValue={user?.name ?? ''} readOnly />
            <Input label="E-posta" defaultValue={user?.email ?? ''} readOnly />
            <Input label="Rol" defaultValue={user?.role ?? ''} readOnly />
          </div>
        </SettingSection>

        <SettingSection icon={Bell} title="Bildirim Tercihleri" accentColor="#ffaa4c">
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
                  className="h-4 w-4 rounded"
                  style={{ accentColor: 'var(--sf-accent)' }}
                />
                <span className="text-sm" style={{ color: 'var(--sf-text-2)' }}>{item.label}</span>
              </label>
            ))}
          </div>
        </SettingSection>

        <SettingSection icon={Building} title="Firma Bilgileri" accentColor="#7d6cff">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Firma Adı" placeholder="Firma adınız" />
            <Input label="Vergi Numarası" placeholder="Vergi numaranız" />
            <Input label="Vergi Dairesi" placeholder="Vergi dairesi" />
            <Input label="Telefon" placeholder="Firma telefonu" />
          </div>
        </SettingSection>

        <SettingSection icon={Shield} title="Yetkiler" accentColor="#38d996">
          <div className="flex flex-wrap gap-2">
            {user?.permissions.map((perm) => (
              <span
                key={perm}
                className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium"
                style={{ background: 'var(--sf-accent-bg)', color: 'var(--sf-accent)', border: '1px solid rgba(96,165,250,0.2)' }}
              >
                {perm}
              </span>
            )) ?? <p className="text-sm" style={{ color: 'var(--sf-text-muted)' }}>Yetki listesi yüklenemedi.</p>}
          </div>
        </SettingSection>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled>
            {saved
              ? <><CheckCheck className="h-4 w-4" />Kaydedildi</>
              : <><Save className="h-4 w-4" />Kaydet (API bekleniyor)</>}
          </Button>
        </div>
      </div>
    </PermissionGuard>
  );
}
