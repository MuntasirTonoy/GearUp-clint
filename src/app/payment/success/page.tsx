import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import PublicShell from "@/components/shared/PublicShell";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Payment successful",
};

export default function PaymentSuccessPage() {
  return (
    <PublicShell>
      <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 py-24 text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-emerald-500/15">
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
        <div className="flex flex-col gap-3 sm:flex-row">
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
      </div>
    </PublicShell>
  );
}
