import CartList from "@/components/dashboard/CartList";

export default function CustomerCartPage() {
  return (
    <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold tracking-tight">Cart</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Review your pending rentals and proceed to payment.
      </p>
      <div className="mt-6">
        <CartList />
      </div>
    </div>
  );
}
