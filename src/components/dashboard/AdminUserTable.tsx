"use client";

import { useState, useEffect } from "react";
import { User, Meta } from "@/types";
import { AdminService } from "@/services/admin.service";
import { useDebounce } from "@/hooks/useDebounce";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, ChevronLeft, ChevronRight, UserX, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/utils/api";

export default function AdminUserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [meta, setMeta] = useState<Meta | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 400);
  const [page, setPage] = useState(1);

  const fetchUsers = async (currentPage: number, search: string) => {
    try {
      setLoading(true);
      const res = await AdminService.getUsers({
        page: currentPage,
        limit: 10,
        searchTerm: search || undefined,
      });
      setUsers(res.users);
      setMeta(res.meta);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(1, debouncedSearch);
    setPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    if (page !== 1) {
      fetchUsers(page, debouncedSearch);
    }
  }, [page]);

  const handleToggleSuspension = async (user: User) => {
    try {
      const updatedUser = await AdminService.toggleUserSuspension(user.id, !user.isSuspended);
      setUsers((prev) =>
        prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
      );
      toast.success(
        `${updatedUser.name} has been ${
          updatedUser.isSuspended ? "suspended" : "activated"
        }.`
      );
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search users..."
            className="pl-8"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <div className="rounded-md border bg-card text-card-foreground">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Email</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Role</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-muted-foreground">
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-muted-foreground">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                  >
                    <td className="p-4 align-middle font-medium">{user.name}</td>
                    <td className="p-4 align-middle text-muted-foreground">{user.email}</td>
                    <td className="p-4 align-middle">
                      <Badge variant="outline">{user.role}</Badge>
                    </td>
                    <td className="p-4 align-middle">
                      {user.isSuspended ? (
                        <Badge className="bg-red-500 text-white hover:bg-red-600">Suspended</Badge>
                      ) : (
                        <Badge className="bg-green-500 text-white hover:bg-green-600">Active</Badge>
                      )}
                    </td>
                    <td className="p-4 align-middle text-right">
                      <Button
                        variant={user.isSuspended ? "default" : "destructive"}
                        size="sm"
                        onClick={() => handleToggleSuspension(user)}
                        className="gap-2"
                      >
                        {user.isSuspended ? (
                          <>
                            <UserCheck className="size-4" /> Activate
                          </>
                        ) : (
                          <>
                            <UserX className="size-4" /> Suspend
                          </>
                        )}
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {meta && meta.totalPages && meta.totalPages > 1 && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="text-sm text-muted-foreground mr-4">
            Page {meta.page} of {meta.totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || loading}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous Page</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= meta.totalPages || loading}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next Page</span>
          </Button>
        </div>
      )}
    </div>
  );
}
