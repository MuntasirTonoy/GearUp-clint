import type { Role } from "@/types";

export const DASHBOARD_PATHS: Record<Role, string> = {
  CUSTOMER: "/dashboard/customer",
  PROVIDER: "/dashboard/provider",
  ADMIN: "/dashboard/admin",
};

export const getDashboardPath = (role: Role): string =>
  DASHBOARD_PATHS[role] ?? DASHBOARD_PATHS.CUSTOMER;
