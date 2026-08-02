import { CreditCard } from "lucide-react";

export default function CustomerPaymentsPage() {
  return (
    <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold tracking-tight">Payments</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        View your payment history and transaction details.
      </p>
      <div className="mt-6 flex flex-col items-center gap-3 rounded-xl border border-border bg-card py-16 text-center">
        <CreditCard className="size-10 text-muted-foreground" />
        <p className="font-semibold">Payment history coming soon</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          We&apos;re building out payment tracking. For now, visit your dashboard to see active rentals.
        </p>
      </div>
    </div>
  );
}
