import api from "@/lib/axios";
import type {
  APIResponse,
  User,
  Gear,
  Rental,
  PaginationParams,
  Meta,
} from "@/types";

export interface OverviewMetrics {
  totalUsers: number;
  activeGear: number;
  platformFeeRate: number;
}

export interface AdminUsersResult {
  users: User[];
  meta?: Meta;
}

export interface AdminGearsResult {
  gears: Gear[];
  meta?: Meta;
}

export interface AdminRentalsResult {
  rentals: Rental[];
  meta?: Meta;
}

export interface AdminUserParams extends PaginationParams {
  searchTerm?: string;
}

const getOverview = async (): Promise<OverviewMetrics> => {
  const { data } = await api.get<APIResponse<OverviewMetrics>>("/admin/overview");
  return data.data;
};

const getUsers = async (params?: AdminUserParams): Promise<AdminUsersResult> => {
  const { data } = await api.get<APIResponse<User[]>>("/admin/users", { params });
  return { users: data.data, meta: data.meta };
};

const toggleUserSuspension = async (id: string, isSuspended: boolean): Promise<User> => {
  const { data } = await api.patch<APIResponse<User>>(`/admin/users/${id}/block`, {
    isSuspended,
  });
  return data.data;
};

const getGears = async (params?: PaginationParams): Promise<AdminGearsResult> => {
  const { data } = await api.get<APIResponse<Gear[]>>("/admin/gears", { params });
  return { gears: data.data, meta: data.meta };
};

const getRentals = async (params?: PaginationParams): Promise<AdminRentalsResult> => {
  const { data } = await api.get<APIResponse<Rental[]>>("/admin/rentals", { params });
  return { rentals: data.data, meta: data.meta };
};

export const AdminService = {
  getOverview,
  getUsers,
  toggleUserSuspension,
  getGears,
  getRentals,
};
