import api from "./api";
import { ProductsApi } from "@/types/products";

export const readProducts = async (): Promise<ProductsApi[]> => {
  const res = await api.get(`/products`);
  return res.data;
};
