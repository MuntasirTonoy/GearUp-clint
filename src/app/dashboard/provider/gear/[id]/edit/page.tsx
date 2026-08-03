"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/utils/api";
import { GearService } from "@/services/gear.service";
import { CategoryService } from "@/services/category.service";
import { formatCurrency } from "@/utils/format";
import type { Category, Gear } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StyledSelect } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FileUp, Loader2 } from "lucide-react";
import ImageCropperModal from "@/components/shared/ImageCropperModal";

// Force Turbopack recompile
export default function EditGearPage() {
  const router = useRouter();
  const params = useParams();
  const gearId = params.id as string;

  const [categories, setCategories] = useState<Category[]>([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const [isGearLoading, setIsGearLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    dailyRentalPrice: "",
    quantity: "",
    categoryId: "",
    images: [] as File[],
  });

  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

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

  useEffect(() => {
    if (!gearId) return;
    let active = true;
    
    GearService.getGear(gearId)
      .then((gear) => {
        if (active) {
          setFormData({
            name: gear.name,
            description: gear.description,
            dailyRentalPrice: gear.dailyRentalPrice.toString(),
            quantity: gear.quantity.toString(),
            categoryId: gear.categoryId,
            images: [],
          });
          setExistingImages(gear.images || []);
        }
      })
      .catch(() => {
        toast.error("Failed to load gear details");
        router.push("/dashboard/provider/gears");
      })
      .finally(() => {
        if (active) setIsGearLoading(false);
      });
      
    return () => {
      active = false;
    };
  }, [gearId, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [filesToCrop, setFilesToCrop] = useState<File[]>([]);
  const [isCropperOpen, setIsCropperOpen] = useState(false);

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const totalCurrent = existingImages.length + formData.images.length;
    if (totalCurrent + files.length > 5) {
      toast.error(`You can only have up to 5 images total. You can add ${Math.max(0, 5 - totalCurrent)} more.`);
      return;
    }
    if (files.length > 0) {
      setFilesToCrop(files);
      setIsCropperOpen(true);
    }
  };

  const handleCropComplete = (croppedFiles: File[]) => {
    setFormData((prev) => ({ ...prev, images: [...prev.images, ...croppedFiles] }));
    const urls = croppedFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...urls]);
  };

  const handleRemoveExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveNewImage = (index: number) => {
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
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
      data.append("existingImages", JSON.stringify(existingImages));
      
      if (formData.images.length > 0) {
        formData.images.forEach((img) => data.append("images", img));
      }

      await GearService.updateGear(gearId, data);
      toast.success("Gear listing updated successfully!");
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
      router.push("/dashboard/provider/gears");
      router.refresh();
    } catch (err) {
      toast.error(getApiErrorMessage(err));
      setIsSubmitting(false);
    }
  };

  const totalDays = 1;
  const totalAmount = parseFloat(formData.dailyRentalPrice || "0") * totalDays;
  
  if (isGearLoading) {
    return (
      <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <Skeleton className="h-10 w-1/3 mb-2" />
        <Skeleton className="h-4 w-1/4 mb-6" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold tracking-tight">Edit Gear</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Update your rental listing details.
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
                <Label htmlFor="images">Update Images (max 5)</Label>
                <div className="mt-2">
                  <label
                    htmlFor="images-input"
                    className="flex h-32 cursor-pointer items-center justify-center rounded-lg border border-dashed transition-colors hover:bg-muted/50"
                  >
                    <div className="flex flex-col items-center justify-center gap-2 text-center">
                      <FileUp className="size-6 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        <span className="font-semibold">Click to upload new images</span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        (Leave empty to keep existing images)
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

              {(existingImages.length > 0 || previewUrls.length > 0) && (
                <div className="space-y-4">
                  {existingImages.length > 0 && (
                    <div>
                      <Label>Existing Images</Label>
                      <div className="mt-2 grid grid-cols-3 gap-2">
                        {existingImages.map((url, index) => (
                          <div key={index} className="relative group">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={url}
                              alt={`Existing ${index + 1}`}
                              className="h-20 w-full rounded object-cover border border-border"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveExistingImage(index)}
                              className="absolute top-1 right-1 flex size-5 items-center justify-center rounded-full bg-destructive/80 text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:bg-destructive"
                            >
                              <span className="text-[10px] font-bold">✕</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {previewUrls.length > 0 && (
                    <div>
                      <Label>New Images Preview</Label>
                      <div className="mt-2 grid grid-cols-3 gap-2">
                        {previewUrls.map((url, index) => (
                          <div key={index} className="relative group">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={url}
                              alt={`Preview ${index + 1}`}
                              className="h-20 w-full rounded object-cover border border-border"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveNewImage(index)}
                              className="absolute top-1 right-1 flex size-5 items-center justify-center rounded-full bg-destructive/80 text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:bg-destructive"
                            >
                              <span className="text-[10px] font-bold">✕</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="rounded-lg border border-border bg-muted/40 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Daily Total</span>
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
                  Saving...
                </>
              ) : (
                "Save Changes"
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
