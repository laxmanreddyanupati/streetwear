import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldAlert, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DemoNotice } from '@/components/common/DemoNotice';

interface AdminGateProps {
  children: ReactNode;
}

export function AdminGate({ children }: AdminGateProps) {
  // In demo mode, we provide an explicit toggle to enter the admin workspace.
  // In Firebase production, this will inspect decoded ID token custom claims (token.claims.admin === true).
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(true);

  if (!isAdminUnlocked) {
    return (
      <div className="container-editorial py-20">
        <div className="mx-auto max-w-lg border border-ink/20 bg-paper p-8 text-center sm:p-10">
          <ShieldAlert className="mx-auto size-12 text-ink" />
          <h1 className="display mt-4 text-3xl">Studio Admin Console</h1>
          <p className="mt-3 text-sm text-ink-muted">
            Administrative access is restricted to verified studio operators.
          </p>

          <DemoNotice className="my-6 text-left">
            <strong>Architecture Notice:</strong> In this frontend demo build, authentication uses mock state.
            In production Phase 4, access requires Firebase Authentication with custom claims verified via Firebase Security Rules.
          </DemoNotice>

          <div className="flex flex-col gap-3">
            <Button onClick={() => setIsAdminUnlocked(true)}>
              <ShieldCheck className="size-4" />
              Unlock Admin Demo Session
            </Button>
            <Button asChild variant="outline">
              <Link to="/">
                <ArrowLeft className="size-4" />
                Return to Storefront
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
