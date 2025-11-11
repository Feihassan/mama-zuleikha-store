import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

function ProtectedRoute({ children, requiredRole = null, requireAuth = true }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute - user:', user, 'requiredRole:', requiredRole, 'loading:', loading);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (requireAuth && !user) {
    console.log('No user, redirecting to login');
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    console.log('User role mismatch. User role:', user?.role, 'Required:', requiredRole);
    return <Navigate to="/" replace />;
  }

  console.log('Access granted to protected route');
  return children;
}

export default ProtectedRoute;