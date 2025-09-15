import Container from "@/components/Container.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { useAuthStore } from "@/store/useAuthStore.js";
import { Label } from "@radix-ui/react-label";
import { useState } from "react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const login = useAuthStore((state) => state.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function validateForm() {
    if (!email.trim()) return toast.error("Email is required");

    if (!/\S+@\S+\.\S+/.test(email)) return toast.error("Invalid email");

    if (!password.trim()) return toast.error("Password is required");

    return true;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm() === true) login({ email, password });
  };

  return (
    <div className="px-4 h-screen flex items-center justify-center">
      <div className="max-w-lg w-full mx-auto p-6 rounded-lg shadow-md border">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-sm text-muted-foreground">
            Log in to your account
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex flex-col gap-2">
            <Label className="font-medium">Email</Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="font-medium">Password</Label>

            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
      </div>
    </div>
  );
}
