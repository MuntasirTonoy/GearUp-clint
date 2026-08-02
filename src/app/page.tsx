import { Suspense } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import PublicShell from "@/components/shared/PublicShell";
import FeaturedGearGrid from "@/components/shared/FeaturedGearGrid";
import FeaturedGearSkeleton from "@/components/shared/FeaturedGearSkeleton";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <PublicShell>
      <section className="relative overflow-hidden bg-zinc-900 text-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-500/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-64 w-64 translate-x-1/3 translate-y-1/3 rounded-full bg-sky-500/20 blur-3xl" />
        </div>

        <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-24 text-center sm:px-6 sm:py-32 lg:px-8">
          <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-zinc-200">
            Rent. Explore. Repeat.
          </span>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Rent Sports &amp; Outdoor Gear Instantly
          </h1>
          <p className="max-w-xl text-lg text-zinc-300">
            From camping tents to snowboards, borrow quality gear from trusted
            local providers — no commitment, no clutter.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/gears"
              className={cn(
                buttonVariants({ variant: "default" }),
                "h-11 bg-emerald-500 px-6 text-base text-white hover:bg-emerald-400"
              )}
            >
              Browse Gear
            </Link>
            <Link
              href="/register"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-11 border-white/25 bg-white/10 px-6 text-base text-white hover:bg-white/20 hover:text-white"
              )}
            >
              Become a Provider
            </Link>
          </div>
          <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 pt-4 text-sm text-zinc-400">
            <li>Quality gear</li>
            <li>Local providers</li>
            <li>Flexible daily rentals</li>
          </ul>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Featured Gear
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Handpicked items ready for your next adventure.
            </p>
          </div>
          <Link
            href="/gears"
            className={cn(
              buttonVariants({ variant: "link" }),
              "h-auto p-0 font-semibold"
            )}
          >
            View all
          </Link>
        </div>
        <div className="mt-8">
          <Suspense fallback={<FeaturedGearSkeleton />}>
            <FeaturedGearGrid />
          </Suspense>
        </div>
      </section>
    </PublicShell>
  );
}
