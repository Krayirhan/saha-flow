'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { workOrderCreateSchema, type WorkOrderCreateInput } from '@/lib/validation/schemas';
import { WORK_ORDER_PRIORITIES } from '@/lib/validation/formats';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { CardSpotlight } from '@/components/ui/CardSpotlight';
import { createWorkOrder } from '@/lib/api/work-orders';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export function WorkOrderForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<WorkOrderCreateInput>({
    resolver: zodResolver(workOrderCreateSchema),
    defaultValues: { title: '', description: '', customerId: '', priority: 'medium', scheduledDate: '', tags: [] },
  });

  const onSubmit = async (data: WorkOrderCreateInput) => {
    setServerError(null);
    try {
      const result = await createWorkOrder(data);
      router.push(`/work-orders/${result.id}`);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'İş emri oluşturulamadı');
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 sf-fade-up">
      <div className="flex items-center gap-3">
        <Link href="/work-orders">
          <Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4" /></Button>
        </Link>
        <div>
          <h1 className="text-xl font-bold tracking-tight sf-gradient-text">Yeni İş Emri</h1>
          <p className="mt-0.5 text-sm" style={{ color: 'var(--sf-text-muted)' }}>Yeni bir iş emri oluşturun</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {serverError && (
          <div
            className="flex items-center gap-2 rounded-xl p-3 text-sm"
            style={{ background: 'rgba(255,95,109,0.1)', border: '1px solid rgba(255,95,109,0.3)', color: 'var(--sf-sla-risk)' }}
          >
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        <CardSpotlight className="sf-gradient-card p-6 space-y-5">
          <Input label="Başlık" placeholder="İş emri başlığı giriniz" required error={errors.title?.message} {...register('title')} />
          <Textarea label="Açıklama" required rows={5} placeholder="İş emri detaylarını yazınız…" error={errors.description?.message} {...register('description')} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              label="Öncelik"
              required
              options={WORK_ORDER_PRIORITIES.map((p) => ({ value: p.value, label: p.label }))}
              error={errors.priority?.message}
              {...register('priority')}
            />
            <Input label="Planlanan Tarih" type="date" error={errors.scheduledDate?.message} {...register('scheduledDate')} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Müşteri ID" placeholder="Müşteri seçiniz" required error={errors.customerId?.message} {...register('customerId')} />
            <Input label="Teknisyen ID" placeholder="Teknisyen atayın" error={errors.technicianId?.message} {...register('technicianId')} />
          </div>
          <Input label="Adres" placeholder="İş adresi giriniz…" error={errors.location?.address?.message} {...register('location.address')} />
        </CardSpotlight>

        <div className="flex justify-end gap-3">
          <Link href="/work-orders">
            <Button variant="secondary" type="button">İptal</Button>
          </Link>
          <Button type="submit" loading={isSubmitting} loadingText="Oluşturuluyor…">
            İş Emri Oluştur
          </Button>
        </div>
      </form>
    </div>
  );
}
