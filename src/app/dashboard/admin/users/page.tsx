import AdminUserTable from "@/components/dashboard/AdminUserTable";

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage platform users, including customers and providers.
        </p>
      </div>
      
      <AdminUserTable />
    </div>
  );
}
