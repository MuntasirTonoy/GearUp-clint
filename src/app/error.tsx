"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import PublicShell from "@/components/shared/PublicShell";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <PublicShell>
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-destructive">
          Something went wrong
        </p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Unexpected error
        </h1>
        <p className="max-w-md text-muted-foreground">
          An unexpected error occurred. Please try again.
        </p>
        {error.digest ? (
          <p className="text-xs text-muted-foreground">
            Error reference: {error.digest}
          </p>
        ) : null}
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <Button onClick={reset}>Try again</Button>
          <Link href="/" className={cn(buttonVariants({ variant: "outline" }))}>
            Back to home
          </Link>
        </div>
      </div>
    </PublicShell>
  );
}
