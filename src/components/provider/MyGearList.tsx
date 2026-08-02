"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/utils/api";
import { GearService } from "@/services/gear.service";
import type { Gear } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Trash2, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const STATUS_LABELS: Record<string, string> = {
  AVAILABLE: "Available",
  RENTED: "Rented",
  MAINTENANCE: "Maintenance",
  UNAVAILABLE: "Unavailable",
};

export default function MyGearList() {
  const [gears, setGears] = useState<Gear[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchGears = useCallback(async (): Promise<Gear[]> => {
    const result = await GearService.getMyGears();
    return result.gears;
  }, []);

  useEffect(() => {
    let active = true;
    fetchGears()
      .then((data) => {
        if (active) setGears(data);
      })
      .catch(() => {
        if (active) setError(true);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [fetchGears]);

  const handleRetry = async () => {
    setError(false);
    setIsLoading(true);
    try {
      const data = await fetchGears();
      setGears(data);
    } catch {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (gearId: string) => {
    if (!confirm("Are you sure you want to delete this gear listing?")) {
      return;
    }
    setDeletingId(gearId);
    try {
      await GearService.deleteGear(gearId);
      toast.success("Gear listing deleted successfully");
      setGears((prev) => prev.filter((g) => g.id !== gearId));
    } catch (err) {
      toast.error(getApiErrorMessage(err));
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[0, 1, 2].map((index) => (
          <Skeleton key={index} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card py-10 text-center">
        <p className="text-sm text-muted-foreground">
          We couldn&apos;t load your gear listings.
        </p>
        <Button type="button" variant="outline" onClick={handleRetry}>
          Try again
        </Button>
      </div>
    );
  }

  if (gears.length === 0) {
    return (
      <div className="space-y-4">
        <Link
          href="/dashboard/provider/gear/new"
          className={cn(buttonVariants(), "inline-flex items-center gap-2")}
        >
          <Plus className="size-4" />
          Add New Gear
        </Link>
        <div className="rounded-xl border border-border bg-card py-16 text-center">
          <p className="text-muted-foreground">No gear listings yet</p>
          <p className="mt-1 text-sm">
            Add your first gear to start receiving bookings.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Link
        href="/dashboard/provider/gear/new"
        className={cn(
          buttonVariants(),
          "inline-flex items-center gap-2 bg-emerald-500 text-white hover:bg-emerald-400"
        )}
      >
        <Plus className="size-4" />
        Add New Gear
      </Link>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] table-auto">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">
                Gear
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium text-muted-foreground">
                Price / day
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium text-muted-foreground">
                Quantity
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium text-muted-foreground">
                Status
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {gears.map((gear) => (
              <tr
                key={gear.id}
                className="border-b border-border last:border-b-0 hover:bg-muted/50"
              >
                <td className="px-4 py-2">
                  <div>
                    <div className="font-medium text-foreground">
                      {gear.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {gear.category?.name ?? "—"}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-2 text-right font-mono">
                  ${gear.dailyRentalPrice.toFixed(2)}
                </td>
                <td className="px-4 py-2 text-right">{gear.quantity}</td>
                <td className="px-4 py-2 text-right">
                  <Badge className="text-xs">{STATUS_LABELS[gear.status] ?? gear.status}</Badge>
                </td>
                <td className="px-4 py-2">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/dashboard/provider/gear/${gear.id}/edit`}
                      className={cn(
                        buttonVariants({ variant: "ghost", size: "sm" }),
                        "gap-1.5 text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50"
                      )}
                    >
                      Edit
                    </Link>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(gear.id)}
                      disabled={deletingId === gear.id}
                      className="gap-1.5 text-destructive hover:text-destructive"
                    >
                      {deletingId === gear.id ? "Deleting..." : (
                        <>
                          <Trash2 className="size-4" />
                          Delete
                        </>
                      )}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}