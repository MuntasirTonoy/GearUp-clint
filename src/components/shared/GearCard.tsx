import Image from "next/image";
import Link from "next/link";
import { Mountain } from "lucide-react";
import type { Gear } from "@/types";
import { formatCurrency } from "@/utils/format";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const IMAGE_SIZES =
  "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw";

export default function GearCard({ gear }: { gear: Gear }) {
  const image = gear.images?.[0] ?? null;
  const providerName = gear.provider?.businessName;
  const isAvailable = gear.status === "AVAILABLE";

  return (
    <Link
      href={`/gear/${gear.id}`}
      className="group block h-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Card className="h-full gap-0 overflow-hidden p-0 transition-shadow group-hover:shadow-lg">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          {image ? (
            <Image
              src={image}
              alt={gear.name}
              fill
              sizes={IMAGE_SIZES}
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Mountain className="size-10 text-muted-foreground/50" />
            </div>
          )}
          <Badge
            variant={isAvailable ? "default" : "secondary"}
            className={
              isAvailable
                ? "absolute left-2 top-2 sm:left-3 sm:top-3 bg-emerald-500 text-white text-[10px] sm:text-xs px-1.5 sm:px-2.5 py-0.5"
                : "absolute left-2 top-2 sm:left-3 sm:top-3 text-[10px] sm:text-xs px-1.5 sm:px-2.5 py-0.5"
            }
          >
            {isAvailable ? "Available" : gear.status}
          </Badge>
        </div>

        <div className="flex flex-1 flex-col gap-1 sm:gap-1.5 p-2.5 sm:p-4">
          <h3 className="text-sm sm:text-base font-bold text-foreground line-clamp-1 sm:line-clamp-2">
            {gear.name}
          </h3>
          <p className="line-clamp-2 text-xs sm:text-sm text-muted-foreground">
            {gear.description}
          </p>
          {providerName && (
            <span className="text-xs sm:text-sm font-medium text-foreground truncate">
              {providerName}
            </span>
          )}
          <div className="mt-auto flex items-center justify-between pt-2 gap-1.5">
            <div>
              <span className="text-sm sm:text-lg font-bold text-foreground">
                {formatCurrency(gear.dailyRentalPrice)}
              </span>
              <span className="text-[10px] sm:text-xs text-muted-foreground">/day</span>
            </div>
            {isAvailable && gear.quantity > 0 && (
              <Badge className="bg-orange-500 text-white font-medium text-[9px] sm:text-[11px] px-1.5 sm:px-2 py-0.5 rounded-full shrink-0">
                {gear.quantity} in stock
              </Badge>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
