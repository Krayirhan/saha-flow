'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { customerSchema, type CustomerInput } from '@/lib/validation/schemas';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ErrorState } from '@/components/ui/ErrorState';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';

export default function NewCustomerPage() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerInput>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      taxNumber: '',
      taxOffice: '',
      notes: '',
    },
  });

  const onSubmit = async (data: CustomerInput) => {
    // API entegrasyonu sonrası burası güncellenecek
    console.log('Customer data:', data);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl rounded-xl border border-white/10 bg-white/[0.03] p-8 text-center shadow-sm backdrop-blur-sm">
        <h2 className="text-xl font-semibold text-white">Müşteri kaydedildi</h2>
        <p className="mt-2 text-sm text-white/60">
          Müşteri bilgileri başarıyla alındı. Backend entegrasyonu tamamlandığında veritabanına kaydedilecek.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/customers"
            className="sf-button-primary"
          >
            Müşteri Listesine Dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center gap-2">
        <Link
          href="/customers"
          className="inline-flex items-center gap-1 text-sm text-white/50 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Müşterilere Dön
        </Link>
      </div>

      <h1 className="mb-6 text-2xl font-bold text-white">Yeni Müşteri</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 rounded-xl border border-white/10 bg-white/[0.03] p-6 shadow-sm backdrop-blur-sm"
      >
        {errors.root && (
          <ErrorState message={errors.root.message} />
        )}

        <div className="grid gap-6 sm:grid-cols-2">
          <Input
            label="Müşteri Adı"
            placeholder="Örn: ABC Teknik Servis"
            error={errors.name?.message}
            {...register('name')}
          />
          <Input
            label="E-posta"
            type="email"
            placeholder="ornek@sirket.com"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="Telefon"
            placeholder="05XX XXX XX XX"
            error={errors.phone?.message}
            {...register('phone')}
          />
          <Input
            label="Adres"
            placeholder="Mahalle, Sokak, No, İlçe/İl"
            error={errors.address?.message}
            {...register('address')}
          />
          <Input
            label="Vergi Numarası"
            placeholder="1234567890"
            error={errors.taxNumber?.message}
            {...register('taxNumber')}
          />
          <Input
            label="Vergi Dairesi"
            placeholder="Örn: Üsküdar Vergi Dairesi"
            error={errors.taxOffice?.message}
            {...register('taxOffice')}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-white/70">Notlar</label>
          <textarea
            rows={4}
            className="sf-input"
            placeholder="Müşteri hakkında ek notlar..."
            {...register('notes')}
          />
          {errors.notes && (
            <p className="mt-1 text-xs text-danger-400">{errors.notes.message}</p>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-4">
          <Link
            href="/customers"
            className="rounded-lg px-4 py-2 text-sm font-medium text-white/60 hover:bg-white/10 hover:text-white"
          >
            İptal
          </Link>
          <Button type="submit">
            Müşteriyi Kaydet
          </Button>
        </div>
      </form>
    </div>
  );
}
