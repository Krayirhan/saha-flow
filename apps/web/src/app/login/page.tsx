import { AuthLayout } from '@/components/layout/AuthLayout';
import { LoginForm } from '@/features/auth/components/LoginForm';

export default function LoginPage() {
  return (
    <AuthLayout title="Giriş Yap" subtitle="Saha Flow hesabınıza giriş yapın">
      <LoginForm />
    </AuthLayout>
  );
}
