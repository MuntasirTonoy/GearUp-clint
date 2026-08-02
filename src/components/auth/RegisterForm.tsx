"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Briefcase,
  MapPin,
  FileText,
  Loader2,
  ShoppingBag,
  Store,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { getApiErrorMessage } from "@/utils/api";
import { getDashboardPath } from "@/utils/auth";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import type { Role } from "@/types";

const ROLE_OPTIONS: Array<{ value: Role; label: string; description: string; Icon: React.ElementType }> = [
  {
    value: "CUSTOMER",
    label: "Customer",
    description: "Rent gear for trips and activities.",
    Icon: ShoppingBag,
  },
  {
    value: "PROVIDER",
    label: "Provider",
    description: "List your gear and earn from rentals.",
    Icon: Store,
  },
];

interface InputFieldProps {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: React.ElementType;
  rightSlot?: React.ReactNode;
  minLength?: number;
}

function InputField({
  id,
  label,
  type = "text",
  required,
  autoComplete,
  placeholder,
  value,
  onChange,
  icon: Icon,
  rightSlot,
  minLength,
}: InputFieldProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-zinc-300">
        {label}
      </label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
        <input
          id={id}
          type={type}
          required={required}
          autoComplete={autoComplete}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          minLength={minLength}
          className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-zinc-600 transition-colors focus:border-emerald-500/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        />
        {rightSlot && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2">{rightSlot}</span>
        )}
      </div>
    </div>
  );
}

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
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
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Role selector */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-zinc-300">I want to join as</label>
        <div className="grid grid-cols-2 gap-3">
          {ROLE_OPTIONS.map((option) => {
            const selected = role === option.value;
            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={selected}
                onClick={() => { setRole(option.value); setError(null); }}
                className={cn(
                  "flex items-start gap-3 rounded-xl border p-4 text-left transition-all duration-200",
                  selected
                    ? "border-emerald-500/60 bg-emerald-500/10 shadow-lg shadow-emerald-500/10"
                    : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8"
                )}
              >
                <span className={cn(
                  "mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg transition-colors",
                  selected ? "bg-emerald-500/20 text-emerald-400" : "bg-white/10 text-zinc-400"
                )}>
                  <option.Icon className="size-4" />
                </span>
                <span>
                  <span className={cn("block text-sm font-semibold", selected ? "text-emerald-400" : "text-zinc-200")}>
                    {option.label}
                  </span>
                  <span className="mt-0.5 block text-xs text-zinc-500">
                    {option.description}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Name */}
      <InputField
        id="reg-name"
        label="Full name"
        required
        autoComplete="name"
        placeholder="John Doe"
        value={values.name}
        onChange={handleChange("name")}
        icon={User}
      />

      {/* Email + Phone */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InputField
          id="reg-email"
          label="Email"
          type="email"
          required
          autoComplete="email"
          placeholder="john@example.com"
          value={values.email}
          onChange={handleChange("email")}
          icon={Mail}
        />
        <InputField
          id="reg-phone"
          label="Phone"
          type="tel"
          required
          autoComplete="tel"
          placeholder="+1234567890"
          value={values.phone}
          onChange={handleChange("phone")}
          icon={Phone}
        />
      </div>

      {/* Password + Confirm */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InputField
          id="reg-password"
          label="Password"
          type={showPassword ? "text" : "password"}
          required
          minLength={8}
          autoComplete="new-password"
          placeholder="At least 8 characters"
          value={values.password}
          onChange={handleChange("password")}
          icon={Lock}
          rightSlot={
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="text-zinc-500 hover:text-zinc-300 transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          }
        />
        <InputField
          id="reg-confirm"
          label="Confirm password"
          type={showConfirm ? "text" : "password"}
          required
          minLength={8}
          autoComplete="new-password"
          placeholder="Repeat your password"
          value={values.confirmPassword}
          onChange={handleChange("confirmPassword")}
          icon={Lock}
          rightSlot={
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="text-zinc-500 hover:text-zinc-300 transition-colors"
              aria-label={showConfirm ? "Hide password" : "Show password"}
            >
              {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          }
        />
      </div>

      {/* Provider fields */}
      {isProvider && (
        <div className="space-y-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-500">
            <Briefcase className="size-3.5" />
            Business details
          </p>
          <InputField
            id="reg-businessName"
            label="Business name"
            required={isProvider}
            placeholder="Jane's Gear Shop"
            value={values.businessName}
            onChange={handleChange("businessName")}
            icon={Briefcase}
          />
          <div className="space-y-1.5">
            <label htmlFor="reg-description" className="block text-sm font-medium text-zinc-300">
              Description
            </label>
            <div className="relative">
              <FileText className="pointer-events-none absolute left-3 top-3 size-4 text-zinc-500" />
              <Textarea
                id="reg-description"
                required={isProvider}
                rows={3}
                placeholder="Tell renters what you offer."
                value={values.description}
                onChange={handleChange("description")}
                className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 text-sm text-white placeholder:text-zinc-600 transition-colors focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>
          <InputField
            id="reg-address"
            label="Address"
            required={isProvider}
            placeholder="123 Main St, City, Country"
            value={values.address}
            onChange={handleChange("address")}
            icon={MapPin}
          />
        </div>
      )}

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2.5 text-sm text-red-400"
        >
          <span className="mt-0.5 flex-shrink-0">⚠</span>
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all duration-200 hover:scale-[1.02] hover:shadow-emerald-500/40 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="size-4 animate-spin" />
            Creating account...
          </span>
        ) : (
          "Create account"
        )}
      </button>
    </form>
  );
}
