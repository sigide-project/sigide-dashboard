import { yupResolver } from '@hookform/resolvers/yup';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { authService } from '@/services';
import { useAuthStore } from '@/store';
import type { User } from '@/types';
import {
  ErrorText,
  FormSection,
  LoginCard,
  LoginRoot,
  LogoDot,
  LogoSection,
  LogoSubtitle,
  LogoTitle,
} from './LoginPage.styled';

const schema = yup.object({
  email: yup.string().required('Email is required').email('Enter a valid email'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

type LoginForm = yup.InferType<typeof schema>;

export function LoginPage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const setAuth = useAuthStore((s) => s.setAuth);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: yupResolver(schema),
    defaultValues: { email: '', password: '' },
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = handleSubmit(async (values) => {
    setApiError(null);
    setSubmitting(true);
    try {
      const res = await authService.login(values.email, values.password);
      if (!res.success || !res.user || !res.token) {
        setApiError(res.message || 'Login failed');
        return;
      }
      if (res.user.role !== 'admin') {
        setApiError('Access restricted to administrators');
        return;
      }
      setAuth(res.user as User, res.token);
      navigate('/', { replace: true });
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { message?: string; error?: string } } };
      const msg = ax.response?.data?.message || ax.response?.data?.error || 'Login failed';
      setApiError(msg);
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <LoginRoot>
      <LoginCard elevation={0}>
        <LogoSection>
          <LogoTitle>
            Sigide
            <LogoDot>.</LogoDot>
          </LogoTitle>
          <LogoSubtitle>Admin Dashboard</LogoSubtitle>
        </LogoSection>
        <FormSection onSubmit={onSubmit} noValidate>
          <TextField
            {...register('email')}
            label="Email"
            type="email"
            autoComplete="email"
            fullWidth
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            {...register('password')}
            label="Password"
            type="password"
            autoComplete="current-password"
            fullWidth
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          {apiError ? <ErrorText>{apiError}</ErrorText> : null}
          <Button type="submit" variant="contained" size="large" fullWidth disabled={submitting}>
            {submitting ? <CircularProgress size={24} color="inherit" /> : 'Sign in'}
          </Button>
        </FormSection>
      </LoginCard>
    </LoginRoot>
  );
}
