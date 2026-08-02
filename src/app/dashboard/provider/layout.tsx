import ProviderSidebar from "@/components/ProviderSidebar";
import DashboardMobileNav from "@/components/dashboard/DashboardMobileNav";

export default function ProviderDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <DashboardMobileNav type="provider" />

      <div className="flex flex-1">
        <ProviderSidebar />
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}