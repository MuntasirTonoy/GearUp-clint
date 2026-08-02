"use client";

import { useState, useEffect } from "react";
import { Gear, Meta } from "@/types";
import { AdminService } from "@/services/admin.service";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/utils/api";
import { formatCurrency } from "@/utils/format";

export default function AdminGearsPage() {
  const [gears, setGears] = useState<Gear[]>([]);
  const [gearsMeta, setGearsMeta] = useState<Meta | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [gearsPage, setGearsPage] = useState(1);

  const fetchGears = async (page: number) => {
    try {
      setLoading(true);
      const res = await AdminService.getGears({ page, limit: 10 });
      setGears(res.gears);
      setGearsMeta(res.meta);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGears(gearsPage);
  }, [gearsPage]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gear Listings</h1>
        <p className="text-muted-foreground mt-2">
          Monitor all gear listings across the platform.
        </p>
      </div>

      <div className="rounded-md border bg-card text-card-foreground">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Provider</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Category</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Price</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {loading && gears.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-muted-foreground">Loading gears...</td>
                </tr>
              ) : gears.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-muted-foreground">No gears found.</td>
                </tr>
              ) : (
                gears.map((gear) => (
                  <tr key={gear.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <td className="p-4 align-middle font-medium truncate max-w-[200px]">{gear.name}</td>
                    <td className="p-4 align-middle text-muted-foreground">{gear.provider?.businessName || gear.provider?.user?.name || "N/A"}</td>
                    <td className="p-4 align-middle">{gear.category?.name || "N/A"}</td>
                    <td className="p-4 align-middle">{formatCurrency(gear.dailyRentalPrice)}/day</td>
                    <td className="p-4 align-middle">
                      <Badge variant="outline">{gear.status}</Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {gearsMeta && gearsMeta.totalPages && gearsMeta.totalPages > 1 && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="text-sm text-muted-foreground mr-4">
            Page {gearsMeta.page} of {gearsMeta.totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setGearsPage((p) => Math.max(1, p - 1))}
            disabled={gearsPage === 1 || loading}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous Page</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setGearsPage((p) => p + 1)}
            disabled={gearsPage >= gearsMeta.totalPages || loading}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next Page</span>
          </Button>
        </div>
      )}
    </div>
  );
}
