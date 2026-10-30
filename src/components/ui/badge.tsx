import { cva, type VariantProps } from 'class-variance-authority';
import type * as React from 'react';
import { cn } from '@/utils/cn';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] transition-colors',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-ink text-bone-light',
        secondary: 'border-transparent bg-bone-deep text-ink',
        outline: 'border-ink/25 bg-transparent text-ink',
        acid: 'border-transparent bg-acid text-ink',
        success: 'border-transparent bg-[#dcebd9] text-[#2d5a29]',
        warning: 'border-transparent bg-[#f3e6c9] text-[#72551b]',
        danger: 'border-transparent bg-[#f2d9d4] text-[#7d2e20]',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
