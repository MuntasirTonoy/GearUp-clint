"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import PublicShell from "@/components/shared/PublicShell";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PaymentService } from "@/services/payment.service";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState<"confirming" | "success" | "error">("confirming");

  useEffect(() => {
    if (!sessionId) {
      setStatus("success"); // fallback if page is visited directly without session
      return;
    }

    PaymentService.confirmPaymentSession(sessionId)
      .then((res) => {
        if (res.success) {
          setStatus("success");
        } else {
          setStatus("error");
        }
      })
      .catch(() => {
        setStatus("error");
      });
  }, [sessionId]);

  return (
    <PublicShell>
      <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 py-24 text-center">
        {status === "confirming" && (
          <>
            <span className="flex size-16 items-center justify-center rounded-full bg-orange-500/15">
              <Loader2 className="size-9 animate-spin text-orange-500" />
            </span>
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight">
                Verifying your payment...
              </h1>
              <p className="mx-auto max-w-md text-muted-foreground">
                Please wait a moment while we secure and verify your transaction.
              </p>
            </div>
          </>
        )}

        {status === "success" && (
          <>
            <span className="flex size-16 items-center justify-center rounded-full bg-emerald-500/15 animate-bounce">
              <CheckCircle2 className="size-9 text-emerald-500" />
            </span>
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight">
                Payment successful
              </h1>
              <p className="mx-auto max-w-md text-muted-foreground">
                Your rental has been paid for. Track its progress from your
                dashboard.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row mt-2">
              <Link
                href="/dashboard/customer"
                className={cn(
                  buttonVariants(),
                  "bg-emerald-500 text-white hover:bg-emerald-400"
                )}
              >
                Go to my dashboard
              </Link>
              <Link
                href="/gear"
                className={cn(buttonVariants({ variant: "outline" }))}
              >
                Browse more gear
              </Link>
            </div>
          </>
        )}

        {status === "error" && (
          <>
            <span className="flex size-16 items-center justify-center rounded-full bg-red-500/15">
              <AlertCircle className="size-9 text-red-500" />
            </span>
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight">
                Verification issue
              </h1>
              <p className="mx-auto max-w-md text-muted-foreground">
                We could not verify this checkout session. If you have completed the payment, it will be updated shortly via webhook.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row mt-2">
              <Link
                href="/dashboard/customer"
                className={cn(
                  buttonVariants(),
                  "bg-orange-500 text-white hover:bg-orange-600"
                )}
              >
                Go to my dashboard
              </Link>
              <Link
                href="/gear"
                className={cn(buttonVariants({ variant: "outline" }))}
              >
                Try again
              </Link>
            </div>
          </>
        )}
      </div>
    </PublicShell>
  );
}
