"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  CreditCard,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard/customer", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/customer/rentals", label: "My Rentals", icon: Package },
  { href: "/dashboard/customer/payments", label: "Payments", icon: CreditCard },
];

export default function CustomerSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 flex-shrink-0 flex-col gap-6 border-r border-border bg-muted/20 px-4 py-6 sm:flex">
      <div className="space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-orange-500/10 text-orange-600 dark:text-orange-400"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <span className="inline-flex items-center gap-2.5">
                <item.icon className={cn("size-4", isActive && "text-orange-500")} />
                {item.label}
              </span>
              {isActive && (
                <ChevronRight className="size-3.5 text-orange-500" />
              )}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
