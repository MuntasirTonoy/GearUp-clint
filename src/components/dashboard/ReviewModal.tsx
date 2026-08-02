"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ReviewService } from "@/services/reviews.service";
import { getApiErrorMessage } from "@/utils/api";

interface ReviewModalProps {
  open: boolean;
  onClose: () => void;
  gearName: string;
  gearId: string;
}

export default function ReviewModal({
  open,
  onClose,
  gearName,
  gearId,
}: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!open) return null;

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Please select a star rating.");
      return;
    }
    if (!comment.trim()) {
      toast.error("Please write a comment.");
      return;
    }

    setIsSubmitting(true);
    try {
      await ReviewService.createReview({
        gearId,
        rating,
        comment: comment.trim(),
      });
      toast.success("Review submitted successfully!");
      onClose();
      setRating(0);
      setComment("");
    } catch (err) {
      toast.error(getApiErrorMessage(err));
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-background p-6 shadow-lg">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold">
              Review &ldquo;{gearName}&rdquo;
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Share your experience with this rental.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <Label className="mb-2 block text-sm font-medium">
              Rating
            </Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={cn(
                    "rounded p-0.5 transition-colors",
                    star <= rating ? "text-yellow-400" : "text-muted-foreground/40"
                  )}
                  onClick={() => setRating(star)}
                >
                  <Star className="size-7 fill-current" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="review-comment" className="text-sm font-medium">
              Comment
            </Label>
            <Textarea
              id="review-comment"
              rows={4}
              placeholder="Tell others about your experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="mt-2 resize-none"
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              className="bg-emerald-500 text-white hover:bg-emerald-400"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
