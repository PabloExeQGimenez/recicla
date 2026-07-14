import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./useAuth";
import type { UserRole } from "./authStorage";

export default function RoleRoute({ allow }: { allow: UserRole[] }) {
  const { isAuth, user } = useAuth();

  if (!isAuth) return <Navigate to="/login" replace />;
  if (!user || !allow.includes(user.role))
    return <Navigate to="/403" replace />;

  return <Outlet />;
}
