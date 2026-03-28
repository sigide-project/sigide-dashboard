import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store';
import { RouteContainer } from './ProtectedRoute.styled';

export function ProtectedRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <RouteContainer>
      <Outlet />
    </RouteContainer>
  );
}
