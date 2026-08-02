import api from "@/lib/axios";
import type {
  APIResponse,
  CreateRentalPayload,
  Meta,
  PaginationParams,
  Rental,
  RentalStatus,
} from "@/types";

const createRental = async (payload: CreateRentalPayload): Promise<Rental> => {
  const { data } = await api.post<APIResponse<Rental>>("/rentals", payload);
  return data.data;
};

export interface RentalsResult {
  rentals: Rental[];
  meta?: Meta;
}

const getMyRentals = async (params?: PaginationParams): Promise<RentalsResult> => {
  const { data } = await api.get<APIResponse<Rental[]>>("/rentals/my-rentals", {
    params,
  });
  return { rentals: data.data, meta: data.meta };
};

const getProviderRentals = async (
  params?: PaginationParams
): Promise<RentalsResult> => {
  const { data } = await api.get<APIResponse<Rental[]>>("/rentals/provider", {
    params,
  });
  return { rentals: data.data, meta: data.meta };
};

const updateRentalStatus = async (
  id: string,
  status: RentalStatus
): Promise<Rental> => {
  const { data } = await api.patch<APIResponse<Rental>>(`/rentals/${id}/status`, {
    status,
  });
  return data.data;
};

const cancelRental = async (id: string): Promise<Rental> => {
  const { data } = await api.patch<APIResponse<Rental>>(`/rentals/${id}/cancel`);
  return data.data;
};

const getRental = async (id: string): Promise<Rental> => {
  const { data } = await api.get<APIResponse<Rental>>(`/rentals/${id}`);
  return data.data;
};

export const RentalService = {
  createRental,
  getMyRentals,
  getProviderRentals,
  updateRentalStatus,
  cancelRental,
  getRental,
};
