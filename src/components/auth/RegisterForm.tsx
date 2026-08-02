"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { getApiErrorMessage } from "@/utils/api";
import { getDashboardPath } from "@/utils/auth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Role } from "@/types";

const ROLE_OPTIONS: Array<{
  value: Role;
  label: string;
  description: string;
}> = [
  {
    value: "CUSTOMER",
    label: "Customer",
    description: "Rent gear for trips and activities.",
  },
  {
    value: "PROVIDER",
    label: "Provider",
    description: "List your gear and earn from rentals.",
  },
];

export default function RegisterForm() {
  const router = useRouter();
  const register = useAuthStore((state) => state.register);

  const [role, setRole] = useState<Role>("CUSTOMER");
  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    businessName: "",
    description: "",
    address: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isProvider = role === "PROVIDER";

  const handleChange =
    (field: keyof typeof values) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((prev) => ({ ...prev, [field]: e.target.value }));
      setError(null);
    };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (values.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (values.password !== values.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await register({
        name: values.name,
        email: values.email,
        phone: values.phone,
        password: values.password,
        role,
        ...(isProvider
          ? {
              businessName: values.businessName,
              description: values.description,
              address: values.address,
            }
          : {}),
      });
      const user = useAuthStore.getState().user;
      router.push(getDashboardPath(user?.role ?? "CUSTOMER"));
    } catch (err) {
      setError(getApiErrorMessage(err));
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>I want to join as</Label>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {ROLE_OPTIONS.map((option) => {
            const selected = role === option.value;
            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={selected}
                onClick={() => {
                  setRole(option.value);
                  setError(null);
                }}
                className={cn(
                  "rounded-lg border p-4 text-left transition-colors",
                  selected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card hover:border-foreground/40"
                )}
              >
                <span className="block text-sm font-semibold">
                  {option.label}
                </span>
                <span
                  className={cn(
                    "mt-1 block text-xs",
                    selected ? "text-primary-foreground/80" : "text-muted-foreground"
                  )}
                >
                  {option.description}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Full name</Label>
        <Input
          id="name"
          type="text"
          required
          autoComplete="name"
          placeholder="John Doe"
          value={values.name}
          onChange={handleChange("name")}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            required
            autoComplete="email"
            placeholder="john@example.com"
            value={values.email}
            onChange={handleChange("email")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            required
            autoComplete="tel"
            placeholder="+1234567890"
            value={values.phone}
            onChange={handleChange("phone")}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="At least 8 characters"
            value={values.password}
            onChange={handleChange("password")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input
            id="confirmPassword"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="Repeat your password"
            value={values.confirmPassword}
            onChange={handleChange("confirmPassword")}
          />
        </div>
      </div>

      {isProvider && (
        <div className="space-y-4 rounded-lg border bg-muted/30 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Business details
          </p>
          <div className="space-y-2">
            <Label htmlFor="businessName">Business name</Label>
            <Input
              id="businessName"
              type="text"
              required={isProvider}
              placeholder="Jane's Gear Shop"
              value={values.businessName}
              onChange={handleChange("businessName")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              required={isProvider}
              rows={3}
              placeholder="Tell renters what you offer."
              value={values.description}
              onChange={handleChange("description")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              type="text"
              required={isProvider}
              placeholder="123 Main St, City, Country"
              value={values.address}
              onChange={handleChange("address")}
            />
          </div>
        </div>
      )}

      {error && (
        <p
          role="alert"
          className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {error}
        </p>
      )}

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Creating account..." : "Create account"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-foreground underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
