"use client";

import { Button } from "@/src/app/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/src/app/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session, status } = useSession();

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  // Show loading state while checking session
  if (status === "loading") {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ml-20 mt-10">
        <div className="container flex h-16 max-w-screen-2xl items-center">
          <div className="flex flex-1 items-center justify-end space-x-2">
            <span className="text-sm">Loading...</span>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ml-20 mt-10">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        {/* Desktop Logo */}
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold text-xl">The Meet</span>
          </Link>
        </div>
        {/* Mobile Logo */}
        <Link href="/" className="mr-6 flex-1 md:hidden">
          <span className="font-bold text-xl">The Meet</span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-2">
          {session?.user ? (
            // Logged in state
            <>
              <span className="text-sm font-medium text-foreground">
                Hey {session.user.username}!
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Log Out
              </Button>
            </>
          ) : (
            // Not logged in state
            <>
              <Link
                href="/auth/signup"
                className="text-sm font-medium text-foreground hover:text-primary mr-10"
              >
                Welcome User
              </Link>
              <Button variant="outline" size="sm" asChild>
                <Link href="/auth/login">Log In</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
