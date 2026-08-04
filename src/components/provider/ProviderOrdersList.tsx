"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { CalendarDays, Package, RefreshCw, Check, X, Truck, RotateCcw } from "lucide-react";
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
  PLACED: "bg-gray-400 text-white",
  PAID: "bg-amber-500 text-white",
  CONFIRMED: "bg-blue-500 text-white",
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
  icon: React.ReactNode;
  title: string;
  status: RentalStatus;
  variant: "default" | "outline" | "destructive";
  className?: string;
}

const getActions = (rental: Rental): RentalAction[] => {
  // PLACED: customer hasn't paid yet — no provider action needed
  if (rental.status === 'PLACED') {
    return [];
  }
  // PAID: customer has paid — provider can now confirm or cancel (triggers refund)
  if (rental.status === 'PAID') {
    return [
      { icon: <Check className="size-4" />, title: "Confirm Order", status: "CONFIRMED", variant: "default", className: "bg-emerald-500 text-white hover:bg-emerald-400" },
      { icon: <X className="size-4" />, title: "Reject & Refund", status: "CANCELLED", variant: "destructive" },
    ];
  }
  if (rental.status === 'CONFIRMED') {
    return [
      { icon: <Truck className="size-4" />, title: "Mark Picked Up", status: "PICKED_UP", variant: "default", className: "bg-blue-500 text-white hover:bg-blue-400" },
      { icon: <X className="size-4" />, title: "Cancel", status: "CANCELLED", variant: "destructive" },
    ];
  }
  if (rental.status === 'PICKED_UP') {
    return [
      { icon: <RotateCcw className="size-4" />, title: "Mark Returned", status: "RETURNED", variant: "default", className: "bg-green-500 text-white hover:bg-green-400" },
    ];
  }
  return [];
};

export default function ProviderOrdersList() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());
  const [selectedCustomer, setSelectedCustomer] = useState<Rental["customer"] | null>(null);

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
            const actions = getActions(rental);
            const pending = pendingIds.has(rental.id);
            return (
              <tr
                key={rental.id}
                className="border-b border-border last:border-b-0 hover:bg-muted/50"
              >
                <td className="px-4 py-3">
                  <button
                    type="button"
                    className="text-left outline-none group focus-visible:underline cursor-pointer"
                    onClick={() => setSelectedCustomer(rental.customer)}
                  >
                    <div className="font-medium text-foreground group-hover:text-emerald-500 transition-colors">
                      {rental.customer?.name ?? "Customer"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {rental.customer?.email ?? ""}
                    </div>
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                    <span>{rental.gear?.name ?? "Gear"}</span>
                    <Badge variant="secondary" className="rounded-full px-1.5 py-0 text-[10px] font-semibold bg-orange-500/10 text-orange-600 border border-orange-500/20 shrink-0">
                      {rental.orderedQuantity} 
                    </Badge>
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
                  {formatCurrency(rental.orderAmount)}
                </td>
                <td className="px-4 py-3 text-right">
                  <Badge className={STATUS_COLORS[rental.status]}>
                    {STATUS_LABELS[rental.status]}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap justify-end gap-1.5">
                    {actions.map((action) => (
                      <Button
                        key={action.status}
                        type="button"
                        variant={action.variant}
                        size="icon"
                        className={`size-8 ${action.className ?? ""}`}
                        disabled={pending}
                        title={action.title}
                        onClick={() =>
                          handleStatusChange(rental.id, action.status)
                        }
                      >
                        {pending ? (
                          <RefreshCw className="size-3.5 animate-spin" />
                        ) : action.icon}
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

      {selectedCustomer && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedCustomer(null)}
        >
          <div 
            className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <h3 className="text-lg font-bold text-foreground">Customer Details</h3>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8 rounded-full"
                onClick={() => setSelectedCustomer(null)}
              >
                <X className="size-4" />
              </Button>
            </div>
            
            <div className="mt-6 flex flex-col items-center gap-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 font-bold text-xl uppercase">
                {selectedCustomer.profilePhoto ? (
                  <img
                    src={selectedCustomer.profilePhoto}
                    alt={selectedCustomer.name}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <span>
                    {selectedCustomer.name
                      ? selectedCustomer.name
                          .split(" ")
                          .map((p) => p[0])
                          .slice(0, 2)
                          .join("")
                      : "C"}
                  </span>
                )}
              </div>
              <div>
                <h4 className="text-xl font-bold text-foreground">{selectedCustomer.name ?? "Customer"}</h4>
                <p className="text-sm text-muted-foreground">Customer Account</p>
              </div>
            </div>

            <div className="mt-6 space-y-4 rounded-xl border border-border bg-muted/40 p-4 text-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground shrink-0">Email Address</span>
                <a 
                  href={`mailto:${selectedCustomer.email}`} 
                  className="font-medium text-foreground hover:text-emerald-500 transition-colors truncate"
                >
                  {selectedCustomer.email ?? "—"}
                </a>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground shrink-0">Mobile Number</span>
                {selectedCustomer.phone ? (
                  <a 
                    href={`tel:${selectedCustomer.phone}`} 
                    className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    {selectedCustomer.phone}
                  </a>
                ) : (
                  <span className="font-medium text-muted-foreground">Not provided</span>
                )}
              </div>
            </div>

            <div className="mt-6">
              <Button
                type="button"
                className="w-full bg-emerald-500 text-white hover:bg-emerald-400"
                onClick={() => setSelectedCustomer(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}