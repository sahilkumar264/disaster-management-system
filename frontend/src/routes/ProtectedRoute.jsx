import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const getFallbackPath = (role) => {
  if (role === "admin") {
    return "/admin";
  }

  if (role === "user") {
    return "/user";
  }

  return "/";
};

const ProtectedRoute = ({ children, role, redirectTo = "/user/login" }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to={getFallbackPath(user.role)} replace />;
  }

  return children;
};

export default ProtectedRoute;
