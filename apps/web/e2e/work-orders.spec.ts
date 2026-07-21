import { test, expect } from '@playwright/test';

test.describe('Work Orders', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: '1',
          email: 'test@example.com',
          name: 'Test User',
          role: 'admin',
          permissions: ['*'],
        }),
      }),
    );
  });

  test('displays work orders list', async ({ page }) => {
    await page.route('**/api/work-orders*', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [
            {
              id: 'wo-001',
              title: 'Test İş Emri',
              description: 'Test açıklaması',
              status: 'pending',
              priority: 'high',
              customerId: 'c1',
              customerName: 'Test Müşteri',
              technicianName: null,
              scheduledDate: null,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              tags: [],
            },
          ],
          total: 1,
          page: 1,
          limit: 20,
          totalPages: 1,
        }),
      }),
    );

    await page.route('**/api/dashboard/stats', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          totalToday: 5,
          pending: 3,
          completedThisMonth: 12,
          totalCollection: 15000,
          collectionCurrency: 'TRY',
        }),
      }),
    );

    await page.goto('http://localhost:3000/work-orders');
    await expect(page.getByText('Test İş Emri')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Test Müşteri')).toBeVisible();
  });

  test('navigates to new work order form', async ({ page }) => {
    await page.goto('http://localhost:3000/work-orders');
    await page.getByText('Yeni İş Emri').click();
    await expect(page).toHaveURL(/\/work-orders\/new/);
  });

  test('shows empty state when no work orders', async ({ page }) => {
    await page.route('**/api/work-orders*', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: [], total: 0, page: 1, limit: 20, totalPages: 0 }),
      }),
    );

    await page.goto('http://localhost:3000/work-orders');
    await expect(page.getByText('Henüz iş emri yok')).toBeVisible({ timeout: 10000 });
  });

  test('navigates to work order detail', async ({ page }) => {
    await page.route('**/api/work-orders*', (route) => {
      const url = route.request().url();
      if (url.includes('/wo-001')) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 'wo-001',
            title: 'Detay İş Emri',
            description: 'Bu bir detay sayfasıdır',
            status: 'in_progress',
            priority: 'medium',
            customerId: 'c1',
            customerName: 'Detay Müşteri',
            technicianName: 'Ahmet Teknisyen',
            scheduledDate: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            tags: ['test'],
          }),
        });
      }
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [
            {
              id: 'wo-001',
              title: 'Detay İş Emri',
              description: 'Bu bir detay sayfasıdır',
              status: 'in_progress',
              priority: 'medium',
              customerId: 'c1',
              customerName: 'Detay Müşteri',
              technicianName: 'Ahmet Teknisyen',
              scheduledDate: null,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              tags: ['test'],
            },
          ],
          total: 1,
          page: 1,
          limit: 20,
          totalPages: 1,
        }),
      });
    });

    await page.route('**/api/work-orders/wo-001/status-history', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      }),
    );

    await page.goto('http://localhost:3000/work-orders/wo-001');
    await expect(page.getByText('Detay İş Emri')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Bu bir detay sayfasıdır')).toBeVisible();
  });
});
