"use client";

import { useState } from "react";
import Image from "next/image";
import { Mountain } from "lucide-react";
import { cn } from "@/lib/utils";

export default function GearGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const [index, setIndex] = useState(0);
  const current = images[index];

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-muted">
      <div className="relative aspect-[4/3]">
        {current ? (
          <Image
            src={current}
            alt={name}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Mountain className="size-12 text-muted-foreground/40" />
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 border-t border-border bg-background p-2">
          {images.map((image, imageIndex) => (
            <button
              key={image}
              type="button"
              onClick={() => setIndex(imageIndex)}
              aria-label={`View image ${imageIndex + 1} of ${name}`}
              className={cn(
                "relative size-16 shrink-0 overflow-hidden rounded-md border-2 transition-colors",
                imageIndex === index
                  ? "border-emerald-500"
                  : "border-transparent"
              )}
            >
              <Image
                src={image}
                alt=""
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
