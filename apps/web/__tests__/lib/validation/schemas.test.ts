import { describe, it, expect } from 'vitest';
import { loginSchema, workOrderCreateSchema, customerSchema, searchParamsSchema } from '@/lib/validation/schemas';

describe('loginSchema', () => {
  it('validates a correct login input', () => {
    const result = loginSchema.safeParse({ email: 'test@example.com', password: '123456' });
    expect(result.success).toBe(true);
  });

  it('rejects empty email', () => {
    const result = loginSchema.safeParse({ email: '', password: '123456' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.email).toBeDefined();
    }
  });

  it('rejects invalid email format', () => {
    const result = loginSchema.safeParse({ email: 'notanemail', password: '123456' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.email).toBeDefined();
    }
  });

  it('rejects short password', () => {
    const result = loginSchema.safeParse({ email: 'test@example.com', password: '123' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.password).toBeDefined();
    }
  });

  it('accepts rememberMe as optional', () => {
    const result = loginSchema.safeParse({ email: 'test@example.com', password: '123456' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.rememberMe).toBe(false);
    }
  });
});

describe('workOrderCreateSchema', () => {
  const validInput = {
    title: 'Klima Arızası',
    description: 'Ofis kliması çalışmıyor, acil bakım gerekiyor',
    customerId: 'c1',
    priority: 'high' as const,
  };

  it('validates a correct work order', () => {
    const result = workOrderCreateSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it('rejects empty title', () => {
    const result = workOrderCreateSchema.safeParse({ ...validInput, title: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.title).toBeDefined();
    }
  });

  it('rejects short description', () => {
    const result = workOrderCreateSchema.safeParse({ ...validInput, description: 'Kısa' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.description).toBeDefined();
    }
  });

  it('rejects invalid priority', () => {
    const result = workOrderCreateSchema.safeParse({ ...validInput, priority: 'extreme' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.priority).toBeDefined();
    }
  });

  it('rejects missing customerId', () => {
    const result = workOrderCreateSchema.safeParse({ ...validInput, customerId: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.customerId).toBeDefined();
    }
  });

  it('accepts optional fields', () => {
    const result = workOrderCreateSchema.safeParse({
      ...validInput,
      technicianId: 't1',
      scheduledDate: '2026-07-25',
      tags: ['acil'],
      location: { address: 'İstanbul' },
    });
    expect(result.success).toBe(true);
  });
});

describe('customerSchema', () => {
  it('validates a correct customer', () => {
    const result = customerSchema.safeParse({ name: 'ABC Ltd.' });
    expect(result.success).toBe(true);
  });

  it('rejects empty name', () => {
    const result = customerSchema.safeParse({ name: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.name).toBeDefined();
    }
  });

  it('rejects invalid email', () => {
    const result = customerSchema.safeParse({ name: 'ABC', email: 'invalid' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.email).toBeDefined();
    }
  });

  it('accepts valid phone', () => {
    const result = customerSchema.safeParse({ name: 'ABC', phone: '05321234567' });
    expect(result.success).toBe(true);
  });

  it('rejects invalid phone', () => {
    const result = customerSchema.safeParse({ name: 'ABC', phone: '123' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.phone).toBeDefined();
    }
  });
});

describe('searchParamsSchema', () => {
  it('uses defaults for empty input', () => {
    const result = searchParamsSchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(1);
      expect(result.data.limit).toBe(20);
      expect(result.data.sortOrder).toBe('desc');
    }
  });

  it('coerces string page to number', () => {
    const result = searchParamsSchema.safeParse({ page: '3' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(3);
    }
  });
});
