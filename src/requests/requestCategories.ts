import { ICategory } from "@/models/common/types";
import { api } from "./api";

export const requestCategories = {
  fetchAllCategories: async () => {
    try {
      const { data } = await api.get<ICategory[]>("/categories");
      return data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  },
};
