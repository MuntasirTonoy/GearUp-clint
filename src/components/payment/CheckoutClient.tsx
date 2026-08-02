"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AlertTriangle, CheckCircle2, Package } from "lucide-react";
import { RentalService } from "@/services/rental.service";
import { getApiErrorMessage } from "@/utils/api";
import { formatCurrency } from "@/utils/format";
import type { Rental, RentalStatus } from "@/types";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import PayNowButton from "./PayNowButton";

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const STATUS_MESSAGES: Record<
  RentalStatus,
  { title: string; body: string } | null
> = {
  CONFIRMED: null,
  PLACED: {
    title: "Awaiting provider confirmation",
    body: "This booking is still awaiting confirmation from the provider. You'll be able to pay once it's confirmed.",
  },
  PAID: {
    title: "Already paid",
    body: "This booking has already been paid for. You can track it from your dashboard.",
  },
  CANCELLED: {
    title: "Booking cancelled",
    body: "This booking was cancelled, so no payment can be made for it.",
  },
  PICKED_UP: {
    title: "Booking in progress",
    body: "This rental has already been picked up, so no payment is required.",
  },
  RETURNED: {
    title: "Booking completed",
    body: "This rental has already been returned.",
  },
};

export default function CheckoutClient() {
  const params = useParams<{ rentalId: string }>();
  const rentalId = params.rentalId;

  const [rental, setRental] = useState<Rental | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    RentalService.getRental(rentalId)
      .then((data) => {
        if (active) setRental(data);
      })
      .catch((err) => {
        if (active) setError(getApiErrorMessage(err));
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [rentalId]);

  if (isLoading) {
    return (
      <Card className="mx-auto w-full max-w-2xl">
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="mx-auto w-full max-w-2xl">
        <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
          <AlertTriangle className="size-10 text-destructive" />
          <p className="text-sm text-muted-foreground">{error}</p>
          <Link
            href="/dashboard/customer"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Back to dashboard
          </Link>
        </CardContent>
      </Card>
    );
  }

  if (!rental) return null;

  const blocked = STATUS_MESSAGES[rental.status];
  if (blocked) {
    return (
      <Card className="mx-auto w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4 py-8 text-center">
          <CheckCircle2 className="size-10 text-muted-foreground" />
          <div className="space-y-1">
            <p className="font-semibold">{blocked.title}</p>
            <p className="text-sm text-muted-foreground">{blocked.body}</p>
          </div>
          <Link
            href="/dashboard/customer"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Back to dashboard
          </Link>
        </CardContent>
      </Card>
    );
  }

  const gearName = rental.gear?.name ?? "Gear rental";

  return (
    <div className="mx-auto grid w-full max-w-4xl gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <Card>
        <CardHeader>
          <CardTitle>Rental summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-lg font-bold">{gearName}</p>
              {rental.gear?.provider?.businessName && (
                <p className="text-sm text-muted-foreground">
                  {rental.gear.provider.businessName}
                </p>
              )}
            </div>
            <Badge className="bg-emerald-500 text-white">Confirmed</Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Start date</p>
              <p className="mt-1 font-semibold">
                {formatDate(rental.startDate)}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">End date</p>
              <p className="mt-1 font-semibold">{formatDate(rental.endDate)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Duration</p>
              <p className="mt-1 font-semibold">
                {rental.totalDays} day{rental.totalDays === 1 ? "" : "s"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Daily rate</p>
              <p className="mt-1 font-semibold">
                {rental.gear?.dailyRentalPrice
                  ? formatCurrency(rental.gear.dailyRentalPrice)
                  : "—"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="h-fit">
        <CardHeader>
          <CardTitle>Payment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 rounded-lg border border-border bg-muted/40 p-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Total</span>
              <span className="text-lg font-bold tabular-nums">
                {formatCurrency(rental.totalAmount)}
              </span>
            </div>
          </div>
          <PayNowButton rentalId={rental.id} />
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Package className="size-3.5" />
            You&apos;ll be redirected to Stripe to complete your payment
            securely.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
