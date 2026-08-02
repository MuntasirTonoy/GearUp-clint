import api from "@/lib/axios";
import type { APIResponse, Category } from "@/types";

const getCategories = async (): Promise<Category[]> => {
  const { data } = await api.get<APIResponse<Category[]>>("/categories");
  return data.data;
};

export const CategoryService = {
  getCategories,
};
