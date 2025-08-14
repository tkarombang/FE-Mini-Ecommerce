import axios from "axios";
import { Order, CreateOrderDTO } from "@/types/order";

const API_URL = "http://localhost:8000";

export const createOrder = async (orderData: CreateOrderDTO): Promise<Order> => {
  const res = await axios.post<Order>(`${API_URL}/orders`, orderData);
  return res.data;
};

export const getOrders = async (): Promise<Order[]> => {
  const res = await axios.get<Order[]>(`${API_URL}/orders`);
  return res.data;
};
