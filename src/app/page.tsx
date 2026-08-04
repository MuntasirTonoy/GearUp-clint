import { Suspense } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import PublicShell from "@/components/shared/PublicShell";
import FeaturedGearGrid from "@/components/shared/FeaturedGearGrid";
import FeaturedGearSkeleton from "@/components/shared/FeaturedGearSkeleton";
import ScrollReveal from "@/components/shared/ScrollReveal";
import CountUp from "@/components/shared/CountUp";
import {
  ArrowRight,
  Tent,
  Bike,
  Snowflake,
  Waves,
  Shield,
  Star,
  Zap,
  Search,
  CalendarCheck,
  PackageCheck,
  Users,
  TrendingUp,
  Award,
  Clock,
} from "lucide-react";

export const dynamic = "force-dynamic";

const STATS = [
  { target: 2400, suffix: "+", label: "Gear items", Icon: Award },
  { target: 98, suffix: "%", label: "Satisfaction", Icon: Star },
  { target: 500, suffix: "+", label: "Providers", Icon: Users },
  { target: 4.9, suffix: "★", label: "Average rating", Icon: TrendingUp, isFloat: true },
];

const GEAR_ICONS = [
  { Icon: Tent,      label: "Camping", delay: "0s",   x: "7%",  y: "22%" },
  { Icon: Bike,      label: "Cycling", delay: "1.8s", x: "84%", y: "16%" },
  { Icon: Snowflake, label: "Winter",  delay: "3.2s", x: "10%", y: "65%" },
  { Icon: Waves,     label: "Water",   delay: "2.1s", x: "82%", y: "70%" },
];

const TRUST_BADGES = [
  { Icon: Shield, text: "Verified providers" },
  { Icon: Star,   text: "5-star rated" },
  { Icon: Zap,    text: "Instant booking" },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    Icon: Search,
    title: "Browse & Filter",
    description:
      "Search thousands of gear listings by category, location, and price.",
  },
  {
    step: "02",
    Icon: CalendarCheck,
    title: "Book by the Day",
    description:
      "Pick your rental dates, confirm the booking instantly, and pay securely through Stripe.",
  },
  {
    step: "03",
    Icon: PackageCheck,
    title: "Pick Up & Go",
    description:
      "Collect your gear from the local provider, enjoy your adventure, and return it when done.",
  },
];

export default function HomePage() {
  return (
    <PublicShell>
      {/* ────────────── HERO ────────────── */}
      <section className="relative min-h-[92vh] overflow-hidden flex items-center bg-zinc-100 text-zinc-900 dark:bg-zinc-950 dark:text-white transition-colors duration-300">
        {/* Animated background glows — distinct colors */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {/* Primary orb — orange */}
          <div
            className="absolute -top-32 left-1/4 h-[500px] w-[500px] -translate-x-1/2 rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(249,115,22,0.30) 0%, transparent 70%)",
              animation: "orb-drift 12s ease-in-out infinite",
            }}
          />
          {/* Secondary orb — violet/purple contrast */}
          <div
            className="absolute top-1/2 right-0 h-[420px] w-[420px] translate-x-1/4 -translate-y-1/2 rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(139,92,246,0.22) 0%, transparent 70%)",
              animation: "orb-drift-2 15s ease-in-out infinite",
              animationDelay: "3s",
            }}
          />
          {/* Tertiary orb — pink/rose contrast */}
          <div
            className="absolute bottom-0 left-1/3 h-[320px] w-[320px] rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(236,72,153,0.16) 0%, transparent 70%)",
              animation: "orb-drift 18s ease-in-out infinite",
              animationDelay: "6s",
            }}
          />
          {/* Top glow line — orange accent */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-zinc-400/20 dark:via-white/10 to-transparent" />
        </div>

        {/* Floating gear icons */}
        {GEAR_ICONS.map(({ Icon, label, delay, x, y }, i) => (
          <div
            key={label}
            className="pointer-events-none absolute hidden lg:block"
            style={{
              left: x,
              top: y,
              animation: `float ${6 + i * 0.5}s ease-in-out infinite`,
              animationDelay: delay,
            }}
          >
            <div
              className="flex h-14 w-14 items-center justify-center rounded-2xl border border-zinc-300/60 bg-white/70 shadow-lg shadow-orange-200/40 backdrop-blur-sm dark:border-white/10 dark:bg-white/5 dark:shadow-black/20"
              style={{
                animation: `icon-sway ${7 + i * 1.3}s ease-in-out infinite`,
                animationDelay: `${parseFloat(delay) + 0.5}s`,
              }}
            >
              <Icon className="h-6 w-6 text-emerald-500 dark:text-emerald-400 opacity-90" />
            </div>
          </div>
        ))}

        {/* Content */}
        <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-8 px-4 py-28 text-center sm:px-6 lg:px-8">
          {/* Live badge */}
          <div
            className="inline-flex animate-badge-pop items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-emerald-600 backdrop-blur-sm dark:text-emerald-400"
            style={{ animationDelay: "0ms" }}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            Rent. Explore. Repeat.
          </div>

          {/* Headline */}
          <h1
            className="max-w-4xl animate-fade-up text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-6xl lg:text-7xl"
            style={{ animationDelay: "120ms" }}
          >
            <span className="block">Rent Sports &amp;</span>
            <span
              className="block"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #f97316 0%, #a855f7 50%, #ec4899 100%)",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                animation: "shimmer 3s linear infinite",
              }}
            >
              Outdoor Gear Instantly
            </span>
          </h1>

          {/* Subline */}
          <p
            className="max-w-2xl animate-fade-up text-lg leading-relaxed text-zinc-500 dark:text-zinc-400"
            style={{ animationDelay: "220ms" }}
          >
            From camping tents to snowboards, borrow quality gear from trusted
            local providers — no commitment, no clutter.
          </p>

          {/* CTAs */}
          <div
            className="flex animate-fade-up flex-col gap-4 sm:flex-row"
            style={{ animationDelay: "320ms" }}
          >
            <Link
              href="/gear"
              className="group relative inline-flex h-12 items-center justify-center gap-2 overflow-hidden rounded-full bg-emerald-500 px-8 text-base font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:scale-[1.03] hover:bg-emerald-400 hover:shadow-emerald-500/50"
            >
              <span>Browse Gear</span>
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/register"
              className="inline-flex h-12 items-center justify-center rounded-full border border-zinc-300 bg-white/80 px-8 text-base font-semibold text-zinc-800 backdrop-blur-sm transition-all duration-300 hover:scale-[1.03] hover:border-zinc-400 hover:bg-white dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:border-white/30 dark:hover:bg-white/10"
            >
              Become a Provider
            </Link>
          </div>

          {/* Trust badges */}
          <div
            className="flex animate-fade-up flex-wrap items-center justify-center gap-3"
            style={{ animationDelay: "420ms" }}
          >
            {TRUST_BADGES.map(({ Icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white/70 px-4 py-1.5 text-sm text-zinc-600 backdrop-blur-sm dark:border-white/10 dark:bg-white/5 dark:text-zinc-400"
              >
                <Icon className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" />
                {text}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom fade */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* ────────────── STATS STRIP ────────────── */}
      <section className="border-y border-border bg-muted/40 dark:border-white/5 dark:bg-white/[0.02]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y divide-border md:grid-cols-4 md:divide-y-0">
          {STATS.map(({ target, suffix, label, Icon, isFloat }, idx) => (
            <ScrollReveal
              key={label}
              delay={idx * 100}
              direction="up"
              className="flex flex-col items-center gap-2 px-8 py-10 text-center"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 dark:text-emerald-400">
                <Icon className="h-5 w-5" />
              </span>
              <span className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
                {isFloat ? (
                  <span>4.9★</span>
                ) : (
                  <CountUp target={target} suffix={suffix} />
                )}
              </span>
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {label}
              </span>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ────────────── HOW IT WORKS ────────────── */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        {/* Background accent orb */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div
            className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20"
            style={{
              background: "radial-gradient(circle, rgba(249,115,22,0.3) 0%, transparent 70%)",
            }}
          />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <ScrollReveal direction="up" className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              <Clock className="h-3 w-3" />
              Simple 3-step process
            </span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
              How GearUp Works
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Getting your hands on great outdoor gear has never been this easy.
              No membership, no long-term commitment.
            </p>
          </ScrollReveal>

          {/* Steps grid */}
          <div className="relative mt-16 grid gap-8 md:grid-cols-3">
            {/* Connector line */}
            <div className="pointer-events-none absolute inset-x-0 top-[52px] hidden h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent md:block" />

            {HOW_IT_WORKS.map(({ step, Icon, title, description }, idx) => (
              <ScrollReveal
                key={step}
                direction="up"
                delay={idx * 150}
              >
                <div className="group relative flex flex-col items-center gap-5 rounded-2xl border border-border bg-card p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/10">
                  {/* Step icon */}
                  <div className="relative flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full border-2 border-emerald-500/40 bg-background shadow-md shadow-emerald-500/10 transition-all duration-300 group-hover:border-emerald-500 group-hover:shadow-emerald-500/20">
                    <Icon className="h-6 w-6 text-emerald-500 dark:text-emerald-400 transition-transform duration-300 group-hover:scale-110" />
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-black text-white shadow">
                      {step}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                      {title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {description}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* CTA */}
          <ScrollReveal direction="up" delay={300} className="mt-12 flex justify-center">
            <Link
              href="/gear"
              className="group inline-flex h-11 items-center gap-2 rounded-full bg-zinc-900 px-7 text-sm font-semibold text-white shadow transition-all duration-300 hover:scale-[1.03] hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
            >
              Start exploring gear
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* ────────────── FEATURED GEAR ────────────── */}
      <section className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Featured Gear
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Handpicked items ready for your next adventure.
            </p>
          </div>
          <Link
            href="/gear"
            className={cn(
              buttonVariants({ variant: "link" }),
              "group h-auto p-0 font-semibold"
            )}
          >
            View all
            <ArrowRight className="ml-1 size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </ScrollReveal>
        <ScrollReveal direction="up" delay={100} className="mt-8">
          <Suspense fallback={<FeaturedGearSkeleton />}>
            <FeaturedGearGrid />
          </Suspense>
        </ScrollReveal>
      </section>
    </PublicShell>
  );
}
