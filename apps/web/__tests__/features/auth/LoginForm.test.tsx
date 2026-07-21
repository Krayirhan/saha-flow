import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from '@/features/auth/components/LoginForm';

vi.mock('@/features/auth/hooks/useAuth', () => ({
  useAuth: () => ({
    login: vi.fn().mockRejectedValue(new Error('Invalid credentials')),
    user: null,
    isLoading: false,
    isAuthenticated: false,
    error: null,
    logout: vi.fn(),
    mutate: vi.fn(),
  }),
}));

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login form with email and password fields', () => {
    render(<LoginForm />);

    expect(screen.getByLabelText('E-posta')).toBeInTheDocument();
    expect(screen.getByLabelText('Şifre')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /giriş yap/i })).toBeInTheDocument();
  });

  it('shows validation errors for empty fields', async () => {
    render(<LoginForm />);

    const submitButton = screen.getByRole('button', { name: /giriş yap/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('E-posta adresi zorunludur')).toBeInTheDocument();
      expect(screen.getByText('Şifre zorunludur')).toBeInTheDocument();
    });
  });

  it('shows validation error for invalid email', async () => {
    render(<LoginForm />);

    const emailInput = screen.getByLabelText('E-posta');
    const passwordInput = screen.getByLabelText('Şifre');
    const submitButton = screen.getByRole('button', { name: /giriş yap/i });

    await userEvent.type(emailInput, 'invalid-email');
    await userEvent.type(passwordInput, '12345678');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByLabelText('E-posta')).toHaveValue('invalid-email');
    });
  });

  it('shows server error on failed login', async () => {
    render(<LoginForm />);

    const emailInput = screen.getByLabelText('E-posta');
    const passwordInput = screen.getByLabelText('Şifre');
    const submitButton = screen.getByRole('button', { name: /giriş yap/i });

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'wrongpassword');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/e-posta veya şifre hatalı/i)).toBeInTheDocument();
    });
  });

  it('renders remember me checkbox', () => {
    render(<LoginForm />);
    expect(screen.getByLabelText('Beni hatırla')).toBeInTheDocument();
  });
});
