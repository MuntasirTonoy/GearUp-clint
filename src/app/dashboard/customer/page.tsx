import MyRentalsList from "@/components/dashboard/MyRentalsList";
import DashboardUserInfoCard from "@/components/dashboard/DashboardUserInfoCard";

export default function CustomerDashboardPage() {
  return (
    <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Customer Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Welcome back! Manage your rentals and payments below.
        </p>
      </div>
      
      <DashboardUserInfoCard />
      
      <div className="mt-8">
        <MyRentalsList />
      </div>
    </div>
  );
}
