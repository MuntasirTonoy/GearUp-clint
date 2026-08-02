import PaymentHistoryList from "@/components/dashboard/PaymentHistoryList";

export default function CustomerPaymentsPage() {
  return (
    <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold tracking-tight">Payments</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        View your payment history and transaction details.
      </p>
      <PaymentHistoryList />
    </div>
  );
}
