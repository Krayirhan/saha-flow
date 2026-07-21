import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('redirects to login page when unauthenticated', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await expect(page).toHaveURL(/\/login/);
  });

  test('login page renders form', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await expect(page.getByLabel('E-posta')).toBeVisible();
    await expect(page.getByLabel('Şifre')).toBeVisible();
    await expect(page.getByRole('button', { name: /giriş yap/i })).toBeVisible();
  });

  test('shows validation errors on empty submit', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.getByRole('button', { name: /giriş yap/i }).click();
    await expect(page.getByText('E-posta adresi zorunludur')).toBeVisible();
    await expect(page.getByText('Şifre zorunludur')).toBeVisible();
  });

  test('shows error on invalid credentials', async ({ page }) => {
    await page.route('**/api/auth/login', (route) =>
      route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ code: 'UNAUTHORIZED', message: 'Invalid credentials' }),
      }),
    );

    await page.goto('http://localhost:3000/login');
    await page.getByLabel('E-posta').fill('wrong@example.com');
    await page.getByLabel('Şifre').fill('wrongpassword');
    await page.getByRole('button', { name: /giriş yap/i }).click();

    await expect(page.getByText(/e-posta veya şifre hatalı/i)).toBeVisible({ timeout: 5000 });
  });

  test('redirects to dashboard after successful login', async ({ page }) => {
    await page.route('**/api/auth/login', (route) =>
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

    await page.goto('http://localhost:3000/login');
    await page.getByLabel('E-posta').fill('test@example.com');
    await page.getByLabel('Şifre').fill('password123');
    await page.getByRole('button', { name: /giriş yap/i }).click();

    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });
  });
});
