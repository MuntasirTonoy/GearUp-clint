"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CalendarDays, Package } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { RentalService } from "@/services/rental.service";
import { getApiErrorMessage } from "@/utils/api";
import { getDashboardPath } from "@/utils/auth";
import { formatCurrency } from "@/utils/format";
import type { Gear } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const DAY_MS = 86_400_000;

const toDateInputValue = (date: Date) => {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
};

type RentNowGear = Pick<
  Gear,
  "id" | "name" | "dailyRentalPrice" | "quantity" | "status"
>;

export default function RentNowWidget({ gear }: { gear: RentNowGear }) {
  const router = useRouter();

  const today = toDateInputValue(new Date());

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAvailable = gear.status === "AVAILABLE";

  const totalDays =
    startDate && endDate && endDate > startDate
      ? Math.round(
          (new Date(endDate).getTime() - new Date(startDate).getTime()) /
            DAY_MS
        )
      : 0;
  const totalAmount = totalDays * gear.dailyRentalPrice;

  const handleStartChange = (value: string) => {
    setStartDate(value);
    setEndDate((current) => (current && value >= current ? "" : current));
    setError(null);
  };

  const handleRent = async () => {
    if (!isAvailable) {
      setError("This item is not available for rent right now.");
      return;
    }
    if (!startDate || !endDate) {
      setError("Please choose both a start and an end date.");
      return;
    }
    if (endDate <= startDate) {
      setError("The end date must be after the start date.");
      return;
    }
    setError(null);

    const state = useAuthStore.getState();
    if (state.status === "idle") {
      await state.fetchMe();
    }
    const { status: authStatus } = useAuthStore.getState();
    if (authStatus !== "authenticated") {
      router.push(`/login?redirect=${encodeURIComponent(`/gear/${gear.id}`)}`);
      return;
    }

    setIsSubmitting(true);
    try {
      await RentalService.createRental({
        gearId: gear.id,
        startDate,
        endDate,
      });
      toast.success(`Rental for "${gear.name}" requested successfully!`);
      router.push(getDashboardPath("CUSTOMER"));
      router.refresh();
    } catch (err) {
      toast.error(getApiErrorMessage(err));
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="lg:sticky lg:top-20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold">
            {formatCurrency(gear.dailyRentalPrice)}
            <span className="text-sm font-normal text-muted-foreground">
              {" "}
              / day
            </span>
          </div>
          <Badge
            className={
              isAvailable
                ? "bg-emerald-500 text-white"
                : undefined
            }
          >
            {isAvailable ? "Available" : gear.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="start-date">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-4 text-muted-foreground" />
              Start date
            </span>
          </Label>
          <Input
            id="start-date"
            type="date"
            min={today}
            value={startDate}
            onChange={(event) => handleStartChange(event.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="end-date">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-4 text-muted-foreground" />
              End date
            </span>
          </Label>
          <Input
            id="end-date"
            type="date"
            min={startDate || today}
            value={endDate}
            onChange={(event) => {
              setEndDate(event.target.value);
              setError(null);
            }}
          />
        </div>

        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Package className="size-4" />
          {gear.quantity} available
        </div>

        {error && (
          <p
            role="alert"
            className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {error}
          </p>
        )}

        <div className="space-y-2 rounded-lg border border-border bg-muted/40 p-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Days</span>
            <span className="font-semibold tabular-nums">{totalDays}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Total</span>
            <span className="font-bold tabular-nums">
              {formatCurrency(totalAmount)}
            </span>
          </div>
        </div>

        <Button
          type="button"
          className="w-full bg-emerald-500 text-white hover:bg-emerald-400"
          onClick={handleRent}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Booking..." : "Rent Now"}
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          You&apos;ll be signed in to continue. Rentals are confirmed by the
          provider.
        </p>
      </CardContent>
    </Card>
  );
}
