import type { Metadata } from "next";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import PublicShell from "@/components/shared/PublicShell";

export const metadata: Metadata = {
  title: "Gear details",
};

export default async function GearDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <PublicShell>
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-24 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Gear details</h1>
        <p className="max-w-md text-sm text-muted-foreground">
          The full detail page for this item (id: {id}) is coming soon.
        </p>
        <Link
          href="/gears"
          className={cn(buttonVariants({ variant: "link" }), "mt-2 font-semibold")}
        >
          Back to browse
        </Link>
      </div>
    </PublicShell>
  );
}
