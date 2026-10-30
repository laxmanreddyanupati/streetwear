import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check } from 'lucide-react';
import { accountService } from '@/services';
import { forgotPasswordSchema, type ForgotPasswordFormValues } from '@/schemas';
import { usePageMeta } from '@/hooks/usePageMeta';
import { AuthShell } from '@/components/account/AuthShell';
import { TextField } from '@/components/forms/Fields';
import { Button } from '@/components/ui/button';
import { getErrorMessage } from '@/utils/misc';

export function ForgotPasswordPage() {
  usePageMeta({
    title: 'Reset password',
    description: 'Request a demo password reset. No email is sent.',
  });
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    setError(null);
    setMessage(null);
    try {
      const result = await accountService.requestPasswordReset(values.email);
      setMessage(result.message);
    } catch (caught) {
      setError(getErrorMessage(caught));
    }
  });

  return (
    <AuthShell
      eyebrow="Account"
      title="Reset access."
      description="In a production build this would send a secure, time-limited reset link. In this demo no email is sent and no password exists to reset."
      image="/images/about-rack.jpg"
      imageAlt="Clothing rail in the STREETWEAR. studio"
      footer={
        <>
          Remembered it?{' '}
          <Link to="/account/login" className="font-medium text-ink underline underline-offset-4">
            Return to sign in
          </Link>
          .
        </>
      }
    >
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <TextField
          type="email"
          label="Email address"
          autoComplete="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register('email')}
        />
        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Preparing…' : 'Send demo reset'}
        </Button>
        {message && (
          <p className="flex items-start gap-2 border border-ink/15 bg-bone p-3 text-xs leading-5 text-ink-muted" aria-live="polite">
            <Check className="mt-0.5 size-4 shrink-0 text-[#2d5a29]" aria-hidden="true" /> {message}
          </p>
        )}
        {error && (
          <p className="border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive" role="alert">
            {error}
          </p>
        )}
      </form>
    </AuthShell>
  );
}
