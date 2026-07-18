"use client";

import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { MobileNav } from "@/components/layout/mobile-nav";
import { UserMenu } from "@/components/layout/user-menu";
import { CountdownBanner } from "@/components/shared/countdown-ring";
import type { Profile } from "@/types/database";

interface HeaderProps {
  profile: Profile | null;
  email?: string;
}

export function Header({ profile, email }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md">
      <div className="flex h-16 items-center gap-4 px-4 lg:px-6">
        <MobileNav />

        <div className="hidden md:block flex-1">
          <CountdownBanner />
        </div>

        <div className="flex items-center gap-1 ml-auto">
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-white">
              3
            </span>
            <span className="sr-only">Notifications</span>
          </Button>
          <ThemeToggle />
          <UserMenu profile={profile} email={email} />
        </div>
      </div>
    </header>
  );
}
