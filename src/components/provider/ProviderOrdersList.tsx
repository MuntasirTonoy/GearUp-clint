"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { CalendarDays, Package, RefreshCw } from "lucide-react";
import { RentalService } from "@/services/rental.service";
import { formatCurrency } from "@/utils/format";
import { getApiErrorMessage } from "@/utils/api";
import type { Rental, RentalStatus } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const STATUS_LABELS: Record<RentalStatus, string> = {
  PLACED: "Placed",
  CONFIRMED: "Confirmed",
  PAID: "Paid",
  CANCELLED: "Cancelled",
  PICKED_UP: "Picked up",
  RETURNED: "Returned",
};

const STATUS_COLORS: Partial<Record<RentalStatus, string>> = {
  PLACED: "bg-yellow-400 text-black",
  CONFIRMED: "bg-blue-500 text-white",
  PAID: "bg-purple-500 text-white",
  PICKED_UP: "bg-green-500 text-white",
  CANCELLED: "bg-red-500 text-white",
  RETURNED: "bg-gray-300 text-black",
};

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

interface RentalAction {
  label: string;
  status: RentalStatus;
  variant: "default" | "outline" | "destructive";
  className?: string;
}

const ACTION_MAP: Partial<Record<RentalStatus, RentalAction[]>> = {
  PLACED: [
    { label: "Confirm", status: "CONFIRMED", variant: "default", className: "bg-emerald-500 text-white hover:bg-emerald-400" },
    { label: "Reject", status: "CANCELLED", variant: "destructive" },
  ],
  PAID: [
    { label: "Mark Picked Up", status: "PICKED_UP", variant: "default", className: "bg-blue-500 text-white hover:bg-blue-400" },
  ],
  PICKED_UP: [
    { label: "Mark Returned", status: "RETURNED", variant: "default", className: "bg-green-500 text-white hover:bg-green-400" },
  ],
};

export default function ProviderOrdersList() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());

  const fetchRentals = useCallback(async (): Promise<Rental[]> => {
    const result = await RentalService.getProviderRentals();
    return result.rentals;
  }, []);

  useEffect(() => {
    let active = true;
    fetchRentals()
      .then((data) => {
        if (active) setRentals(data);
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
  }, [fetchRentals]);

  const handleRetry = async () => {
    setError(false);
    setIsLoading(true);
    try {
      const data = await fetchRentals();
      setRentals(data);
    } catch {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (rentalId: string, newStatus: RentalStatus) => {
    const prevStatus = rentals.find((r) => r.id === rentalId)?.status;

    setRentals((prev) =>
      prev.map((r) => (r.id === rentalId ? { ...r, status: newStatus } : r))
    );
    setPendingIds((prev) => new Set(prev).add(rentalId));

    try {
      const updated = await RentalService.updateRentalStatus(rentalId, newStatus);
      setRentals((prev) =>
        prev.map((r) => (r.id === rentalId ? { ...r, status: updated.status } : r))
      );
      toast.success(`Order moved to ${STATUS_LABELS[newStatus]}`);
    } catch (err) {
      setRentals((prev) =>
        prev.map((r) => (r.id === rentalId ? { ...r, status: prevStatus ?? r.status } : r))
      );
      toast.error(getApiErrorMessage(err));
    } finally {
      setPendingIds((prev) => {
        const next = new Set(prev);
        next.delete(rentalId);
        return next;
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[0, 1, 2, 3].map((index) => (
          <Skeleton key={index} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card py-10 text-center">
        <p className="text-sm text-muted-foreground">
          We couldn&apos;t load your incoming orders.
        </p>
        <Button type="button" variant="outline" onClick={handleRetry}>
          Try again
        </Button>
      </div>
    );
  }

  if (rentals.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card py-16 text-center">
        <Package className="size-10 text-muted-foreground" />
        <div className="space-y-1">
          <p className="font-semibold">No incoming orders</p>
          <p className="text-sm text-muted-foreground">
            Rental requests for your gear will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] table-auto">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">
              Customer
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">
              Gear
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">
              Dates
            </th>
            <th className="px-4 py-2 text-right text-xs font-medium text-muted-foreground">
              Amount
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
          {rentals.map((rental) => {
            const actions = ACTION_MAP[rental.status] ?? [];
            const pending = pendingIds.has(rental.id);
            return (
              <tr
                key={rental.id}
                className="border-b border-border last:border-b-0 hover:bg-muted/50"
              >
                <td className="px-4 py-3">
                  <div>
                    <div className="font-medium text-foreground">
                      {rental.customer?.name ?? "Customer"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {rental.customer?.email ?? ""}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm font-medium text-foreground">
                    {rental.gear?.name ?? "Gear"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {rental.totalDays} day{rental.totalDays === 1 ? "" : "s"}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <CalendarDays className="size-4 shrink-0" />
                    <span className="whitespace-nowrap">
                      {formatDate(rental.startDate)}
                    </span>
                    <span>&rarr;</span>
                    <span className="whitespace-nowrap">
                      {formatDate(rental.endDate)}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right font-semibold text-foreground">
                  {formatCurrency(rental.totalAmount)}
                </td>
                <td className="px-4 py-3 text-right">
                  <Badge
                    className={STATUS_COLORS[rental.status]}
                  >
                    {STATUS_LABELS[rental.status]}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap justify-end gap-2">
                    {actions.map((action) => (
                      <Button
                        key={action.status}
                        type="button"
                        variant={action.variant}
                        size="sm"
                        className={action.className}
                        disabled={pending}
                        onClick={() =>
                          handleStatusChange(rental.id, action.status)
                        }
                      >
                        {pending ? (
                          <RefreshCw className="size-3.5 animate-spin" />
                        ) : null}
                        {action.label}
                      </Button>
                    ))}
                    {actions.length === 0 && (
                      <span className="text-xs text-muted-foreground">
                        &mdash;
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}