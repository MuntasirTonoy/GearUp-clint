"use client";

import { useState, useEffect } from "react";
import { Rental, Meta } from "@/types";
import { AdminService } from "@/services/admin.service";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/utils/api";
import { formatCurrency } from "@/utils/format";

export default function AdminRentalsPage() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [rentalsMeta, setRentalsMeta] = useState<Meta | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [rentalsPage, setRentalsPage] = useState(1);

  const fetchRentals = async (page: number) => {
    try {
      setLoading(true);
      const res = await AdminService.getRentals({ page, limit: 10 });
      setRentals(res.rentals);
      setRentalsMeta(res.meta);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRentals(rentalsPage);
  }, [rentalsPage]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Rental Transactions</h1>
        <p className="text-muted-foreground mt-2">
          Monitor all rental transactions across the platform.
        </p>
      </div>

      <div className="rounded-md border bg-card text-card-foreground">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Gear</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Customer</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Dates</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Total</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {loading && rentals.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-muted-foreground">Loading rentals...</td>
                </tr>
              ) : rentals.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-muted-foreground">No rentals found.</td>
                </tr>
              ) : (
                rentals.map((rental) => (
                  <tr key={rental.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <td className="p-4 align-middle font-medium truncate max-w-[200px]">{rental.gear?.name || "N/A"}</td>
                    <td className="p-4 align-middle text-muted-foreground">{rental.customer?.name || "N/A"}</td>
                    <td className="p-4 align-middle text-xs">
                      {new Date(rental.startDate).toLocaleDateString()} - {new Date(rental.endDate).toLocaleDateString()}
                    </td>
                    <td className="p-4 align-middle font-semibold">{formatCurrency(rental.orderAmount)}</td>
                    <td className="p-4 align-middle">
                      <Badge variant="secondary">{rental.status}</Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {rentalsMeta && rentalsMeta.totalPages && rentalsMeta.totalPages > 1 && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="text-sm text-muted-foreground mr-4">
            Page {rentalsMeta.page} of {rentalsMeta.totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setRentalsPage((p) => Math.max(1, p - 1))}
            disabled={rentalsPage === 1 || loading}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous Page</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setRentalsPage((p) => p + 1)}
            disabled={rentalsPage >= rentalsMeta.totalPages || loading}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next Page</span>
          </Button>
        </div>
      )}
    </div>
  );
}
