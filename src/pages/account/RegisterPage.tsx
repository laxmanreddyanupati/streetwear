import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { registerSchema, type RegisterFormValues } from '@/schemas';
import { usePageMeta } from '@/hooks/usePageMeta';
import { AuthShell } from '@/components/account/AuthShell';
import { TextField } from '@/components/forms/Fields';
import { Button } from '@/components/ui/button';
import { getErrorMessage } from '@/utils/misc';

export function RegisterPage() {
  usePageMeta({ title: 'Create account', description: 'Create a local demo STREETWEAR. account.' });
  const navigate = useNavigate();
  const { register: createAccount } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      await createAccount({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
      });
      navigate('/account', { replace: true });
    } catch (error) {
      setFormError(getErrorMessage(error));
    }
  });

  return (
    <AuthShell
      eyebrow="Account"
      title="Create an account."
      description="A demonstration account keeps your addresses and local orders together in this browser. No password is ever stored."
      image="/images/editorial-woman.jpg"
      imageAlt="Editorial image from the STREETWEAR. campaign"
      footer={
        <>
          Already have an account?{' '}
          <Link to="/account/login" className="font-medium text-ink underline underline-offset-4">
            Sign in
          </Link>
          .
        </>
      }
    >
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="First name"
            autoComplete="given-name"
            error={errors.firstName?.message}
            {...register('firstName')}
          />
          <TextField
            label="Last name"
            autoComplete="family-name"
            error={errors.lastName?.message}
            {...register('lastName')}
          />
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
          autoComplete="new-password"
          placeholder="At least 8 characters"
          error={errors.password?.message}
          {...register('password')}
        />
        <TextField
          type="password"
          label="Confirm password"
          autoComplete="new-password"
          placeholder="Repeat your password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />
        {formError && (
          <p className="flex items-start gap-2 border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive" role="alert">
            <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" /> {formError}
          </p>
        )}
        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Creating account…' : 'Create demo account'}
        </Button>
        <p className="text-center text-[10px] leading-5 text-ink-muted">
          Demo only. The password is checked for length, then discarded.
        </p>
      </form>
    </AuthShell>
  );
}
