import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar.jsx";
import { Route, Routes } from "react-router-dom";
import PublicRoute from "./components/PublicRoute.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import NotesPage from "./pages/NotesPage.jsx";
import InviteUsersPage from "./pages/InviteUsersPage.jsx";
import AcceptInvitePage from "./pages/AcceptInvitePage.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import { useEffect } from "react";
import { useAuthStore } from "./store/useAuthStore.js";
import { Loader } from "lucide-react";

export default function App() {
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    checkAuth();
  }, []);

  if (isCheckingAuth && !user) {
    return (
      <div className="flex items-center justify-center h-dvh">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <Toaster />

      <Navbar />

      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/invite/:token" element={<AcceptInvitePage />} />

        </Route>

        <Route element={<PrivateRoute />}>
          <Route path="/" element={<NotesPage />} />
          <Route path="/invite-users" element={<InviteUsersPage />} />
          {/* <Route path="/invite/:token" element={<AcceptInvitePage />} /> */}
        </Route>
      </Routes>
    </div>
  );
}
