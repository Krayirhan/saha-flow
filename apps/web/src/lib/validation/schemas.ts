import { z } from 'zod';

const turkishPhoneRegex = /^(?:\+90|0)?[5][0-9]{2}[0-9]{3}[0-9]{2}[0-9]{2}$/;

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'E-posta adresi zorunludur')
    .email('Geçerli bir e-posta adresi giriniz'),
  password: z
    .string()
    .min(1, 'Şifre zorunludur')
    .min(6, 'Şifre en az 6 karakter olmalıdır'),
  rememberMe: z.boolean().optional().default(false),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const workOrderCreateSchema = z.object({
  title: z
    .string()
    .min(1, 'İş emri başlığı zorunludur')
    .min(3, 'Başlık en az 3 karakter olmalıdır')
    .max(200, 'Başlık en fazla 200 karakter olabilir'),
  description: z
    .string()
    .min(1, 'Açıklama zorunludur')
    .min(10, 'Açıklama en az 10 karakter olmalıdır')
    .max(5000, 'Açıklama en fazla 5000 karakter olabilir'),
  customerId: z.string().min(1, 'Müşteri seçimi zorunludur'),
  technicianId: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical'], {
    errorMap: () => ({ message: 'Geçerli bir öncelik seviyesi seçiniz' }),
  }),
  scheduledDate: z.string().optional(),
  tags: z.array(z.string()).optional().default([]),
  location: z
    .object({
      address: z.string().min(1, 'Adres zorunludur').max(500, 'Adres en fazla 500 karakter olabilir'),
      latitude: z.number().min(-90).max(90).optional(),
      longitude: z.number().min(-180).max(180).optional(),
    })
    .optional(),
});

export type WorkOrderCreateInput = z.infer<typeof workOrderCreateSchema>;

export const workOrderUpdateSchema = workOrderCreateSchema.partial().extend({
  status: z
    .enum(['pending', 'assigned', 'in_progress', 'completed', 'cancelled'])
    .optional(),
});

export type WorkOrderUpdateInput = z.infer<typeof workOrderUpdateSchema>;

export const customerSchema = z.object({
  name: z
    .string()
    .min(1, 'Müşteri adı zorunludur')
    .min(2, 'Ad en az 2 karakter olmalıdır')
    .max(200, 'Ad en fazla 200 karakter olabilir'),
  email: z.string().email('Geçerli bir e-posta adresi giriniz').optional().or(z.literal('')),
  phone: z
    .string()
    .regex(turkishPhoneRegex, 'Geçerli bir telefon numarası giriniz')
    .optional()
    .or(z.literal('')),
  address: z.string().max(500, 'Adres en fazla 500 karakter olabilir').optional(),
  taxNumber: z.string().max(20, 'Vergi numarası en fazla 20 karakter olabilir').optional(),
  taxOffice: z.string().max(100, 'Vergi dairesi en fazla 100 karakter olabilir').optional(),
  notes: z.string().max(1000, 'Notlar en fazla 1000 karakter olabilir').optional(),
});

export type CustomerInput = z.infer<typeof customerSchema>;

export const searchParamsSchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  search: z.string().optional(),
  status: z.string().optional(),
  sortBy: z.string().optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type SearchParams = z.infer<typeof searchParamsSchema>;
