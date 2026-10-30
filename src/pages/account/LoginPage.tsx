import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { DEMO_EMAIL } from '@/services';
import { loginSchema, type LoginFormValues } from '@/schemas';
import { usePageMeta } from '@/hooks/usePageMeta';
import { AuthShell } from '@/components/account/AuthShell';
import { TextField } from '@/components/forms/Fields';
import { Button } from '@/components/ui/button';
import { getErrorMessage } from '@/utils/misc';
import { useState } from 'react';

export function LoginPage() {
  usePageMeta({ title: 'Sign in', description: 'Sign in to the STREETWEAR. demo account.' });
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);

  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/account';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      await signIn(values);
      navigate(from, { replace: true });
    } catch (error) {
      setFormError(getErrorMessage(error));
    }
  });

  return (
    <AuthShell
      eyebrow="Account"
      title="Welcome back."
      description="Sign in to view your demo orders, addresses and profile. Any valid email and an 8-character password works."
      image="/images/editorial-portrait.jpg"
      imageAlt="Editorial portrait from the STREETWEAR. campaign"
      footer={
        <>
          New here?{' '}
          <Link to="/account/register" className="font-medium text-ink underline underline-offset-4">
            Create a demo account
          </Link>
          . Forgot your password?{' '}
          <Link to="/account/forgot-password" className="underline underline-offset-4">
            Reset it
          </Link>
          .
        </>
      }
    >
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <div className="border border-ink/15 bg-bone p-3 text-[11px] leading-5 text-ink-muted">
          Demo login: <button type="button" className="font-medium text-ink underline underline-offset-4" onClick={() => { setValue('email', DEMO_EMAIL); setValue('password', 'demo1234'); }}>{DEMO_EMAIL}</button> with any password of 8+ characters.
        </div>
        <TextField
          type="email"
          label="Email address"
          autoComplete="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register('email')}
        />
        <TextField
          type="password"
          label="Password"
          autoComplete="current-password"
          placeholder="At least 8 characters"
          error={errors.password?.message}
          {...register('password')}
        />
        {formError && (
          <p className="flex items-start gap-2 border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive" role="alert">
            <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" /> {formError}
          </p>
        )}
        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </Button>
        <p className="text-center text-[10px] leading-5 text-ink-muted">
          No password is stored. The demo accepts any valid email.
        </p>
      </form>
    </AuthShell>
  );
}
