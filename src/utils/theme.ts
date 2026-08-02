import { useSyncExternalStore } from "react";

export const THEME_STORAGE_KEY = "gearup-theme";

export type Theme = "light" | "dark";

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

export function subscribeTheme(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getTheme(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark")
    ? "dark"
    : "light";
}

export function getServerTheme(): Theme {
  return "light";
}

export function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  emit();
}

export function useTheme() {
  return useSyncExternalStore(subscribeTheme, getTheme, getServerTheme);
}
