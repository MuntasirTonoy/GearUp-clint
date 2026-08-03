import { Metadata } from "next";
import { Banknote } from "lucide-react";
import ProviderEarningsList from "@/components/provider/ProviderEarningsList";

export const metadata: Metadata = {
  title: "My Earnings | GearUp Provider",
  description: "View all payments received for your gear rentals, search by transaction ID.",
};

export default function ProviderEarningsPage() {
  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10">
            <Banknote className="size-5 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Earnings</h1>
            <p className="text-sm text-muted-foreground">
              All payments received from your rental orders
            </p>
          </div>
        </div>

        <ProviderEarningsList />
      </div>
    </div>
  );
}
