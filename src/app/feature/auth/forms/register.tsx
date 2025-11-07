"use client";

import { useState } from "react";
import { Button } from "@/src/app/ui/button";
import { Input } from "@/src/app/ui/input";
import { Label } from "@/src/app/ui/label";
import Link from "next/link";

export const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Implement registration API call
      console.log("Registration attempt:", { username, email, password });
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert("Registration successful!");
    } catch (error) {
      console.error("Registration failed:", error);
      setError("Registration failed!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-transparent rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="username" className="mb-2">Username</Label>
          <Input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Choose a username"
          />
        </div>
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
            placeholder="Create a password"
            minLength={8}
          />
        </div>
        <div>
          <Label htmlFor="confirmPassword" className="mb-2">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Confirm your password"
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Signing up..." : "Sign Up"}
        </Button>
        <Link href="/auth/login">Already have an account? Log in</Link>
      </form>
    </div>
  );
};
