"use client";

import { useEffect, useRef, useState } from "react";
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
  User,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { getDashboardPath } from "@/utils/auth";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileHeight, setMobileHeight] = useState(0);
  const mobileDrawerRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Bootstrap auth
  useEffect(() => {
    const state = useAuthStore.getState();
    if (state.status === "idle") state.fetchMe();
  }, []);

  // Scroll handler
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Measure drawer height for smooth animation
  useEffect(() => {
    if (mobileDrawerRef.current) {
      setMobileHeight(mobileOpen ? mobileDrawerRef.current.scrollHeight : 0);
    }
  }, [mobileOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const isLoading = status === "idle" || status === "loading";
  const isAuthenticated = status === "authenticated" && !!user;
  const dashboardPath = getDashboardPath(user?.role ?? "CUSTOMER");

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((p) => p[0])
        .filter(Boolean)
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "";

  const handleSignOut = async () => {
    setMobileOpen(false);
    setProfileOpen(false);
    await logout();
    router.push("/");
    router.refresh();
  };

  if (pathname === "/login" || pathname === "/register") return null;

  return (
    <header
      className={cn(
        "animate-navbar-in sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-border bg-background/80 shadow-md backdrop-blur-xl"
          : "bg-background/60 backdrop-blur-md"
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* ── Logo ── */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 text-lg font-bold tracking-tight text-foreground"
        >
          <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 shadow-lg shadow-orange-500/30 transition-transform duration-300 group-hover:scale-110">
            <Mountain className="size-4 text-white" />
          </span>
          <span className="hidden bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent sm:inline">
            GearUp
          </span>
        </Link>

        {/* ── Desktop nav links (md+) ── */}
        <div className="hidden h-full items-stretch gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative flex items-center px-4 text-sm font-medium transition-colors duration-200",
                isActive(link.href)
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {link.label}
              {isActive(link.href) && (
                <span className="absolute inset-x-4 bottom-0 h-0.5 rounded-full bg-orange-500" />
              )}
            </Link>
          ))}
        </div>

        {/* ── Right side ── */}
        <div className="flex items-center gap-2">
          <ThemeToggle className="text-muted-foreground hover:text-foreground hover:bg-secondary" />

          {/* ── DESKTOP: authenticated user avatar + dropdown ── */}
          {!isLoading && isAuthenticated && (
            <div ref={profileRef} className="relative hidden md:block">
              <button
                type="button"
                onClick={() => setProfileOpen((v) => !v)}
                className="flex h-9 w-9 items-center justify-center rounded-full ring-2 ring-border transition-all duration-200 hover:ring-orange-500/60 focus:outline-none"
                aria-label="Account menu"
                aria-expanded={profileOpen}
              >
                <Avatar className="size-9">
                  {user?.profilePhoto ? (
                    <AvatarImage src={user.profilePhoto} alt={user.name} />
                  ) : null}
                  <AvatarFallback className="bg-gradient-to-br from-orange-400 to-orange-600 text-[11px] text-white font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </button>

              {/* Dropdown */}
              {profileOpen && (
                <div className="absolute right-0 top-12 w-64 rounded-2xl border border-border bg-popover shadow-xl shadow-black/10 ring-1 ring-black/5 dark:ring-white/5 overflow-hidden animate-scale-in">
                  {/* User info */}
                  <div className="flex items-center gap-3 px-4 py-4 border-b border-border">
                    <Avatar className="size-10 flex-shrink-0">
                      {user?.profilePhoto ? (
                        <AvatarImage src={user.profilePhoto} alt={user.name} />
                      ) : null}
                      <AvatarFallback className="bg-gradient-to-br from-orange-400 to-orange-600 text-sm text-white font-bold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">{user?.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                  {/* Menu items */}
                  <div className="p-2">
                    <Link
                      href={dashboardPath}
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                    >
                      <LayoutDashboard className="size-4 text-orange-500" />
                      My Dashboard
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
                    >
                      <LogOut className="size-4" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── DESKTOP: guest buttons ── */}
          {!isLoading && !isAuthenticated && (
            <div className="hidden items-center gap-2 md:flex">
              <Link
                href="/login"
                className="inline-flex h-9 items-center rounded-lg px-4 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-4 text-sm font-semibold text-white shadow-md shadow-orange-500/20 transition-all duration-200 hover:scale-[1.03] hover:shadow-orange-500/40"
              >
                <Compass className="size-3.5" />
                Get started
              </Link>
            </div>
          )}

          {/* ── Hamburger (mobile + tablet) ── */}
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {/* ── Mobile animated dropdown ── */}
      <div
        className="overflow-hidden border-t border-border bg-background/98 backdrop-blur-xl transition-all duration-300 ease-in-out md:hidden"
        style={{ maxHeight: mobileOpen ? mobileHeight : 0, opacity: mobileOpen ? 1 : 0 }}
      >
        <div ref={mobileDrawerRef} className="mx-auto max-w-7xl px-4 py-4 space-y-1 sm:px-6">

          {/* User info card (if authenticated) */}
          {isAuthenticated && (
            <div className="flex items-center gap-3 rounded-2xl border border-border bg-muted/40 px-4 py-3 mb-3">
              <Avatar className="size-10 flex-shrink-0">
                {user?.profilePhoto ? (
                  <AvatarImage src={user.profilePhoto} alt={user.name} />
                ) : null}
                <AvatarFallback className="bg-gradient-to-br from-orange-400 to-orange-600 text-sm text-white font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">{user?.name}</p>
                <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>
          )}

          {/* Nav links */}
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                isActive(link.href)
                  ? "bg-orange-500/10 text-orange-600 dark:text-orange-400"
                  : "text-foreground hover:bg-secondary"
              )}
            >
              {link.label}
            </Link>
          ))}

          <div className="h-px bg-border my-2" />

          {/* Authenticated actions */}
          {isAuthenticated ? (
            <>
              <Link
                href={dashboardPath}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
              >
                <LayoutDashboard className="size-4 text-orange-500" />
                My Dashboard
              </Link>
              <button
                onClick={handleSignOut}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
              >
                <LogOut className="size-4" />
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
              >
                <User className="size-4 text-orange-500" />
                Log in
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileOpen(false)}
                className="mt-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 py-3 text-sm font-semibold text-white shadow-md shadow-orange-500/20"
              >
                <Compass className="size-4" />
                Get started
              </Link>
            </>
          )}

          {/* Bottom padding so last item isn't clipped */}
          <div className="h-2" />
        </div>
      </div>
    </header>
  );
}
