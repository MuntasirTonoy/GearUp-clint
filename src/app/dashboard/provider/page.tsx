"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, ClipboardList, Banknote, Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import DashboardUserInfoCard from "@/components/dashboard/DashboardUserInfoCard";
import api from "@/lib/axios";

interface ProviderStats {
  totalListings: number;
  pendingRequests: number;
}

function StatCard({
  label,
  value,
  icon: Icon,
  colorClass,
  isLoading,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  colorClass: string;
  isLoading: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 flex items-start gap-4">
      <div className={cn("flex size-10 items-center justify-center rounded-xl shrink-0", colorClass)}>
        <Icon className="size-5" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        {isLoading ? (
          <Skeleton className="mt-1 h-9 w-16" />
        ) : (
          <p className="mt-1 text-3xl font-bold">{value}</p>
        )}
      </div>
    </div>
  );
}

export default function ProviderOverviewPage() {
  const [stats, setStats] = useState<ProviderStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    api
      .get<{ data: ProviderStats }>("/providers/stats")
      .then(({ data }) => {
        if (active) setStats(data.data);
      })
      .catch(() => {
        if (active) setStats({ totalListings: 0, pendingRequests: 0 });
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

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
        <StatCard
          label="Total Listings"
          value={stats?.totalListings ?? 0}
          icon={Package}
          colorClass="bg-blue-500/10 text-blue-600"
          isLoading={isLoading}
        />
        <StatCard
          label="Pending Requests"
          value={stats?.pendingRequests ?? 0}
          icon={ClipboardList}
          colorClass="bg-amber-500/10 text-amber-600"
          isLoading={isLoading}
        />
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/dashboard/provider/orders"
          className={cn(
            buttonVariants(),
            "inline-flex items-center gap-2 bg-amber-500 text-white hover:bg-amber-400"
          )}
        >
          <ClipboardList className="size-4" />
          View Orders
        </Link>
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
        <Link
          href="/dashboard/provider/gear/new"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "inline-flex items-center gap-2"
          )}
        >
          <Plus className="size-4" />
          Add New Gear
        </Link>
        <Link
          href="/dashboard/provider/earnings"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "inline-flex items-center gap-2"
          )}
        >
          <Banknote className="size-4" />
          View Earnings
        </Link>
      </div>
    </div>
  );
}