"use client";

import { Button } from "@/src/app/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/src/app/ui/sheet"
import { Menu } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mx-40 my-10">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold text-xl">The Meet</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm">
            {/* Future nav links here */}
          </nav>
        </div>
        <Link href="/" className="mr-6 flex-1 md:hidden">
          <span className="font-bold text-xl">The Meet</span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <Link
            href="/signup"
            className="text-sm font-medium text-foreground hover:text-primary"
          >
            Welcome User
          </Link>
          <Button variant="outline" size="sm" asChild>
            <Link href="/signin">Log In</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
