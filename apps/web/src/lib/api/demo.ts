import type { AuthUser, Customer, DashboardStats, WorkOrder } from './types';

const DEMO_USER_KEY = 'sahaflow-demo-mode';

export function isDemoMode(): boolean {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(DEMO_USER_KEY) === 'true';
}

export function enableDemoMode(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(DEMO_USER_KEY, 'true');
  // Set a cookie so the middleware can identify demo mode
  document.cookie = 'saha-flow-demo=true; path=/; max-age=86400; SameSite=Strict';
}

export function disableDemoMode(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(DEMO_USER_KEY);
  document.cookie = 'saha-flow-demo=; path=/; max-age=0; SameSite=Strict';
}

export const demoUser: AuthUser = {
  id: 'demo-user-1',
  email: 'admin@sahaflow.local',
  name: 'Demo Admin',
  role: 'ADMIN',
  permissions: [
    'user:read', 'user:create', 'user:update', 'user:delete',
    'work_order:read', 'work_order:create', 'work_order:update', 'work_order:delete', 'work_order:assign',
    'customer:read', 'customer:create', 'customer:update', 'customer:delete',
    'report:read', 'report:create',
    'setting:read', 'setting:update',
    'audit:read',
  ],
};

export const demoDashboardStats: DashboardStats = {
  totalToday: 12,
  pending: 7,
  completedThisMonth: 89,
  totalCollection: 125_400,
  collectionCurrency: 'TRY',
};

export const demoWorkOrders: WorkOrder[] = [
  {
    id: 'wo-1',
    title: 'Klima Arızası - Salon Ünitesi',
    description: 'Müşterinin salonundaki duvar tipi klima soğutmuyor. Filtre temizliği ve gaz basıncı kontrolü gerekiyor.',
    status: 'pending',
    priority: 'high',
    customerId: 'cust-1',
    customerName: 'ABC Plaza Ofisleri',
    technicianName: 'Mehmet Kaya',
    scheduledDate: '2026-07-21T09:00:00Z',
    createdAt: '2026-07-20T14:30:00Z',
    updatedAt: '2026-07-20T14:30:00Z',
    tags: ['klima', 'acil'],
    location: { address: 'Levent Mah. Kule Sk. No:5, Şişli/İstanbul' },
  },
  {
    id: 'wo-2',
    title: 'Kombi Yıllık Bakım',
    description: 'Yoğuşmalı kombinin yıllık bakımı. Eşanjör temizliği ve genel kontrol.',
    status: 'in_progress',
    priority: 'medium',
    customerId: 'cust-2',
    customerName: 'Zeynep Demir',
    technicianName: 'Ali Yılmaz',
    scheduledDate: '2026-07-21T10:30:00Z',
    createdAt: '2026-07-19T11:00:00Z',
    updatedAt: '2026-07-21T08:15:00Z',
    tags: ['kombi', 'bakım'],
    location: { address: 'Kadıköy Mah. Moda Cd. No:12, Kadıköy/İstanbul' },
  },
  {
    id: 'wo-3',
    title: 'IP Kamera Kurulumu',
    description: '4 adet IP kamera kurulumu ve NVR kayıt cihazı yapılandırması.',
    status: 'completed',
    priority: 'high',
    customerId: 'cust-3',
    customerName: 'GüvenPark AVM',
    technicianName: 'Can Öztürk',
    scheduledDate: '2026-07-20T13:00:00Z',
    completedDate: '2026-07-20T15:45:00Z',
    createdAt: '2026-07-18T09:20:00Z',
    updatedAt: '2026-07-20T15:45:00Z',
    tags: ['kamera', 'güvenlik'],
    location: { address: 'Ataşehir Bulvarı No:45, Ataşehir/İstanbul' },
  },
  {
    id: 'wo-4',
    title: 'Klima Periyodik Bakım',
    description: '8 adet kaset tipi klima periyodik bakımı.',
    status: 'assigned',
    priority: 'low',
    customerId: 'cust-4',
    customerName: 'Serinlet Restoran Zinciri',
    technicianName: 'Elif Aksoy',
    scheduledDate: '2026-07-22T08:00:00Z',
    createdAt: '2026-07-19T16:45:00Z',
    updatedAt: '2026-07-20T09:00:00Z',
    tags: ['klima', 'bakım'],
    location: { address: 'Etiler Mah. Nispetiye Cd. No:78, Beşiktaş/İstanbul' },
  },
  {
    id: 'wo-5',
    title: 'Yangın Algılama Sistemi Kontrolü',
    description: 'Bina yangın algılama sisteminin aylık testleri ve sensör kontrolü.',
    status: 'cancelled',
    priority: 'critical',
    customerId: 'cust-5',
    customerName: 'TeknoFix Data Center',
    createdAt: '2026-07-18T10:00:00Z',
    updatedAt: '2026-07-19T14:20:00Z',
    tags: ['yangın', 'güvenlik'],
    location: { address: 'Tuzla OSB 3. Cadde No:20, Tuzla/İstanbul' },
  },
];

export const demoCustomers: Customer[] = [
  {
    id: 'cust-1',
    name: 'ABC Plaza Ofisleri',
    email: 'teknik@abcplaza.com',
    phone: '0212 555 01 01',
    address: 'Levent Mah. Kule Sk. No:5, Şişli/İstanbul',
    taxNumber: '1234567890',
    taxOffice: 'Şişli Vergi Dairesi',
    notes: 'Toplam 24 adet klima ünitesi bakım sözleşmesi mevcut.',
    totalWorkOrders: 12,
    createdAt: '2025-03-15T10:00:00Z',
    updatedAt: '2026-07-20T14:30:00Z',
  },
  {
    id: 'cust-2',
    name: 'Zeynep Demir',
    email: 'zeynep.demir@email.com',
    phone: '0532 555 02 02',
    address: 'Kadıköy Mah. Moda Cd. No:12, Kadıköy/İstanbul',
    totalWorkOrders: 3,
    createdAt: '2026-01-10T09:00:00Z',
    updatedAt: '2026-07-19T11:00:00Z',
  },
  {
    id: 'cust-3',
    name: 'GüvenPark AVM',
    email: 'guvenlik@guvenpark.com.tr',
    phone: '0216 555 03 03',
    address: 'Ataşehir Bulvarı No:45, Ataşehir/İstanbul',
    taxNumber: '9876543210',
    taxOffice: 'Ataşehir Vergi Dairesi',
    notes: 'Güvenlik sistemleri bakım sözleşmesi. Aylık düzenli kontrol.',
    totalWorkOrders: 28,
    createdAt: '2024-08-20T11:30:00Z',
    updatedAt: '2026-07-20T15:45:00Z',
  },
  {
    id: 'cust-4',
    name: 'Serinlet Restoran Zinciri',
    email: 'operasyon@serinlet.com',
    phone: '0212 555 04 04',
    address: 'Etiler Mah. Nispetiye Cd. No:78, Beşiktaş/İstanbul',
    taxNumber: '5678901234',
    taxOffice: 'Beşiktaş Vergi Dairesi',
    totalWorkOrders: 45,
    createdAt: '2024-11-05T13:15:00Z',
    updatedAt: '2026-07-20T09:00:00Z',
  },
  {
    id: 'cust-5',
    name: 'TeknoFix Data Center',
    email: 'noc@teknofix.net',
    phone: '0216 555 05 05',
    address: 'Tuzla OSB 3. Cadde No:20, Tuzla/İstanbul',
    taxNumber: '3456789012',
    taxOffice: 'Tuzla Vergi Dairesi',
    notes: '7/24 kritik altyapı. Acil müdahale SLA: 2 saat.',
    totalWorkOrders: 67,
    createdAt: '2023-06-12T08:00:00Z',
    updatedAt: '2026-07-19T14:20:00Z',
  },
];

export function mockApiResponse(endpoint: string, options?: { method?: string; params?: Record<string, unknown> }): unknown {
  const { method = 'GET', params } = options ?? {};

  if (endpoint === '/auth/me') return demoUser;
  if (endpoint === '/auth/login' && method === 'POST') return demoUser;
  if (endpoint === '/auth/refresh' && method === 'POST') return demoUser;
  if (endpoint === '/auth/logout' && method === 'POST') return undefined;

  if (endpoint === '/dashboard/stats' && method === 'GET') return demoDashboardStats;
  if (endpoint === '/dashboard/recent-work-orders' && method === 'GET') return demoWorkOrders.slice(0, 5);

  if (endpoint === '/work-orders' && method === 'GET') {
    const status = params?.status as string | undefined;
    const search = params?.search as string | undefined;
    let result = [...demoWorkOrders];
    if (status) result = result.filter((wo) => wo.status === status);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (wo) =>
          wo.title.toLowerCase().includes(q) ||
          (wo.customerName?.toLowerCase().includes(q) ?? false),
      );
    }
    return {
      data: result,
      total: result.length,
      page: 1,
      limit: 20,
      totalPages: 1,
    };
  }

  if (endpoint.startsWith('/work-orders/') && method === 'GET') {
    const id = endpoint.split('/').pop();
    return demoWorkOrders.find((wo) => wo.id === id) ?? demoWorkOrders[0];
  }

  if (endpoint === '/customers' && method === 'GET') {
    const search = params?.search as string | undefined;
    let result = [...demoCustomers];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          (c.email?.toLowerCase().includes(q) ?? false),
      );
    }
    return {
      data: result,
      total: result.length,
      page: 1,
      limit: 20,
      totalPages: 1,
    };
  }

  if (endpoint.startsWith('/customers/') && method === 'GET') {
    const id = endpoint.split('/').pop();
    return demoCustomers.find((c) => c.id === id) ?? demoCustomers[0];
  }

  // Default fallback for unknown endpoints
  return {};
}
