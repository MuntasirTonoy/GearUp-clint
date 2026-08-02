import type { Metadata } from "next";
import Link from "next/link";
import RegisterForm from "@/components/auth/RegisterForm";
import { Mountain } from "lucide-react";

export const metadata: Metadata = {
  title: "Create account",
};

export default function RegisterPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-zinc-950 px-4 py-12">
      {/* Background orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-32 right-1/4 h-[500px] w-[500px] rounded-full opacity-30"
          style={{
            background: "radial-gradient(circle, rgba(16,185,129,0.5) 0%, transparent 70%)",
            animation: "orb-drift 14s ease-in-out infinite",
          }}
        />
        <div
          className="absolute bottom-0 left-1/4 h-[400px] w-[400px] rounded-full opacity-25"
          style={{
            background: "radial-gradient(circle, rgba(168,85,247,0.5) 0%, transparent 70%)",
            animation: "orb-drift-2 18s ease-in-out infinite",
            animationDelay: "5s",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
      </div>

      <div className="relative w-full max-w-2xl animate-scale-in" style={{ animationDelay: "60ms" }}>
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-2 text-center">
          <Link href="/" className="flex items-center gap-2.5 text-xl font-bold text-white">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/30">
              <Mountain className="size-5 text-white" />
            </span>
            GearUp
          </Link>
          <h1 className="mt-3 text-2xl font-bold text-white">Create your account</h1>
          <p className="text-sm text-zinc-400">
            Join as a customer or start listing your gear as a provider.
          </p>
        </div>

        {/* Form card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/40 backdrop-blur-xl">
          <RegisterForm />
        </div>

        <p className="mt-6 text-center text-sm text-zinc-500">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-emerald-400 transition-colors hover:text-emerald-300">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
