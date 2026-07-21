'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { customerSchema, type CustomerInput } from '@/lib/validation/schemas';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export default function NewCustomerPage() {
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CustomerInput>({
    resolver: zodResolver(customerSchema),
    defaultValues: { name: '', email: '', phone: '', address: '', taxNumber: '', taxOffice: '', notes: '' },
  });

  const onSubmit = async (data: CustomerInput) => {
    console.log('Customer data:', data);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div
        className="mx-auto max-w-lg rounded-2xl p-10 text-center"
        style={{ background: 'var(--sf-surface)', border: '1px solid var(--sf-border)' }}
      >
        <CheckCircle className="mx-auto mb-4 h-12 w-12" style={{ color: 'var(--sf-completed)' }} />
        <h2 className="text-lg font-semibold" style={{ color: 'var(--sf-text)' }}>Müşteri kaydedildi</h2>
        <p className="mt-2 text-sm" style={{ color: 'var(--sf-text-muted)' }}>
          Müşteri bilgileri alındı. Backend entegrasyonu tamamlandığında veritabanına kaydedilecek.
        </p>
        <Link href="/customers">
          <Button className="mt-6" variant="secondary">Müşteri Listesine Dön</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/customers">
          <Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4" /></Button>
        </Link>
        <div>
          <h1 className="text-xl font-bold tracking-tight" style={{ color: 'var(--sf-text)' }}>Yeni Müşteri</h1>
          <p className="mt-0.5 text-sm" style={{ color: 'var(--sf-text-muted)' }}>Müşteri bilgilerini doldurun</p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5 rounded-2xl p-6"
        style={{ background: 'var(--sf-surface)', border: '1px solid var(--sf-border)' }}
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Input label="Müşteri Adı" placeholder="Örn: ABC Teknik Servis" required error={errors.name?.message} {...register('name')} />
          <Input label="E-posta" type="email" placeholder="ornek@sirket.com" error={errors.email?.message} {...register('email')} />
          <Input label="Telefon" placeholder="05XX XXX XX XX" error={errors.phone?.message} {...register('phone')} />
          <Input label="Adres" placeholder="Mahalle, Sokak, No, İlçe/İl" error={errors.address?.message} {...register('address')} />
          <Input label="Vergi Numarası" placeholder="1234567890" error={errors.taxNumber?.message} {...register('taxNumber')} />
          <Input label="Vergi Dairesi" placeholder="Örn: Üsküdar Vergi Dairesi" error={errors.taxOffice?.message} {...register('taxOffice')} />
        </div>
        <Textarea label="Notlar" rows={4} placeholder="Müşteri hakkında ek notlar…" error={errors.notes?.message} {...register('notes')} />

        <div className="flex items-center justify-end gap-3 pt-2">
          <Link href="/customers">
            <Button variant="secondary" type="button">İptal</Button>
          </Link>
          <Button type="submit" loading={isSubmitting} loadingText="Kaydediliyor…">
            Müşteriyi Kaydet
          </Button>
        </div>
      </form>
    </div>
  );
}
