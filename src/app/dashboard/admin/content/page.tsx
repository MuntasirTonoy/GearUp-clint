import AdminContentTabs from "@/components/dashboard/AdminContentTabs";

export default function AdminContentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Platform Content</h1>
        <p className="text-muted-foreground mt-2">
          Inspect listings and transactions across the platform.
        </p>
      </div>
      
      <AdminContentTabs />
    </div>
  );
}
