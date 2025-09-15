import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore.js";

export default function PrivateRoute() {
  const user = useAuthStore((state) => state.user);

  return user ? <Outlet /> : <Navigate to="/login" />;
}
