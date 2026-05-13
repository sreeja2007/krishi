import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-forest-50">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-3 border-forest-700 border-t-transparent rounded-full animate-spin" />
        <p className="text-forest-700 font-medium text-sm">Loading KrishiAI...</p>
      </div>
    </div>
  );
  return user ? children : <Navigate to="/login" />;
}
