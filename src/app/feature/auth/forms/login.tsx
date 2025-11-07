"use client";

import { useState } from "react";
import { Button } from "@/src/app/ui/button";
import { Input } from "@/src/app/ui/input";
import { Label } from "@/src/app/ui/label";
import Link from "next/link";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false, // Don't redirect automatically
      });

      if (result?.error) {
        toast.error("Invalid email or password");
      } else if (result?.ok) {
        toast.success("Login successful!");
        // Redirect to home page after successful login
        router.push("/");
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-transparent p-6 bg-card rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Log In</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email" className="mb-2">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
          />
        </div>
        <div>
          <Label htmlFor="password" className="mb-2">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
          />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Log In"}
        </Button>
        <Link href="/auth/signup">Don't have an account? Sign up</Link>
      </form>
    </div>
  );
};
