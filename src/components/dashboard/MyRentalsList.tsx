"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, CreditCard, Package, Star } from "lucide-react";
import { RentalService } from "@/services/rental.service";
import { formatCurrency } from "@/utils/format";
import type { Rental, RentalStatus } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import ReviewModal from "./ReviewModal";

const STATUS_LABELS: Record<RentalStatus, string> = {
  PLACED: "Placed",
  CONFIRMED: "Confirmed",
  PAID: "Paid",
  CANCELLED: "Cancelled",
  PICKED_UP: "Picked up",
  RETURNED: "Returned",
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
          <p className="font-semibold">No rentals yet</p>
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
          <p className="truncate font-semibold">
            {rental.gear?.name ?? "Gear rental"}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-4" />
              {formatDate(rental.startDate)} &rarr; {formatDate(rental.endDate)}
            </span>
            <span>
              {rental.totalDays} day{rental.totalDays === 1 ? "" : "s"}
            </span>
            <span className="font-semibold text-foreground">
              {formatCurrency(rental.totalAmount)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge
            className={
              rental.status === "CONFIRMED"
                ? "bg-blue-500 text-white"
                : rental.status === "PLACED"
                  ? "bg-yellow-400 text-black"
                  : rental.status === "PAID"
                    ? "bg-purple-500 text-white"
                    : rental.status === "PICKED_UP"
                      ? "bg-green-500 text-white"
                      : undefined
            }
          >
            {STATUS_LABELS[rental.status]}
          </Badge>
          {rental.status === "CONFIRMED" && (
            <Link
              href={`/checkout/${rental.id}`}
              className={cn(
                "inline-flex h-9 items-center justify-center gap-1.5 rounded-md bg-emerald-500 px-3 text-sm font-medium text-white transition-colors hover:bg-emerald-400"
              )}
            >
              <CreditCard className="size-4" />
              Pay now
            </Link>
          )}
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
          gearId={rental.gear.id}
        />
      )}
    </>
  );
}
