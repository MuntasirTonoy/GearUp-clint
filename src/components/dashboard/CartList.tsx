"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { CalendarDays, CreditCard, Package, ShoppingCart } from "lucide-react";
import { RentalService } from "@/services/rental.service";
import { PaymentService } from "@/services/payment.service";
import { formatCurrency } from "@/utils/format";
import { getApiErrorMessage } from "@/utils/api";
import type { Rental } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export default function CartList() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchRentals = useCallback(async (): Promise<Rental[]> => {
    const result = await RentalService.getMyRentals();
    return result.rentals.filter((r) => r.status === "PLACED");
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

  const handleCancel = async (id: string) => {
    try {
      await RentalService.cancelRental(id);
      toast.success("Item removed from cart (Cancelled)");
      setRentals((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[0, 1].map((index) => (
          <Skeleton key={index} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card py-10 text-center">
        <p className="text-sm text-muted-foreground">
          We couldn&apos;t load your cart.
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
        <ShoppingCart className="size-10 text-muted-foreground" />
        <div className="space-y-1">
          <p className="font-semibold">Your cart is empty</p>
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

  const totalPayable = rentals.reduce((acc, curr) => acc + curr.totalAmount, 0);

  return (
    <div className="space-y-8">
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Package className="size-5" />
              Pending Payments
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              You must checkout these items individually.
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Total Payable</p>
            <p className="text-2xl font-bold text-emerald-600">{formatCurrency(totalPayable)}</p>
          </div>
        </div>
        
        <div className="space-y-3">
          {rentals.map((rental) => (
            <CartRow 
              key={rental.id} 
              rental={rental} 
              onCancel={() => handleCancel(rental.id)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

function CartRow({ rental, onCancel }: { rental: Rental; onCancel: () => void }) {
  const [isPaying, setIsPaying] = useState(false);

  const handlePay = async () => {
    setIsPaying(true);
    try {
      toast.loading("Redirecting to payment...", { id: `pay-${rental.id}` });
      const session = await PaymentService.initiatePayment(rental.id);
      toast.dismiss(`pay-${rental.id}`);
      window.location.href = session.url;
    } catch (err) {
      toast.dismiss(`pay-${rental.id}`);
      toast.error(getApiErrorMessage(err));
      setIsPaying(false);
    }
  };

  return (
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
        <Badge className="bg-yellow-400 text-black">Placed</Badge>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onCancel}
          className="text-destructive hover:bg-destructive/10"
        >
          Cancel
        </Button>
        <Button
          type="button"
          size="sm"
          onClick={handlePay}
          disabled={isPaying}
          className="gap-1.5 bg-emerald-500 text-white hover:bg-emerald-400"
        >
          <CreditCard className="size-4" />
          {isPaying ? "Processing..." : "Pay Now"}
        </Button>
      </div>
    </div>
  );
}
