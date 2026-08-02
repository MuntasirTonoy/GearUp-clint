"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  CreditCard,
  ClipboardList,
  Plus,
  Users,
  Database,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_CONFIGS = {
  customer: [
    { href: "/dashboard/customer", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/customer/rentals", label: "My Rentals", icon: Package },
    { href: "/dashboard/customer/payments", label: "Payments", icon: CreditCard },
  ],
  provider: [
    { href: "/dashboard/provider", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/provider/orders", label: "Orders", icon: ClipboardList },
    { href: "/dashboard/provider/gears", label: "My Gear", icon: Package },
    { href: "/dashboard/provider/gear/new", label: "Add Gear", icon: Plus },
  ],
  admin: [
    { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/admin/users", label: "Users", icon: Users },
    { href: "/dashboard/admin/content", label: "Content", icon: Database },
  ],
} as const;

type DashboardType = keyof typeof NAV_CONFIGS;

export default function DashboardMobileNav({ type }: { type: DashboardType }) {
  const pathname = usePathname();
  const items = NAV_CONFIGS[type];

  return (
    <nav className="flex gap-2 overflow-x-auto border-b border-border bg-background px-4 py-3 scrollbar-none sm:hidden">
      {items.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "inline-flex flex-shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 whitespace-nowrap",
              isActive
                ? "bg-orange-500 text-white shadow-md shadow-orange-500/30"
                : "bg-muted text-muted-foreground hover:bg-orange-500/10 hover:text-orange-600"
            )}
          >
            <Icon className="size-3.5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
