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
    <div className="overflow-hidden rounded-xl border border-border bg-muted animate-scale-in">
      <div className="relative aspect-[4/3] overflow-hidden">
        {current ? (
          <Image
            key={current}
            src={current}
            alt={name}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover animate-scale-in"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Mountain className="size-12 text-muted-foreground/40" />
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 border-t border-border bg-background p-2 overflow-x-auto scrollbar-none">
          {images.map((image, imageIndex) => (
            <button
              key={image}
              type="button"
              onClick={() => setIndex(imageIndex)}
              aria-label={`View image ${imageIndex + 1} of ${name}`}
              className={cn(
                "relative size-16 shrink-0 overflow-hidden rounded-md border-2 transition-all duration-300 hover:scale-105 active:scale-95",
                imageIndex === index
                  ? "border-emerald-500 scale-105 shadow-sm"
                  : "border-transparent opacity-75 hover:opacity-100"
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
