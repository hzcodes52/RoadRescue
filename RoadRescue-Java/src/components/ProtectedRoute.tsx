import { Navigate } from '@/lib/router-compat';
import type { ReactNode } from 'react';
import { useAuth } from '@/lib/auth';
import { Loader2 } from 'lucide-react';

export function ProtectedRoute({ children, adminOnly = false, mechanicOnly = false }: { children: ReactNode; adminOnly?: boolean; mechanicOnly?: boolean }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent-500" />
      </div>
    );
  }

  if (!user) return <Navigate to={adminOnly ? '/admin/login' : mechanicOnly ? '/mechanic/login' : '/login'} replace />;
  if (adminOnly && user.role !== 'ADMIN') return <Navigate to="/" replace />;

  if (mechanicOnly && user.role !== 'MECHANIC') return <Navigate to="/" replace />;
  if (!adminOnly && !mechanicOnly && user.role === 'MECHANIC') return <Navigate to="/mechanic/dashboard" replace />;
  return <>{children}</>;
}
