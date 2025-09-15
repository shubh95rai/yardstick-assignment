import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore.js";

export default function PublicRoute() {
  const user = useAuthStore((state) => state.user);

  return user ? <Navigate to="/" /> : <Outlet />;
}
