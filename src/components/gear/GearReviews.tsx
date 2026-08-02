import { Star } from "lucide-react";
import type { Review } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function StarRating({ rating }: { rating: number }) {
  return (
    <div
      className="flex items-center gap-0.5"
      aria-label={`${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={
            index < rating
              ? "size-4 fill-amber-400 text-amber-400"
              : "size-4 text-muted-foreground/40"
          }
        />
      ))}
    </div>
  );
}

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export default function GearReviews({ reviews }: { reviews: Review[] }) {
  const average = reviews.length
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  return (
    <section className="mt-12">
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Reviews</h2>
        {reviews.length > 0 && (
          <p className="text-sm text-muted-foreground">
            {average.toFixed(1)} / 5 · {reviews.length} review
            {reviews.length === 1 ? "" : "s"}
          </p>
        )}
      </div>

      {reviews.length === 0 ? (
        <div className="mt-4 rounded-xl border border-border bg-muted/50 p-8 text-center">
          <p className="text-sm text-muted-foreground">
            No reviews yet. Be the first to rent this gear.
          </p>
        </div>
      ) : (
        <ul className="mt-6 space-y-4">
          {reviews.map((review) => {
            const name = review.user?.name ?? "Anonymous";
            const initials = name
              .split(" ")
              .map((part) => part[0])
              .filter(Boolean)
              .slice(0, 2)
              .join("")
              .toUpperCase();

            return (
              <li
                key={review.id}
                className="rounded-xl border border-border bg-card p-5"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-9">
                      {review.user?.profilePhoto ? (
                        <AvatarImage
                          src={review.user.profilePhoto}
                          alt={name}
                        />
                      ) : null}
                      <AvatarFallback className="bg-muted text-xs">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(review.createdAt)}
                      </p>
                    </div>
                  </div>
                  <StarRating rating={review.rating} />
                </div>
                {review.comment && (
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {review.comment}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
