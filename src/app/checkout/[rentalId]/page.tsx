import type { Metadata } from "next";
import PublicShell from "@/components/shared/PublicShell";
import CheckoutClient from "@/components/payment/CheckoutClient";

export const metadata: Metadata = {
  title: "Checkout",
};

export const dynamic = "force-dynamic";

export default function CheckoutPage() {
  return (
    <PublicShell>
      <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <CheckoutClient />
      </div>
    </PublicShell>
  );
}
