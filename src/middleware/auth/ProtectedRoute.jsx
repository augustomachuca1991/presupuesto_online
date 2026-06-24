import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <i className="ti ti-loader-2 animate-spin text-yel text-2xl" />
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
