"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, Package, Star } from "lucide-react";
import { RentalService } from "@/services/rental.service";
import { formatCurrency } from "@/utils/format";
import type { Rental, RentalStatus } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import ReviewModal from "./ReviewModal";

const STATUS_LABELS: Record<RentalStatus, string> = {
  PLACED: "Order Placed",
  PAID: "Payment Received",
  CONFIRMED: "Confirmed",
  CANCELLED: "Cancelled",
  PICKED_UP: "Picked Up",
  RETURNED: "Returned",
};

const STATUS_COLORS: Record<RentalStatus, string> = {
  PLACED: "bg-yellow-400 text-black",
  PAID: "bg-amber-500 text-white",
  CONFIRMED: "bg-blue-500 text-white",
  CANCELLED: "bg-red-500 text-white",
  PICKED_UP: "bg-green-500 text-white",
  RETURNED: "bg-gray-300 text-black",
};

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export default function MyRentalsList() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchRentals = useCallback(async (): Promise<Rental[]> => {
    const result = await RentalService.getMyRentals();
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

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[0, 1, 2].map((index) => (
          <Skeleton key={index} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card py-10 text-center">
        <p className="text-sm text-muted-foreground">
          We couldn&apos;t load your rentals.
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
          <p className="font-semibold">No active rentals</p>
          <p className="text-sm text-muted-foreground">
            Browse gear and book your first rental.
          </p>
        </div>
        <Link
          href="/gear"
          className={cn(buttonVariants(), "bg-emerald-500 text-white hover:bg-emerald-400")}
        >
          Browse gear
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {rentals.map((rental) => (
        <RentalRow key={rental.id} rental={rental} />
      ))}
    </div>
  );
}

function RentalRow({ rental }: { rental: Rental }) {
  const [showReview, setShowReview] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <Link
              href={`/gear/${rental.gearId}`}
              className="truncate font-semibold text-foreground hover:text-orange-500 hover:underline transition-colors"
            >
              {rental.gear?.name ?? "Gear rental"}
            </Link>
            <Badge variant="secondary" className="rounded-full px-1.5 py-0 text-[10px] font-semibold bg-orange-500/10 text-orange-600 border border-orange-500/20 shrink-0">
              {rental.orderedQuantity}
            </Badge>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-4" />
              {formatDate(rental.startDate)} &rarr; {formatDate(rental.endDate)}
            </span>
            <span>
              {rental.totalDays} day{rental.totalDays === 1 ? "" : "s"}
            </span>
            <span className="font-semibold text-foreground">
              {formatCurrency(rental.orderAmount)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className={STATUS_COLORS[rental.status]}>
            {STATUS_LABELS[rental.status]}
          </Badge>

          {/* Pay Now: only show if order is placed and not yet paid */}
          {rental.status === "PLACED" && (
            <Link
              href={`/checkout/${rental.id}`}
              className={cn(buttonVariants({ size: "sm" }), "bg-emerald-500 text-white hover:bg-emerald-400")}
            >
              Pay Now
            </Link>
          )}

          {/* Leave Review: only after returned */}
          {rental.status === "RETURNED" && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowReview(true)}
              className="gap-1.5"
            >
              <Star className="size-4" />
              Leave Review
            </Button>
          )}
        </div>
      </div>

      {rental.gear && (
        <ReviewModal
          open={showReview}
          onClose={() => setShowReview(false)}
          gearName={rental.gear.name}
          gearId={rental.gearId}
        />
      )}
    </>
  );
}
