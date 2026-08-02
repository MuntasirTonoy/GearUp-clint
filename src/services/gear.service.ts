import api from "@/lib/axios";
import type { APIResponse, Gear, GearQueryParams, Meta } from "@/types";

interface GearsResult {
  gears: Gear[];
  meta?: Meta;
}

const getGears = async (params?: GearQueryParams): Promise<GearsResult> => {
  const { data } = await api.get<APIResponse<Gear[]>>("/gears", { params });
  return { gears: data.data, meta: data.meta };
};

const getGear = async (id: string): Promise<Gear> => {
  const { data } = await api.get<APIResponse<Gear>>(`/gears/${id}`);
  return data.data;
};

export const GearService = {
  getGears,
  getGear,
};
