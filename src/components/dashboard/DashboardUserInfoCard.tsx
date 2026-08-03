"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Calendar, Briefcase, MapPin, Edit2, Loader2, Camera } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/utils/api";
import ImageCropperModal from "@/components/shared/ImageCropperModal";

export default function DashboardUserInfoCard() {
  const { user, status, updateProfile } = useAuthStore();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleOpenChange = (open: boolean) => {
    setIsEditOpen(open);
    if (open && user) {
      setName(user.name);
      setPhone(user.phone || "");
      setSelectedFile(null);
      setPreviewUrl(user.profilePhoto || null);
    }
  };

  const [filesToCrop, setFilesToCrop] = useState<File[]>([]);
  const [isCropperOpen, setIsCropperOpen] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFilesToCrop([file]);
      setIsCropperOpen(true);
    }
  };

  const handleCropComplete = (croppedFiles: File[]) => {
    if (croppedFiles[0]) {
      setSelectedFile(croppedFiles[0]);
      setPreviewUrl(URL.createObjectURL(croppedFiles[0]));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      if (phone.trim()) formData.append("phone", phone);
      if (selectedFile) formData.append("profilePhoto", selectedFile);

      await updateProfile(formData);
      toast.success("Profile updated successfully!");
      setIsEditOpen(false);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "idle" || status === "loading" && !user) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const joinedDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-start gap-6">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <Avatar className="h-20 w-20 ring-4 ring-orange-500/10">
            {user.profilePhoto ? (
              <AvatarImage src={user.profilePhoto} alt={user.name} />
            ) : null}
            <AvatarFallback className="bg-gradient-to-br from-orange-400 to-orange-600 text-xl font-bold text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Info */}
        <div className="flex flex-1 flex-col justify-center">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                {user.role === "PROVIDER" && user.provider ? user.provider.businessName : user.name}
              </h2>
              {user.role === "PROVIDER" && user.provider && (
                <p className="text-sm font-medium text-muted-foreground mt-0.5">
                  Owner: {user.name}
                </p>
              )}
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge
                  variant="secondary"
                  className="bg-orange-500/10 text-orange-600 dark:text-orange-400 hover:bg-orange-500/20"
                >
                  {user.role}
                </Badge>
                <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <Calendar className="size-3.5" />
                  Joined {joinedDate}
                </span>
              </div>
            </div>

            <Button variant="outline" size="sm" className="gap-1.5 self-start sm:self-auto" onClick={() => handleOpenChange(true)}>
              <Edit2 className="size-3.5" />
              Edit Profile
            </Button>
            
            {/* Custom Modal */}
            {isEditOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                <div className="w-full max-w-md rounded-xl border border-border bg-background p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
                  <div className="mb-4 space-y-1">
                    <h3 className="text-lg font-semibold leading-none tracking-tight">Edit Profile</h3>
                    <p className="text-sm text-muted-foreground">
                      Update your personal information and profile picture.
                    </p>
                  </div>
                  <form onSubmit={handleSubmit} className="mt-4 space-y-6">
                    {/* Profile Picture Upload */}
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative">
                        <Avatar className="h-24 w-24 ring-2 ring-border">
                          {previewUrl ? (
                            <AvatarImage src={previewUrl} alt="Preview" className="object-cover" />
                          ) : null}
                          <AvatarFallback className="bg-muted text-2xl">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <Label
                          htmlFor="photo-upload"
                          className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-orange-500 text-white shadow-md hover:bg-orange-600 transition-colors"
                        >
                          <Camera className="size-4" />
                        </Label>
                        <input
                          id="photo-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Click the camera icon to upload a new photo
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="John Doe"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+1 234 567 8900"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditOpen(false)}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isSubmitting} className="bg-orange-500 text-white hover:bg-orange-600">
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
                  </form>
                </div>
                
                <ImageCropperModal
                  files={filesToCrop}
                  isOpen={isCropperOpen}
                  onClose={() => setIsCropperOpen(false)}
                  onCropComplete={handleCropComplete}
                  defaultAspect={1}
                  title="Crop Profile Photo"
                />
              </div>
            )}
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Mail className="size-4 text-orange-500" />
              <span>{user.email}</span>
            </div>
            {user.phone && (
              <div className="flex items-center gap-2">
                <Phone className="size-4 text-orange-500" />
                <span>{user.phone}</span>
              </div>
            )}
            
            {user.role === "PROVIDER" && user.provider && (
              <div className="flex items-center gap-2">
                <MapPin className="size-4 text-orange-500" />
                <span className="truncate">{user.provider.address}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
