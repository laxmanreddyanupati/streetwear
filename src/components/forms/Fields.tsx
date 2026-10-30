import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FieldError } from '@/components/ui/field-error';
import { cn } from '@/utils/cn';

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  containerClassName?: string;
}

export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, error, hint, id, className, containerClassName, ...props }, ref) => {
    const generatedId = React.useId();
    const fieldId = id ?? generatedId;
    const describedBy = [error ? `${fieldId}-error` : null, hint ? `${fieldId}-hint` : null]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={cn('min-w-0', containerClassName)}>
        <Label htmlFor={fieldId} className="mb-2 block">
          {label}
        </Label>
        <Input
          id={fieldId}
          ref={ref}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy || undefined}
          className={cn(error && 'border-destructive focus-visible:border-destructive focus-visible:ring-destructive', className)}
          {...props}
        />
        {hint && (
          <p id={`${fieldId}-hint`} className="mt-1.5 text-[11px] leading-5 text-ink-muted">
            {hint}
          </p>
        )}
        <FieldError id={`${fieldId}-error`} message={error} />
      </div>
    );
  },
);
TextField.displayName = 'TextField';

interface TextAreaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  hint?: string;
  containerClassName?: string;
}

export const TextAreaField = React.forwardRef<HTMLTextAreaElement, TextAreaFieldProps>(
  ({ label, error, hint, id, className, containerClassName, ...props }, ref) => {
    const generatedId = React.useId();
    const fieldId = id ?? generatedId;
    const describedBy = [error ? `${fieldId}-error` : null, hint ? `${fieldId}-hint` : null]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={cn('min-w-0', containerClassName)}>
        <Label htmlFor={fieldId} className="mb-2 block">
          {label}
        </Label>
        <textarea
          id={fieldId}
          ref={ref}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy || undefined}
          className={cn(
            'flex min-h-28 w-full rounded-sm border border-ink/20 bg-white px-3.5 py-3 text-sm text-ink transition-colors placeholder:text-ink-muted/70 focus-visible:border-ink focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ink disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-destructive focus-visible:border-destructive focus-visible:ring-destructive',
            className,
          )}
          {...props}
        />
        {hint && (
          <p id={`${fieldId}-hint`} className="mt-1.5 text-[11px] leading-5 text-ink-muted">
            {hint}
          </p>
        )}
        <FieldError id={`${fieldId}-error`} message={error} />
      </div>
    );
  },
);
TextAreaField.displayName = 'TextAreaField';

interface SelectOption {
  label: string;
  value: string;
}

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  hint?: string;
  containerClassName?: string;
  options: SelectOption[];
}

export const SelectField = React.forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, error, hint, id, className, containerClassName, options, ...props }, ref) => {
    const generatedId = React.useId();
    const fieldId = id ?? generatedId;
    const describedBy = [error ? `${fieldId}-error` : null, hint ? `${fieldId}-hint` : null]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={cn('min-w-0', containerClassName)}>
        <Label htmlFor={fieldId} className="mb-2 block">
          {label}
        </Label>
        <select
          id={fieldId}
          ref={ref}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy || undefined}
          className={cn(
            'flex h-11 w-full rounded-sm border border-ink/20 bg-white px-3.5 text-sm text-ink transition-colors focus-visible:border-ink focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ink disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-destructive focus-visible:border-destructive focus-visible:ring-destructive',
            className,
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {hint && (
          <p id={`${fieldId}-hint`} className="mt-1.5 text-[11px] leading-5 text-ink-muted">
            {hint}
          </p>
        )}
        <FieldError id={`${fieldId}-error`} message={error} />
      </div>
    );
  },
);
SelectField.displayName = 'SelectField';

export const InputField = TextField;
