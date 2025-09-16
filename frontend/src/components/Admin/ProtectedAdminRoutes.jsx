import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedAdminRoute = ({ children }) => {
  const { accessToken, loading, user } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!accessToken) return <Navigate to="/login" replace />;
  if (user?.role === "admin") {
    return children;
  } else {
    return <Navigate to="/unauthorized" replace />;
  }
};

export default ProtectedAdminRoute;
