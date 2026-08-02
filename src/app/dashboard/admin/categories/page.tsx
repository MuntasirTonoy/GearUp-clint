"use client";

import { useState, useEffect } from "react";
import { Category } from "@/types";
import { CategoryService } from "@/services/category.service";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/utils/api";
import { Trash2, Edit2, AlertCircle } from "lucide-react";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeletingAll, setIsDeletingAll] = useState(false);

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

  const openCreateModal = () => {
    setEditingCategory(null);
    setCategoryName("");
    setCategoryDescription("");
    setIsCategoryModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setCategoryName(cat.name);
    setCategoryDescription(cat.description || "");
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      setIsSubmitting(true);
      if (editingCategory) {
        await CategoryService.updateCategory(editingCategory.id, {
          name: categoryName,
          description: categoryDescription,
        });
        toast.success("Category updated successfully");
      } else {
        await CategoryService.createCategory({
          name: categoryName,
          description: categoryDescription,
        });
        toast.success("Category created successfully");
      }
      setIsCategoryModalOpen(false);
      fetchCategories();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!editingCategory) return;
    
    if (!confirm(`Are you sure you want to delete ${editingCategory.name}?`)) {
      return;
    }

    try {
      setIsDeleting(true);
      await CategoryService.deleteCategory(editingCategory.id);
      toast.success("Category deleted successfully");
      setIsCategoryModalOpen(false);
      fetchCategories();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteAll = async () => {
    if (categories.length === 0) return;
    
    if (!confirm("WARNING: Are you sure you want to delete ALL categories? This cannot be undone.")) {
      return;
    }

    try {
      setIsDeletingAll(true);
      // Backend does not have bulk delete, so we do it in parallel
      await Promise.all(categories.map(cat => CategoryService.deleteCategory(cat.id)));
      toast.success("All categories deleted successfully");
      fetchCategories();
    } catch (error) {
      toast.error("Some categories could not be deleted. " + getApiErrorMessage(error));
      fetchCategories();
    } finally {
      setIsDeletingAll(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground mt-2">
            Manage equipment categories for providers.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="destructive" 
            onClick={handleDeleteAll}
            disabled={categories.length === 0 || isDeletingAll}
            className="gap-2"
          >
            <AlertCircle className="size-4" />
            {isDeletingAll ? "Deleting..." : "Delete All"}
          </Button>
          <Button className="bg-orange-500 text-white hover:bg-orange-600 gap-2" onClick={openCreateModal}>
            Add Category
          </Button>
        </div>
      </div>

      <div className="rounded-md border bg-card text-card-foreground">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Description</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Gears</th>
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {loading && categories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-muted-foreground">Loading categories...</td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-muted-foreground">No categories found.</td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr key={category.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <td className="p-4 align-middle font-medium">{category.name}</td>
                    <td className="p-4 align-middle text-muted-foreground truncate max-w-[300px]">{category.description || "N/A"}</td>
                    <td className="p-4 align-middle">
                      <Badge variant="outline">{category._count?.gears || 0} items</Badge>
                    </td>
                    <td className="p-4 align-middle text-right">
                      <Button variant="ghost" size="sm" onClick={() => openEditModal(category)} className="text-orange-500 hover:text-orange-600 hover:bg-orange-500/10">
                        <Edit2 className="size-4 mr-2" />
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Category Creation/Edit Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-border bg-background p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <div className="mb-4 space-y-1">
              <h3 className="text-lg font-semibold leading-none tracking-tight">
                {editingCategory ? "Edit Category" : "Add New Category"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {editingCategory ? "Update details for this category." : "Create a new gear category for providers."}
              </p>
            </div>
            <form onSubmit={handleSaveCategory} className="mt-4 space-y-4">
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
              
              <div className="flex justify-between pt-4 mt-6 border-t border-border">
                {editingCategory ? (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={handleDeleteCategory}
                    disabled={isSubmitting || isDeleting}
                  >
                    <Trash2 className="size-4 mr-2" />
                    {isDeleting ? "Deleting..." : "Delete"}
                  </Button>
                ) : (
                  <div /> // Spacer to keep right side aligned
                )}
                
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCategoryModalOpen(false)}
                    disabled={isSubmitting || isDeleting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting || isDeleting} className="bg-orange-500 text-white hover:bg-orange-600">
                    {isSubmitting ? "Saving..." : "Save"}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
