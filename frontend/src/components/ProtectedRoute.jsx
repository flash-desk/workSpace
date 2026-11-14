import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="d-flex vh-100 align-items-center justify-content-center"><div className="spinner-border" /></div>;
  return user ? children : <Navigate to="/login" replace />;
}
