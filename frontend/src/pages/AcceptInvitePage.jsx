import Container from "@/components/Container.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { useInviteStore } from "@/store/useInviteStore.js";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";

export default function AcceptInvitePage() {
  const fetchInviteDetails = useInviteStore(
    (state) => state.fetchInviteDetails
  );
  const acceptInvite = useInviteStore((state) => state.acceptInvite);
  const inviteDetails = useInviteStore((state) => state.inviteDetails);
  const isLoading = useInviteStore((state) => state.isLoading);
  const isSubmitting = useInviteStore((state) => state.isSubmitting);

  const { token } = useParams();

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  function validateForm() {
    if (!name.trim()) return toast.error("Name is required");
    if (!password.trim()) return toast.error("Password is required");

    return true;
  }

  const handleAccept = async () => {
    if (validateForm() === true) {
      const res = await acceptInvite({
        token,
        name,
        password,
      });

      if (res === true) {
        navigate("/");
      }
    }
  };

  useEffect(() => {
    fetchInviteDetails(token);
  }, [token]);

  if (isLoading && !inviteDetails) {
    return <p>Loading...</p>;
  }

  if (!inviteDetails) {
    return (
      <div className="text-center pt-24">
        <p className="font-medium text-muted-foreground">
          {" "}
          Invite link is invalid or expired.
        </p>
      </div>
    );
  }

  return (
    <Container>
      <div className="max-w-md mx-auto p-4 flex flex-col gap-4">
        <h1 className="text-xl font-semibold">Join your team</h1>
        <p>
          You're invited as <strong>{inviteDetails.role}</strong> using email{" "}
          <strong>{inviteDetails.email}</strong>
        </p>

        <Input
          className="border p-2 w-full mb-2"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          type="password"
          className="border p-2 w-full mb-2"
          placeholder="Create password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          onClick={handleAccept}
          disabled={isSubmitting}
          className="bg-green-600 text-white hover:bg-green-700"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Accepting...
            </>
          ) : (
            "Accept Invite"
          )}
        </Button>
      </div>
    </Container>
  );
}
