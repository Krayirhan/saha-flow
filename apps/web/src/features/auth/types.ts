import type { AuthUser } from '@/lib/api/types';

export interface LoginFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

export interface UseAuthReturn extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  loginDemo: () => Promise<void>;
  logout: () => Promise<void>;
  mutate: () => void;
}
