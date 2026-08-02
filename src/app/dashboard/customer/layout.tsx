import CustomerSidebar from "@/components/dashboard/CustomerSidebar";
import DashboardMobileNav from "@/components/dashboard/DashboardMobileNav";

export default function CustomerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      {/* Mobile-only tab bar — plain string prop, safe for RSC */}
      <DashboardMobileNav type="customer" />

      {/* Desktop: sidebar + content side by side */}
      <div className="flex flex-1">
        <CustomerSidebar />
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}
