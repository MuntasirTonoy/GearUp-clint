import Link from "next/link";
import SignOutButton from "@/components/auth/SignOutButton";
import AdminSidebar from "@/components/dashboard/AdminSidebar";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <header className="flex items-center justify-between border-b bg-background px-6 py-3">
        <Link href="/" className="text-base font-semibold text-emerald-600 dark:text-emerald-500">
          GearUp Admin
        </Link>
        <SignOutButton />
      </header>
      <main className="flex flex-1">
        <AdminSidebar />
        <div className="flex-1 overflow-auto p-8">{children}</div>
      </main>
    </div>
  );
}
