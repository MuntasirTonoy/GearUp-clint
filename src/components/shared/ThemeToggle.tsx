"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { applyTheme, THEME_STORAGE_KEY, type Theme } from "@/utils/theme";

export default function ThemeToggle({ className }: { className?: string }) {
  const toggle = () => {
    const next: Theme = document.documentElement.classList.contains("dark")
      ? "light"
      : "dark";
    applyTheme(next);
    window.localStorage.setItem(THEME_STORAGE_KEY, next);
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={cn(className)}
      onClick={toggle}
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      <Sun className="size-4 hidden dark:block" />
      <Moon className="size-4 dark:hidden" />
    </Button>
  );
}
