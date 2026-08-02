import ProviderOrdersList from "@/components/provider/ProviderOrdersList";

export default function ProviderOrdersPage() {
  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold tracking-tight">Incoming Orders</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Review and manage rental requests for your gear.
      </p>
      <div className="mt-6">
        <ProviderOrdersList />
      </div>
    </div>
  );
}