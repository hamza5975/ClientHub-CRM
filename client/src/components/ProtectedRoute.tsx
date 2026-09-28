import { Navigate } from 'react-router-dom';
import { Spinner } from '@/components/ui';
import { useAppSelector } from '@/store/hooks';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, token, status } = useAppSelector((state) => state.auth);

  if (status === 'loading') {
    return (
      <div
        className="flex h-screen items-center justify-center"
        data-icod-id="src_components_protectedroute_tsx_e84b">
        <Spinner size="lg" data-icod-id="src_components_protectedroute_tsx_26a9" />
      </div>
    );
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
