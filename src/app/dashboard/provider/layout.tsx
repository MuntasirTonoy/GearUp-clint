import Link from "next/link";
import SignOutButton from "@/components/auth/SignOutButton";
import ProviderSidebar from "@/components/ProviderSidebar";

export default function ProviderDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <header className="flex items-center justify-between border-b bg-background px-6 py-3">
        <Link href="/" className="text-base font-semibold">
          GearUp
        </Link>
        <SignOutButton />
      </header>
      <main className="flex flex-1">
        <ProviderSidebar />
        <div className="flex-1">{children}</div>
      </main>
    </div>
  );
}