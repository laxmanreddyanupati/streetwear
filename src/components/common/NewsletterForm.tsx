import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Check } from 'lucide-react';
import { newsletterService } from '@/services';
import { newsletterSchema, type NewsletterFormValues } from '@/schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { FieldError } from '@/components/ui/field-error';
import { cn } from '@/utils/cn';
import { getErrorMessage } from '@/utils/misc';

type Feedback = { type: 'success' | 'error'; message: string } | null;

export function NewsletterForm({
  source = 'footer',
  className,
  tone = 'light',
}: {
  source?: string;
  className?: string;
  tone?: 'light' | 'dark';
}) {
  const [feedback, setFeedback] = useState<Feedback>(null);
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { email: '', consent: false },
  });

  const onSubmit = handleSubmit(async (values) => {
    setFeedback(null);
    try {
      await newsletterService.subscribe(values.email, source);
      reset();
      setFeedback({
        type: 'success',
        message: 'You are on the list. Look out for the next studio note.',
      });
    } catch (error) {
      setFeedback({ type: 'error', message: getErrorMessage(error) });
    }
  });

  const dark = tone === 'dark';

  return (
    <form onSubmit={onSubmit} className={cn('w-full', className)} noValidate>
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="flex-1">
          <label htmlFor={`newsletter-email-${source}`} className="sr-only">
            Email address
          </label>
          <Input
            id={`newsletter-email-${source}`}
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={Boolean(errors.email)}
            className={cn(
              dark && 'border-bone-light/25 bg-transparent text-bone-light placeholder:text-bone-light/45 focus-visible:border-bone-light focus-visible:ring-bone-light',
            )}
            {...register('email')}
          />
          <FieldError message={errors.email?.message} />
        </div>
        <Button
          type="submit"
          variant={dark ? 'acid' : 'default'}
          disabled={isSubmitting}
          className="sm:min-w-36"
        >
          {isSubmitting ? 'Joining…' : 'Join the list'}
          <ArrowRight aria-hidden="true" />
        </Button>
      </div>
      <div className="mt-4 flex items-start gap-3">
        <Controller
          control={control}
          name="consent"
          render={({ field }) => (
            <Checkbox
              id={`newsletter-consent-${source}`}
              checked={field.value}
              onCheckedChange={(value) => field.onChange(value === true)}
              className={cn(dark && 'border-bone-light/40 bg-transparent data-[state=checked]:bg-acid data-[state=checked]:text-ink')}
            />
          )}
        />
        <div>
          <label
            htmlFor={`newsletter-consent-${source}`}
            className={cn('text-xs leading-5', dark ? 'text-bone-light/65' : 'text-ink-muted')}
          >
            I agree to receive studio notes and collection releases. See the{' '}
            <Link to="/privacy" className="underline underline-offset-4">
              privacy policy
            </Link>
            .
          </label>
          <FieldError message={errors.consent?.message} />
        </div>
      </div>
      <div aria-live="polite" className="min-h-6">
        {feedback && (
          <p
            className={cn(
              'mt-2 flex items-start gap-2 text-xs leading-5',
              feedback.type === 'success'
                ? dark
                  ? 'text-acid'
                  : 'text-[#2d5a29]'
                : 'text-destructive',
            )}
          >
            {feedback.type === 'success' && <Check className="mt-0.5 size-3.5" aria-hidden="true" />}
            {feedback.message}
          </p>
        )}
      </div>
    </form>
  );
}
