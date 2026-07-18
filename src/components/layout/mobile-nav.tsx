"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { navItems } from "@/components/layout/sidebar";
import {
  LayoutDashboard,
  CalendarHeart,
  CheckSquare,
  ShoppingBag,
  Wallet,
  Users,
  Store,
  BarChart3,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap = {
  LayoutDashboard,
  CalendarHeart,
  CheckSquare,
  ShoppingBag,
  Wallet,
  Users,
  Store,
  BarChart3,
  Settings,
};

export function MobileNav() {
  const pathname = usePathname();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="border-b p-4 text-left">
          <SheetTitle className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-emerald-gold">
              <Heart className="h-4 w-4 text-white" fill="white" />
            </div>
            <span className="font-display">Wedding Planner</span>
          </SheetTitle>
        </SheetHeader>
        <nav className="space-y-1 p-3">
          {navItems.map((item) => {
            const Icon = iconMap[item.icon];
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-emerald/10 text-emerald-dark"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
