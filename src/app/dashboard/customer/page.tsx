import MyRentalsList from "@/components/dashboard/MyRentalsList";

export default function CustomerDashboardPage() {
  return (
    <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold tracking-tight">Customer Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Manage your rentals and payments.
      </p>
      <div className="mt-6">
        <MyRentalsList />
      </div>
    </div>
  );
}
