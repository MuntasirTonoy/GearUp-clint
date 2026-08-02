import type { Metadata } from "next";
import Link from "next/link";
import LoginForm from "@/components/auth/LoginForm";
import { Mountain, Tent, Bike, Snowflake } from "lucide-react";

export const metadata: Metadata = {
  title: "Sign in",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string | string[] }>;
}) {
  const { redirect } = await searchParams;
  const redirectTo = Array.isArray(redirect) ? redirect[0] : redirect;

  return (
    <div className="flex min-h-screen">
      {/* ── Left panel — visual / brand ── */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-zinc-950 p-12 lg:flex">
        {/* Background orbs */}
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute -top-24 left-0 h-[450px] w-[450px] rounded-full opacity-40"
            style={{
              background: "radial-gradient(circle, rgba(16,185,129,0.5) 0%, transparent 70%)",
              animation: "orb-drift 12s ease-in-out infinite",
            }}
          />
          <div
            className="absolute bottom-0 right-0 h-[350px] w-[350px] rounded-full opacity-30"
            style={{
              background: "radial-gradient(circle, rgba(59,130,246,0.5) 0%, transparent 70%)",
              animation: "orb-drift-2 15s ease-in-out infinite",
              animationDelay: "4s",
            }}
          />
          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        {/* Logo */}
        <Link href="/" className="relative flex items-center gap-2.5 text-lg font-bold text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/30">
            <Mountain className="size-4 text-white" />
          </span>
          <span className="bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            GearUp
          </span>
        </Link>

        {/* Center hero content */}
        <div className="relative flex flex-col items-center gap-8 text-center">
          {/* Floating gear cards */}
          <div className="relative h-52 w-full">
            {[
              { Icon: Tent, label: "Camping", rotate: "-12deg", x: "5%", y: "10%", delay: "0s" },
              { Icon: Bike, label: "Cycling", rotate: "6deg", x: "72%", y: "5%", delay: "2s" },
              { Icon: Snowflake, label: "Winter", rotate: "-5deg", x: "30%", y: "45%", delay: "1s" },
            ].map(({ Icon, label, rotate, x, y, delay }) => (
              <div
                key={label}
                className="absolute flex flex-col items-center gap-1.5 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm shadow-xl"
                style={{
                  left: x,
                  top: y,
                  transform: `rotate(${rotate})`,
                  animation: `float 6s ease-in-out infinite`,
                  animationDelay: delay,
                }}
              >
                <Icon className="h-8 w-8 text-emerald-400" />
                <span className="text-xs font-medium text-zinc-300">{label}</span>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-white">
              Gear for every adventure
            </h2>
            <p className="text-sm leading-relaxed text-zinc-400">
              2,400+ items from 500+ trusted providers.<br />
              Book daily. Return easy.
            </p>
          </div>

          {/* Stats row */}
          <div className="flex gap-6 text-center">
            {[
              { v: "4.9★", l: "Rating" },
              { v: "98%", l: "Satisfaction" },
              { v: "24h", l: "Support" },
            ].map(({ v, l }) => (
              <div key={l} className="flex flex-col gap-0.5">
                <span className="text-lg font-bold text-emerald-400">{v}</span>
                <span className="text-xs text-zinc-500">{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer quote */}
        <p className="relative text-xs text-zinc-600">
          &ldquo;The best gear is gear you didn&rsquo;t have to buy.&rdquo;
        </p>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex flex-1 flex-col items-center justify-center bg-zinc-950 px-6 py-12 lg:bg-zinc-900">
        {/* Mobile logo */}
        <Link href="/" className="mb-8 flex items-center gap-2 text-lg font-bold text-white lg:hidden">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600">
            <Mountain className="size-4 text-white" />
          </span>
          GearUp
        </Link>

        <div className="w-full max-w-sm animate-scale-in" style={{ animationDelay: "100ms" }}>
          {/* Header */}
          <div className="mb-8 space-y-1.5">
            <h1 className="text-2xl font-bold text-white">Welcome back</h1>
            <p className="text-sm text-zinc-400">Sign in to manage your gear rentals.</p>
          </div>

          <LoginForm redirectTo={redirectTo} />

          {/* Divider & Register */}
          <div className="mt-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs text-zinc-600">or</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <p className="mt-4 text-center text-sm text-zinc-500">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold text-emerald-400 hover:text-emerald-300 transition-colors">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
