"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/utils/api";
import { GearService } from "@/services/gear.service";
import { CategoryService } from "@/services/category.service";
import { formatCurrency } from "@/utils/format";
import type { Category } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StyledSelect } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FileUp, Loader2 } from "lucide-react";
import ImageCropperModal from "@/components/shared/ImageCropperModal";

export default function AddGearPage() {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);

  useEffect(() => {
    let active = true;
    CategoryService.getCategories()
      .then((data) => {
        if (active) setCategories(data);
      })
      .catch(() => {
        toast.error("Failed to load categories");
      })
      .finally(() => {
        if (active) setIsCategoriesLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    dailyRentalPrice: "",
    quantity: "",
    categoryId: "",
    images: [] as File[],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [filesToCrop, setFilesToCrop] = useState<File[]>([]);
  const [isCropperOpen, setIsCropperOpen] = useState(false);

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }
    if (files.length > 0) {
      setFilesToCrop(files);
      setIsCropperOpen(true);
    }
  };

  const handleCropComplete = (croppedFiles: File[]) => {
    setFormData((prev) => ({ ...prev, images: croppedFiles }));
    previewUrls.forEach((url) => URL.revokeObjectURL(url));
    const urls = croppedFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!formData.description.trim()) {
      toast.error("Description is required");
      return;
    }
    if (!formData.dailyRentalPrice || parseFloat(formData.dailyRentalPrice) <= 0) {
      toast.error("Valid daily rental price is required");
      return;
    }
    if (!formData.quantity || parseInt(formData.quantity) <= 0) {
      toast.error("Valid quantity is required");
      return;
    }
    if (!formData.categoryId) {
      toast.error("Category is required");
      return;
    }

    setIsSubmitting(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("dailyRentalPrice", formData.dailyRentalPrice);
      data.append("quantity", formData.quantity);
      data.append("categoryId", formData.categoryId);
      formData.images.forEach((img) => data.append("images", img));

      await GearService.createGear(data);
      toast.success("Gear listing created successfully!");
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
      router.push("/dashboard/provider/gears");
      router.refresh();
    } catch (err) {
      toast.error(getApiErrorMessage(err));
      setIsSubmitting(false);
    }
  };

  const totalDays = 1;
  const totalAmount =
    parseFloat(formData.dailyRentalPrice || "0") * totalDays;

  return (
    <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold tracking-tight">Add New Gear</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        List a new item for rental.
      </p>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Gear Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Hiking Backpack"
                  className="mt-2"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your gear, its condition, features, etc."
                  rows={4}
                  className="mt-2"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <Label htmlFor="dailyRentalPrice">Daily Rental Price *</Label>
                <Input
                  id="dailyRentalPrice"
                  name="dailyRentalPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.dailyRentalPrice}
                  onChange={handleInputChange}
                  placeholder="e.g., 25.00"
                  className="mt-2"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <Label htmlFor="quantity">Quantity *</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  placeholder="e.g., 3"
                  className="mt-2"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                {isCategoriesLoading ? (
                  <Skeleton className="mt-2 h-10 w-full" />
                ) : (
                  <StyledSelect
                    id="category"
                    value={formData.categoryId}
                    onChange={(e) => setFormData((prev) => ({ ...prev, categoryId: e.target.value }))}
                    disabled={isSubmitting}
                    className="mt-2"
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </StyledSelect>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="images">Images (max 5) *</Label>
                <div className="mt-2">
                  <label
                    htmlFor="images-input"
                    className="flex h-32 cursor-pointer items-center justify-center rounded-lg border border-dashed transition-colors hover:bg-muted/50"
                  >
                    <div className="flex flex-col items-center justify-center gap-2 text-center">
                      <FileUp className="size-6 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        <span className="font-semibold">Click to upload</span>
                        {" "}up to 5 images
                      </p>
                    </div>
                    <Input
                      id="images-input"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImagesChange}
                      className="hidden"
                      disabled={isSubmitting}
                    />
                  </label>
                </div>
              </div>

              {previewUrls.length > 0 && (
                <div>
                  <Label>Preview</Label>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {previewUrls.map((url, index) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={index}
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="h-20 rounded object-cover"
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="rounded-lg border border-border bg-muted/40 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total</span>
                  <span className="font-semibold tabular-nums">
                    {formatCurrency(totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-emerald-500 text-white hover:bg-emerald-400"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Listing"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <ImageCropperModal
        files={filesToCrop}
        isOpen={isCropperOpen}
        onClose={() => setIsCropperOpen(false)}
        onCropComplete={handleCropComplete}
        defaultAspect={4 / 3}
        title="Crop Gear Images"
      />
    </div>
  );
}
