"use client";

import { useState, useEffect } from "react";
import { Gear, Rental, Meta, Category } from "@/types";
import { AdminService } from "@/services/admin.service";
import { CategoryService } from "@/services/category.service";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/utils/api";
import { formatCurrency } from "@/utils/format";

export default function AdminContentTabs() {
  const [activeTab, setActiveTab] = useState<"gears" | "rentals" | "categories">("gears");
  const [gears, setGears] = useState<Gear[]>([]);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [gearsMeta, setGearsMeta] = useState<Meta | undefined>(undefined);
  const [rentalsMeta, setRentalsMeta] = useState<Meta | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  
  const [gearsPage, setGearsPage] = useState(1);
  const [rentalsPage, setRentalsPage] = useState(1);

  // Category Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await CategoryService.getCategories();
      setCategories(res);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      setIsSubmitting(true);
      await CategoryService.createCategory({
        name: categoryName,
        description: categoryDescription,
      });
      toast.success("Category created successfully");
      setIsCategoryModalOpen(false);
      setCategoryName("");
      setCategoryDescription("");
      fetchCategories();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (activeTab === "gears") {
      fetchGears(gearsPage);
    } else if (activeTab === "rentals") {
      fetchRentals(rentalsPage);
    } else if (activeTab === "categories") {
      fetchCategories();
    }
  }, [activeTab, gearsPage, rentalsPage]);

  return (
    <div className="space-y-6">
      {/* Tabs Header */}
      <div className="flex w-full items-center border-b">
        <button
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            activeTab === "gears"
              ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("gears")}
        >
          Gear Listings
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            activeTab === "rentals"
              ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("rentals")}
        >
          Rental Transactions
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            activeTab === "categories"
              ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("categories")}
        >
          Categories
        </button>
      </div>

      {/* Tabs Content */}
      <div className="rounded-md border bg-card text-card-foreground">
        <div className="relative w-full overflow-auto">
          {activeTab === "gears" && (
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
          )}

          {activeTab === "rentals" && (
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
          )}

          {activeTab === "categories" && (
            <div>
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="font-medium">All Categories</h3>
                <Button size="sm" className="bg-orange-500 text-white hover:bg-orange-600" onClick={() => setIsCategoryModalOpen(true)}>
                  Add Category
                </Button>
              </div>
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Description</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Gears Count</th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {loading && categories.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="p-4 text-center text-muted-foreground">Loading categories...</td>
                    </tr>
                  ) : categories.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="p-4 text-center text-muted-foreground">No categories found.</td>
                    </tr>
                  ) : (
                    categories.map((category) => (
                      <tr key={category.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <td className="p-4 align-middle font-medium">{category.name}</td>
                        <td className="p-4 align-middle text-muted-foreground truncate max-w-[300px]">{category.description || "N/A"}</td>
                        <td className="p-4 align-middle">
                          <Badge variant="outline">{category._count?.gears || 0} items</Badge>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Pagination Controls */}
      {activeTab === "gears" && gearsMeta && gearsMeta.totalPages && gearsMeta.totalPages > 1 && (
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

      {activeTab === "rentals" && rentalsMeta && rentalsMeta.totalPages && rentalsMeta.totalPages > 1 && (
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

      {/* Category Creation Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-border bg-background p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <div className="mb-4 space-y-1">
              <h3 className="text-lg font-semibold leading-none tracking-tight">Add New Category</h3>
              <p className="text-sm text-muted-foreground">
                Create a new gear category for providers.
              </p>
            </div>
            <form onSubmit={handleCreateCategory} className="mt-4 space-y-4">
              <div className="space-y-2">
                <label htmlFor="categoryName" className="text-sm font-medium leading-none">
                  Category Name
                </label>
                <input
                  id="categoryName"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="e.g. Tents, Bicycles"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="categoryDesc" className="text-sm font-medium leading-none">
                  Description
                </label>
                <textarea
                  id="categoryDesc"
                  value={categoryDescription}
                  onChange={(e) => setCategoryDescription(e.target.value)}
                  placeholder="Brief description of the category..."
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCategoryModalOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="bg-orange-500 text-white hover:bg-orange-600">
                  {isSubmitting ? "Creating..." : "Create Category"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
