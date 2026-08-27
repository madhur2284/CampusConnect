import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./useAuth";
import Spinner from "../../components/Spinner";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, initializing } = useAuth();
  const location = useLocation();

  if (initializing) {
    return <Spinner label="Checking your session" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
