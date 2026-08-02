"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { getApiErrorMessage } from "@/utils/api";
import { getDashboardPath } from "@/utils/auth";
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

const inputClass =
  "w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10";

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
      <fieldset className="space-y-3">
        <legend className="text-sm font-medium text-zinc-700">
          I want to join as
        </legend>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {ROLE_OPTIONS.map((option) => {
            const selected = role === option.value;
            return (
              <label
                key={option.value}
                className={`cursor-pointer rounded-lg border p-4 transition-colors ${
                  selected
                    ? "border-zinc-900 bg-zinc-900 text-white"
                    : "border-zinc-300 bg-white hover:border-zinc-400"
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value={option.value}
                  checked={selected}
                  onChange={() => {
                    setRole(option.value);
                    setError(null);
                  }}
                  className="sr-only"
                />
                <span className="block text-sm font-semibold">
                  {option.label}
                </span>
                <span
                  className={`mt-1 block text-xs ${
                    selected ? "text-zinc-300" : "text-zinc-500"
                  }`}
                >
                  {option.description}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="space-y-1">
        <label htmlFor="name" className="block text-sm font-medium text-zinc-700">
          Full name
        </label>
        <input
          id="name"
          type="text"
          required
          autoComplete="name"
          placeholder="John Doe"
          value={values.name}
          onChange={handleChange("name")}
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="email" className="block text-sm font-medium text-zinc-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            placeholder="john@example.com"
            value={values.email}
            onChange={handleChange("email")}
            className={inputClass}
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="phone" className="block text-sm font-medium text-zinc-700">
            Phone
          </label>
          <input
            id="phone"
            type="tel"
            required
            autoComplete="tel"
            placeholder="+1234567890"
            value={values.phone}
            onChange={handleChange("phone")}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="password" className="block text-sm font-medium text-zinc-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="At least 8 characters"
            value={values.password}
            onChange={handleChange("password")}
            className={inputClass}
          />
        </div>
        <div className="space-y-1">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-zinc-700"
          >
            Confirm password
          </label>
          <input
            id="confirmPassword"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="Repeat your password"
            value={values.confirmPassword}
            onChange={handleChange("confirmPassword")}
            className={inputClass}
          />
        </div>
      </div>

      {isProvider && (
        <div className="space-y-4 rounded-lg border border-zinc-200 bg-zinc-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Business details
          </p>
          <div className="space-y-1">
            <label
              htmlFor="businessName"
              className="block text-sm font-medium text-zinc-700"
            >
              Business name
            </label>
            <input
              id="businessName"
              type="text"
              required={isProvider}
              placeholder="Jane's Gear Shop"
              value={values.businessName}
              onChange={handleChange("businessName")}
              className={inputClass}
            />
          </div>
          <div className="space-y-1">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-zinc-700"
            >
              Description
            </label>
            <textarea
              id="description"
              required={isProvider}
              rows={3}
              placeholder="Tell renters what you offer."
              value={values.description}
              onChange={handleChange("description")}
              className={`${inputClass} resize-none`}
            />
          </div>
          <div className="space-y-1">
            <label
              htmlFor="address"
              className="block text-sm font-medium text-zinc-700"
            >
              Address
            </label>
            <input
              id="address"
              type="text"
              required={isProvider}
              placeholder="123 Main St, City, Country"
              value={values.address}
              onChange={handleChange("address")}
              className={inputClass}
            />
          </div>
        </div>
      )}

      {error && (
        <p
          role="alert"
          className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Creating account..." : "Create account"}
      </button>

      <p className="text-center text-sm text-zinc-500">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-zinc-900 underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
