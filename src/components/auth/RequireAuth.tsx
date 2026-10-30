import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Spinner } from '@/components/common/Spinner';

export function RequireAuth({ children }: { children: ReactNode }) {
  const { status } = useAuth();
  const location = useLocation();

  if (status === 'loading') {
    return (
      <div className="container-editorial flex min-h-[50vh] items-center justify-center">
        <Spinner className="size-5" label="Checking your session" />
      </div>
    );
  }

  if (status === 'anonymous') {
    return <Navigate to="/account/login" state={{ from: location }} replace />;
  }

  return children;
}
