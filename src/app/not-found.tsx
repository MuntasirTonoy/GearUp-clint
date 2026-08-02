import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import PublicShell from "@/components/shared/PublicShell";

export default function NotFound() {
  return (
    <PublicShell>
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600">
          404
        </p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Page not found
        </h1>
        <p className="max-w-md text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or may have been
          moved.
        </p>
        <Link
          href="/"
          className={cn(buttonVariants({ variant: "default" }), "mt-2")}
        >
          Back to home
        </Link>
      </div>
    </PublicShell>
  );
}
