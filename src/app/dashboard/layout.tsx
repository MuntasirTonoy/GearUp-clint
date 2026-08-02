import Link from "next/link";
import SignOutButton from "@/components/auth/SignOutButton";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
