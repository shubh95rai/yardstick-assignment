import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore.js";
import { Button } from "./ui/button.jsx";
import { Badge } from "./ui/badge.jsx";

export default function Navbar() {
  const user = useAuthStore((state) => state.user);
  const tenant = useAuthStore((state) => state.tenant);
  const logout = useAuthStore((state) => state.logout);

  return (
    <nav className="flex items-center justify-between fixed w-full top-0 z-10 shadow-md h-16 px-6 bg-white">
      {/* left side */}
      <div className="flex items-end gap-4">
        <Link to="/" className="text-lg font-bold">
          Notes App
        </Link>
        {user && (
          // <span className="text-sm text-slate-500">
          //   {tenant?.slug} • {tenant?.plan}
          // </span>
          <Badge variant="secondary">
            {tenant?.slug} • {tenant?.plan} {"plan"}
          </Badge>
        )}
      </div>

      {/* right side */}
      <div className="flex items-center gap-6">
        {user ? (
          <>
            <Link to="/" className="text-sm font-medium underline">
              Notes
            </Link>
            {user.role === "admin" && (
              <Link
                to="/invite-users"
                className="text-sm font-medium underline"
              >
                Invite Users
              </Link>
            )}
            <Button variant="outline" onClick={logout}>
              Logout
            </Button>
          </>
        ) : (
          <Link to="/login">
            <Button variant="outline">Login</Button>
          </Link>
        )}
      </div>
    </nav>
  );
}
