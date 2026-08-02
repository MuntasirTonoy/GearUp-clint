import Link from "next/link";
import SignOutButton from "@/components/auth/SignOutButton";

export default function DashboardLayout({
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
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
