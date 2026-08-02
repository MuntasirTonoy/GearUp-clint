export type Role = "CUSTOMER" | "PROVIDER" | "ADMIN";

export type RentalStatus =
  | "PLACED"
  | "CONFIRMED"
  | "PAID"
  | "CANCELLED"
  | "PICKED_UP"
  | "RETURNED";

export type GearStatus = "AVAILABLE" | "RENTED" | "MAINTENANCE" | "UNAVAILABLE";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export interface Meta {
  page: number;
  limit: number;
  total: number;
  totalPages?: number;
}

export interface APIResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: Meta;
  error?: Record<string, unknown>;
  stack?: string;
}

export interface ApiErrorResponse {
  success: boolean;
  message: string;
  error?: Record<string, unknown>;
  stack?: string;
  statusCode?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  profilePhoto: string | null;
  role: Role;
  isDeleted: boolean;
  isSuspended: boolean;
  createdAt: string;
  updatedAt: string;
  provider?: Provider | null;
}

export interface Provider {
  id: string;
  userId: string;
  businessName: string;
  description: string;
  address: string;
  createdAt: string;
  updatedAt: string;
  user?: Pick<User, "id" | "name" | "email" | "phone" | "profilePhoto" | "role">;
  gears?: Gear[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  _count?: { gears: number };
}

export interface Gear {
  id: string;
  name: string;
  description: string;
  images: string[];
  dailyRentalPrice: number;
  quantity: number;
  status: GearStatus;
  providerId: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  category?: Pick<Category, "id" | "name" | "description">;
  provider?: Pick<Provider, "id" | "businessName"> & {
    user?: Pick<User, "id" | "name" | "email" | "profilePhoto">;
  };
  reviews?: Review[];
  _count?: { rentals: number; reviews: number };
}

export interface Rental {
  id: string;
  customerId: string;
  gearId: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  totalAmount: number;
  status: RentalStatus;
  createdAt: string;
  updatedAt: string;
  gear?: Pick<Gear, "id" | "name" | "description" | "images" | "dailyRentalPrice"> & {
    provider?: Pick<Provider, "id" | "businessName"> & {
      user?: Pick<User, "id" | "name" | "phone" | "profilePhoto">;
    };
  };
  customer?: Pick<User, "id" | "name" | "email" | "phone" | "profilePhoto">;
  payment?: Payment | null;
}

export interface Payment {
  id: string;
  rentalId: string;
  transactionId: string;
  amount: number;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  rental?: Pick<Rental, "id" | "gearId" | "totalAmount" | "status" | "startDate" | "endDate"> & {
    gear?: Pick<Gear, "id" | "name" | "images">;
  };
}

export interface Review {
  id: string;
  userId: string;
  gearId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  user?: Pick<User, "id" | "name" | "profilePhoto">;
}

export interface PlatformSettings {
  id: string;
  platformFeeRate: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthPayload {
  user: User;
  accessToken: string;
  refreshToken?: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone: string;
  role?: Role;
  businessName?: string;
  description?: string;
  address?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RefreshTokenPayload {
  accessToken: string;
}

export interface CreateRentalPayload {
  gearId: string;
  startDate: string;
  endDate: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface GearQueryParams extends PaginationParams {
  searchTerm?: string;
  categoryId?: string;
  status?: GearStatus;
  minPrice?: number;
  maxPrice?: number;
}
