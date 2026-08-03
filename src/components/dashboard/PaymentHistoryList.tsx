"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { formatCurrency } from "@/utils/format";
import { PaymentService } from "@/services/payment.service";
import type { Payment } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export default function PaymentHistoryList() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    PaymentService.getMyPayments()
      .then((data) => {
        if (active) {
          const successPayments = data.filter(
            (p) => p.paymentStatus === "PAID" || p.paymentStatus === "REFUNDED"
          );
          setPayments(successPayments);
        }
      })
      .catch(() => {
        // error handling omitted for brevity, can show error state
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card py-16 text-center">
        <p className="font-semibold text-lg">No payment history</p>
        <p className="text-sm text-muted-foreground">You haven&apos;t made any payments yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 mt-6">
      {payments.map((payment) => (
        <Card key={payment.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center p-4 gap-4">
              {payment.rental?.gear?.images?.[0] && (
                <div className="relative h-16 w-24 overflow-hidden rounded-md shrink-0 border border-border">
                  <Image
                    src={payment.rental.gear.images[0]}
                    alt={payment.rental.gear.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate font-semibold">{payment.rental?.gear?.name}</p>
                  <Badge variant="outline" className="text-xs">
                    {payment.rental?.status}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {payment.rental && (
                    <span>
                      {formatDate(payment.rental.startDate)} &rarr; {formatDate(payment.rental.endDate)}
                    </span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  Transaction: {payment.transactionId?.slice(0, 12)}...
                </div>
              </div>
              
              <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 sm:gap-1 border-t sm:border-none pt-3 sm:pt-0">
                <div className="text-right">
                  <p className="font-bold">{formatCurrency(payment.amount)}</p>
                  <Badge
                    className={cn(
                      "mt-1",
                      payment.paymentStatus === "PAID"
                        ? "bg-emerald-500 text-white"
                        : payment.paymentStatus === "REFUNDED"
                        ? "bg-amber-500 text-white"
                        : payment.paymentStatus === "FAILED"
                        ? "bg-red-500 text-white"
                        : "bg-gray-500 text-white"
                    )}
                  >
                    {payment.paymentStatus}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
