import type { Metadata } from "next";
import RegisterForm from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Create account | GearUp",
};

export default function RegisterPage() {
  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 px-4 py-12">
      <div className="w-full max-w-xl space-y-6 rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-semibold text-zinc-900">
            Create your account
          </h1>
          <p className="text-sm text-zinc-500">
            Join GearUp as a customer or start listing your gear as a provider.
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
