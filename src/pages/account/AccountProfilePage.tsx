import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { profileSchema, type ProfileFormValues } from '@/schemas';
import { TextField } from '@/components/forms/Fields';
import { Button } from '@/components/ui/button';
import { DemoNotice } from '@/components/common/DemoNotice';
import { formatDate } from '@/utils/format';
import { getErrorMessage } from '@/utils/misc';

export function AccountProfilePage() {
  const { customer, updateProfile } = useAuth();
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: customer?.firstName ?? '',
      lastName: customer?.lastName ?? '',
      phone: customer?.phone ?? '',
    },
  });

  if (!customer) return null;

  const onSubmit = handleSubmit(async (values) => {
    setFeedback(null);
    try {
      await updateProfile({
        firstName: values.firstName,
        lastName: values.lastName,
        phone: values.phone || undefined,
      });
      setFeedback({ type: 'success', message: 'Profile updated in this browser session.' });
    } catch (error) {
      setFeedback({ type: 'error', message: getErrorMessage(error) });
    }
  });

  return (
    <div>
      <div className="border-b border-ink/15 pb-4">
        <h2 className="font-display text-3xl">Profile</h2>
        <p className="mt-1 text-sm text-ink-muted">
          Keep the details attached to your demo orders up to date.
        </p>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_280px]">
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
            label="Phone (optional)"
            type="tel"
            autoComplete="tel"
            error={errors.phone?.message}
            {...register('phone')}
          />
          <div>
            <label htmlFor="account-email" className="field-label">
              Email address
            </label>
            <input
              id="account-email"
              value={customer.email}
              readOnly
              className="flex h-12 w-full cursor-not-allowed rounded-sm border border-ink/15 bg-bone px-3.5 text-sm text-ink-muted"
            />
            <p className="mt-1.5 text-[11px] text-ink-muted">
              Email changes are disabled in the demo. A production account would require
              re-verification.
            </p>
          </div>

          {feedback && (
            <p
              className={`flex items-center gap-2 text-xs ${
                feedback.type === 'success' ? 'text-[#2d5a29]' : 'text-destructive'
              }`}
              aria-live="polite"
            >
              {feedback.type === 'success' && <Check className="size-3.5" aria-hidden="true" />}
              {feedback.message}
            </p>
          )}

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving…' : 'Save changes'}
          </Button>
        </form>

        <aside className="h-fit border border-ink/15 bg-bone p-5">
          <p className="label-xs text-ink-muted">Account summary</p>
          <dl className="mt-4 space-y-3 text-xs">
            <div>
              <dt className="text-ink-muted">Member since</dt>
              <dd className="mt-0.5 font-medium">{formatDate(customer.createdAt)}</dd>
            </div>
            <div>
              <dt className="text-ink-muted">Account type</dt>
              <dd className="mt-0.5 font-medium">Demo / local browser</dd>
            </div>
            <div>
              <dt className="text-ink-muted">Password</dt>
              <dd className="mt-0.5 font-medium">Not stored</dd>
            </div>
          </dl>
        </aside>
      </div>

      <DemoNotice className="mt-8">
        Profile edits persist in <code className="text-[11px]">localStorage</code> for this browser.
        Clearing site data resets the demo account.
      </DemoNotice>
    </div>
  );
}
