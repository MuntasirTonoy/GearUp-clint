import AdminSidebar from "@/components/dashboard/AdminSidebar";
import DashboardMobileNav from "@/components/dashboard/DashboardMobileNav";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <DashboardMobileNav type="admin" />

      <div className="flex flex-1">
        <AdminSidebar />
        <div className="flex-1 min-w-0 overflow-auto p-4 sm:p-8">{children}</div>
      </div>
    </div>
  );
}
