import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore.js";
import toast from "react-hot-toast";
import Container from "@/components/Container.jsx";
import { useInviteStore } from "@/store/useInviteStore.js";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Loader2 } from "lucide-react";

export default function InviteUserPage() {
  const user = useAuthStore((state) => state.user);
  const inviteUser = useInviteStore((state) => state.inviteUser);
  const inviteUrl = useInviteStore((state) => state.inviteUrl);
  const isSubmitting = useInviteStore((state) => state.isSubmitting);
  const logout = useAuthStore((state) => state.logout);

  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");

  if (user?.role !== "admin") {
    return (
      <div className="pt-24 text-center font-medium text-muted-foreground">
        <p>You are not authorized to access this page.</p>
      </div>
    );
  }

  function validateForm() {
    if (!email.trim()) return toast.error("Email is required");

    if (!/\S+@\S+\.\S+/.test(email)) return toast.error("Invalid email");

    if (!role.trim()) return toast.error("Role is required");

    return true;
  }

  const handleInvite = async (e) => {
    e.preventDefault();

    if (validateForm() === true) {
      await inviteUser({
        email,
        role,
        tenantId: user.tenantId,
      });
    }
  };

  return (
    <Container>
      <div className="max-w-md mx-auto p-4">
        <h1 className="text-xl font-semibold mb-4">Invite User</h1>

        <div className="flex items-center gap-2 mb-4">
          <Input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="member">Member</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleInvite}
          className="bg-blue-600 hover:bg-blue-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Sending...
            </>
          ) : (
            "Send Invite"
          )}
        </Button>

        {inviteUrl && (
          <div className="mt-8 p-3 border rounded-md bg-slate-50">
            <p className="text-sm">Invite Link :</p>
            <a
              href={inviteUrl}
              className="text-blue-600 break-all"
              onClick={logout}
            >
              {inviteUrl}
            </a>
          </div>
        )}
      </div>
    </Container>
  );
}
