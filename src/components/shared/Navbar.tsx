"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  Mountain,
  X,
  Compass,
} from "lucide-react";
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

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const status = useAuthStore((state) => state.status);
  const logout = useAuthStore((state) => state.logout);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const state = useAuthStore.getState();
    if (state.status === "idle") {
      state.fetchMe();
    }
  }, []);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

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
    <header
      className={cn(
        "animate-navbar-in sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-white/10 bg-zinc-950/80 shadow-xl shadow-black/20 backdrop-blur-xl dark:bg-zinc-950/80"
          : "bg-zinc-950/60 backdrop-blur-md dark:bg-zinc-950/60"
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 text-lg font-bold tracking-tight text-white"
        >
          <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/30 transition-transform duration-300 group-hover:scale-110">
            <Mountain className="size-4 text-white" />
          </span>
          <span className="bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">
            GearUp
          </span>
        </Link>

        {/* Desktop Nav links */}
        <div className="hidden h-full items-stretch gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative flex items-center px-4 text-sm font-medium transition-colors duration-200",
                  active
                    ? "text-white"
                    : "text-zinc-400 hover:text-white"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <ThemeToggle className="text-zinc-400 hover:text-white hover:bg-white/10" />

          {isLoading ? (
            <Skeleton className="hidden h-9 w-24 bg-white/10 md:block" aria-hidden="true" />
          ) : isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button
                    type="button"
                    className="flex h-10 items-center gap-2 rounded-full border border-white/15 bg-white/5 px-2 pr-3 text-white backdrop-blur-sm transition-all duration-200 hover:border-white/25 hover:bg-white/10"
                  >
                    <Avatar className="size-7">
                      {user?.profilePhoto ? (
                        <AvatarImage src={user.profilePhoto} alt={user.name} />
                      ) : null}
                      <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-emerald-600 text-[11px] text-white font-bold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="max-w-[120px] truncate text-sm font-medium">
                      {user?.name}
                    </span>
                    <ChevronDown className="size-3.5 text-zinc-400" />
                  </button>
                }
              />
              <DropdownMenuContent align="end" className="w-56 border-white/10 bg-zinc-900">
                <div className="flex flex-col gap-0.5 px-2 py-1.5">
                  <p className="truncate text-sm font-semibold text-white">{user?.name}</p>
                  <p className="truncate text-xs text-zinc-500">{user?.email}</p>
                </div>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem render={<Link href={dashboardPath} />}>
                  <LayoutDashboard className="text-emerald-400" />
                  My Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem variant="destructive" onClick={handleSignOut}>
                  <LogOut />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Link
                href="/login"
                className="inline-flex h-9 items-center rounded-lg px-4 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/10 hover:text-white"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 text-sm font-semibold text-white shadow-md shadow-emerald-500/20 transition-all duration-200 hover:scale-[1.03] hover:shadow-emerald-500/40"
              >
                <Compass className="size-3.5" />
                Get started
              </Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-zinc-400 hover:bg-white/10 hover:text-white md:hidden"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </nav>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="border-t border-white/10 bg-zinc-950/95 px-4 py-4 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    "flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-emerald-500/15 text-emerald-400"
                      : "text-zinc-400 hover:bg-white/10 hover:text-white"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}

            <div className="my-1 h-px bg-white/10" />

            {isAuthenticated ? (
              <>
                <Link
                  href={dashboardPath}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <LayoutDashboard className="size-4 text-emerald-400" />
                  My Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
                >
                  <LogOut className="size-4" />
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="mt-1 flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 py-2.5 text-sm font-semibold text-white"
                >
                  <Compass className="size-4" />
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
