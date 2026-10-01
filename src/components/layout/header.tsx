"use client";

import Link from "next/link";

import {
  Bell,
  Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { MobileNav } from "@/components/layout/mobile-nav";
import { UserMenu } from "@/components/layout/user-menu";
import { CountdownBanner } from "@/components/shared/countdown-ring";
import { useNotificationCount } from "@/components/layout/notification-badge";

import type { Profile } from "@/types/database";

interface HeaderProps {
  profile: Profile | null;
  email?: string;
}

export function Header({
  profile,
  email,
}: HeaderProps) {
  const {
    count,
    eventId,
  } = useNotificationCount();

  const notificationHref =
    eventId
      ? `/dashboard/notifications?event=${encodeURIComponent(
          eventId
        )}`
      : "/dashboard/notifications";

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md">
      <div className="flex h-16 items-center gap-3 px-4 lg:px-6">
        {/* Mobile Menu */}

        <MobileNav />

        {/* Countdown */}

        <div className="hidden flex-1 md:block">
          <CountdownBanner />
        </div>

        {/* Actions */}

        <div className="ml-auto flex items-center gap-1">
          {/* Search */}

          <Button
            variant="ghost"
            size="icon"
            className="hidden sm:flex"
          >
            <Search className="h-5 w-5" />

            <span className="sr-only">
              Search
            </span>
          </Button>

          {/* Notifications */}

          <Link
            href={notificationHref}
            aria-label="Open notifications"
            className="relative flex h-10 w-10 items-center justify-center rounded-lg text-foreground transition hover:bg-muted"
          >
            <Bell className="h-5 w-5" />

            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex min-w-4 h-4 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-white">
                {count > 99
                  ? "99+"
                  : count}
              </span>
            )}

            <span className="sr-only">
              Notifications
            </span>
          </Link>

          {/* Theme */}

          <ThemeToggle />

          {/* User */}

          <UserMenu
            profile={profile}
            email={email}
          />
        </div>
      </div>
    </header>
  );
}