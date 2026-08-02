import MyRentalsList from "@/components/dashboard/MyRentalsList";

export default function CustomerRentalsPage() {
  return (
    <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold tracking-tight">My Rentals</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        View and manage all your gear rentals.
      </p>
      <div className="mt-6">
        <MyRentalsList />
      </div>
    </div>
  );
}
