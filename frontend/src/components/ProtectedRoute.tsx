import { useEffect } from "react";
import toast from "react-hot-toast";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../stores/auth.store";
import type { Role } from "../types";

function Forbidden() {
  useEffect(() => {
    toast.error("Bạn không có quyền truy cập trang này", { id: "forbidden" });
  }, []);
  return <Navigate to="/" replace />;
}

export default function ProtectedRoute({ roles }: { roles?: Role[] }) {
  const accessToken = useAuthStore((s) => s.accessToken);
  const user = useAuthStore((s) => s.user);
  const location = useLocation();
  if (!accessToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (roles && (!user || !roles.includes(user.role))) {
    return <Forbidden />;
  }

  return <Outlet />;
}
