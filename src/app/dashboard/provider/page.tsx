import Link from "next/link";
import { Package } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import DashboardUserInfoCard from "@/components/dashboard/DashboardUserInfoCard";

export default function ProviderOverviewPage() {
  return (
    <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Provider Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Welcome back! Here&apos;s what&apos;s happening with your listings.
        </p>
      </div>

      <DashboardUserInfoCard />

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">Total Listings</p>
          <p className="mt-1 text-3xl font-bold">0</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">Pending Requests</p>
          <p className="mt-1 text-3xl font-bold">0</p>
        </div>
      </div>

      <div className="mt-8">
        <Link
          href="/dashboard/provider/gears"
          className={cn(
            buttonVariants(),
            "inline-flex items-center gap-2 bg-emerald-500 text-white hover:bg-emerald-400"
          )}
        >
          <Package className="size-4" />
          Manage My Gear
        </Link>
      </div>
    </div>
  );
}