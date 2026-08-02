import type { Metadata } from "next";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import PublicShell from "@/components/shared/PublicShell";

export const metadata: Metadata = {
  title: "Browse Gear",
};

export default function BrowseGearPage() {
  return (
    <PublicShell>
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-24 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Browse Gear</h1>
        <p className="max-w-md text-sm text-muted-foreground">
          Search and filtering for the full gear catalog is coming soon.
        </p>
        <Link
          href="/"
          className={cn(buttonVariants({ variant: "link" }), "mt-2 font-semibold")}
        >
          Back to home
        </Link>
      </div>
    </PublicShell>
  );
}
