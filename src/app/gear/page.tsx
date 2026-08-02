import { Suspense } from "react";
import type { Metadata } from "next";
import PublicShell from "@/components/shared/PublicShell";
import GearFilters from "@/components/gear/GearFilters";
import GearGridSection from "@/components/gear/GearGridSection";
import GearGridSkeleton from "@/components/gear/GearGridSkeleton";

export const metadata: Metadata = {
  title: "Browse Gear",
};

export const dynamic = "force-dynamic";

export default async function GearBrowsePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;

  return (
    <PublicShell>
      <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Browse Gear</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Rent sports and outdoor gear on demand from trusted local
            providers.
          </p>
        </div>
        <div className="flex flex-col gap-8 lg:flex-row">
          <aside className="w-full shrink-0 lg:w-64">
            <GearFilters />
          </aside>
          <div className="min-w-0 flex-1">
            <Suspense fallback={<GearGridSkeleton />}>
              <GearGridSection searchParams={params} />
            </Suspense>
          </div>
        </div>
      </div>
    </PublicShell>
  );
}
