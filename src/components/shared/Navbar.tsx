"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { ChevronDown, LayoutDashboard, LogOut, Menu, Mountain, X } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { getDashboardPath } from "@/utils/auth";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import ThemeToggle from "./ThemeToggle";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/gear", label: "Browse Gear" },
];

const GHOST_DARK =
  "dark:text-white dark:hover:bg-white/10 dark:hover:text-white";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const status = useAuthStore((state) => state.status);
  const logout = useAuthStore((state) => state.logout);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const state = useAuthStore.getState();
    if (state.status === "idle") {
      state.fetchMe();
    }
  }, []);

  const isLoading = status === "idle" || status === "loading";
  const isAuthenticated = status === "authenticated" && !!user;
  const dashboardPath = getDashboardPath(user?.role ?? "CUSTOMER");

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((part) => part[0])
        .filter(Boolean)
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "";

  const handleSignOut = async () => {
    await logout();
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold tracking-tight"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-500 text-white">
            <Mountain className="size-4" />
          </span>
          GearUp
        </Link>

        <div className="hidden h-full items-stretch gap-7 md:flex">
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center border-b-2 text-sm font-medium transition-colors",
                  active
                    ? "border-emerald-500 text-zinc-900 dark:text-white"
                    : "border-transparent text-zinc-500 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle className={GHOST_DARK} />

          {isLoading ? (
            <Skeleton
              className="hidden h-9 w-24 bg-muted md:block"
              aria-hidden="true"
            />
          ) : isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button
                    type="button"
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "h-10 gap-2 rounded-full px-1.5 pr-3 dark:border-white/20 dark:bg-white/10 dark:hover:bg-white/15 dark:aria-expanded:bg-white/15"
                    )}
                  >
                    <Avatar className="size-7">
                      {user?.profilePhoto ? (
                        <AvatarImage
                          src={user.profilePhoto}
                          alt={user.name}
                        />
                      ) : null}
                      <AvatarFallback className="bg-emerald-500 text-[11px] text-white">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="max-w-[120px] truncate text-sm font-medium">
                      {user?.name}
                    </span>
                    <ChevronDown className="size-4 text-muted-foreground" />
                  </button>
                }
              />
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex flex-col gap-0.5 px-2 py-1.5">
                  <p className="truncate text-sm font-semibold">
                    {user?.name}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem render={<Link href={dashboardPath} />}>
                  <LayoutDashboard />
                  My Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  onClick={handleSignOut}
                >
                  <LogOut />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden items-center gap-3 md:flex">
              <Link
                href="/login"
                className={cn(buttonVariants({ variant: "ghost" }), GHOST_DARK)}
              >
                Log in
              </Link>
              <Link
                href="/register"
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "bg-emerald-500 text-white hover:bg-emerald-400 hover:text-white"
                )}
              >
                Sign up
              </Link>
            </div>
          )}

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn(GHOST_DARK, "md:hidden")}
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="border-t border-zinc-200 bg-white px-4 py-4 md:hidden dark:border-white/10 dark:bg-zinc-900">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  GHOST_DARK,
                  "justify-start"
                )}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                <Link
                  href={dashboardPath}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    GHOST_DARK,
                    "justify-start"
                  )}
                >
                  My Dashboard
                </Link>
                <Button
                  variant="ghost"
                  className="justify-start text-destructive dark:text-red-400 dark:hover:bg-white/10 dark:hover:text-red-300"
                  onClick={handleSignOut}
                >
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    GHOST_DARK,
                    "justify-start"
                  )}
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    buttonVariants({ variant: "default" }),
                    "justify-center bg-emerald-500 text-white hover:bg-emerald-400 hover:text-white"
                  )}
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
